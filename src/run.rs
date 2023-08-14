use std::sync::Arc;

use futures::{
    channel::oneshot::{self, Receiver},
    TryFutureExt,
};
use js_sys::{Array, JsString, TypeError, Uint8Array, WebAssembly::Module};
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};
use wasmer_wasix::{Runtime as _, WasiEnvBuilder, WasiError, WasiRuntimeError};
use web_sys::ReadableStream;

use crate::{utils::Error, Runtime};

#[wasm_bindgen(typescript_custom_section)]
const ITEXT_STYLE: &'static str = r#"
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
        let result = builder.run(module);
        let _ = sender.send(ExitCondition(result));
    }))?;

    Ok(Instance {
        stdin: None,
        stdout: web_sys::ReadableStream::new().map_err(Error::js)?,
        stderr: web_sys::ReadableStream::new().map_err(Error::js)?,
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
    pub async fn wait(self) -> Result<JsOutput, Error> {
        let Instance {
            stdin,
            stdout,
            stderr,
            exit,
        } = self;

        if let Some(stdin) = stdin {
            wasm_bindgen_futures::JsFuture::from(stdin.close())
                .await
                .map_err(Error::js)?;
        }

        let (exit, stdout, stderr) = futures::future::try_join3(
            exit.map_err(Error::from),
            read_to_end(stdout),
            read_to_end(stderr),
        )
        .await?;

        let code = exit.into_exit_code()?;

        let output = Output {
            code,
            ok: code == 0,
            stdout: Uint8Array::from(stdout.as_slice()),
            stderr: Uint8Array::from(stderr.as_slice()),
        };

        Ok(output.into())
    }
}

async fn read_to_end(stream: ReadableStream) -> Result<Vec<u8>, Error> {
    if stream.locked() {
        // The user is already reading this stream, so let them consume the output.
        return Ok(Vec::new());
    }

    // Otherwise, we need to lock the stream and read to end
    let reader = web_sys::ReadableStreamDefaultReader::new(&stream).map_err(Error::js)?;

    let mut buffer = Vec::new();
    let done = JsValue::from_str("done");
    let value = JsValue::from_str("value");

    loop {
        let next_chunk = wasm_bindgen_futures::JsFuture::from(reader.read())
            .await
            .map_err(Error::js)?;

        let done = js_sys::Reflect::get(&next_chunk, &done).map_err(Error::js)?;
        if done.is_truthy() {
            break;
        }

        let chunk = js_sys::Reflect::get(&next_chunk, &value).map_err(Error::js)?;
        let chunk = Uint8Array::new(&chunk);

        // PERF: It'd be nice if we can skip this redundant to_vec() and copy
        // directly from the Uint8Array into our buffer.
        buffer.extend(chunk.to_vec());
    }

    Ok(buffer)
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
const ITEXT_STYLE: &'static str = r#"
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
