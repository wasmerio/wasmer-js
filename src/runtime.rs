use std::sync::Arc;

use virtual_net::VirtualNetworking;
use wasmer_wasix::{
    http::{HttpClient, WebHttpClient},
    runtime::{
        package_loader::{BuiltinPackageLoader, PackageLoader},
        resolver::{PackageSpecifier, PackageSummary, QueryError, Source, WapmSource},
    },
    VirtualTaskManager,
};

use crate::{
    module_cache::ModuleCache,
    task_manager::{TaskManager, ThreadPool},
};

#[derive(Clone, derivative::Derivative)]
#[derivative(Debug)]
pub struct Runtime {
    pool: ThreadPool,
    task_manager: Arc<dyn VirtualTaskManager>,
    networking: Arc<dyn VirtualNetworking>,
    source: Arc<dyn Source + Send + Sync>,
    http_client: Arc<dyn HttpClient + Send + Sync>,
    package_loader: Arc<dyn PackageLoader + Send + Sync>,
    module_cache: Arc<ModuleCache>,
    #[derivative(Debug = "ignore")]
    tty: Option<Arc<dyn wasmer_wasix::os::TtyBridge + Send + Sync>>,
}

impl Runtime {
    pub fn with_pool_size(pool_size: usize) -> Self {
        let pool = ThreadPool::new(pool_size);
        Runtime::new(pool)
    }

    pub fn with_max_threads() -> Result<Self, anyhow::Error> {
        let pool = ThreadPool::new_with_max_threads()?;
        Ok(Runtime::new(pool))
    }

    pub(crate) fn new(pool: ThreadPool) -> Self {
        let task_manager = TaskManager::new(pool.clone());
        let http_client = Arc::new(WebHttpClient::default());
        let package_loader = BuiltinPackageLoader::new_only_client(http_client.clone());
        let module_cache = ModuleCache::default();

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
    pub fn with_registry(&mut self, url: &str) -> Result<&mut Self, url::ParseError> {
        let url = url.parse()?;
        self.source = Arc::new(WapmSource::new(url, self.http_client.clone()));
        Ok(self)
    }

    /// Enable networking (i.e. TCP and UDP) via a gateway server.
    pub fn with_network_gateway(&mut self, gateway_url: impl Into<String>) -> &mut Self {
        let networking = crate::net::connect_networking(gateway_url.into());
        self.networking = Arc::new(networking);
        self
    }

    pub fn with_tty(
        &mut self,
        tty: impl wasmer_wasix::os::TtyBridge + Send + Sync + 'static,
    ) -> &mut Self {
        self.tty = Some(Arc::new(tty));
        self
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
