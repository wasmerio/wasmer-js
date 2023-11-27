use std::sync::Arc;

use bytes::BytesMut;
use futures::{channel::oneshot, TryStreamExt};
use js_sys::{JsString, Reflect, Uint8Array};
use tracing::Instrument;
use virtual_fs::{AsyncReadExt, Pipe};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue, UnwrapThrowExt};
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
    runtime::Runtime,
    utils::{Error, GlobalScope},
    Instance, JsRuntime, SpawnOptions,
};

/// A package from the Wasmer registry.
///
/// @example
/// ```ts
/// import { Wasmer } from "@wasmer/sdk";
///
/// const pkg = await Wasmer.fromRegistry("wasmer/python");
/// const instance = await pkg.entrypoint!.run({ args: ["--version"]});
/// const { ok, code, stdout, stderr } = await instance.wait();
///
/// if (ok) {
///     const decoder = new TextDecoder("utf-8");
///     console.log(`Version:`, decoder.decode(stdout).trim());
/// } else {
///     throw new Error(`Python exited with ${code}: ${stderr}`);
/// }
/// ```
#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Wasmer {
    /// The package's entrypoint.
    #[wasm_bindgen(getter_with_clone)]
    pub entrypoint: Option<Command>,
    /// A map containing all commands available to the package (including
    /// dependencies).
    #[wasm_bindgen(getter_with_clone)]
    pub commands: Commands,
}

#[wasm_bindgen]
impl Wasmer {
    /// Load a package from the Wasmer registry.
    #[wasm_bindgen(js_name = "fromRegistry")]
    pub async fn js_from_registry(
        specifier: &str,
        runtime: Option<OptionalRuntime>,
    ) -> Result<Wasmer, Error> {
        Wasmer::from_registry(specifier, runtime).await
    }

    /// Load a package from a `*.webc` file.
    #[wasm_bindgen(js_name = "fromWebc")]
    pub async fn js_from_webc(
        webc: Uint8Array,
        runtime: Option<OptionalRuntime>,
    ) -> Result<Wasmer, Error> {
        Wasmer::from_webc(webc.to_vec(), runtime).await
    }
}

/// The actual impl - with `#[tracing::instrument]` macros.
impl Wasmer {
    #[tracing::instrument(skip(runtime))]
    async fn from_registry(
        specifier: &str,
        runtime: Option<OptionalRuntime>,
    ) -> Result<Self, Error> {
        let specifier = PackageSpecifier::parse(specifier)?;
        let runtime = runtime.unwrap_or_default().resolve()?.into_inner();
        let pkg = BinaryPackage::from_registry(&specifier, &*runtime).await?;

        Wasmer::from_package(pkg, runtime)
    }

    #[tracing::instrument(skip(runtime))]
    async fn from_webc(webc: Vec<u8>, runtime: Option<OptionalRuntime>) -> Result<Self, Error> {
        let runtime = runtime.unwrap_or_default().resolve()?.into_inner();
        let container = webc::Container::from_bytes(webc)?;
        let pkg = BinaryPackage::from_webc(&container, &*runtime).await?;

        Wasmer::from_package(pkg, runtime)
    }

    fn from_package(pkg: BinaryPackage, runtime: Arc<Runtime>) -> Result<Self, Error> {
        let pkg = Arc::new(pkg);
        let commands = Commands::default();

        for cmd in &pkg.commands {
            let name = JsString::from(cmd.name());
            let value = JsValue::from(Command {
                name: name.clone(),
                runtime: Arc::clone(&runtime),
                pkg: Arc::clone(&pkg),
            });
            Reflect::set(&commands, &name, &value).map_err(Error::js)?;
        }

        let entrypoint = pkg.entrypoint_cmd.as_deref().map(|name| Command {
            name: name.into(),
            pkg: Arc::clone(&pkg),
            runtime,
        });

        Ok(Wasmer {
            entrypoint,
            commands,
        })
    }
}

