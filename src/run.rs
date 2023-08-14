use std::sync::Arc;

use futures::{
    channel::oneshot::{self, Receiver},
    future::Either,
    Stream, StreamExt,
};
use js_sys::{Array, JsString, TypeError, Uint8Array, WebAssembly::Module};
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};
use wasmer_wasix::{Runtime as _, WasiEnvBuilder, WasiError, WasiRuntimeError};
use web_sys::ReadableStream;

use crate::{utils::Error, Runtime};

#[wasm_bindgen(typescript_custom_section)]
const RUN_CONFIG_TYPE_DEFINITION: &'static str = r#"
interface RunConfig {
    /** The name of the program being run (passed in as arg 0) */
    program: string;
    /** Additional command-line arguments to be passed to the program. */
    args?: string[];
    /** Environment variables to set. */
    env?: Record<string, string>;
    /** The standard input stream. */
    stdin?: string | ArrayBuffer;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "RunConfig")]
    pub type RunConfig;

    #[wasm_bindgen(method, getter, structural)]
    fn program(this: &RunConfig) -> JsString;

    #[wasm_bindgen(method, getter, structural)]
    fn args(this: &RunConfig) -> Option<Array>;

    #[wasm_bindgen(method, getter, structural)]
    fn env(this: &RunConfig) -> JsValue;

    #[wasm_bindgen(method, getter, structural)]
    fn stdin(this: &RunConfig) -> JsValue;
}

/// Run a WASIX program.
#[wasm_bindgen]
#[tracing::instrument(level = "debug", skip_all)]
pub fn run(module: &Module, runtime: &Runtime, config: RunConfig) -> Result<Instance, Error> {
    let runtime = Arc::new(runtime.clone());
    let mut builder = WasiEnvBuilder::new(config.program()).runtime(runtime.clone());

    if let Some(args) = config.args() {
        for arg in args {
            match arg.dyn_into::<JsString>() {
                Ok(arg) => builder.add_arg(String::from(arg)),
                Err(_) => {
                    return Err(Error::js(TypeError::new("Arguments must be strings")));
                }
            }
        }
    }

    if let Some(env) = config.env().dyn_ref() {
        for (key, value) in crate::utils::object_entries(env)? {
            let key: String = key.into();
            let value: String = value
                .dyn_into::<JsString>()
                .map_err(|_| Error::js(TypeError::new("Environment variables must be strings")))?
                .into();
            builder.add_env(key, value);
        }
    }

    let (sender, receiver) = oneshot::channel();
    let module = wasmer::Module::from(module.clone());

    // Note: The WasiEnvBuilder::run() method blocks, so we need to run it on
    // the thread pool.
    runtime.task_manager().task_dedicated(Box::new(move || {
        let _span = tracing::debug_span!("run").entered();
        let result = builder.run(module);
        let _ = sender.send(ExitCondition(result));
    }))?;

    let stdout = web_sys::ReadableStream::new().map_err(Error::js)?;
    let stderr = web_sys::ReadableStream::new().map_err(Error::js)?;

    Ok(Instance {
        stdin: None,
        stdout,
        stderr,
        exit: receiver,
    })
}

#[derive(Debug)]
#[wasm_bindgen]
pub struct Instance {
    #[wasm_bindgen(getter_with_clone)]
    pub stdin: Option<web_sys::WritableStream>,
    #[wasm_bindgen(getter_with_clone)]
    pub stdout: web_sys::ReadableStream,
    #[wasm_bindgen(getter_with_clone)]
    pub stderr: web_sys::ReadableStream,
    exit: Receiver<ExitCondition>,
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

struct ExitCondition(Result<(), wasmer_wasix::WasiRuntimeError>);

impl ExitCondition {
    fn into_exit_code(self) -> Result<i32, Error> {
        match self.0 {
            Ok(_) => Ok(0),
            Err(WasiRuntimeError::Wasi(WasiError::Exit(exit_code))) => Ok(exit_code.raw()),
            Err(e) => Err(e.into()),
        }
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Output")]
    pub type JsOutput;
}

struct Output {
    code: i32,
    ok: bool,
    stdout: Uint8Array,
    stderr: Uint8Array,
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
type Output = {
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
