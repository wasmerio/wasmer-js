use std::sync::Arc;

use bytes::Bytes;
use http::{Method, Request};
use wasm_bindgen::prelude::wasm_bindgen;
use wasmer_http_listener_networking::HttpListenerNetworking;
use web_sys::ResponseInit;

#[wasm_bindgen]
pub struct HttpListenerNetworkingWrapper {
    pub(crate) networking: Arc<HttpListenerNetworking>,
}

#[wasm_bindgen]
pub struct HttpListenerNetworkingRequestHandlerWrapper {
    pub(crate) request_handler:
        wasmer_http_listener_networking::HttpListenerNetworkingRequestHandler,
}

#[wasm_bindgen]
impl HttpListenerNetworkingWrapper {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        // No support for outgoing connections as of now, so no fallback networking impl
        let networking = HttpListenerNetworking::new_without_fallback();
        Self {
            networking: Arc::new(networking),
        }
    }

    pub fn build_request_handler(&self) -> HttpListenerNetworkingRequestHandlerWrapper {
        let request_handler = self.networking.build_request_handler();
        HttpListenerNetworkingRequestHandlerWrapper { request_handler }
    }
}

impl Default for HttpListenerNetworkingWrapper {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
impl HttpListenerNetworkingRequestHandlerWrapper {
    pub async fn handle_request(
        &self,
        request: web_sys::Request,
        local_addr: Option<String>,
        peer_addr: Option<String>,
    ) -> Result<web_sys::Response, js_sys::Error> {
        let request = web_request_to_http_request(request).await?;
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
        let response = self
            .request_handler
            .handle_request(request, local_addr, peer_addr)
            .await
            .map_err(|_| js_sys::Error::new("Failed to handle request"))?;
        http_response_to_web_response(response)
    }
}

async fn web_request_to_http_request(
    web_request: web_sys::Request,
) -> Result<Request<Bytes>, js_sys::Error> {
    let method = Method::from_bytes(web_request.method().as_bytes())
        .map_err(|_| js_sys::Error::new("Invalid HTTP method"))?;

    let url = web_request.url();
    let mut builder = Request::builder().method(method).uri(url);

    let headers = builder
        .headers_mut()
        .ok_or_else(|| js_sys::Error::new("Failed to get headers"))?;
    let web_headers = web_request.headers();
    let headers_iter = js_sys::try_iter(&web_headers)?
        .ok_or_else(|| js_sys::Error::new("Failed to iterate headers"))?;

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

    let body_promise = web_request.array_buffer()?;
    let body_future = wasm_bindgen_futures::JsFuture::from(body_promise);
    let array_buffer = body_future
        .await
        .map_err(|_| js_sys::Error::new("Failed to read request body"))?;
    let uint8_array = js_sys::Uint8Array::new(&array_buffer);
    let body = Bytes::from(uint8_array.to_vec());

    builder
        .body(body)
        .map_err(|_| js_sys::Error::new("Failed to construct request"))
}

fn http_response_to_web_response(
    http_response: http::Response<Bytes>,
) -> Result<web_sys::Response, js_sys::Error> {
    let mut response_init = ResponseInit::new();
    response_init.status(http_response.status().as_u16());

    let headers =
        web_sys::Headers::new().map_err(|_| js_sys::Error::new("Failed to create headers"))?;
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

    let body = js_sys::Uint8Array::from(http_response.body().as_ref());
    web_sys::Response::new_with_opt_buffer_source_and_init(Some(&body), &response_init)
        .map_err(|_| js_sys::Error::new("Failed to create web_sys::Response"))
}
