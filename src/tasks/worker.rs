use std::{mem::ManuallyDrop, pin::Pin};

use anyhow::{Context, Error};
use futures::Future;
use js_sys::{Array, JsString, Uint8Array};
use once_cell::sync::{Lazy, OnceCell};
use tokio::sync::mpsc::UnboundedSender;
use wasm_bindgen::{
    prelude::{wasm_bindgen, Closure},
    JsCast, JsValue,
};
use wasmer_wasix::runtime::resolver::WebcHash;

use crate::tasks::pool::{Message, PostMessagePayload};

/// A handle to a running [`web_sys::Worker`].
///
/// This will automatically terminate the worker when dropped.
#[derive(Debug)]
pub(crate) struct WorkerHandle {
    id: usize,
    inner: web_sys::Worker,
    _closures: Closures,
}

impl WorkerHandle {
    pub(crate) fn spawn(id: usize, sender: UnboundedSender<Message>) -> Result<Self, Error> {
        let name = format!("worker-{id}");

        let worker = web_sys::Worker::new_with_options(
            &WORKER_URL,
            web_sys::WorkerOptions::new().name(&name),
        )
        .map_err(crate::utils::js_error)?;

        let closures = Closures::new(sender);
        worker.set_onmessage(Some(closures.on_message()));
        worker.set_onerror(Some(closures.on_error()));

        // The worker has technically been started, but it's kinda useless
        // because it hasn't been initialized with the same WebAssembly module
        // and linear memory as the scheduler.
        init_message()
            .and_then(|msg| worker.post_message(&msg))
            .map_err(crate::utils::js_error)?;

        Ok(WorkerHandle {
            id,
            inner: worker,
            _closures: closures,
        })
    }

    pub(crate) fn id(&self) -> usize {
        self.id
    }

    /// Send a message to the worker.
    pub(crate) fn send(&self, msg: PostMessagePayload) -> Result<(), Error> {
        let repr: PostMessagePayloadRepr = msg.into();
        let js = JsValue::from(repr);

        self.inner
            .post_message(&js)
            .map_err(crate::utils::js_error)?;

        Ok(())
    }
}

impl Drop for WorkerHandle {
    fn drop(&mut self) {
        tracing::trace!(id = self.id(), "Terminating worker");
        self.inner.terminate();
    }
}