/// A runnable WASIX command.
#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Command {
    #[wasm_bindgen(getter_with_clone)]
    pub name: JsString,
    pkg: Arc<BinaryPackage>,
    runtime: Arc<Runtime>,
}

#[wasm_bindgen]
impl Command {
    pub async fn run(&self, options: Option<SpawnOptions>) -> Result<Instance, Error> {
        let runtime = Arc::clone(&self.runtime);
        let pkg = Arc::clone(&self.pkg);
        let tasks = Arc::clone(runtime.task_manager());

        let options = options.unwrap_or_default();

        let mut runner = WasiRunner::new();
        let (stdin, stdout, stderr) = configure_runner(&options, &mut runner, &runtime).await?;
        let command_name = String::from(&self.name);

        tracing::debug!(%command_name, "Starting the WASI runner");

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

    /// Read the binary that will be
    pub fn binary(&self) -> Uint8Array {
        let name = String::from(&self.name);
        let cmd = self.pkg.get_command(&name).unwrap_throw();
        Uint8Array::from(cmd.atom())
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Record<string, Command>", extends = js_sys::Object)]
    #[derive(Clone, Default, Debug)]
    pub type Commands;

    /// A helper to allow functions to take a `runtime?: Runtime` parameter.
    #[wasm_bindgen(typescript_type = "Runtime")]
    pub type OptionalRuntime;
}

impl OptionalRuntime {
    fn resolve(&self) -> Result<JsRuntime, Error> {
        let js_value: &JsValue = self.as_ref();

        if js_value.is_undefined() {
            Runtime::lazily_initialized().map(JsRuntime::from)
        } else {
            let rt = JsRuntime::try_from(js_value).expect_throw("Expected a runtime");
            Ok(rt)
        }
    }
}

impl Default for OptionalRuntime {
    fn default() -> Self {
        Self {
            obj: JsValue::UNDEFINED,
        }
    }
}

pub(crate) async fn configure_runner(
    options: &SpawnOptions,
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
    let args = options.parse_args()?;
    runner.set_args(args);

    let env = options.parse_env()?;
    runner.set_envs(env);

    for (dest, dir) in options.mounted_directories()? {
        runner.mount(dest, Arc::new(dir));
    }

    if let Some(uses) = options.uses() {
        let uses = crate::utils::js_string_array(uses)?;
        let packages = load_injected_packages(uses, runtime).await?;
        runner.add_injected_packages(packages);
    }

    let (stderr_pipe, stderr_stream) = crate::streams::output_pipe();
    runner.set_stderr(Box::new(stderr_pipe));

    let tty_options = runtime.tty_options().clone();
    match setup_tty(options, tty_options) {
        TerminalMode::Interactive {
            stdin_pipe,
            stdout_pipe,
            stdout_stream,
            stdin_stream,
        } => {
            tracing::debug!("Setting up interactive TTY");
            runner.set_stdin(Box::new(stdin_pipe));
            runner.set_stdout(Box::new(stdout_pipe));
            runtime.set_connected_to_tty(true);
            Ok((Some(stdin_stream), stdout_stream, stderr_stream))
        }
        TerminalMode::NonInteractive { stdin } => {
            tracing::debug!("Setting up non-interactive TTY");
            let (stdout_pipe, stdout_stream) = crate::streams::output_pipe();
            runner.set_stdin(Box::new(stdin));
            runner.set_stdout(Box::new(stdout_pipe));

            // HACK: Make sure we don't report stdin as interactive.  This
            // doesn't belong here because now it'll affect every other
            // instance sharing the same runtime... In theory, every
            // instance should get its own TTY state, but that's an issue
            // for wasmer-wasix to work out.
            runtime.set_connected_to_tty(false);

            Ok((None, stdout_stream, stderr_stream))
        }
    }
}

fn setup_tty(options: &SpawnOptions, tty_options: TtyOptions) -> TerminalMode {
    // Handle the simple (non-interactive) case first.
    if let Some(stdin) = options.read_stdin() {
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
        tty_options,
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
