#[cfg(test)]
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

mod module_cache;
mod net;
mod runtime;
mod tasks;
mod utils;
mod ws;

pub(crate) use crate::utils::{bindgen_sleep, js_error};

pub use crate::runtime::Runtime;
