// DISCUSSION: just use sync runtime? workers are being more of a pain than they're worth. I don't know if replicating wasi-web is desirable here.

use std::time::Duration;
/// ^1: bindgen glue marks its calls as unsafe - namely the use of
///     shared references that can be sent to is not in line with
///     the way the rust borrow checker is meant to work. hence
///     this file has some `unsafe` code in it
use std::{future::Future, pin::Pin, sync::Arc};

use derivative::Derivative;
use futures::future::BoxFuture;
use http::{HeaderMap, StatusCode};
use js_sys::Promise;

use tokio::runtime::{Builder, Handle, Runtime};
/* #[allow(unused_imports, dead_code)]
use tracing::{debug, error, info, trace, warn}; */
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::*;
use wasmer_wasix::{
    http::{DynHttpClient, HttpRequest, HttpResponse},
    os::TtyBridge,
    runtime::{
        module_cache::{FileSystemCache, ModuleCache, ThreadLocalCache},
        package_loader::{BuiltinPackageLoader, PackageLoader},
        resolver::{MultiSource, Source},
        task_manager::TaskWasm,
    },
    VirtualNetworking, VirtualTaskManager, WasiThreadError,
};
use web_sys::*;

use super::{pool::WebThreadPool, tty::*};

#[derive(Derivative)]
#[derivative(Debug)]
pub(crate) struct WebRuntime {
    pub(crate) pool: WebThreadPool,
    #[derivative(Debug = "ignore")]
    tty: Option<JSTty>,
    http_client: DynHttpClient,
    package_loader: Arc<BuiltinPackageLoader>,
    source: Arc<MultiSource>,
    module_cache: Arc<dyn ModuleCache + Send + Sync>,
    net: wasmer_wasix::virtual_net::DynVirtualNetworking,
    tasks: Arc<dyn VirtualTaskManager>,
}

impl WebRuntime {
    #[allow(unused_variables)]
    pub(crate) fn new(pool: WebThreadPool, tty: Option<JSTtyBridge>) -> WebRuntime {
        let tasks = WebTaskManager {
            pool: pool.clone(),
            runtime: Arc::new(Builder::new_current_thread().build().unwrap()),
        };
        let http_client = Arc::new(WebHttpClient { pool: pool.clone() });
        let source = MultiSource::new();

        let cache_dir = std::env::current_dir()
            .unwrap_or_else(|_| ".wasmer".into())
            .join("cache")
            .join("");

        // Note: the package loader and module cache have tiered caching, so
        // even if the filesystem cache fails (i.e. because we're compiled to
        // wasm32-unknown-unknown and running in a browser), the in-memory layer
        // should still work.
        let package_loader = BuiltinPackageLoader::new_with_client(&cache_dir, http_client.clone());
        let module_cache =
            ThreadLocalCache::default().with_fallback(FileSystemCache::new(&cache_dir));
        WebRuntime {
            pool,
            tasks: Arc::new(tasks),
            tty: tty.map(|tty| JSTty::new(tty)),
            http_client,
            net: Arc::new(WebVirtualNetworking),
            module_cache: Arc::new(module_cache),
            package_loader: Arc::new(package_loader),
            source: Arc::new(source),
        }
    }
}

#[derive(Clone, Debug)]
struct WebVirtualNetworking;

impl VirtualNetworking for WebVirtualNetworking {}

#[derive(Debug, Clone)]
pub(crate) struct WebTaskManager {
    pool: WebThreadPool,
    runtime: Arc<Runtime>,
}

struct WebRuntimeGuard<'g> {
    #[allow(unused)]
    inner: tokio::runtime::EnterGuard<'g>,
}
impl<'g> Drop for WebRuntimeGuard<'g> {
    fn drop(&mut self) {}
}

