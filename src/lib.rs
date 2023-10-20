#[cfg(test)]
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

mod container;
mod facade;
mod instance;
mod net;
mod package_loader;
mod run;
mod runtime;
mod streams;
mod tasks;
mod tty;
mod utils;
mod ws;

pub use crate::{
    container::{Container, Manifest, Volume},
    facade::{SpawnConfig, Wasmer, WasmerConfig},
    instance::{Instance, JsOutput},
    run::{run, RunConfig},
    runtime::Runtime,
    tty::{Tty, TtyState},
};

use js_sys::{JsString, Uint8Array};
use tracing_subscriber::{prelude::__tracing_subscriber_SubscriberExt, EnvFilter};
use wasm_bindgen::prelude::wasm_bindgen;

pub(crate) const USER_AGENT: &str = concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));
const RUST_LOG: &[&str] = &[
    "info",
    "wasmer_wasix=debug",
    "wasmer_wasix::syscalls::wasi::fd_read=trace",
    "wasmer_wasix_js=debug",
    "wasmer_wasix_js::streams=trace",
    "wasmer=debug",
];

#[wasm_bindgen]
pub fn wat2wasm(wat: JsString) -> Result<Uint8Array, utils::Error> {
    let wat = String::from(wat);
    let wasm = wasmer::wat2wasm(wat.as_bytes())?;
    Ok(Uint8Array::from(wasm.as_ref()))
}

#[wasm_bindgen(start, skip_typescript)]
fn on_start() {
    console_error_panic_hook::set_once();

    let registry = tracing_subscriber::Registry::default()
        .with(EnvFilter::new(RUST_LOG.join(",")))
        .with(
            tracing_browser_subscriber::BrowserLayer::new().with_max_level(tracing::Level::TRACE),
        );
    tracing::subscriber::set_global_default(registry).unwrap();
}
