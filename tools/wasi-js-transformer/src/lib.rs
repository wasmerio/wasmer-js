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

#[cfg(target_arch = "wasm32")]
#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => {
        log(&format_args!($($t)*).to_string());
    };
}

#[cfg(not(target_arch = "wasm32"))]
#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => {
        println!($($t)*);
    }
}

// Declare our modules in scope
mod applier;
mod generator;
mod parser;
mod transformer;
mod utils;

/// i64 lowering that can be done by the browser
#[wasm_bindgen]
pub fn lower_i64_imports(mut wasm_binary: Vec<u8>) -> Vec<u8> {
    log("yoooo");
    transformer::lower_i64_wasm_for_wasi_js(&mut wasm_binary).unwrap();
    return wasm_binary.clone();
}
