use std::sync::Arc;

use anyhow::Context;
use bytes::BytesMut;
use futures::{channel::oneshot, TryStreamExt};
use js_sys::JsString;
use tracing::Instrument;
use virtual_fs::{AsyncReadExt, Pipe};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasmer_wasix::{
    bin_factory::BinaryPackage,
    os::{Tty, TtyOptions},
    runners::{wasi::WasiRunner, Runner},
    runtime::resolver::PackageSpecifier,
    Runtime as _,
};
use web_sys::{ReadableStream, WritableStream};

use crate::{
    instance::ExitCondition,
    utils::{Error, GlobalScope},
    Instance, RunConfig, Runtime,
};

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

    #[wasm_bindgen(js_name = "spawn")]
    pub async fn js_spawn(
        &self,
        app_id: String,
        config: Option<SpawnConfig>,
    ) -> Result<Instance, Error> {
        self.spawn(app_id, config).await
    }

    pub fn runtime(&self) -> Runtime {
        self.runtime.clone()
    }
}

impl Wasmer {
    #[tracing::instrument(skip_all)]
    async fn spawn(&self, app_id: String, config: Option<SpawnConfig>) -> Result<Instance, Error> {
        let specifier: PackageSpecifier = app_id.parse()?;
        let config = config.unwrap_or_default();

        let pkg = BinaryPackage::from_registry(&specifier, &self.runtime).await?;
        let command_name = config
            .command()
            .as_string()
            .or_else(|| pkg.entrypoint_cmd.clone())
            .context("No command name specified")?;

        let runtime = match config.runtime().as_runtime() {
            Some(rt) => Arc::new(rt),
            None => Arc::new(self.runtime.clone()),
        };
        let tasks = Arc::clone(runtime.task_manager());

        let mut runner = WasiRunner::new();
        let (stdin, stdout, stderr) = config.configure_runner(&mut runner, &runtime).await?;

        tracing::debug!(%specifier, %command_name, "Starting the WASI runner");

        let (sender, receiver) = oneshot::channel();

        // Note: The WasiRunner::run_command() method blocks, so we need to run
        // it on the thread pool.
        tasks.task_dedicated(Box::new(move || {
            let result = runner.run_command(&command_name, &pkg, runtime);
            let _ = sender.send(ExitCondition::from_result(result));
        }))?;

        Ok(Instance {
            stdin,
            stdout,
            stderr,
            exit: receiver,
        })
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "SpawnConfig", extends = RunConfig)]
    #[derive(Default)]
    pub type SpawnConfig;

    #[wasm_bindgen(method, getter)]
    fn command(this: &SpawnConfig) -> JsValue;
    #[wasm_bindgen(method, getter)]
    fn uses(this: &SpawnConfig) -> Option<js_sys::Array>;
}

impl SpawnConfig {
    pub(crate) async fn configure_runner(
        &self,
        runner: &mut WasiRunner,
        runtime: &Runtime,
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

        for (dest, dir) in self.mounted_directories()? {
            // runner.mount_dir(dest.as_ref(), dir)?;
            todo!("Mount {dir:?} to {dest}");
        }

        if let Some(uses) = self.uses() {
            let uses = crate::utils::js_string_array(uses)?;
            let packages = load_injected_packages(uses, runtime).await?;
            runner.add_injected_packages(packages);
        }

        let (stderr_pipe, stderr_stream) = crate::streams::output_pipe();
        runner.set_stderr(Box::new(stderr_pipe));

        let options = runtime.tty_options().clone();
        match self.setup_tty(options) {
            TerminalMode::Interactive {
                stdin_pipe,
                stdout_pipe,
                stdout_stream,
                stdin_stream,
            } => {
                runner.set_stdin(Box::new(stdin_pipe));
                runner.set_stdout(Box::new(stdout_pipe));
                Ok((Some(stdin_stream), stdout_stream, stderr_stream))
            }
            TerminalMode::NonInteractive { stdin } => {
                let (stdout_pipe, stdout_stream) = crate::streams::output_pipe();
                runner.set_stdin(Box::new(stdin));
                runner.set_stdout(Box::new(stdout_pipe));
                Ok((None, stdout_stream, stderr_stream))
            }
        }
    }

