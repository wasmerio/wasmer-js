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
        // TODO: Find out how to use this macro from child modules
        // log(&format_args!($($t)*).to_string());
    };
}

#[cfg(not(target_arch = "wasm32"))]
#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => {
        println!($($t)*);
    }
}

// Import our modules
mod applier;
mod generator;
mod parser;
mod transformer;
mod utils;

/// i64 lowering that can be done by the browser
#[wasm_bindgen]
pub fn lower_i64_imports(passed_wasm_binary: &JsValue) -> js_sys::Uint8Array {
    let wasm_binary = js_sys::Uint8Array::new(passed_wasm_binary);
    let mut wasm_binary_vec = vec![0; wasm_binary.length() as usize];
    wasm_binary.copy_to(&mut wasm_binary_vec);
    transformer::lower_i64_wasm_for_wasi_js(&mut wasm_binary_vec).unwrap();
    let response: js_sys::Uint8Array;
    unsafe {
        response = js_sys::Uint8Array::view(wasm_binary_vec.as_slice());
    }
    return response;
}
