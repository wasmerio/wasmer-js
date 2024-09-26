use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use anyhow::{Context, Error};
use bytes::Bytes;
use reqwest::{Method, header::{HeaderMap, HeaderValue}, StatusCode};
use wasmer_wasix::{
    bin_factory::BinaryPackage,
    http::{HttpClient, HttpRequest, HttpResponse},
    runtime::resolver::{DistributionInfo, PackageSummary, Resolution, WebcHash},
};
use webc::Container;

/// A package loader that uses the browser's native APIs to download packages.
///
/// Downloads will be cached based on the [`default`] caching behaviour.
///
/// [`default`]: https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
#[derive(Debug, Clone)]
pub struct PackageLoader {
    client: Arc<dyn HttpClient + Send + Sync>,
    cache: Arc<Cache>,
}

impl PackageLoader {
    pub fn new(client: Arc<dyn HttpClient + Send + Sync>) -> Self {
        let cache = Arc::new(Cache::default());
        PackageLoader { client, cache }
    }

    async fn download(&self, dist: &DistributionInfo) -> Result<Bytes, Error> {
        let mut headers = HeaderMap::new();
        headers.insert("Accept", HeaderValue::from_static("application/webc"));

        let request = HttpRequest {
            url: dist.webc.clone(),
            method: Method::GET,
            headers,
            body: None,
            options: Default::default(),
        };

        tracing::debug!(%request.url, %request.method, "Downloading a webc file");
        tracing::trace!(?request.headers);

        let response = self.client.request(request).await?;

        tracing::trace!(
            %response.status,
            %response.redirected,
            ?response.headers,
            response.len=response.body.as_ref().map(|body| body.len()),
            "Received a response",
        );

        if !response.is_ok() {
            let url = &dist.webc;
            return Err(
                http_error(&response).context(format!("The GET request to \"{url}\" failed"))
            );
        }

        let body = response
            .body
            .context("The response didn't contain a body")?;

        Ok(body.into())
    }

    pub(crate) async fn download_cached(&self, dist: &DistributionInfo) -> Result<Bytes, Error> {
        let webc_hash = dist.webc_sha256;

        let body = match self.cache.load(&webc_hash) {
            Some(body) => {
                tracing::debug!("Cache Hit!");
                body
            }
            None => {
                tracing::debug!("Cache Miss");
                let bytes = self.download(dist).await?;
                self.cache.save(webc_hash, bytes.clone());
                bytes
            }
        };

        Ok(body)
    }
}

#[async_trait::async_trait]
impl wasmer_wasix::runtime::package_loader::PackageLoader for PackageLoader {
    #[tracing::instrument(
        skip_all,
        fields(
            pkg=format!("{:?}", summary.pkg.id),
            pkg.url=summary.dist.webc.as_str(),
        ),
    )]
    async fn load(&self, summary: &PackageSummary) -> Result<Container, Error> {
        let body = self.download_cached(&summary.dist).await?;
        let container = Container::from_bytes(body)?;

        Ok(container)
    }

    async fn load_package_tree(
        &self,
        root: &Container,
        resolution: &Resolution,
        root_is_local_dir: bool,
    ) -> Result<BinaryPackage, Error> {
        wasmer_wasix::runtime::package_loader::load_package_tree(root, self, resolution, root_is_local_dir).await
    }
}

pub(crate) fn http_error(response: &HttpResponse) -> Error {
    let status = response.status;

    if status == StatusCode::SERVICE_UNAVAILABLE {
        if let Some(retry_after) = response
            .headers
            .get("Retry-After")
            .and_then(|retry_after| retry_after.to_str().ok())
        {
            tracing::debug!(
                %retry_after,
                "Received 503 Service Unavailable while looking up a package. The backend may still be generating the *.webc file.",
            );
            return anyhow::anyhow!("{status} (Retry After: {retry_after})");
        }
    }

    Error::msg(status)
}

/// A quick'n'dirty cache for downloaded packages.
///
/// This makes no attempt at verifying a cached
#[derive(Debug, Default)]
struct Cache(Mutex<HashMap<WebcHash, Bytes>>);

impl Cache {
    fn load(&self, hash: &WebcHash) -> Option<Bytes> {
        let cache = self.0.lock().ok()?;
        let bytes = cache.get(hash)?;
        Some(bytes.clone())
    }

    fn save(&self, hash: WebcHash, bytes: Bytes) {
        debug_assert_eq!(
            hash,
            WebcHash::sha256(bytes.as_ref()),
            "Mismatched webc hash"
        );

        if let Ok(mut cache) = self.0.lock() {
            cache.insert(hash, bytes);
        }
    }
}
