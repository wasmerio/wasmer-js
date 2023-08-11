use js_sys::{JsString, Promise};

use wasm_bindgen::{JsCast, JsValue};
use web_sys::{Window, WorkerGlobalScope};

/// Try to extract the most appropriate error message from a [`JsValue`],
/// falling back to a generic error message.
pub(crate) fn js_error(value: JsValue) -> anyhow::Error {
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
pub struct Error(pub anyhow::Error);

impl<E: Into<anyhow::Error>> From<E> for Error {
    fn from(value: E) -> Self {
        Error(value.into())
    }
}

impl From<Error> for JsValue {
    fn from(Error(error): Error) -> Self {
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
