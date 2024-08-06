use std::sync::{atomic::AtomicBool, Arc, Mutex, Weak};

use http::HeaderValue;
use once_cell::sync::Lazy;
use virtual_net::VirtualNetworking;
use wasmer_config::package::PackageSource;
use wasmer_wasix::{
    http::{HttpClient, WebHttpClient},
    os::{TtyBridge, TtyOptions},
    runtime::{
        module_cache::ThreadLocalCache,
        package_loader::PackageLoader,
        resolver::{PackageSummary, QueryError, Source, WapmSource},
    },
    VirtualTaskManager, WasiTtyState,
};

use crate::{tasks::ThreadPool, utils::Error};

/// A weak reference to the global [`Runtime`].
static GLOBAL_RUNTIME: Lazy<Mutex<Weak<Runtime>>> = Lazy::new(Mutex::default);

/// Runtime components used when running WebAssembly programs.
#[derive(Clone, derivative::Derivative)]
#[derivative(Debug)]
pub struct Runtime {
    pool: ThreadPool,
    task_manager: Arc<dyn VirtualTaskManager>,
    networking: Arc<dyn VirtualNetworking>,
    source: Option<Arc<WapmSource>>,
    http_client: Arc<dyn HttpClient + Send + Sync>,
    package_loader: Arc<crate::package_loader::PackageLoader>,
    module_cache: Arc<ThreadLocalCache>,
    tty: TtyOptions,
    connected_to_tty: Arc<AtomicBool>,
}

impl Runtime {
    /// Get a reference to the global runtime, if it has already been
    /// initialized.
    pub(crate) fn global() -> Option<Arc<Runtime>> {
        GLOBAL_RUNTIME.lock().ok()?.upgrade()
    }

    /// Get a reference to the global runtime, initializing it if it hasn't
    /// already been.
    pub(crate) fn lazily_initialized() -> Result<Arc<Self>, Error> {
        match GLOBAL_RUNTIME.lock() {
            Ok(mut guard) => match guard.upgrade() {
                Some(rt) => Ok(rt),
                None => {
                    tracing::debug!("Initializing the global runtime");
                    let rt = Arc::new(Runtime::with_defaults()?);
                    *guard = Arc::downgrade(&rt);

                    Ok(rt)
                }
            },
            Err(mut e) => {
                tracing::warn!("The global runtime lock was poisoned. Reinitializing.");

                let rt = Arc::new(Runtime::with_defaults()?);
                **e.get_mut() = Arc::downgrade(&rt);

                // FIXME: Use this when it becomes stable
                // GLOBAL_RUNTIME.clear_poison();

                Ok(rt)
            }
        }
    }

    pub(crate) fn with_defaults() -> Result<Self, Error> {
        let pool = ThreadPool::new();
        let mut rt = Runtime::new(pool);

        rt.set_registry(crate::DEFAULT_REGISTRY, None)?;

        Ok(rt)
    }

    pub(crate) fn new(pool: ThreadPool) -> Self {
        let task_manager = Arc::new(pool.clone());

        let mut http_client = WebHttpClient::default();
        http_client
            .with_default_header(
                http::header::USER_AGENT,
                HeaderValue::from_static(crate::USER_AGENT),
            )
            .with_task_manager(task_manager.clone());
        let http_client = Arc::new(http_client);

        let module_cache = ThreadLocalCache::default();
        let package_loader = crate::package_loader::PackageLoader::new(http_client.clone());

        Runtime {
            pool,
            task_manager: Arc::new(task_manager),
            networking: Arc::new(virtual_net::UnsupportedVirtualNetworking::default()),
            source: None,
            http_client: Arc::new(http_client),
            package_loader: Arc::new(package_loader),
            module_cache: Arc::new(module_cache),
            tty: TtyOptions::default(),
            connected_to_tty: Arc::new(AtomicBool::new(false)),
        }
    }

    /// Set the registry that packages will be fetched from.
    pub fn set_registry(&mut self, url: &str, token: Option<&str>) -> Result<(), Error> {
        let url = url.parse().map_err(Error::from)?;

        let mut source = WapmSource::new(url, self.http_client.clone());
        if let Some(token) = token {
            source = source.with_auth_token(token);
        }
        self.source = Some(Arc::new(source));

        Ok(())
    }

    /// Enable networking (i.e. TCP and UDP) via a gateway server.
    pub fn set_network_gateway(&mut self, gateway_url: String) {
        let networking = crate::net::connect_networking(gateway_url);
        self.networking = Arc::new(networking);
    }
}

