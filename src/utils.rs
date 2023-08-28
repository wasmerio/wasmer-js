use std::{collections::BTreeMap, fmt::Debug, num::NonZeroUsize};

use js_sys::{JsString, Promise};

use wasm_bindgen::{JsCast, JsValue};
use web_sys::{Window, WorkerGlobalScope};

/// Try to extract the most appropriate error message from a [`JsValue`],
/// falling back to a generic error message.
pub(crate) fn js_error(value: JsValue) -> anyhow::Error {
    web_sys::console::warn_1(&value);

    if let Some(e) = value.dyn_ref::<js_sys::Error>() {
        anyhow::Error::msg(String::from(e.message()))
    } else if let Some(obj) = value.dyn_ref::<js_sys::Object>() {
        return anyhow::Error::msg(String::from(obj.to_string()));
    } else if let Some(s) = value.dyn_ref::<js_sys::JsString>() {
        return anyhow::Error::msg(String::from(s));
    } else {
        anyhow::anyhow!("An unknown error occurred: {value:?}")
    }
}

pub(crate) fn bindgen_sleep(milliseconds: i32) -> Promise {
    Promise::new(&mut |resolve, reject| {
        let global_scope = js_sys::global();

        if let Some(window) = global_scope.dyn_ref::<Window>() {
            window
                .set_timeout_with_callback_and_timeout_and_arguments_0(&resolve, milliseconds)
                .unwrap();
        } else if let Some(worker_global_scope) = global_scope.dyn_ref::<WorkerGlobalScope>() {
            worker_global_scope
                .set_timeout_with_callback_and_timeout_and_arguments_0(&resolve, milliseconds)
                .unwrap();
        } else {
            let error = js_sys::Error::new("Unable to call setTimeout()");
            reject.call1(&reject, &error).unwrap();
        }
    })
}

/// A wrapper around [`anyhow::Error`] that can be returned to JS to raise
/// an exception.
#[derive(Debug)]
pub enum Error {
    Rust(anyhow::Error),
    JavaScript(JsValue),
}

impl Error {
    pub(crate) fn js(error: impl Into<JsValue>) -> Self {
        Error::JavaScript(error.into())
    }

    pub(crate) fn into_anyhow(self) -> anyhow::Error {
        match self {
            Error::Rust(e) => e,
            Error::JavaScript(js) => js_error(js),
        }
    }
}

impl<E: Into<anyhow::Error>> From<E> for Error {
    fn from(value: E) -> Self {
        Error::Rust(value.into())
    }
}

impl From<Error> for JsValue {
    fn from(error: Error) -> Self {
        match error {
            Error::JavaScript(e) => e,
            Error::Rust(error) => {
                let custom = js_sys::Object::new();

                let _ = js_sys::Reflect::set(
                    &custom,
                    &JsString::from("detailedMessage"),
                    &JsString::from(format!("{error:?}")),
                );

                let causes: js_sys::Array = std::iter::successors(error.source(), |e| e.source())
                    .map(|e| JsString::from(e.to_string()))
                    .collect();
                let _ = js_sys::Reflect::set(&custom, &JsString::from("causes"), &causes);

                let error_prototype = js_sys::Error::new(&error.to_string());
                let _ = js_sys::Reflect::set_prototype_of(&custom, &error_prototype);

                custom.into()
            }
        }
    }
}

pub(crate) fn object_entries(obj: &js_sys::Object) -> Result<BTreeMap<JsString, JsValue>, Error> {
    let mut entries = BTreeMap::new();

    for key in js_sys::Object::keys(obj) {
        let key: JsString = key
            .dyn_into()
            .map_err(|_| Error::js(js_sys::TypeError::new("Object keys should be strings")))?;
        let value = js_sys::Reflect::get(obj, &key).map_err(Error::js)?;
        entries.insert(key, value);
    }

    Ok(entries)
}

/// The amount of concurrency available on this system.
///
/// Returns `None` if unable to determine the available concurrency.
pub(crate) fn hardware_concurrency() -> Option<NonZeroUsize> {
    let global = js_sys::global();

    let hardware_concurrency = if let Some(window) = global.dyn_ref::<web_sys::Window>() {
        window.navigator().hardware_concurrency()
    } else if let Some(worker_scope) = global.dyn_ref::<web_sys::DedicatedWorkerGlobalScope>() {
        worker_scope.navigator().hardware_concurrency()
    } else {
        return None;
    };

    let hardware_concurrency = hardware_concurrency as usize;
    NonZeroUsize::new(hardware_concurrency)
}

/// A dummy value that can be used in a [`Debug`] impl instead of showing the
/// original value.
pub(crate) struct Hidden;

impl Debug for Hidden {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("_")
    }
}

/// Get a reference to the currently running module.
pub(crate) fn current_module() -> js_sys::WebAssembly::Module {
    // FIXME: Switch this to something stable and portable
    //
    // We use an undocumented API to get a reference to the
    // WebAssembly module that is being executed right now so start
    // a new thread by transferring the WebAssembly linear memory and
    // module to a worker and beginning execution.
    //
    // This can only be used in the browser. Trying to build
    // wasmer-wasix for NodeJS will probably result in the following:
    //
    // Error: executing `wasm-bindgen` over the wasm file
    //   Caused by:
    //   0: failed to generate bindings for import of `__wbindgen_placeholder__::__wbindgen_module`
    //   1: `wasm_bindgen::module` is currently only supported with `--target no-modules` and `--tar get web`
    wasm_bindgen::module().dyn_into().unwrap()
}
