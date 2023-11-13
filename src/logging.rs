use std::{
    io::{ErrorKind, LineWriter, Write},
    sync::Mutex,
};

use tracing_subscriber::EnvFilter;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

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
pub fn initialize_logger(filter: Option<String>) -> Result<(), crate::utils::Error> {
    let max_level = tracing::level_filters::STATIC_MAX_LEVEL
        .into_level()
        .unwrap_or(tracing::Level::ERROR);

    let filter = EnvFilter::builder()
        .with_regex(false)
        .with_default_directive(max_level.into())
        .parse_lossy(filter.unwrap_or_else(|| crate::DEFAULT_RUST_LOG.join(",")));

    let writer = Mutex::new(LineWriter::new(ConsoleLogger));

    tracing_subscriber::fmt::fmt()
        .with_writer(writer)
        .with_env_filter(filter)
        .without_time()
        .try_init()
        .map_err(|e| anyhow::anyhow!(e))?;

    Ok(())
}

struct ConsoleLogger;

impl Write for ConsoleLogger {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        let text = std::str::from_utf8(buf)
            .map_err(|e| std::io::Error::new(ErrorKind::InvalidInput, e))?;

        let js_string = JsValue::from_str(text);
        web_sys::console::log_1(&js_string);

        Ok(text.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}