impl Runtime {
    pub(crate) fn tty_options(&self) -> &TtyOptions {
        &self.tty
    }

    pub(crate) fn set_connected_to_tty(&self, state: bool) {
        self.connected_to_tty
            .store(state, std::sync::atomic::Ordering::SeqCst);
    }
}

impl wasmer_wasix::runtime::Runtime for Runtime {
    fn networking(&self) -> &Arc<dyn VirtualNetworking> {
        &self.networking
    }

    fn task_manager(&self) -> &Arc<dyn VirtualTaskManager> {
        &self.task_manager
    }

    fn source(&self) -> Arc<dyn wasmer_wasix::runtime::resolver::Source + Send + Sync> {
        match &self.source {
            Some(wapm) => Arc::clone(wapm) as _,
            None => Arc::new(UnsupportedSource),
        }
    }

    fn http_client(&self) -> Option<&wasmer_wasix::http::DynHttpClient> {
        Some(&self.http_client)
    }

    fn package_loader(&self) -> Arc<dyn PackageLoader + Send + Sync> {
        self.package_loader.clone()
    }

    fn module_cache(
        &self,
    ) -> Arc<dyn wasmer_wasix::runtime::module_cache::ModuleCache + Send + Sync> {
        self.module_cache.clone()
    }

    fn load_module_sync(&self, wasm: &[u8]) -> Result<wasmer::Module, wasmer_wasix::SpawnError> {
        let wasm = unsafe { js_sys::Uint8Array::view(wasm) };
        let module = js_sys::WebAssembly::Module::new(&wasm)
            .map_err(|x| wasmer_wasix::SpawnError::Other(crate::utils::js_error(x).into()))?;

        Ok(wasmer::Module::from((module, wasm.to_vec())))
    }

    fn tty(&self) -> Option<&(dyn wasmer_wasix::os::TtyBridge + Send + Sync)> {
        Some(self)
    }
}

impl TtyBridge for Runtime {
    #[tracing::instrument(level = "debug", skip_all)]
    fn reset(&self) {
        self.tty.set_echo(true);
        self.tty.set_line_buffering(true);
        self.tty.set_line_feeds(true);
        self.set_connected_to_tty(false);
    }

    #[tracing::instrument(level = "debug", skip(self), ret)]
    fn tty_get(&self) -> WasiTtyState {
        let connected_to_tty = self
            .connected_to_tty
            .load(std::sync::atomic::Ordering::SeqCst);

        WasiTtyState {
            cols: self.tty.cols(),
            rows: self.tty.rows(),
            width: 800,
            height: 600,
            stdin_tty: connected_to_tty,
            stdout_tty: connected_to_tty,
            stderr_tty: connected_to_tty,
            echo: self.tty.echo(),
            line_buffered: self.tty.line_buffering(),
            line_feeds: self.tty.line_feeds(),
        }
    }

    #[tracing::instrument(level = "debug", skip(self))]
    fn tty_set(&self, tty_state: WasiTtyState) {
        self.tty.set_cols(tty_state.cols);
        self.tty.set_rows(tty_state.rows);
        self.tty.set_echo(tty_state.echo);
        self.tty.set_line_buffering(tty_state.line_buffered);
        self.tty.set_line_feeds(tty_state.line_feeds);
        self.set_connected_to_tty(
            tty_state.stdin_tty || tty_state.stdout_tty || tty_state.stderr_tty,
        );
    }
}

/// A [`Source`] that will always error out with [`QueryError::Unsupported`].
#[derive(Debug, Clone)]
struct UnsupportedSource;

#[async_trait::async_trait]
impl Source for UnsupportedSource {
    async fn query(&self, _package: &PackageSource) -> Result<Vec<PackageSummary>, QueryError> {
        Err(QueryError::Unsupported)
    }
}

#[cfg(test)]
mod tests {
    use wasm_bindgen_test::wasm_bindgen_test;
    use wasmer_wasix::{Runtime as _, WasiEnvBuilder};

    use super::*;

    pub(crate) const TRIVIAL_WAT: &[u8] = br#"(
        module
            (memory $memory 0)
            (export "memory" (memory $memory))
            (func (export "_start") nop)
        )"#;

    #[wasm_bindgen_test]
    async fn execute_a_trivial_module() {
        let runtime = Runtime::with_defaults().unwrap();
        let module = runtime.load_module(TRIVIAL_WAT).await.unwrap();

        WasiEnvBuilder::new("trivial")
            .runtime(Arc::new(runtime))
            .run(module)
            .unwrap();
    }
}
