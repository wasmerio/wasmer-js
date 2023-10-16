use std::fmt::Debug;

use anyhow::{Context, Error};
use js_sys::{Array, JsString, Uint8Array};
use once_cell::sync::Lazy;
use wasm_bindgen::{
    prelude::{wasm_bindgen, Closure},
    JsCast, JsValue,
};

use crate::tasks::{PostMessagePayload, SchedulerChannel, SchedulerMessage, WorkerMessage};

/// A handle to a running [`web_sys::Worker`].
///
/// This provides a structured way to communicate with the worker and will
/// automatically call [`web_sys::Worker::terminate()`] when dropped.
#[derive(Debug)]
pub(crate) struct WorkerHandle {
    id: u32,
    inner: web_sys::Worker,
}

impl WorkerHandle {
    pub(crate) fn spawn(id: u32, sender: SchedulerChannel) -> Result<Self, Error> {
        let name = format!("worker-{id}");

        let worker = web_sys::Worker::new_with_options(
            &WORKER_URL,
            web_sys::WorkerOptions::new().name(&name),
        )
        .map_err(crate::utils::js_error)?;

        let on_message: Closure<dyn FnMut(web_sys::MessageEvent)> = Closure::new({
            let sender = sender.clone();
            move |msg: web_sys::MessageEvent| {
                on_message(msg, &sender, id);
            }
        });
        let on_message: js_sys::Function = on_message.into_js_value().unchecked_into();
        worker.set_onmessage(Some(&on_message));

        let on_error: Closure<dyn FnMut(web_sys::ErrorEvent)> = Closure::new(on_error);
        let on_error: js_sys::Function = on_error.into_js_value().unchecked_into();
        worker.set_onerror(Some(&on_error));

        // The worker has technically been started, but it's kinda useless
        // because it hasn't been initialized with the same WebAssembly module
        // and linear memory as the scheduler. We need to initialize explicitly.
        init_message(id)
            .and_then(|msg| worker.post_message(&msg))
            .map_err(crate::utils::js_error)?;

        Ok(WorkerHandle { id, inner: worker })
    }

    pub(crate) fn id(&self) -> u32 {
        self.id
    }

    /// Send a message to the worker.
    pub(crate) fn send(&self, msg: PostMessagePayload) -> Result<(), Error> {
        let js = msg.into_js().map_err(|e| e.into_anyhow())?;

        self.inner
            .post_message(&js)
            .map_err(crate::utils::js_error)?;

        Ok(())
    }
}

fn on_error(msg: web_sys::ErrorEvent) {
    tracing::error!(
        error = %msg.message(),
        filename = %msg.filename(),
        line_number = %msg.lineno(),
        column = %msg.colno(),
        "An error occurred",
    );
}

fn on_message(msg: web_sys::MessageEvent, sender: &SchedulerChannel, id: u32) {
    web_sys::console::log_3(
        &JsValue::from("received message from worker"),
        &JsValue::from(id),
        &msg.data(),
    );

    let result = WorkerMessage::try_from_js(msg.data())
        .map_err(|e| crate::utils::js_error(e.into()))
        .context("Unknown message")
        .and_then(|msg| {
            let msg = match msg {
                WorkerMessage::MarkBusy => SchedulerMessage::WorkerBusy { worker_id: id },
                WorkerMessage::MarkIdle => SchedulerMessage::WorkerIdle { worker_id: id },
                WorkerMessage::Scheduler(msg) => msg,
            };
            sender.send(msg).map_err(|_| Error::msg("Send failed"))
        });

    if let Err(e) = result {
        tracing::warn!(
            error = &*e,
            msg.origin = msg.origin(),
            msg.last_event_id = msg.last_event_id(),
            "Unable to handle a message from the worker",
        );
    }
}

impl Drop for WorkerHandle {
    fn drop(&mut self) {
        tracing::trace!(id = self.id(), "Terminating worker");
        self.inner.terminate();
    }
}

/// Craft the special `"init"` message.
fn init_message(id: u32) -> Result<JsValue, JsValue> {
    let msg = js_sys::Object::new();

    js_sys::Reflect::set(&msg, &JsString::from("type"), &JsString::from("init"))?;
    js_sys::Reflect::set(&msg, &JsString::from("memory"), &wasm_bindgen::memory())?;
    js_sys::Reflect::set(&msg, &JsString::from("id"), &JsValue::from(id))?;
    js_sys::Reflect::set(
        &msg,
        &JsString::from("module"),
        &crate::utils::current_module(),
    )?;

    Ok(msg.into())
}

/// A data URL containing our worker's bootstrap script.
static WORKER_URL: Lazy<String> = Lazy::new(|| {
    #[wasm_bindgen]
    #[allow(non_snake_case)]
    extern "C" {
        #[wasm_bindgen(js_namespace = ["import", "meta"], js_name = url)]
        static IMPORT_META_URL: String;
    }

    tracing::debug!(import_url = IMPORT_META_URL.as_str());

    let script = include_str!("worker.js").replace("$IMPORT_META_URL", &IMPORT_META_URL);

    let blob = web_sys::Blob::new_with_u8_array_sequence_and_options(
        Array::from_iter([Uint8Array::from(script.as_bytes())]).as_ref(),
        web_sys::BlobPropertyBag::new().type_("application/javascript"),
    )
    .unwrap();

    web_sys::Url::create_object_url_with_blob(&blob).unwrap()
});