#[async_trait::async_trait]
#[allow(unused_variables)]
impl VirtualTaskManager for WebTaskManager {
    /// Invokes whenever a WASM thread goes idle. In some runtimes (like singlethreaded
    /// execution environments) they will need to do asynchronous work whenever the main
    /// thread goes idle and this is the place to hook for that.
    fn sleep_now(
        &self,
        time: Duration,
    ) -> Pin<Box<dyn Future<Output = ()> + Send + Sync + 'static>> {
        // The async code itself has to be sent to a main JS thread as this is where
        // time can be handled properly - later we can look at running a JS runtime
        // on the dedicated threads but that will require that processes can be unwound
        // using asyncify
        let timeout = std::cmp::min(time.as_millis(), i32::MAX as u128) as i32;
        let (tx, rx) = tokio::sync::oneshot::channel();
        self.pool.spawn_shared(Box::new(move || {
            Box::pin(async move {
                let _ = JsFuture::from(Promise::new(&mut move |resolve, reject| {
                    set_timeout(&resolve, timeout);
                }))
                .await;
                let _ = tx.send(());
            })
        }));
        Box::pin(async move {
            let _ = rx.await;
        })
    }

    /// Starts an asynchronous task that will run on a shared worker pool
    /// This task must not block the execution or it could cause a deadlock
    fn task_shared(
        &self,
        task: Box<
            dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + Send + 'static>> + Send + 'static,
        >,
    ) -> Result<(), WasiThreadError> {
        self.pool.spawn_shared(Box::new(move || {
            Box::pin(async move {
                let fut = task();
                fut.await
            })
        }));
        Ok(())
    }

    /// Returns a runtime that can be used for asynchronous tasks
    fn runtime(&self) -> &Handle {
        self.runtime.handle()
    }

    /// Enters a runtime context
    #[allow(dyn_drop)]
    fn runtime_enter<'g>(&'g self) -> Box<dyn std::ops::Drop + 'g> {
        Box::new(WebRuntimeGuard {
            inner: self.runtime.enter(),
        })
    }

    /// Starts an asynchronous task will will run on a dedicated thread
    /// pulled from the worker pool that has a stateful thread local variable
    /// It is ok for this task to block execution and any async futures within its scope
    fn task_wasm(&self, task: TaskWasm) -> Result<(), WasiThreadError> {
        self.pool.spawn_wasm(task);
        Ok(())
    }

    /// Starts an asynchronous task will will run on a dedicated thread
    /// pulled from the worker pool. It is ok for this task to block execution
    /// and any async futures within its scope
    fn task_dedicated(
        &self,
        task: Box<dyn FnOnce() + Send + 'static>,
    ) -> Result<(), WasiThreadError> {
        self.pool.spawn_dedicated(task);
        Ok(())
    }
    /// Returns the amount of parallelism that is possible on this platform
    fn thread_parallelism(&self) -> Result<usize, WasiThreadError> {
        Ok(8)
    }
}

impl wasmer_wasix::Runtime for WebRuntime {
    fn networking(&self) -> &wasmer_wasix::virtual_net::DynVirtualNetworking {
        &self.net
    }

    fn task_manager(&self) -> &Arc<dyn VirtualTaskManager> {
        &self.tasks
    }

    fn tty(&self) -> Option<&(dyn TtyBridge + Send + Sync)> {
        self.tty
            .as_ref()
            .map(|x| x as &(dyn TtyBridge + Send + Sync))
    }

    fn http_client(&self) -> Option<&DynHttpClient> {
        Some(&self.http_client)
    }

    fn module_cache(&self) -> Arc<dyn ModuleCache + Send + Sync> {
        Arc::clone(&self.module_cache)
    }

    fn package_loader(&self) -> Arc<dyn PackageLoader + Send + Sync> {
        Arc::clone(&self.package_loader) as Arc<dyn PackageLoader + Send + Sync>
    }

    fn source(&self) -> Arc<dyn Source + Send + Sync> {
        Arc::clone(&self.source) as Arc<dyn Source + Send + Sync>
    }
}

#[derive(Clone, Debug)]
struct WebHttpClient {
    pool: WebThreadPool,
}

impl WebHttpClient {
    async fn do_request(request: HttpRequest) -> Result<HttpResponse, anyhow::Error> {
        let resp = fetch(
            request.url.as_str(),
            request.method.as_str(),
            request.options.gzip,
            request.options.cors_proxy,
            &request.headers,
            request.body,
        )
        .await?;

        let redirected = resp.redirected();
        let status = StatusCode::from_u16(resp.status())?;

        let mut headers = HeaderMap::new();

        // NOTE: Copied from reqwest's implementation
        let js_headers = resp.headers();
        let data = get_response_data(resp).await?;
        let js_iter = js_sys::try_iter(&js_headers)
            .map_err(|_| anyhow::anyhow!("Could not iterate through response headers"))?
            .ok_or_else(|| anyhow::anyhow!("Could not iterate through response headers"))?;

        for item in js_iter {
            let item =
                item.map_err(|_| anyhow::anyhow!("Could not iterate through response headers"))?;
            let item = item.dyn_into::<js_sys::Array>().unwrap();
            let [name, value]: [String; 2] = [
                item.get(0).as_string().unwrap(),
                item.get(1).as_string().unwrap(),
            ];
            headers.append(
                http::HeaderName::from_bytes(name.as_bytes())
                    .map_err(|e| anyhow::anyhow!("Response header name was invalid: {}", e))?,
                value
                    .parse()
                    .map_err(|e| anyhow::anyhow!("Could not parse response header value: {}", e))?,
            );
        }

        /* debug!("received {} bytes", data.len()); */
        let resp = HttpResponse {
            redirected,
            status,
            headers,
            body: Some(data),
        };
        /* debug!("response status {}", status); */

        Ok(resp)
    }
}

