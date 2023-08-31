use futures::{channel::oneshot::Receiver, Stream, StreamExt, TryFutureExt};
use js_sys::Uint8Array;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};
use wasmer_wasix::WasiError;

use crate::utils::Error;

/// A handle connected to a running WASI program.
#[derive(Debug)]
#[wasm_bindgen]
pub struct Instance {
    /// The standard input stream, if one wasn't provided when starting the
    /// instance.
    #[wasm_bindgen(getter_with_clone, readonly)]
    pub stdin: Option<web_sys::WritableStream>,
    /// The WASI program's standard output.
    #[wasm_bindgen(getter_with_clone, readonly)]
    pub stdout: web_sys::ReadableStream,
    /// The WASI program's standard error.
    #[wasm_bindgen(getter_with_clone, readonly)]
    pub stderr: web_sys::ReadableStream,
    pub(crate) exit: Receiver<ExitCondition>,
}

#[wasm_bindgen]
impl Instance {
    /// Wait for the process to exit.
    #[wasm_bindgen(js_name = "wait")]
    pub async fn js_wait(self) -> Result<JsOutput, Error> {
        let output = self.wait().await?;
        Ok(output.into())
    }
}

impl Instance {
    #[tracing::instrument(skip_all)]
    async fn wait(self) -> Result<Output, Error> {
        let Instance {
            stdin,
            stdout,
            stderr,
            exit,
        } = self;

        if let Some(stdin) = stdin {
            if stdin.locked() {
                // The caller has already acquired a writer so it's their
                // responsibility to close the stream.
            } else {
                tracing::debug!("Closing stdin");
                wasm_bindgen_futures::JsFuture::from(stdin.close())
                    .await
                    .map_err(Error::js)?;
            }
        }

        let mut stdout_buffer = Vec::new();
        let stdout_done = copy_to_buffer(crate::streams::read_to_end(stdout), &mut stdout_buffer);
        let mut stderr_buffer = Vec::new();
        let stderr_done = copy_to_buffer(crate::streams::read_to_end(stderr), &mut stderr_buffer);

        // Note: this relies on the underlying instance closing stdout and
        // stderr when it exits. Failing to do this will block forever.
        let (_, _, exit_condition) =
            futures::try_join!(stdout_done, stderr_done, exit.map_err(Error::from))?;
        let code = exit_condition.into_exit_code()?;

        let output = Output {
            code,
            ok: code == 0,
            stdout: stdout_buffer,
            stderr: stderr_buffer,
        };

        Ok(output)
    }
}

async fn copy_to_buffer(
    stream: impl Stream<Item = Result<Vec<u8>, Error>>,
    buffer: &mut Vec<u8>,
) -> Result<(), Error> {
    futures::pin_mut!(stream);
    while let Some(chunk) = stream.next().await {
        buffer.extend(chunk?);
    }

    Ok(())
}

#[derive(Debug)]
pub(crate) struct ExitCondition(pub Result<(), anyhow::Error>);

impl ExitCondition {
    fn into_exit_code(self) -> Result<i32, Error> {
        match self.0 {
            Ok(_) => Ok(0),
            Err(e) => match e.chain().find_map(|e| e.downcast_ref::<WasiError>()) {
                Some(WasiError::Exit(exit_code)) => Ok(exit_code.raw()),
                _ => Err(e.into()),
            },
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Output {
    code: i32,
    ok: bool,
    stdout: Vec<u8>,
    stderr: Vec<u8>,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Output")]
    pub type JsOutput;
}

impl From<Output> for JsOutput {
    fn from(value: Output) -> Self {
        let Output {
            code,
            ok,
            stdout,
            stderr,
        } = value;

        let output = js_sys::Object::new();
        let _ = js_sys::Reflect::set(&output, &JsValue::from_str("code"), &JsValue::from(code));
        let _ = js_sys::Reflect::set(&output, &JsValue::from_str("ok"), &JsValue::from(ok));
        let _ = js_sys::Reflect::set(
            &output,
            &JsValue::from_str("stdout"),
            &Uint8Array::from(stdout.as_slice()),
        );
        let _ = js_sys::Reflect::set(
            &output,
            &JsValue::from_str("stderr"),
            &Uint8Array::from(stderr.as_slice()),
        );

        output.unchecked_into()
    }
}

#[wasm_bindgen(typescript_custom_section)]
const OUTPUT_TYPE_DEFINITION: &'static str = r#"
export type Output = {
    /* The program's exit code. */
    code: number;
    /* Did the program exit successfully? */
    ok: boolean;
    /* The contents of the program's stdout stream. */
    stdout: Uint8Array;
    /* The contents of the program's stderr stream. */
    stderr: Uint8Array;
}
"#;

#[cfg(test)]
mod tests {
    use futures::channel::oneshot;
    use virtual_fs::AsyncReadExt;
    use virtual_fs::AsyncWriteExt;
    use wasm_bindgen_test::wasm_bindgen_test;
    use wasmer_wasix::{wasmer_wasix_types::wasi::ExitCode, WasiRuntimeError};

    use super::*;

    #[wasm_bindgen_test]
    async fn read_stdout_and_stderr_when_waiting_for_completion() {
        tracing_wasm::set_as_global_default_with_config(
            tracing_wasm::WASMLayerConfigBuilder::default()
                .set_console_config(tracing_wasm::ConsoleConfig::ReportWithoutConsoleColor)
                .build(),
        );

        let (mut stdin, stdin_stream) = crate::streams::input_pipe();
        let (mut stdout, stdout_stream) = crate::streams::output_pipe();
        let (mut stderr, stderr_stream) = crate::streams::output_pipe();
        let (sender, exit) = oneshot::channel();
        let instance = Instance {
            stdin: Some(stdin_stream),
            stdout: stdout_stream,
            stderr: stderr_stream,
            exit,
        };
        dbg!(&instance);

        // First, let's pretend to be a WASIX process doing stuff in the background
        stdout.write_all(b"stdout").await.unwrap();
        stdout.flush().await.unwrap();
        stderr.write_all(b"stderr").await.unwrap();
        stderr.flush().await.unwrap();

        // Now, we pretend the WASIX process exited
        stdout.close();
        stderr.close();
        sender
            .send(ExitCondition(Err(anyhow::Error::from(
                WasiRuntimeError::Wasi(WasiError::Exit(ExitCode::Other(42))),
            ))))
            .unwrap();

        // and wait for the result
        let output = instance.wait().await.unwrap();

        assert_eq!(
            output,
            Output {
                code: 42,
                ok: false,
                stdout: b"stdout".to_vec(),
                stderr: b"stderr".to_vec()
            }
        );
        // Reading from stdin should now result in an EOF because it's closed
        let mut buffer = Vec::new();
        let bytes_read = stdin.read_to_end(&mut buffer).await.unwrap();
        assert_eq!(bytes_read, 0);
    }
}
