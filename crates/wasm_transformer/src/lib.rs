// Library to be consumed on the browser

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[allow(unused_imports)]
use js_sys::*;
use std::*;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Add support for browser console.log
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

// Declare our modules in scope
#[macro_use]
mod macros;

mod transformer;
mod utils;

const VERSION: &str = env!("CARGO_PKG_VERSION");
/// get the versioon of the package
#[wasm_bindgen]
pub fn version() -> String {
    VERSION.to_string()
}

/// i64 lowering that can be done by the browser
#[wasm_bindgen(js_name = lowerI64Imports)]
pub fn lower_i64_imports(mut wasm_binary: Vec<u8>) -> Vec<u8> {
    transformer::lower_i64_imports(&mut wasm_binary).unwrap()
}
