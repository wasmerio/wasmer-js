use std::{collections::BTreeMap, sync::Arc};

use anyhow::Context;
use futures::channel::oneshot;
use js_sys::Array;
use virtual_fs::TmpFileSystem;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue, UnwrapThrowExt};
use wasmer_wasix::{Runtime as _, WasiEnvBuilder};

use crate::{instance::ExitCondition, utils::Error, Directory, Instance, Runtime, StringOrBytes};

const DEFAULT_PROGRAM_NAME: &str = "wasm";

/// Run a WASIX program.
#[wasm_bindgen]
pub async fn run(wasm_module: WasmModule, config: RunConfig) -> Result<Instance, Error> {
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

    let module: wasmer::Module = wasm_module.to_module(&*runtime).await?;

    // Note: The WasiEnvBuilder::run() method blocks, so we need to run it on
    // the thread pool.
    let tasks = runtime.task_manager().clone();
    tasks.spawn_with_module(
        module,
        Box::new(move |module| {
            let _span = tracing::debug_span!("run").entered();
            let result = builder.run(module).map_err(anyhow::Error::new);
            tracing::warn!(?result);
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

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "WebAssembly.Module | Uint8Array")]
    pub type WasmModule;
}

impl WasmModule {
    async fn to_module(
        &self,
        runtime: &dyn wasmer_wasix::Runtime,
    ) -> Result<wasmer::Module, Error> {
        if let Some(module) = self.dyn_ref::<js_sys::WebAssembly::Module>() {
            Ok(module.clone().into())
        } else if let Some(buffer) = self.dyn_ref::<js_sys::Uint8Array>() {
            let buffer = buffer.to_vec();
            let module = runtime.load_module(&buffer).await?;
            Ok(module)
        } else {
            unreachable!();
        }
    }
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
     * Directories that should be mounted inside the WASIX instance.
     */
    mount?: Record<string, Directory>;
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
    fn stdin(this: &RunConfig) -> Option<StringOrBytes>;

    #[wasm_bindgen(method, getter)]
    fn mount(this: &RunConfig) -> OptionalDirectories;

    #[wasm_bindgen(method, getter)]
    pub(crate) fn runtime(this: &RunConfig) -> OptionalRuntime;

    /// A proxy for `Option<&Runtime>`.
    #[wasm_bindgen]
    pub(crate) type OptionalRuntime;

    #[wasm_bindgen]
    pub(crate) type OptionalDirectories;
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

        let fs = self.filesystem()?;
        builder.set_fs(Box::new(fs));

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
        self.stdin().map(|s| s.as_bytes())
    }

    pub(crate) fn mounted_directories(&self) -> Result<Vec<(String, Directory)>, Error> {
        let Ok(obj) = self.mount().dyn_into::<js_sys::Object>() else {
            return Ok(Vec::new());
        };

        let entries = crate::utils::object_entries(&obj)?;
        let mut mounted_directories = Vec::new();

        for (key, value) in &entries {
            let key = String::from(key.clone());
            let value = Directory::try_from(value).map_err(|_| {
                anyhow::Error::msg(
                    "Mounted directories should be a mapping from strings to directories",
                )
            })?;
            mounted_directories.push((key, value));
        }

        Ok(mounted_directories)
    }

    pub(crate) fn filesystem(&self) -> Result<TmpFileSystem, Error> {
        let root = TmpFileSystem::new();

        for (dest, fs) in self.mounted_directories()? {
            tracing::trace!(%dest, ?fs, "Mounting directory");

            let fs = Arc::new(fs) as Arc<_>;
            root.mount(dest.as_str().into(), &fs, "/".into())
                .with_context(|| format!("Unable to mount to \"{dest}\""))?;
        }

        tracing::trace!(?root, "Initialized the filesystem");

        Ok(root)
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
