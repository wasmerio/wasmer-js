#[cfg(test)]
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

mod module_cache;
mod task_manager;
mod utils;

pub(crate) use self::utils::js_error;
