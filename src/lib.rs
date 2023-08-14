#[cfg(test)]
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

mod module_cache;
mod net;
mod run;
mod runtime;
mod tasks;
mod tty;
mod utils;
mod ws;

pub use crate::{
    run::{run, Instance, JsOutput, RunConfig},
    runtime::Runtime,
    tty::{Tty, TtyState},
};

use js_sys::{JsString, Uint8Array};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn wat2wasm(wat: JsString) -> Result<Uint8Array, utils::Error> {
    let wat = String::from(wat);
    let wasm = wasmer::wat2wasm(wat.as_bytes())?;
    Ok(Uint8Array::from(wasm.as_ref()))
}
