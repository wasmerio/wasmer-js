use std::{collections::BTreeMap, num::NonZeroUsize};

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
