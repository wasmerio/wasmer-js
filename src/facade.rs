use std::sync::Arc;

use anyhow::Context;
use futures::channel::oneshot;
use js_sys::JsString;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasmer_wasix::{
    bin_factory::BinaryPackage,
    runners::{wasi::WasiRunner, Runner},
    runtime::resolver::PackageSpecifier,
    Runtime as _,
};

use crate::{instance::ExitCondition, utils::Error, Instance, RunConfig, Runtime};

/// The entrypoint to the Wasmer SDK.
#[wasm_bindgen]
pub struct Wasmer {
    runtime: Runtime,
    api_key: Option<String>,
}

#[wasm_bindgen]
impl Wasmer {
    #[wasm_bindgen(constructor)]
    pub fn new(cfg: Option<WasmerConfig>) -> Result<Wasmer, Error> {
        let cfg = cfg.unwrap_or_default();

        let runtime = Runtime::with_pool_size(cfg.pool_size())?;

        Ok(Wasmer {
            runtime,
            api_key: cfg.api_key().map(String::from),
        })
    }

    /// The API key used to communicate with the Wasmer backend.
    #[wasm_bindgen(getter)]
    pub fn api_key(&self) -> Option<String> {
        self.api_key.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_api_key(&mut self, api_key: Option<String>) {
        self.api_key = api_key;
    }

    #[tracing::instrument(level = "debug", skip_all)]
    pub async fn spawn(
        &self,
        app_id: String,
        config: Option<SpawnConfig>,
    ) -> Result<Instance, Error> {
        let specifier: PackageSpecifier = app_id.parse()?;
        let config = config.unwrap_or_default();

        let pkg = BinaryPackage::from_registry(&specifier, &self.runtime).await?;
        let command_name = config
            .command()
            .as_string()
            .or_else(|| pkg.entrypoint_cmd.clone())
            .context("No command name specified")?;

        let runtime = Arc::new(self.runtime.clone());
        let tasks = Arc::clone(runtime.task_manager());

        let mut runner = WasiRunner::new();
        configure_runner(&mut runner, &config)?;

        let (sender, receiver) = oneshot::channel();

        tracing::debug!(%specifier, %command_name, "Starting the WASI runner");

        // Note: The WasiRunner::run_command() method blocks, so we need to run
        // it on the thread pool.
        tasks.task_dedicated(Box::new(move || {
            let result = runner.run_command(&command_name, &pkg, runtime);
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

    pub fn runtime(&self) -> Runtime {
        self.runtime.clone()
    }
}

fn configure_runner(runner: &mut WasiRunner, config: &SpawnConfig) -> Result<(), Error> {
    let args = config.parse_args()?;
    runner.set_args(args);

    let env = config.parse_env()?;
    runner.set_envs(env);

    Ok(())
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "SpawnConfig", extends = RunConfig)]
    #[derive(Default)]
    pub type SpawnConfig;

    #[wasm_bindgen(method, getter)]
    fn command(this: &SpawnConfig) -> JsValue;
}

#[wasm_bindgen(typescript_custom_section)]
const SPAWN_CONFIG_TYPE_DEFINITION: &'static str = r#"
/**
 * Configuration used when starting a WASI program.
 */
export type SpawnConfig = RunConfig & {
    /**
     * The name of the command to be run (uses the package's entrypoint if not
     * defined).
     */
    command?: string;
}
"#;

#[wasm_bindgen(typescript_custom_section)]
const WASMER_CONFIG_TYPE_DEFINITION: &'static str = r#"
/**
 * Configuration used when initializing the Wasmer SDK.
 */
export type WasmerConfig = {
    /**
     * The number of threads to use by default.
     */
     poolSize?: number;
     /**
      * An API key to use when interacting with the Wasmer registry.
      */
      apiKey?: string;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "WasmerConfig")]
    #[derive(Default)]
    pub type WasmerConfig;

    #[wasm_bindgen(method, getter)]
    fn pool_size(this: &WasmerConfig) -> Option<usize>;

    #[wasm_bindgen(method, getter)]
    fn api_key(this: &WasmerConfig) -> Option<JsString>;
}