impl wasmer_wasix::http::HttpClient for WebHttpClient {
    fn request(
        &self,
        request: wasmer_wasix::http::HttpRequest,
    ) -> BoxFuture<Result<wasmer_wasix::http::HttpResponse, anyhow::Error>> {
        let (tx, rx) = tokio::sync::oneshot::channel();
        // The async code itself has to be sent to a main JS thread as this is where
        // HTTP requests can be handled properly - later we can look at running a JS runtime
        // on the dedicated threads but that will require that processes can be unwound
        // using asyncify
        self.pool.spawn_shared(Box::new(move || {
            Box::pin(async move {
                let res = Self::do_request(request).await;
                let _ = tx.send(res);
            })
        }));
        Box::pin(async move { rx.await.unwrap() })
    }
}

fn fetch_internal(request: &Request) -> JsFuture {
    let global = js_sys::global();
    if JsValue::from_str("WorkerGlobalScope").js_in(&global)
        && global.is_instance_of::<WorkerGlobalScope>()
    {
        JsFuture::from(
            global
                .unchecked_into::<WorkerGlobalScope>()
                .fetch_with_request(request),
        )
    } else {
        JsFuture::from(
            global
                .unchecked_into::<web_sys::Window>()
                .fetch_with_request(request),
        )
    }
}

pub async fn fetch(
    url: &str,
    method: &str,
    _gzip: bool,
    cors_proxy: Option<String>,
    headers: &http::HeaderMap,
    data: Option<Vec<u8>>,
) -> Result<Response, anyhow::Error> {
    let mut opts = RequestInit::new();
    opts.method(method);
    opts.mode(RequestMode::Cors);

    if let Some(data) = data {
        let data_len = data.len();
        let array = js_sys::Uint8Array::new_with_length(data_len as u32);
        array.copy_from(&data[..]);

        opts.body(Some(&array));
    }

    let request = {
        let request = Request::new_with_str_and_init(&url, &opts)
            .map_err(|_| anyhow::anyhow!("Could not construct request object"))?;

        let set_headers = request.headers();
        for (name, val) in headers.iter() {
            let val = String::from_utf8_lossy(val.as_bytes());
            set_headers.set(name.as_str(), &val).map_err(|_| {
                anyhow::anyhow!("could not apply request header: '{name}': '{val}'")
            })?;
        }
        request
    };

    let resp_value = match fetch_internal(&request).await.ok() {
        Some(a) => a,
        None => {
            // If the request failed it may be because of CORS so if a cors proxy
            // is configured then try again with the cors proxy
            let url_store;
            let url = if let Some(cors_proxy) = cors_proxy {
                url_store = format!("https://{}/{}", cors_proxy, url);
                url_store.as_str()
            } else {
                // TODO: more descriptive error.
                return Err(anyhow::anyhow!("Could not fetch '{url}'"));
            };

            let request = Request::new_with_str_and_init(url, &opts)
                .map_err(|_| anyhow::anyhow!("Could not construct request for url '{url}'"))?;

            let set_headers = request.headers();
            for (name, val) in headers.iter() {
                let value = String::from_utf8_lossy(val.as_bytes());
                set_headers.set(name.as_str(), &value).map_err(|_| {
                    anyhow::anyhow!("Could not apply request header: '{name}': '{value}'")
                })?;
            }

            fetch_internal(&request).await.map_err(|_| {
                // TODO: more descriptive error.
                anyhow::anyhow!("Could not fetch '{url}'")
            })?
        }
    };
    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();

    if resp.status() < 200 || resp.status() >= 400 {
        /* debug!("fetch-failed: {}", resp.status_text()); */
        return Err(anyhow::anyhow!(
            "Request to '{url}' failed with status {}",
            resp.status()
        ));
    }

    Ok(resp)
}

pub async fn get_response_data(resp: Response) -> Result<Vec<u8>, anyhow::Error> {
    let resp = { JsFuture::from(resp.array_buffer().unwrap()) };

    let arrbuff_value = resp.await.map_err(|_| {
        // TODO: forward error message
        anyhow::anyhow!("Could not retrieve response body")
    })?;
    assert!(arrbuff_value.is_instance_of::<js_sys::ArrayBuffer>());
    //let arrbuff: js_sys::ArrayBuffer = arrbuff_value.dyn_into().unwrap();

    let typebuff: js_sys::Uint8Array = js_sys::Uint8Array::new(&arrbuff_value);
    let ret = typebuff.to_vec();
    Ok(ret)
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "setTimeout")]
    fn set_timeout(handler: &js_sys::Function, timeout: i32) -> i32;
}
