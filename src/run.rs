use std::{collections::BTreeMap, sync::Arc};

use futures::channel::oneshot::{self};
use js_sys::{Array, JsString, TypeError, WebAssembly::Module};
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};
use wasmer_wasix::{Runtime as _, WasiEnvBuilder};

use crate::{instance::ExitCondition, utils::Error, Instance, Runtime};

/// Run a WASIX program.
#[wasm_bindgen]
#[tracing::instrument(level = "debug", skip_all)]
pub fn run(module: &Module, runtime: &Runtime, config: RunConfig) -> Result<Instance, Error> {
    let runtime = Arc::new(runtime.clone());
    let mut builder = WasiEnvBuilder::new(config.program()).runtime(runtime.clone());

    for arg in config.parse_args()? {
        builder.add_arg(arg);
    }

    for (key, value) in config.parse_env()? {
        builder.add_env(key, value);
    }

    let (sender, receiver) = oneshot::channel();
    let module = wasmer::Module::from(module.clone());

    // Note: The WasiEnvBuilder::run() method blocks, so we need to run it on
    // the thread pool.
    runtime.task_manager().task_dedicated(Box::new(move || {
        let _span = tracing::debug_span!("run").entered();
        let result = builder.run(module).map_err(anyhow::Error::new);
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

impl RunConfig {
    pub(crate) fn parse_args(&self) -> Result<Vec<String>, Error> {
        let mut parsed = Vec::new();

        if let Some(args) = self.args() {
            for arg in args {
                match arg.dyn_into::<JsString>() {
                    Ok(arg) => parsed.push(String::from(arg)),
                    Err(_) => {
                        return Err(Error::js(TypeError::new("Arguments must be strings")));
                    }
                }
            }
        }

        Ok(parsed)
    }

    pub(crate) fn parse_env(&self) -> Result<BTreeMap<String, String>, Error> {
        let mut parsed = BTreeMap::new();

        if let Some(env) = self.env().dyn_ref() {
            for (key, value) in crate::utils::object_entries(env)? {
                let key: String = key.into();
                let value: String = value
                    .dyn_into::<JsString>()
                    .map_err(|_| {
                        Error::js(TypeError::new("Environment variables must be strings"))
                    })?
                    .into();
                parsed.insert(key, value);
            }
        }

        Ok(parsed)
    }
}