/// Craft the special `"init"` message.
fn init_message() -> Result<JsValue, JsValue> {
    fn init() -> Result<JsValue, JsValue> {
        let msg = js_sys::Object::new();

        js_sys::Reflect::set(
            &msg,
            &JsString::from(wasm_bindgen::intern("type")),
            &JsString::from(wasm_bindgen::intern("init")),
        )?;
        js_sys::Reflect::set(
            &msg,
            &JsString::from(wasm_bindgen::intern("memory")),
            &wasm_bindgen::memory(),
        )?;
        js_sys::Reflect::set(
            &msg,
            &JsString::from(wasm_bindgen::intern("module")),
            &crate::utils::current_module(),
        )?;

        Ok(msg.into())
    }

    thread_local! {
    static MSG: OnceCell<JsValue> = OnceCell::new();
    }

    let msg = MSG.with(|msg| msg.get_or_try_init(init).cloned())?;

    Ok(msg)
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

/// The object that will actually be sent to worker threads via `postMessage()`.
///
/// On the other side, you'll want to convert back to a [`PostMessagePayload`]
/// using [`PostMessagePayload::from_raw()`].
#[derive(serde::Serialize, serde::Deserialize)]
#[serde(tag = "type", rename_all = "kebab-case")]
pub(crate) enum PostMessagePayloadRepr {
    SpawnAsync {
        ptr: usize,
    },
    SpawnBlocking {
        ptr: usize,
    },
    #[serde(skip)]
    CacheModule {
        hash: WebcHash,
        module: js_sys::WebAssembly::Module,
    },
}

impl PostMessagePayloadRepr {
    pub(crate) unsafe fn reconstitute(self) -> PostMessagePayload {
        let this = ManuallyDrop::new(self);

        match &*this {
            PostMessagePayloadRepr::SpawnAsync { ptr } => {
                let boxed = Box::from_raw(
                    *ptr as *mut Box<
                        dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>>
                            + Send
                            + 'static,
                    >,
                );
                PostMessagePayload::SpawnAsync(*boxed)
            }

            PostMessagePayloadRepr::SpawnBlocking { ptr } => {
                let boxed = Box::from_raw(*ptr as *mut Box<dyn FnOnce() + Send + 'static>);
                PostMessagePayload::SpawnBlocking(*boxed)
            }
            PostMessagePayloadRepr::CacheModule { hash, ref module } => {
                PostMessagePayload::CacheModule {
                    hash: std::ptr::read(hash),
                    module: std::ptr::read(module),
                }
            }
        }
    }
}

impl From<PostMessagePayload> for PostMessagePayloadRepr {
    fn from(value: PostMessagePayload) -> Self {
        // Note: Where applicable, we use Box<Box<_>> to make sure we have a
        // thin pointer to the Box<dyn ...> fat pointer.

        match value {
            PostMessagePayload::SpawnAsync(task) => {
                let boxed: Box<Box<_>> = Box::new(task);
                PostMessagePayloadRepr::SpawnAsync {
                    ptr: Box::into_raw(boxed) as usize,
                }
            }
            PostMessagePayload::SpawnBlocking(task) => {
                let boxed: Box<Box<_>> = Box::new(task);
                PostMessagePayloadRepr::SpawnBlocking {
                    ptr: Box::into_raw(boxed) as usize,
                }
            }
            PostMessagePayload::CacheModule { hash, module } => {
                PostMessagePayloadRepr::CacheModule { hash, module }
            }
        }
    }
}

impl From<PostMessagePayloadRepr> for JsValue {
    fn from(value: PostMessagePayloadRepr) -> Self {
        let js = serde_wasm_bindgen::to_value(&value).unwrap();
        // Note: We don't want to invoke drop() because the worker will receive
        // a free'd pointer.
        std::mem::forget(value);
        js
    }
}

impl TryFrom<JsValue> for PostMessagePayloadRepr {
    type Error = serde_wasm_bindgen::Error;

    fn try_from(value: JsValue) -> Result<Self, Self::Error> {
        serde_wasm_bindgen::from_value(value)
    }
}

impl Drop for PostMessagePayloadRepr {
    fn drop(&mut self) {
        // We implement drop by swapping in something that doesn't need any
        // deallocation then converting the original value to a
        // PostMessagePayload so it can be deallocated as usual.
        let to_drop = std::mem::replace(self, PostMessagePayloadRepr::SpawnAsync { ptr: 0 });
        let _ = unsafe { to_drop.reconstitute() };
    }
}

#[derive(Debug)]
struct Closures {
    on_message: Closure<dyn FnMut(web_sys::MessageEvent)>,
    on_error: Closure<dyn FnMut(web_sys::ErrorEvent)>,
}

impl Closures {
    fn new(sender: UnboundedSender<Message>) -> Self {
        Closures {
            on_message: Closure::new({
                let sender = sender.clone();
                move |msg: web_sys::MessageEvent| {
                    let result = serde_wasm_bindgen::from_value::<WorkerMessage>(msg.data())
                        .map_err(|e| crate::utils::js_error(e.into()))
                        .context("Unknown message")
                        .and_then(|msg| {
                            sender
                                .send(msg.into())
                                .map_err(|_| Error::msg("Send failed"))
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
            }),
            on_error: Closure::new({
                let _sender = sender.clone();
                |msg| {
                    todo!("Handle {msg:?}");
                }
            }),
        }
    }

    fn on_message(&self) -> &js_sys::Function {
        self.on_message.as_ref().unchecked_ref()
    }

    fn on_error(&self) -> &js_sys::Function {
        self.on_error.as_ref().unchecked_ref()
    }
}

/// A message the worker sends back to the scheduler.
#[derive(serde::Serialize, serde::Deserialize)]
#[serde(tag = "type", rename_all = "kebab-case")]
enum WorkerMessage {
    MarkBusy { worker_id: usize },
    MarkIdle { worker_id: usize },
}

impl From<WorkerMessage> for Message {
    fn from(value: WorkerMessage) -> Self {
        match value {
            WorkerMessage::MarkBusy { worker_id } => Message::MarkBusy { worker_id },
            WorkerMessage::MarkIdle { worker_id } => Message::MarkIdle { worker_id },
        }
    }
}

/// The main entrypoint for workers.
#[wasm_bindgen]
#[allow(non_snake_case)]
pub async fn __worker_handle_message(msg: JsValue) -> Result<(), crate::utils::Error> {
    tracing::info!(?msg, "XXX handling a message");
    let msg = PostMessagePayloadRepr::try_from(msg).map_err(crate::utils::Error::js)?;

    unsafe {
        match msg.reconstitute() {
            PostMessagePayload::SpawnAsync(thunk) => thunk().await,
            PostMessagePayload::SpawnBlocking(thunk) => thunk(),
            PostMessagePayload::CacheModule { hash, .. } => {
                tracing::warn!(%hash, "XXX Caching module");
            }
        }
    }

    Ok(())
}
