use std::sync::Arc;

use anyhow::Context;
use futures::channel::oneshot;
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
    pub fn new(pool_size: Option<usize>) -> Result<Wasmer, JsValue> {
        let runtime = Runtime::with_pool_size(pool_size)?;
        Ok(Wasmer {
            runtime,
            api_key: None,
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
    pub async fn spawn(&self, app_id: String, config: SpawnConfig) -> Result<Instance, Error> {
        let specifier: PackageSpecifier = app_id.parse()?;
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
    pub type SpawnConfig;

    #[wasm_bindgen(method, getter)]
    fn command(this: &SpawnConfig) -> JsValue;
}

#[wasm_bindgen(typescript_custom_section)]
const SPAWN_CONFIG_TYPE_DEFINITION: &'static str = r#"
interface SpawnConfig extends RunConfig {
    /**
     * The name of the command to be run (uses the package's entrypoint if not
     * defined).
     */
    command?: string;
}
"#;