    fn setup_tty(&self, options: TtyOptions) -> TerminalMode {
        // Handle the simple (non-interactive) case first.
        if let Some(stdin) = self.read_stdin() {
            return TerminalMode::NonInteractive {
                stdin: virtual_fs::StaticFile::new(stdin.into()),
            };
        }

        let (stdout_pipe, stdout_stream) = crate::streams::output_pipe();

        // Note: Because this is an interactive session, we want to intercept
        // stdin and let the TTY modify it.
        //
        // To do that, we manually copy data from the user's pipe into the TTY,
        // then the TTY modifies those bytes and writes them to the pipe we gave
        // to the runtime.
        //
        // To avoid confusing the pipes and how stdin data gets moved around,
        // here's a diagram:
        //
        //  ---------------------------------            --------------------          ----------------------------
        // | stdin_stream (user) u_stdin_rx | --copy--> | (tty) u_stdin_tx  | --pipe-> | stdin_pipe (runtime) ... |
        // ---------------------------------            --------------------          ----------------------------
        let (u_stdin_rx, stdin_stream) = crate::streams::input_pipe();
        let (u_stdin_tx, stdin_pipe) = Pipe::channel();

        let tty = Tty::new(
            Box::new(u_stdin_tx),
            Box::new(stdout_pipe.clone()),
            GlobalScope::current().is_mobile(),
            options,
        );

        // Because the TTY is manually copying between pipes, we need to make
        // sure the stdin pipe passed to the runtime is closed when the user
        // closes their end.
        let cleanup = {
            let stdin_pipe = stdin_pipe.clone();
            move || {
                tracing::debug!("Closing stdin");
                stdin_pipe.close();
            }
        };

        // Use the JS event loop to drive our manual user->tty copy
        wasm_bindgen_futures::spawn_local(
            copy_stdin_to_tty(u_stdin_rx, tty, cleanup)
                .in_current_span()
                .instrument(tracing::debug_span!("tty")),
        );

        TerminalMode::Interactive {
            stdin_pipe,
            stdout_pipe,
            stdout_stream,
            stdin_stream,
        }
    }
}

fn copy_stdin_to_tty(
    mut u_stdin_rx: Pipe,
    mut tty: Tty,
    cleanup: impl FnOnce(),
) -> impl std::future::Future<Output = ()> {
    /// A RAII guard used to make sure the cleanup function always gets called.
    struct CleanupGuard<F: FnOnce()>(Option<F>);

    impl<F: FnOnce()> Drop for CleanupGuard<F> {
        fn drop(&mut self) {
            let cb = self.0.take().unwrap();
            cb();
        }
    }

    async move {
        let _guard = CleanupGuard(Some(cleanup));
        let mut buffer = BytesMut::new();

        loop {
            match u_stdin_rx.read_buf(&mut buffer).await {
                Ok(0) => {
                    break;
                }
                Ok(_) => {
                    // PERF: It'd be nice if we didn't need to do a copy here.
                    let data = buffer.to_vec();
                    tty = tty.on_event(wasmer_wasix::os::InputEvent::Raw(data)).await;
                    buffer.clear();
                }
                Err(e) => {
                    tracing::warn!(
                        error = &e as &dyn std::error::Error,
                        "Error reading stdin and copying it to the tty"
                    );
                    break;
                }
            }
        }
    }
}

#[derive(Debug)]
enum TerminalMode {
    Interactive {
        /// The [`Pipe`] used as the WASIX instance's stdin.
        stdin_pipe: Pipe,
        /// The [`Pipe`] used as the WASIX instance's stdout.
        stdout_pipe: Pipe,
        /// The [`ReadableStream`] our JavaScript caller will read stdout from.
        stdout_stream: ReadableStream,
        /// The [`WritableStream`] our JavaScript caller will write stdin to.
        stdin_stream: WritableStream,
    },
    NonInteractive {
        /// The file to use as the WASIX instance's stdin.
        stdin: virtual_fs::StaticFile,
    },
}

#[tracing::instrument(level = "debug", skip_all)]
async fn load_injected_packages(
    packages: Vec<String>,
    runtime: &Runtime,
) -> Result<Vec<BinaryPackage>, Error> {
    let futures: futures::stream::FuturesOrdered<_> = packages
        .into_iter()
        .map(|pkg| async move { load_package(&pkg, runtime).await })
        .collect();

    let packages = futures.try_collect().await?;

    Ok(packages)
}

#[tracing::instrument(level = "debug", skip(runtime))]
async fn load_package(pkg: &str, runtime: &Runtime) -> Result<BinaryPackage, Error> {
    let specifier: PackageSpecifier = pkg.parse()?;
    let pkg = BinaryPackage::from_registry(&specifier, runtime).await?;

    Ok(pkg)
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
    /**
     * Packages that should also be loaded into the WASIX environment.
     */
    uses?: string[];
}
"#;

#[wasm_bindgen(typescript_custom_section)]
const WASMER_CONFIG_TYPE_DEFINITION: &'static str = r#"
/**
 * Configuration used when initializing the Wasmer SDK.
 */
export type WasmerConfig = {
    /**
     * The maximum number of threads to use.
     *
     * Note that setting this value too low may starve the threadpool of CPU
     * resources, which may lead to deadlocks (e.g. one blocking operation waits
     * on the result of another, but that other operation never gets a chance to
     * run because there aren't any free threads).
     *
     * If not provided, this defaults to `16 * navigator.hardwareConcurrency`.
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
