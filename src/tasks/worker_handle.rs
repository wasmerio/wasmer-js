use std::{fmt::Debug, future::Future, pin::Pin};

use anyhow::{Context, Error};
use js_sys::{Array, JsString, Uint8Array, WebAssembly};
use once_cell::sync::Lazy;
use tokio::sync::mpsc::UnboundedSender;
use wasm_bindgen::{
    prelude::{wasm_bindgen, Closure},
    JsCast, JsValue,
};

use js_sys::{BigInt, Reflect};
use wasmer_wasix::runtime::resolver::WebcHash;

use crate::{
    tasks::{SchedulerMessage, WorkerMessage},
    utils::Hidden,
};

/// A handle to a running [`web_sys::Worker`].
///
/// This provides a structured way to communicate with the worker and will
/// automatically call [`web_sys::Worker::terminate()`] when dropped.
#[derive(Debug)]
pub(crate) struct WorkerHandle {
    id: u64,
    inner: web_sys::Worker,
}

impl WorkerHandle {
    pub(crate) fn spawn(id: u64, sender: UnboundedSender<SchedulerMessage>) -> Result<Self, Error> {
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

    pub(crate) fn id(&self) -> u64 {
        self.id
    }

    /// Send a message to the worker.
    pub(crate) fn send(&self, msg: PostMessagePayload) -> Result<(), Error> {
        let js = msg.into_js().map_err(|e| e.into_anyhow())?;
        web_sys::console::error_2(&format!("Sending to {}", self.id).into(), &js);

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

fn on_message(msg: web_sys::MessageEvent, sender: &UnboundedSender<SchedulerMessage>, id: u64) {
    let result = serde_wasm_bindgen::from_value::<WorkerMessage>(msg.data())
        .map_err(|e| crate::utils::js_error(e.into()))
        .context("Unknown message")
        .and_then(|msg| {
            sender
                .send(SchedulerMessage::Worker { worker_id: id, msg })
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

impl Drop for WorkerHandle {
    fn drop(&mut self) {
        tracing::trace!(id = self.id(), "Terminating worker");
        self.inner.terminate();
    }
}

/// Craft the special `"init"` message.
fn init_message(id: u64) -> Result<JsValue, JsValue> {
    let msg = js_sys::Object::new();

    js_sys::Reflect::set(&msg, &JsString::from("type"), &JsString::from("init"))?;
    js_sys::Reflect::set(&msg, &JsString::from("memory"), &wasm_bindgen::memory())?;
    js_sys::Reflect::set(&msg, &JsString::from("id"), &BigInt::from(id))?;
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

/// A message that will be sent to a worker using `postMessage()`.
pub(crate) enum PostMessagePayload {
    SpawnAsync(Box<dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>> + Send + 'static>),
    SpawnBlocking(Box<dyn FnOnce() + Send + 'static>),
    CacheModule {
        hash: WebcHash,
        module: WebAssembly::Module,
    },
    SpawnWithModule {
        module: WebAssembly::Module,
        task: Box<dyn FnOnce(wasmer::Module) + Send + 'static>,
    },
    SpawnWithModuleAndMemory {
        module: WebAssembly::Module,
        /// An instance of the WebAssembly linear memory that has already been
        /// created.
        memory: Option<WebAssembly::Memory>,
        task: Box<dyn FnOnce(wasmer::Module, wasmer::Memory) + Send + 'static>,
    },
}

mod consts {
    pub(crate) const SPAWN_ASYNC: &str = "spawn-async";
    pub(crate) const SPAWN_BLOCKING: &str = "spawn-blocking";
    pub(crate) const CACHE_MODULE: &str = "cache-module";
    pub(crate) const SPAWN_WITH_MODULE: &str = "spawn-with-module";
    pub(crate) const SPAWN_WITH_MODULE_AND_MEMORY: &str = "spawn-with-module-and-memory";
    pub(crate) const PTR: &str = "ptr";
    pub(crate) const MODULE: &str = "module";
    pub(crate) const MEMORY: &str = "memory";
    pub(crate) const MODULE_HASH: &str = "module-hash";
    pub(crate) const TYPE: &str = "type";
}

impl PostMessagePayload {
    pub(crate) fn into_js(self) -> Result<JsValue, crate::utils::Error> {
        fn set(
            obj: &JsValue,
            field: &str,
            value: impl Into<JsValue>,
        ) -> Result<(), crate::utils::Error> {
            Reflect::set(obj, &JsValue::from_str(field), &value.into())
                .map_err(crate::utils::js_error)
                .with_context(|| format!("Unable to set \"{field}\""))?;
            Ok(())
        }

        let obj = js_sys::Object::new();

        // Note: double-box any callable so we get a thin pointer

        match self {
            PostMessagePayload::SpawnAsync(task) => {
                let ptr = Box::into_raw(Box::new(task)) as usize;
                set(&obj, consts::TYPE, consts::SPAWN_ASYNC)?;
                set(&obj, consts::PTR, BigInt::from(ptr))?;
            }
            PostMessagePayload::SpawnBlocking(task) => {
                let ptr = Box::into_raw(Box::new(task)) as usize;
                set(&obj, consts::TYPE, consts::SPAWN_BLOCKING)?;
                set(&obj, consts::PTR, BigInt::from(ptr))?;
            }
            PostMessagePayload::CacheModule { hash, module } => {
                set(&obj, consts::TYPE, consts::CACHE_MODULE)?;
                set(&obj, consts::MODULE_HASH, hash.to_string())?;
                set(&obj, consts::MODULE, module)?;
            }
            PostMessagePayload::SpawnWithModule { module, task } => {
                let ptr = Box::into_raw(Box::new(task)) as usize;
                set(&obj, consts::TYPE, consts::SPAWN_WITH_MODULE)?;
                set(&obj, consts::PTR, BigInt::from(ptr))?;
                set(&obj, consts::MODULE, module)?;
            }
            PostMessagePayload::SpawnWithModuleAndMemory {
                module,
                memory,
                task,
            } => {
                let ptr = Box::into_raw(Box::new(task)) as usize;
                set(&obj, consts::TYPE, consts::SPAWN_WITH_MODULE)?;
                set(&obj, consts::PTR, BigInt::from(ptr))?;
                set(&obj, consts::MODULE, module)?;
                set(&obj, consts::MEMORY, memory)?;
            }
        }

        Ok(obj.into())
    }

    pub(crate) fn try_from_js(value: JsValue) -> Result<Self, crate::utils::Error> {
        fn get_js<T>(value: &JsValue, field: &str) -> Result<T, crate::utils::Error>
        where
            T: JsCast,
        {
            let value =
                Reflect::get(value, &JsValue::from_str(field)).map_err(crate::utils::Error::js)?;
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

        let ty = get_string(&value, consts::TYPE)?;

        // Safety: Keep this in sync with PostMessagePayload::to_js()

        match ty.as_str() {
            consts::SPAWN_ASYNC => {
                let ptr = get_usize(&value, consts::PTR)?
                    as *mut Box<
                        dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>>
                            + Send
                            + 'static,
                    >;
                let task = unsafe { *Box::from_raw(ptr) };

                Ok(PostMessagePayload::SpawnAsync(task))
            }
            consts::SPAWN_BLOCKING => {
                let ptr =
                    get_usize(&value, consts::PTR)? as *mut Box<dyn FnOnce() + Send + 'static>;
                let task = unsafe { *Box::from_raw(ptr) };

                Ok(PostMessagePayload::SpawnBlocking(task))
            }
            consts::CACHE_MODULE => {
                let module = get_js(&value, consts::MODULE)?;
                let hash = get_string(&value, consts::MODULE_HASH)?;
                let hash = WebcHash::parse_hex(&hash)?;

                Ok(PostMessagePayload::CacheModule { hash, module })
            }
            consts::SPAWN_WITH_MODULE => {
                let ptr = get_usize(&value, consts::PTR)?
                    as *mut Box<dyn FnOnce(wasmer::Module) + Send + 'static>;
                let task = unsafe { *Box::from_raw(ptr) };
                let module = get_js(&value, consts::MODULE)?;

                Ok(PostMessagePayload::SpawnWithModule { module, task })
            }
            consts::SPAWN_WITH_MODULE_AND_MEMORY => {
                let ptr = get_usize(&value, consts::PTR)?
                    as *mut Box<dyn FnOnce(wasmer::Module, wasmer::Memory) + Send + 'static>;
                let task = unsafe { *Box::from_raw(ptr) };
                let module = get_js(&value, consts::MODULE)?;
                let memory = get_js(&value, consts::MEMORY).ok();

                Ok(PostMessagePayload::SpawnWithModuleAndMemory {
                    module,
                    memory,
                    task,
                })
            }
            other => Err(anyhow::anyhow!("Unknown message type: {other}").into()),
        }
    }
}

impl Debug for PostMessagePayload {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PostMessagePayload::SpawnAsync(_) => {
                f.debug_tuple("SpawnAsync").field(&Hidden).finish()
            }
            PostMessagePayload::SpawnBlocking(_) => {
                f.debug_tuple("SpawnBlocking").field(&Hidden).finish()
            }
            PostMessagePayload::CacheModule { hash, module } => f
                .debug_struct("CacheModule")
                .field("hash", hash)
                .field("module", module)
                .finish(),
            PostMessagePayload::SpawnWithModule { module, task: _ } => f
                .debug_struct("CacheModule")
                .field("module", module)
                .field("task", &Hidden)
                .finish(),
            PostMessagePayload::SpawnWithModuleAndMemory {
                module,
                memory,
                task: _,
            } => f
                .debug_struct("CacheModule")
                .field("module", module)
                .field("memory", memory)
                .field("task", &Hidden)
                .finish(),
        }
    }
}
