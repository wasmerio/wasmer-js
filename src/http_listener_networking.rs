use std::{
    sync::{
        atomic::{AtomicU32, Ordering},
        Arc,
    },
};

use bytes::Bytes;
use http::{Method, Request};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasmer_http_listener_networking::HttpListenerNetworking as HttpListenerNetworkingNative;
use web_sys::ResponseInit;

// Mask to diffrentiate this user message from others...
pub(crate) const USER_MESSAGE_HTTP_LISTENER_NETWORKING_ON_NEW_LISTENER_LSB: u64 = 1;
// ... combined with a counter to identify the specific networking instance
pub(crate) static HTTP_LISTENER_NETWORKING_ID: AtomicU32 = AtomicU32::new(0);

#[derive(Clone, wasm_bindgen_derive::TryFromJsValue)]
#[wasm_bindgen(getter_with_clone)]
pub struct HttpListenerNetworking {
    pub(crate) networking: Arc<HttpListenerNetworkingNative>,
    pub(crate) callback: Option<js_sys::Function>,
    pub(crate) request_handler:
        Arc<wasmer_http_listener_networking::HttpListenerNetworkingRequestHandler>,
}

impl std::fmt::Debug for HttpListenerNetworking {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("HttpListenerNetworking").finish()
    }
}

#[wasm_bindgen]
impl HttpListenerNetworking {
    #[wasm_bindgen(constructor)]
    pub fn new() -> HttpListenerNetworking {
        // No support for outgoing connections as of now, so no fallback networking impl
        let networking = HttpListenerNetworkingNative::new_without_fallback();
        let request_handler = networking.build_request_handler();
        Self {
            networking: Arc::new(networking),
            callback: None,
            request_handler: Arc::new(request_handler),
        }
    }

    pub fn clone(&self) -> Self {
        <Self as Clone>::clone(self)
    }

    #[wasm_bindgen(js_name = "setOnNewListener")]
    pub fn set_on_new_listener(
        &mut self,
        callback: js_sys::Function,
    ) -> Result<(), js_sys::Error> {
        tracing::debug!("HTTPLISTENER have listener func");
        self.callback = Some(callback);
        Ok(())
    }

    #[wasm_bindgen(js_name = "handleRequest")]
    pub async fn handle_request(
        &self,
        request: web_sys::Request,
        local_addr: Option<String>,
        peer_addr: Option<String>,
    ) -> Result<web_sys::Response, js_sys::Error> {
        tracing::debug!("HttpListenerNetworking::handle_request::1");
        let request: Request<Bytes> = web_request_to_http_request(request).await?;
        tracing::debug!("HttpListenerNetworking::handle_request::2");
        let local_addr = local_addr
            .map(|addr| {
                addr.parse()
                    .map_err(|_| js_sys::Error::new("Invalid local address"))
            })
            .transpose()?;
        let peer_addr = peer_addr
            .map(|addr| {
                addr.parse()
                    .map_err(|_| js_sys::Error::new("Invalid local address"))
            })
            .transpose()?;
        tracing::debug!("HttpListenerNetworking::handle_request::3");
        let response: http::Response<Bytes> = self
            .request_handler
            .handle_request(request, local_addr, peer_addr)
            .await
            .map_err(|e| js_sys::Error::new(&format!("Failed to handle request: {e:?}")))?;
        tracing::debug!("HttpListenerNetworking::handle_request::4");
        http_response_to_web_response(response)
    }
}

impl Default for HttpListenerNetworking {
    fn default() -> Self {
        Self::new()
    }
}

async fn web_request_to_http_request(
    web_request: web_sys::Request,
) -> Result<Request<Bytes>, js_sys::Error> {
    tracing::debug!("web_request_to_http_request::1");
    let method = Method::from_bytes(web_request.method().as_bytes())
        .map_err(|_| js_sys::Error::new("Invalid HTTP method"))?;
    tracing::debug!("web_request_to_http_request::2");

    let url = web_request.url();
    tracing::debug!("web_request_to_http_request::3");

    let mut builder = Request::builder().method(method).uri(url);

    let headers = builder
        .headers_mut()
        .ok_or_else(|| js_sys::Error::new("Failed to get headers"))?;
    let web_headers = web_request.headers();
    let headers_iter = js_sys::try_iter(&web_headers)?
        .ok_or_else(|| js_sys::Error::new("Failed to iterate headers"))?;
    tracing::debug!("web_request_to_http_request::4");

    for header in headers_iter {
        let header = header?;
        let header_array = js_sys::Array::from(&header);
        if header_array.length() == 2 {
            let key = header_array
                .get(0)
                .as_string()
                .ok_or_else(|| js_sys::Error::new("Invalid header key"))?;
            let value = header_array
                .get(1)
                .as_string()
                .ok_or_else(|| js_sys::Error::new("Invalid header value"))?;
            headers.insert(
                http::header::HeaderName::from_bytes(key.as_bytes())
                    .map_err(|_| js_sys::Error::new("Invalid header name"))?,
                http::header::HeaderValue::from_str(&value)
                    .map_err(|_| js_sys::Error::new("Invalid header value"))?,
            );
        }
    }
    tracing::debug!("web_request_to_http_request::5");
    let body_promise = web_request.array_buffer()?;
    tracing::debug!("web_request_to_http_request::6");

    let body_future = wasm_bindgen_futures::JsFuture::from(body_promise);
    let array_buffer = body_future
        .await
        .map_err(|_| js_sys::Error::new("Failed to read request body"))?;
    tracing::debug!("web_request_to_http_request::7");
    let uint8_array = js_sys::Uint8Array::new(&array_buffer);
    tracing::debug!("web_request_to_http_request::8");
    let body = Bytes::from(uint8_array.to_vec());
    tracing::debug!("web_request_to_http_request::9");

    builder
        .body(body)
        .map_err(|_| js_sys::Error::new("Failed to construct request"))
}

fn http_response_to_web_response(
    http_response: http::Response<Bytes>,
) -> Result<web_sys::Response, js_sys::Error> {
    tracing::debug!("http_response_to_web_response::1");
    let mut response_init = ResponseInit::new();
    response_init.status(http_response.status().as_u16());
    tracing::debug!("http_response_to_web_response::2");
    let headers =
        web_sys::Headers::new().map_err(|_| js_sys::Error::new("Failed to create headers"))?;
    tracing::debug!("http_response_to_web_response::3");
    for (key, value) in http_response.headers().iter() {
        headers
            .set(
                key.as_str(),
                value
                    .to_str()
                    .map_err(|_| js_sys::Error::new("Invalid header value"))?,
            )
            .map_err(|_| js_sys::Error::new("Failed to set header"))?;
    }
    response_init.headers(&headers);
    tracing::debug!("http_response_to_web_response::4");
    let body = js_sys::Uint8Array::from(http_response.body().as_ref());
    tracing::debug!("http_response_to_web_response::5");
    web_sys::Response::new_with_opt_buffer_source_and_init(Some(&body), &response_init)
        .map_err(|_| js_sys::Error::new("Failed to create web_sys::Response"))
}
