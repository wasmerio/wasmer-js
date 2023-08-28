use std::pin::Pin;

use anyhow::{Context, Error};
use futures::Future;
use js_sys::{Array, BigInt, JsString, Reflect, Uint8Array};
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
    id: u64,
    inner: web_sys::Worker,
    _closures: Closures,
}

impl WorkerHandle {
    pub(crate) fn spawn(id: u64, sender: UnboundedSender<Message>) -> Result<Self, Error> {
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
        // and linear memory as the scheduler. We need to initialize explicitly.
        init_message()
            .and_then(|msg| worker.post_message(&msg))
            .map_err(crate::utils::js_error)?;

        Ok(WorkerHandle {
            id,
            inner: worker,
            _closures: closures,
        })
    }

    pub(crate) fn id(&self) -> u64 {
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

const SPAWN_ASYNC: &str = "spawn-async";
const SPAWN_BLOCKING: &str = "spawn-blocking";
const CACHE_MODULE: &str = "cache-module";
const SPAWN_WITH_MODULE: &str = "spawn-with-module";
const PTR: &str = "ptr";
const MODULE: &str = "module";
const MODULE_HASH: &str = "module-hash";
const TYPE: &str = "type";

impl PostMessagePayload {
    fn into_js(self) -> Result<JsValue, crate::utils::Error> {
        fn set(
            obj: &JsValue,
            field: &str,
            value: impl Into<JsValue>,
        ) -> Result<(), crate::utils::Error> {
            Reflect::set(
                obj,
                &JsValue::from_str(wasm_bindgen::intern(field)),
                &value.into(),
            )
            .map_err(crate::utils::js_error)
            .with_context(|| format!("Unable to set \"{field}\""))?;
            Ok(())
        }

        let obj = js_sys::Object::new();

        // Note: double-box any callable so we get a thin pointer

        match self {
            PostMessagePayload::SpawnAsync(task) => {
                let ptr = Box::into_raw(Box::new(task)) as usize;
                set(&obj, TYPE, wasm_bindgen::intern(SPAWN_ASYNC))?;
                set(&obj, PTR, BigInt::from(ptr))?;
            }
            PostMessagePayload::SpawnBlocking(task) => {
                let ptr = Box::into_raw(Box::new(task)) as usize;
                set(&obj, TYPE, wasm_bindgen::intern(SPAWN_BLOCKING))?;
                set(&obj, PTR, BigInt::from(ptr))?;
            }
            PostMessagePayload::CacheModule { hash, module } => {
                set(&obj, TYPE, wasm_bindgen::intern(CACHE_MODULE))?;
                set(&obj, MODULE_HASH, hash.to_string())?;
                set(&obj, MODULE, module)?;
            }
            PostMessagePayload::SpawnWithModule { module, task } => {
                let ptr = Box::into_raw(Box::new(task)) as usize;
                set(&obj, TYPE, wasm_bindgen::intern(SPAWN_WITH_MODULE))?;
                set(&obj, PTR, BigInt::from(ptr))?;
                set(&obj, MODULE, module)?;
            }
        }

        Ok(obj.into())
    }

    fn try_from_js(value: JsValue) -> Result<Self, crate::utils::Error> {
        fn get_js<T>(value: &JsValue, field: &str) -> Result<T, crate::utils::Error>
        where
            T: JsCast,
        {
            let value = Reflect::get(value, &JsValue::from_str(wasm_bindgen::intern(field)))
                .map_err(crate::utils::Error::js)?;
            let value = value.dyn_into().map_err(|_| {
                anyhow::anyhow!(
                    "The \"{field}\" field isn't a \"{}\"",
                    std::any::type_name::<T>()
                )
            })?;
            Ok(value)
        }
        fn get_string(value: &JsValue, field: &str) -> Result<String, crate::utils::Error> {
            let string: JsString = get_js(value, field)?;
            Ok(string.into())
        }
        fn get_usize(value: &JsValue, field: &str) -> Result<usize, crate::utils::Error> {
            let ptr: BigInt = get_js(value, field)?;
            let ptr = u64::try_from(ptr)
                .ok()
                .and_then(|ptr| usize::try_from(ptr).ok())
                .context("Unable to convert back to a usize")?;
            Ok(ptr)
        }

        let ty = get_string(&value, TYPE)?;

        // Safety: Keep this in sync with PostMessagePayload::to_js()

        match ty.as_str() {
            self::SPAWN_ASYNC => {
                let ptr = get_usize(&value, PTR)?
                    as *mut Box<
                        dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>>
                            + Send
                            + 'static,
                    >;
                let task = unsafe { *Box::from_raw(ptr) };

                Ok(PostMessagePayload::SpawnAsync(task))
            }
            self::SPAWN_BLOCKING => {
                let ptr = get_usize(&value, PTR)? as *mut Box<dyn FnOnce() + Send + 'static>;
                let task = unsafe { *Box::from_raw(ptr) };

                Ok(PostMessagePayload::SpawnBlocking(task))
            }
            self::CACHE_MODULE => {
                let module = get_js(&value, MODULE)?;
                let hash = get_string(&value, MODULE_HASH)?;
                let hash = WebcHash::parse_hex(&hash)?;

                Ok(PostMessagePayload::CacheModule { hash, module })
            }
            self::SPAWN_WITH_MODULE => {
                let ptr = get_usize(&value, PTR)?
                    as *mut Box<dyn FnOnce(wasmer::Module) + Send + 'static>;
                let task = unsafe { *Box::from_raw(ptr) };
                let module = get_js(&value, MODULE)?;

                Ok(PostMessagePayload::SpawnWithModule { module, task })
            }
            other => Err(anyhow::anyhow!("Unknown message type: {other}").into()),
        }
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
                |msg: web_sys::ErrorEvent| {
                    tracing::error!(
                        error = %msg.message(),
                        filename = %msg.filename(),
                        line_number = %msg.lineno(),
                        column = %msg.colno(),
                        "An error occurred",
                    );
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
    MarkBusy { worker_id: u64 },
    MarkIdle { worker_id: u64 },
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
#[wasm_bindgen(skip_typescript)]
#[allow(non_snake_case)]
pub async fn __worker_handle_message(msg: JsValue) -> Result<(), crate::utils::Error> {
    let _span = tracing::debug_span!("worker_handle_message").entered();
    let msg = PostMessagePayload::try_from_js(msg)?;

    match msg {
        PostMessagePayload::SpawnAsync(thunk) => thunk().await,
        PostMessagePayload::SpawnBlocking(thunk) => thunk(),
        PostMessagePayload::CacheModule { hash, .. } => {
            tracing::warn!(%hash, "XXX Caching module");
        }
        PostMessagePayload::SpawnWithModule { module, task } => {
            task(module.into());
        }
    }

    Ok(())
}
