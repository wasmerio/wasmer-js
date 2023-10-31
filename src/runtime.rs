use std::{num::NonZeroUsize, sync::Arc};

use http::HeaderValue;
use virtual_net::VirtualNetworking;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen_derive::TryFromJsValue;
use wasmer_wasix::{
    http::{HttpClient, WebHttpClient},
    os::{TtyBridge, TtyOptions},
    runtime::{
        module_cache::ThreadLocalCache,
        package_loader::PackageLoader,
        resolver::{PackageSpecifier, PackageSummary, QueryError, Source, WapmSource},
    },
    VirtualTaskManager, WasiTtyState,
};

use crate::{tasks::ThreadPool, utils::Error};

/// Runtime components used when running WebAssembly programs.
#[derive(Clone, derivative::Derivative, TryFromJsValue)]
#[derivative(Debug)]
#[wasm_bindgen]
pub struct Runtime {
    pool: ThreadPool,
    task_manager: Arc<dyn VirtualTaskManager>,
    networking: Arc<dyn VirtualNetworking>,
    source: Arc<dyn Source + Send + Sync>,
    http_client: Arc<dyn HttpClient + Send + Sync>,
    package_loader: Arc<crate::package_loader::PackageLoader>,
    module_cache: Arc<ThreadLocalCache>,
    tty: TtyOptions,
}

#[wasm_bindgen]
impl Runtime {
    #[wasm_bindgen(constructor)]
    pub fn with_pool_size(pool_size: Option<usize>) -> Result<Runtime, Error> {
        let pool = match pool_size {
            Some(size) => {
                // Note:
                let size = NonZeroUsize::new(size).unwrap_or(NonZeroUsize::MIN);
                ThreadPool::new(size)
            }
            None => ThreadPool::new_with_max_threads()?,
        };

        Ok(Runtime::new(pool))
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
            source: Arc::new(UnsupportedSource),
            http_client: Arc::new(http_client),
            package_loader: Arc::new(package_loader),
            module_cache: Arc::new(module_cache),
            tty: TtyOptions::default(),
        }
    }

    /// Set the registry that packages will be fetched from.
    pub fn set_registry(&mut self, url: &str) -> Result<(), Error> {
        let url = url.parse().map_err(Error::from)?;
        self.source = Arc::new(WapmSource::new(url, self.http_client.clone()));
        Ok(())
    }

    /// Enable networking (i.e. TCP and UDP) via a gateway server.
    pub fn set_network_gateway(&mut self, gateway_url: String) {
        let networking = crate::net::connect_networking(gateway_url);
        self.networking = Arc::new(networking);
    }

    pub fn print_tty_options(&self) {
        self.tty_get();
    }
}

impl Runtime {
    pub(crate) fn tty_options(&self) -> &TtyOptions {
        &self.tty
    }

    pub(crate) fn package_loader(&self) -> &Arc<crate::package_loader::PackageLoader> {
        &self.package_loader
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
        self.source.clone()
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

    fn load_module_sync(&self, wasm: &[u8]) -> Result<wasmer::Module, anyhow::Error> {
        let wasm = unsafe { js_sys::Uint8Array::view(wasm) };
        let module = js_sys::WebAssembly::Module::new(&wasm).map_err(crate::utils::js_error)?;
        // Note: We need to use this From impl because it will use the
        // wasm-types-polyfill to parse the *.wasm file's import section.
        //
        // The browser doesn't give you any way to inspect the imports at the
        // moment, so without the polyfill we'll always assume the module wants
        // a minimum of 1 page of memory. This causes modules that want more
        // memory by default (e.g. sharrattj/bash) to fail with an instantiation
        // error.
        //
        // https://github.com/wasmerio/wasmer/blob/8ec4f1d76062e2a612ac2f70f4a73eaf59f8fe9f/lib/api/src/js/module.rs#L323-L328
        Ok(wasmer::Module::from((module, wasm.to_vec())))
    }

    fn tty(&self) -> Option<&(dyn wasmer_wasix::os::TtyBridge + Send + Sync)> {
        Some(self)
    }
}

impl TtyBridge for Runtime {
    fn reset(&self) {
        self.tty.set_echo(true);
        self.tty.set_line_buffering(true);
        self.tty.set_line_feeds(true);
    }

    fn tty_get(&self) -> WasiTtyState {
        WasiTtyState {
            cols: self.tty.cols(),
            rows: self.tty.rows(),
            width: 800,
            height: 600,
            stdin_tty: true,
            stdout_tty: true,
            stderr_tty: true,
            echo: self.tty.echo(),
            line_buffered: self.tty.line_buffering(),
            line_feeds: self.tty.line_feeds(),
        }
    }

    fn tty_set(&self, tty_state: WasiTtyState) {
        self.tty.set_cols(tty_state.cols);
        self.tty.set_rows(tty_state.rows);
        self.tty.set_echo(tty_state.echo);
        self.tty.set_line_buffering(tty_state.line_buffered);
        self.tty.set_line_feeds(tty_state.line_feeds);
    }
}

/// A [`Source`] that will always error out with [`QueryError::Unsupported`].
#[derive(Debug, Clone)]
struct UnsupportedSource;

#[async_trait::async_trait]
impl Source for UnsupportedSource {
    async fn query(&self, _package: &PackageSpecifier) -> Result<Vec<PackageSummary>, QueryError> {
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
        let runtime = Runtime::with_pool_size(Some(2)).unwrap();
        let module = runtime.load_module(TRIVIAL_WAT).await.unwrap();

        WasiEnvBuilder::new("trivial")
            .runtime(Arc::new(runtime))
            .run(module)
            .unwrap();
    }
}
