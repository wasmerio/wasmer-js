use std::{collections::BTreeMap, sync::Arc};

use futures::channel::oneshot;
use js_sys::Array;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue, UnwrapThrowExt};
use wasmer_wasix::{Runtime as _, WasiEnvBuilder};

use crate::{instance::ExitCondition, utils::Error, Instance, Runtime};

const DEFAULT_PROGRAM_NAME: &str = "wasm";

/// Run a WASIX program.
#[wasm_bindgen]
pub fn run(wasm_module: js_sys::WebAssembly::Module, config: RunConfig) -> Result<Instance, Error> {
    let _span = tracing::debug_span!("run").entered();

    let runtime = match config.runtime().as_runtime() {
        Some(rt) => Arc::new(rt.clone()),
        None => Arc::new(Runtime::with_pool_size(None)?),
    };

    let program_name = config
        .program()
        .as_string()
        .unwrap_or_else(|| DEFAULT_PROGRAM_NAME.to_string());

    let mut builder = WasiEnvBuilder::new(program_name).runtime(runtime.clone());
    let (stdin, stdout, stderr) = config.configure_builder(&mut builder)?;

    let (exit_code_tx, exit_code_rx) = oneshot::channel();
    let module = wasmer::Module::from(wasm_module);

    // Note: The WasiEnvBuilder::run() method blocks, so we need to run it on
    // the thread pool.
    let tasks = runtime.task_manager().clone();
    tasks.spawn_with_module(
        module,
        Box::new(move |module| {
            let _span = tracing::debug_span!("run").entered();
            let result = builder.run(module).map_err(anyhow::Error::new);
            let _ = exit_code_tx.send(ExitCondition::from_result(result));
        }),
    )?;

    Ok(Instance {
        stdin,
        stdout,
        stderr,
        exit: exit_code_rx,
    })
}

#[wasm_bindgen(typescript_custom_section)]
const RUN_CONFIG_TYPE_DEFINITION: &'static str = r#"
/** Configuration used when starting a WASI program. */
export type RunConfig = {
    /** The name of the program being run (passed in as arg 0) */
    program?: string;
    /** Additional command-line arguments to be passed to the program. */
    args?: string[];
    /** Environment variables to set. */
    env?: Record<string, string>;
    /** The standard input stream. */
    stdin?: string | ArrayBuffer;
    /**
     * The WASIX runtime to use.
     *
     * Providing a `Runtime` allows multiple WASIX instances to share things
     * like caches and threadpools. If not provided, a default `Runtime` will be
     * created.
     */
    runtime?: Runtime;
};
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "RunConfig")]
    pub type RunConfig;

    #[wasm_bindgen(method, getter)]
    fn program(this: &RunConfig) -> JsValue;

    #[wasm_bindgen(method, getter)]
    fn args(this: &RunConfig) -> Option<Array>;

    #[wasm_bindgen(method, getter)]
    fn env(this: &RunConfig) -> JsValue;

    #[wasm_bindgen(method, getter)]
    fn stdin(this: &RunConfig) -> JsValue;

    #[wasm_bindgen(method, getter)]
    pub(crate) fn runtime(this: &RunConfig) -> OptionalRuntime;

    /// A proxy for `Option<&Runtime>`.
    #[wasm_bindgen(typescript_type = "Runtime | undefined")]
    pub(crate) type OptionalRuntime;
}

impl RunConfig {
    /// Propagate any provided options to the [`WasiEnvBuilder`], returning
    /// streams that can be used for stdin/stdout/stderr.
    fn configure_builder(
        &self,
        builder: &mut WasiEnvBuilder,
    ) -> Result<
        (
            Option<web_sys::WritableStream>,
            web_sys::ReadableStream,
            web_sys::ReadableStream,
        ),
        Error,
    > {
        for arg in self.parse_args()? {
            builder.add_arg(arg);
        }

        for (key, value) in self.parse_env()? {
            builder.add_env(key, value);
        }

        let stdin = match self.read_stdin() {
            Some(stdin) => {
                let f = virtual_fs::StaticFile::new(stdin.into());
                builder.set_stdin(Box::new(f));
                None
            }
            None => {
                let (f, stdin) = crate::streams::input_pipe();
                builder.set_stdin(Box::new(f));
                Some(stdin)
            }
        };

        let (stdout_file, stdout) = crate::streams::output_pipe();
        builder.set_stdout(Box::new(stdout_file));

        let (stderr_file, stderr) = crate::streams::output_pipe();
        builder.set_stderr(Box::new(stderr_file));

        Ok((stdin, stdout, stderr))
    }

    pub(crate) fn parse_args(&self) -> Result<Vec<String>, Error> {
        match self.args() {
            Some(args) => crate::utils::js_string_array(args),
            None => Ok(Vec::new()),
        }
    }

    pub(crate) fn parse_env(&self) -> Result<BTreeMap<String, String>, Error> {
        match self.env().dyn_ref() {
            Some(env) => {
                let vars = crate::utils::js_record_of_strings(env)?;
                Ok(vars.into_iter().collect())
            }
            None => Ok(BTreeMap::new()),
        }
    }

    pub(crate) fn read_stdin(&self) -> Option<Vec<u8>> {
        let stdin = self.stdin();

        if let Some(s) = stdin.as_string() {
            return Some(s.into_bytes());
        }

        stdin
            .dyn_into::<js_sys::Uint8Array>()
            .map(|buf| buf.to_vec())
            .ok()
    }
}

impl Default for RunConfig {
    fn default() -> Self {
        // Note: all fields are optional, so it's fine to use an empty object.
        Self {
            obj: js_sys::Object::new().into(),
        }
    }
}

impl OptionalRuntime {
    pub(crate) fn as_runtime(&self) -> Option<Runtime> {
        let js_value: &JsValue = self.as_ref();

        if js_value.is_undefined() {
            None
        } else {
            let rt = Runtime::try_from(js_value).expect_throw("Expected a runtime");
            Some(rt)
        }
    }
}
