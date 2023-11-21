#[cfg(test)]
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

extern crate alloc;

mod container;
mod facade;
mod instance;
mod logging;
mod net;
mod package_loader;
mod run;
mod runtime;
mod streams;
mod tasks;
mod utils;
mod ws;

pub use crate::{
    container::{Container, Manifest, Volume},
    facade::{SpawnConfig, Wasmer, WasmerConfig},
    instance::{Instance, JsOutput},
    logging::initialize_logger,
    run::{run, RunConfig},
    runtime::Runtime,
};

use wasm_bindgen::prelude::wasm_bindgen;

pub(crate) const USER_AGENT: &str = concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));
pub(crate) const DEFAULT_RUST_LOG: &[&str] = &["warn"];

#[wasm_bindgen]
pub fn wat2wasm(wat: String) -> Result<js_sys::Uint8Array, utils::Error> {
    let wasm = wasmer::wat2wasm(wat.as_bytes())?;
    Ok(wasm.as_ref().into())
}

#[wasm_bindgen(start, skip_typescript)]
fn on_start() {
    console_error_panic_hook::set_once();
}
