#[cfg(test)]
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

extern crate alloc;

pub mod fs;
mod instance;
mod js_runtime;
mod logging;
mod net;
mod options;
mod package_loader;
mod run;
mod runtime;
mod streams;
mod tasks;
mod utils;
mod wasmer;
mod ws;

use std::sync::Mutex;

pub use crate::{
    fs::{Directory, DirectoryInit},
    instance::{Instance, JsOutput},
    js_runtime::{JsRuntime, RuntimeOptions},
    logging::initialize_logger,
    options::{RunOptions, SpawnOptions},
    run::run_wasix,
    utils::StringOrBytes,
    wasmer::Wasmer,
};

use once_cell::sync::Lazy;
use wasm_bindgen::prelude::wasm_bindgen;

pub(crate) const USER_AGENT: &str = concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));
pub(crate) const DEFAULT_RUST_LOG: &[&str] = &["warn"];
pub(crate) static CUSTOM_WORKER_URL: Lazy<Mutex<Option<String>>> = Lazy::new(Mutex::default);
pub(crate) const DEFAULT_REGISTRY: &str =
    wasmer_wasix::runtime::resolver::WapmSource::WASMER_PROD_ENDPOINT;

const CROSS_ORIGIN_WARNING: &str = r#"This package can only be used from "Cross-Origin Isolated" websites. For more details, check out https://docs.wasmer.io/javascript-sdk/explainers/troubleshooting#sharedarraybuffer-and-cross-origin-isolation"#;

#[wasm_bindgen]
pub fn wat2wasm(wat: String) -> Result<js_sys::Uint8Array, utils::Error> {
    let wasm = ::wasmer::wat2wasm(wat.as_bytes())?;
    Ok(wasm.as_ref().into())
}

#[wasm_bindgen(start, skip_typescript)]
fn on_start() {
    console_error_panic_hook::set_once();

    if let Some(cross_origin_isolated) =
        crate::utils::GlobalScope::current().cross_origin_isolated()
    {
        // Note: This will need to be tweaked when we add support for Deno and
        // NodeJS.
        web_sys::console::assert_with_condition_and_data_1(
            cross_origin_isolated,
            &wasm_bindgen::JsValue::from_str(CROSS_ORIGIN_WARNING),
        );
    }
}

#[wasm_bindgen(js_name = setWorkerUrl)]
pub fn set_worker_url(url: js_sys::JsString) {
    *CUSTOM_WORKER_URL.lock().unwrap() = Some(url.into());
}
