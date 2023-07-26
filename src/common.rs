use anyhow::Context;

#[allow(unused_imports, dead_code)]
use tracing::{debug, error, info, trace, warn};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::*;

use web_sys::*;

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
        let request = Request::new_with_str_and_init(url, &opts)
            .map_err(js_error)
            .context("Could not construct request object")?;

        let set_headers = request.headers();
        for (name, val) in headers.iter() {
            let val = String::from_utf8_lossy(val.as_bytes());
            set_headers
                .set(name.as_str(), &val)
                .map_err(js_error)
                .with_context(|| format!("could not apply request header: '{name}': '{val}'"))?;
        }
        request
    };

    let resp_value = match fetch_internal(&request).await {
        Ok(a) => a,
        Err(e) => {
            // If the request failed it may be because of CORS so if a cors proxy
            // is configured then try again with the cors proxy
            let url_store;
            let url = if let Some(cors_proxy) = cors_proxy {
                url_store = format!("https://{}/{}", cors_proxy, url);
                url_store.as_str()
            } else {
                return Err(js_error(e).context(format!("Could not fetch '{url}'")));
            };

            let request = Request::new_with_str_and_init(url, &opts)
                .map_err(js_error)
                .with_context(|| format!("Could not construct request for url '{url}'"))?;

            let set_headers = request.headers();
            for (name, val) in headers.iter() {
                let value = String::from_utf8_lossy(val.as_bytes());
                set_headers
                    .set(name.as_str(), &value)
                    .map_err(js_error)
                    .with_context(|| {
                        anyhow::anyhow!("Could not apply request header: '{name}': '{value}'")
                    })?;
            }

            fetch_internal(&request)
                .await
                .map_err(js_error)
                .with_context(|| anyhow::anyhow!("Could not fetch '{url}'"))?
        }
    };
    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();

    if resp.status() < 200 || resp.status() >= 400 {
        debug!("fetch-failed: {}", resp.status_text());
        return Err(anyhow::anyhow!(
            "Request to '{url}' failed with status {}",
            resp.status()
        ));
    }

    Ok(resp)
}

/// Try to extract the most appropriate error message from a [`JsValue`],
/// falling back to a generic error message.
fn js_error(value: JsValue) -> anyhow::Error {
    if let Some(e) = value.dyn_ref::<js_sys::Error>() {
        anyhow::Error::msg(String::from(e.message()))
    } else if let Some(obj) = value.dyn_ref::<js_sys::Object>() {
        return anyhow::Error::msg(String::from(obj.to_string()));
    } else if let Some(s) = value.dyn_ref::<js_sys::JsString>() {
        return anyhow::Error::msg(String::from(s));
    } else {
        anyhow::Error::msg("An unknown error occurred")
    }
}

pub async fn get_response_data(resp: Response) -> Result<Vec<u8>, anyhow::Error> {
    let resp = { JsFuture::from(resp.array_buffer().unwrap()) };

    let arrbuff_value = resp
        .await
        .map_err(js_error)
        .with_context(|| format!("Could not retrieve response body"))?;
    assert!(arrbuff_value.is_instance_of::<js_sys::ArrayBuffer>());
    //let arrbuff: js_sys::ArrayBuffer = arrbuff_value.dyn_into().unwrap();

    let typebuff: js_sys::Uint8Array = js_sys::Uint8Array::new(&arrbuff_value);
    let ret = typebuff.to_vec();
    Ok(ret)
}
