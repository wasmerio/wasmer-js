use std::{num::NonZeroUsize, sync::Arc};

use virtual_net::VirtualNetworking;
use wasm_bindgen::prelude::wasm_bindgen;
use wasmer_wasix::{
    http::{HttpClient, WebHttpClient},
    runtime::{
        module_cache::ThreadLocalCache,
        package_loader::{BuiltinPackageLoader, PackageLoader},
        resolver::{PackageSpecifier, PackageSummary, QueryError, Source, WapmSource},
    },
    VirtualTaskManager,
};

use crate::{
    tasks::{TaskManager, ThreadPool},
    utils::Error,
    Tty,
};

/// Runtime components used when running WebAssembly programs.
#[derive(Clone, derivative::Derivative)]
#[derivative(Debug)]
#[wasm_bindgen]
pub struct Runtime {
    pool: ThreadPool,
    task_manager: Arc<dyn VirtualTaskManager>,
    networking: Arc<dyn VirtualNetworking>,
    source: Arc<dyn Source + Send + Sync>,
    http_client: Arc<dyn HttpClient + Send + Sync>,
    package_loader: Arc<dyn PackageLoader + Send + Sync>,
    module_cache: Arc<ThreadLocalCache>,
    #[derivative(Debug = "ignore")]
    tty: Option<Arc<dyn wasmer_wasix::os::TtyBridge + Send + Sync>>,
}

#[wasm_bindgen]
impl Runtime {
    #[wasm_bindgen(constructor)]
    pub fn with_pool_size(pool_size: Option<usize>) -> Result<Runtime, Error> {
        let pool = match pool_size {
            Some(size) => {
                let size = NonZeroUsize::new(size).unwrap_or(NonZeroUsize::MIN);
                ThreadPool::new(size)
            }
            None => ThreadPool::new_with_max_threads()?,
        };

        Ok(Runtime::new(pool))
    }

    pub(crate) fn new(pool: ThreadPool) -> Self {
        let task_manager = TaskManager::new(pool.clone());
        let http_client = Arc::new(WebHttpClient::default());
        let package_loader = BuiltinPackageLoader::new_only_client(http_client.clone());
        let module_cache = ThreadLocalCache::default();

        Runtime {
            pool,
            task_manager: Arc::new(task_manager),
            networking: Arc::new(virtual_net::UnsupportedVirtualNetworking::default()),
            source: Arc::new(UnsupportedSource),
            http_client: Arc::new(http_client),
            package_loader: Arc::new(package_loader),
            module_cache: Arc::new(module_cache),
            tty: None,
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

    pub fn set_tty(&mut self, tty: &Tty) {
        self.tty = Some(tty.bridge());
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
        Ok(module.into())
    }

    fn tty(&self) -> Option<&(dyn wasmer_wasix::os::TtyBridge + Send + Sync)> {
        self.tty.as_deref()
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
