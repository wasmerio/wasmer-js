#[cfg(test)]
wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

extern crate alloc;

mod container;
mod facade;
mod instance;
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
    run::{run, RunConfig},
    runtime::Runtime,
};

use js_sys::{JsString, Uint8Array};
use tracing_subscriber::{layer::SubscriberExt, EnvFilter};
use wasm_bindgen::prelude::wasm_bindgen;

pub(crate) const USER_AGENT: &str = concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));
const DEFAULT_RUST_LOG: &[&str] = &["warn"];

#[wasm_bindgen]
pub fn wat2wasm(wat: JsString) -> Result<Uint8Array, utils::Error> {
    let wat = String::from(wat);
    let wasm = wasmer::wat2wasm(wat.as_bytes())?;
    Ok(Uint8Array::from(wasm.as_ref()))
}

#[wasm_bindgen(start, skip_typescript)]
fn on_start() {
    console_error_panic_hook::set_once();
}

/// Initialize the logger used by `@wasmer/wasix`.
///
/// This function can only be called once. Subsequent calls will raise an
/// exception.
///
/// ## Filtering Logs
///
/// The `filter` string can be used to tweak logging verbosity, both globally
/// or on a per-module basis, and follows [the `$RUST_LOG` format][format].
///
/// Some examples:
/// - `off` - turn off all logs
/// - `error`, `warn`, `info`, `debug`, `trace` - set the global log level
/// - `wasmer_wasix` - enable logs for `wasmer_wasix`
/// - `info,wasmer_wasix_js::package_loader=trace` - set the global log level to
///   `info` and set `wasmer_wasix_js::package_loader` to `trace`
/// - `wasmer_wasix_js=debug/flush` -  turns on debug logging for
///   `wasmer_wasix_js` where the log message includes `flush`
/// - `warn,wasmer=info,wasmer_wasix::syscalls::wasi=trace` - directives can be
///   mixed arbitrarily
///
/// When no `filter` string is provided, a useful default will be used.
///
/// [format]: https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html#directives
#[wasm_bindgen(js_name = "initializeLogger")]
pub fn initialize_logger(filter: Option<String>) -> Result<(), utils::Error> {
    let max_level = tracing::level_filters::STATIC_MAX_LEVEL
        .into_level()
        .unwrap_or(tracing::Level::ERROR);

    let filter = EnvFilter::builder()
        .with_regex(false)
        .with_default_directive(max_level.into())
        .parse_lossy(filter.unwrap_or_else(|| DEFAULT_RUST_LOG.join(",")));

    let registry = tracing_subscriber::Registry::default()
        .with(filter)
        .with(tracing_browser_subscriber::BrowserLayer::new().with_max_level(max_level));
    tracing::subscriber::set_global_default(registry)?;

    Ok(())
}
