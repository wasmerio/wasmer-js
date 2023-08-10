#[cfg(test)]
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

mod module_cache;
mod net;
mod runtime;
mod task_manager;
mod utils;
mod ws;

pub(crate) use self::utils::{bindgen_sleep, js_error};
