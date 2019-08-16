// Library to be consumed on the browser
// TODO: Reanem this

use js_sys::*;
use std::*;
use wasm_bindgen::prelude::*;
use wasmparser::Parser;
use wasmparser::ParserState;
use wasmparser::WasmDecoder;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

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

#[wasm_bindgen]
pub fn traverse_wasm_binary(passed_wasm_binary: &JsValue) -> js_sys::Uint8Array {
    let wasm_binary = js_sys::Uint8Array::new(passed_wasm_binary);
    let mut wasm_binary_vec = vec![0; wasm_binary.length() as usize];
    wasm_binary.copy_to(&mut wasm_binary_vec);
    let converted_wasm_binary = convert(&mut wasm_binary_vec);
    let response: js_sys::Uint8Array;
    unsafe {
        response = js_sys::Uint8Array::view(converted_wasm_binary.as_slice());
    }
    return response;
}

