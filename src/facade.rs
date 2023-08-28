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
    _api_key: Option<String>,
}

#[wasm_bindgen]
impl Wasmer {
    #[wasm_bindgen(constructor)]
    pub fn new(cfg: Option<WasmerConfig>) -> Result<Wasmer, Error> {
        let cfg = cfg.unwrap_or_default();

        let mut runtime = Runtime::with_pool_size(cfg.pool_size())?;

        if let Some(registry_url) = cfg.parse_registry_url() {
            runtime.set_registry(&registry_url)?;
        }
        if let Some(gateway) = cfg.network_gateway() {
            runtime.set_network_gateway(gateway.into());
        }

        Ok(Wasmer {
            runtime,
            _api_key: cfg.api_key().map(String::from),
        })
    }

    pub async fn spawn(
        &self,
        app_id: String,
        config: Option<SpawnConfig>,
    ) -> Result<Instance, Error> {
        let _span = tracing::debug_span!("spawn").entered();

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
        config.configure_runner(&mut runner)?;

        tracing::debug!(%specifier, %command_name, "Starting the WASI runner");

        let (sender, receiver) = oneshot::channel();

        // Note: The WasiRunner::run_command() method blocks, so we need to run
        // it on the thread pool.
        tasks.task_dedicated(Box::new(move || {
            let result = runner.run_command(&command_name, &pkg, runtime);
            let _ = sender.send(ExitCondition(result));
        }))?;

        let stdout = web_sys::ReadableStream::new().map_err(Error::js)?;
        wasm_bindgen_futures::JsFuture::from(stdout.cancel())
            .await
            .map_err(Error::js)?;
        let stderr = web_sys::ReadableStream::new().map_err(Error::js)?;
        wasm_bindgen_futures::JsFuture::from(stderr.cancel())
            .await
            .map_err(Error::js)?;

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

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "SpawnConfig", extends = RunConfig)]
    #[derive(Default)]
    pub type SpawnConfig;

    #[wasm_bindgen(method, getter)]
    fn command(this: &SpawnConfig) -> JsValue;
}

impl SpawnConfig {
    pub(crate) fn configure_runner(
        &self,
        runner: &mut WasiRunner,
    ) -> Result<
        (
            Option<web_sys::WritableStream>,
            web_sys::ReadableStream,
            web_sys::ReadableStream,
        ),
        Error,
    > {
        let args = self.parse_args()?;
        runner.set_args(args);

        let env = self.parse_env()?;
        runner.set_envs(env);

        let stdin = match self.read_stdin() {
            Some(stdin) => {
                let f = virtual_fs::StaticFile::new(stdin.into());
                runner.set_stdin(Box::new(f));
                None
            }
            None => {
                let (f, stdin) = crate::streams::readable_pipe();
                runner.set_stdin(Box::new(f));
                Some(stdin)
            }
        };

        let (stdout_file, stdout) = crate::streams::writable_pipe();
        runner.set_stdout(Box::new(stdout_file));

        let (stderr_file, stderr) = crate::streams::writable_pipe();
        runner.set_stderr(Box::new(stderr_file));

        Ok((stdin, stdout, stderr))
    }
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

      /**
       * Set the registry that packages will be fetched from.
       *
       * If null, no registry will be used and looking up packages will always
       * fail.
       *
       * If undefined, will fall back to the default Wasmer registry.
       */
      registryUrl: string | null | undefined;

      /**
       * Enable networking (i.e. TCP and UDP) via a gateway server.
       */
      networkGateway?: string;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "WasmerConfig")]
    pub type WasmerConfig;

    #[wasm_bindgen(method, getter)]
    fn pool_size(this: &WasmerConfig) -> Option<usize>;

    #[wasm_bindgen(method, getter)]
    fn api_key(this: &WasmerConfig) -> Option<JsString>;

    #[wasm_bindgen(method, getter)]
    fn registry_url(this: &WasmerConfig) -> JsValue;

    #[wasm_bindgen(method, getter)]
    fn network_gateway(this: &WasmerConfig) -> Option<JsString>;
}

impl WasmerConfig {
    fn parse_registry_url(&self) -> Option<String> {
        let registry_url = self.registry_url();
        if registry_url.is_null() {
            None
        } else if let Some(s) = registry_url.as_string() {
            Some(s)
        } else {
            Some(wasmer_wasix::runtime::resolver::WapmSource::WASMER_PROD_ENDPOINT.to_string())
        }
    }
}

impl Default for WasmerConfig {
    fn default() -> Self {
        Self {
            obj: js_sys::Object::default().into(),
        }
    }
}
