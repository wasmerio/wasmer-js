use futures::{channel::oneshot::Receiver, future::Either, Stream, StreamExt};
use js_sys::Uint8Array;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};
use wasmer_wasix::WasiError;
use web_sys::ReadableStream;

use crate::utils::Error;

/// A handle connected to a running WASI program.
#[derive(Debug)]
#[wasm_bindgen]
pub struct Instance {
    /// The standard input stream, if one wasn't provided when starting the
    /// instance.
    #[wasm_bindgen(getter_with_clone)]
    pub stdin: Option<web_sys::WritableStream>,
    /// The WASI program's standard output.
    #[wasm_bindgen(getter_with_clone)]
    pub stdout: web_sys::ReadableStream,
    /// The WASI program's standard error.
    #[wasm_bindgen(getter_with_clone)]
    pub stderr: web_sys::ReadableStream,
    pub(crate) exit: Receiver<ExitCondition>,
}

#[wasm_bindgen]
impl Instance {
    /// Wait for the process to exit.
    #[tracing::instrument(level = "debug", skip_all)]
    pub async fn wait(self) -> Result<JsOutput, Error> {
        let Instance {
            stdin,
            stdout,
            stderr,
            mut exit,
        } = self;

        if let Some(stdin) = stdin {
            tracing::debug!("Closed stdin");
            wasm_bindgen_futures::JsFuture::from(stdin.close())
                .await
                .map_err(Error::js)?;
        }

        let stdout_chunks = read_stream(stdout).fuse();
        let stderr_chunks = read_stream(stderr).fuse();
        futures::pin_mut!(stdout_chunks);
        futures::pin_mut!(stderr_chunks);
        let mut stdout_buffer = Vec::new();
        let mut stderr_buffer = Vec::new();

        let code = loop {
            futures::select_biased! {
                chunk = stdout_chunks.next() => {
                    if let Some(chunk) = chunk {
                        stdout_buffer.extend(chunk?);
                    }
                }
                chunk = stderr_chunks.next() => {
                    if let Some(chunk) = chunk {
                        stderr_buffer.extend(chunk?);
                    }
                }
                result = exit => {
                    // The program has exited. Presumably, everything that
                    // should have been written has already been written, so
                    // it's fine to exit the loop.
                    break result?.into_exit_code()?;
                }
            }
        };

        let output = Output {
            code,
            ok: code == 0,
            stdout: Uint8Array::from(stdout_buffer.as_slice()),
            stderr: Uint8Array::from(stderr_buffer.as_slice()),
        };

        Ok(output.into())
    }
}

fn read_stream(stream: ReadableStream) -> impl Stream<Item = Result<Vec<u8>, Error>> {
    let reader = match web_sys::ReadableStreamDefaultReader::new(&stream) {
        Ok(reader) => reader,
        Err(_) => {
            // The stream is either locked and therefore it's the user's
            // responsibility to consume its contents.
            return Either::Left(futures::stream::empty());
        }
    };

    let stream = futures::stream::try_unfold(reader, move |reader| async {
        let next_chunk = wasm_bindgen_futures::JsFuture::from(reader.read())
            .await
            .map_err(Error::js)?;

        let chunk = get_chunk(next_chunk)?;

        Ok(chunk.map(|c| (c, reader)))
    });

    Either::Right(stream)
}

fn get_chunk(next_chunk: JsValue) -> Result<Option<Vec<u8>>, Error> {
    let done = JsValue::from_str(wasm_bindgen::intern("done"));
    let value = JsValue::from_str(wasm_bindgen::intern("value"));

    let done = js_sys::Reflect::get(&next_chunk, &done).map_err(Error::js)?;
    if done.is_truthy() {
        return Ok(None);
    }

    let chunk = js_sys::Reflect::get(&next_chunk, &value).map_err(Error::js)?;
    let chunk = Uint8Array::new(&chunk);

    Ok(Some(chunk.to_vec()))
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

struct Output {
    code: i32,
    ok: bool,
    stdout: Uint8Array,
    stderr: Uint8Array,
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
            &JsValue::from(stdout),
        );
        let _ = js_sys::Reflect::set(
            &output,
            &JsValue::from_str("stderr"),
            &JsValue::from(stderr),
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
