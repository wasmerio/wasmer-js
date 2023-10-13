use std::fmt::Debug;

use anyhow::{Context, Error};
use js_sys::{Array, JsString, Uint8Array, WebAssembly};
use once_cell::sync::Lazy;
use wasm_bindgen::{
    prelude::{wasm_bindgen, Closure},
    JsCast, JsValue,
};
use wasmer_wasix::runtime::module_cache::ModuleHash;

use crate::{
    tasks::{
        interop::Serializer, task_wasm::SpawnWasm, AsyncTask, BlockingModuleTask, BlockingTask,
        SchedulerChannel, SchedulerMessage, WorkerMessage,
    },
    utils::Hidden,
};

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

/// A message that will be sent to a worker using `postMessage()`.
pub(crate) enum PostMessagePayload {
    SpawnAsync(AsyncTask),
    SpawnBlocking(BlockingTask),
    CacheModule {
        hash: ModuleHash,
        module: WebAssembly::Module,
    },
    SpawnWithModule {
        module: WebAssembly::Module,
        task: BlockingModuleTask,
    },
    SpawnWithModuleAndMemory {
        module: WebAssembly::Module,
        /// An instance of the WebAssembly linear memory that has already been
        /// created.
        memory: Option<WebAssembly::Memory>,
        spawn_wasm: SpawnWasm,
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
}

impl PostMessagePayload {
    pub(crate) fn into_js(self) -> Result<JsValue, crate::utils::Error> {
        match self {
            PostMessagePayload::SpawnAsync(task) => Serializer::new(consts::SPAWN_ASYNC)
                .boxed(consts::PTR, task)
                .finish(),
            PostMessagePayload::SpawnBlocking(task) => Serializer::new(consts::SPAWN_BLOCKING)
                .boxed(consts::PTR, task)
                .finish(),
            PostMessagePayload::CacheModule { hash, module } => {
                Serializer::new(consts::CACHE_MODULE)
                    .set(consts::MODULE_HASH, hash.to_string())
                    .set(consts::MODULE, module)
                    .finish()
            }
            PostMessagePayload::SpawnWithModule { module, task } => {
                Serializer::new(consts::SPAWN_WITH_MODULE)
                    .boxed(consts::PTR, task)
                    .set(consts::MODULE, module)
                    .finish()
            }
            PostMessagePayload::SpawnWithModuleAndMemory {
                module,
                memory,
                spawn_wasm,
            } => Serializer::new(consts::SPAWN_WITH_MODULE_AND_MEMORY)
                .boxed(consts::PTR, spawn_wasm)
                .set(consts::MODULE, module)
                .set(consts::MEMORY, memory)
                .finish(),
        }
    }

    /// Try to convert a [`PostMessagePayload`] back from a [`JsValue`].
    ///
    /// # Safety
    ///
    /// This can only be called if the original [`JsValue`] was created using
    /// [`PostMessagePayload::into_js()`].
    pub(crate) unsafe fn try_from_js(value: JsValue) -> Result<Self, crate::utils::Error> {
        let de = crate::tasks::interop::Deserializer::new(value);

        // Safety: Keep this in sync with PostMessagePayload::to_js()
        match de.ty()?.as_str() {
            consts::SPAWN_ASYNC => {
                let task = de.get_boxed(consts::PTR)?;
                Ok(PostMessagePayload::SpawnAsync(task))
            }
            consts::SPAWN_BLOCKING => {
                let task = de.get_boxed(consts::PTR)?;
                Ok(PostMessagePayload::SpawnBlocking(task))
            }
            consts::CACHE_MODULE => {
                let module = de.get_js(consts::MODULE)?;
                let hash = de.get_string(consts::MODULE_HASH)?;
                let hash = ModuleHash::parse_hex(&hash)?;

                Ok(PostMessagePayload::CacheModule { hash, module })
            }
            consts::SPAWN_WITH_MODULE => {
                let task = de.get_boxed(consts::PTR)?;
                let module = de.get_js(consts::MODULE)?;

                Ok(PostMessagePayload::SpawnWithModule { module, task })
            }
            consts::SPAWN_WITH_MODULE_AND_MEMORY => {
                let module = de.get_js(consts::MODULE)?;
                let memory = de.get_js(consts::MEMORY).ok();
                let spawn_wasm = de.get_boxed(consts::PTR)?;

                Ok(PostMessagePayload::SpawnWithModuleAndMemory {
                    module,
                    memory,
                    spawn_wasm,
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
                spawn_wasm,
            } => f
                .debug_struct("CacheModule")
                .field("module", module)
                .field("memory", memory)
                .field("spawn_wasm", &spawn_wasm)
                .finish(),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    };

    use futures::channel::oneshot;
    use wasm_bindgen_test::wasm_bindgen_test;
    use wasmer_wasix::runtime::module_cache::ModuleHash;

    use super::*;

    #[wasm_bindgen_test]
    async fn round_trip_spawn_blocking() {
        let flag = Arc::new(AtomicBool::new(false));
        let msg = PostMessagePayload::SpawnBlocking({
            let flag = Arc::clone(&flag);
            Box::new(move || {
                flag.store(true, Ordering::SeqCst);
            })
        });

        let js = msg.into_js().unwrap();
        let round_tripped = unsafe { PostMessagePayload::try_from_js(js).unwrap() };

        match round_tripped {
            PostMessagePayload::SpawnBlocking(task) => {
                task();
                assert!(flag.load(Ordering::SeqCst));
            }
            _ => unreachable!(),
        }
    }

    #[wasm_bindgen_test]
    async fn round_trip_spawn_async() {
        let flag = Arc::new(AtomicBool::new(false));
        let msg = PostMessagePayload::SpawnAsync({
            let flag = Arc::clone(&flag);
            Box::new(move || {
                Box::pin(async move {
                    flag.store(true, Ordering::SeqCst);
                })
            })
        });

        let js = msg.into_js().unwrap();
        let round_tripped = unsafe { PostMessagePayload::try_from_js(js).unwrap() };

        match round_tripped {
            PostMessagePayload::SpawnAsync(task) => {
                task().await;
                assert!(flag.load(Ordering::SeqCst));
            }
            _ => unreachable!(),
        }
    }

    #[wasm_bindgen_test]
    async fn round_trip_spawn_with_module() {
        let wasm: &[u8] = include_bytes!("../../tests/envvar.wasm");
        let engine = wasmer::Engine::default();
        let module = wasmer::Module::new(&engine, wasm).unwrap();
        let (sender, receiver) = oneshot::channel();
        let msg = PostMessagePayload::SpawnWithModule {
            module: JsValue::from(module).dyn_into().unwrap(),
            task: Box::new(|m| {
                sender
                    .send(
                        m.exports()
                            .map(|e| e.name().to_string())
                            .collect::<Vec<String>>(),
                    )
                    .unwrap();
            }),
        };

        let js = msg.into_js().unwrap();
        let round_tripped = unsafe { PostMessagePayload::try_from_js(js).unwrap() };

        let (module, task) = match round_tripped {
            PostMessagePayload::SpawnWithModule { module, task } => (module, task),
            _ => unreachable!(),
        };
        task(module.into());
        let name = receiver.await.unwrap();
        assert_eq!(
            name,
            vec![
                "memory".to_string(),
                "__heap_base".to_string(),
                "__data_end".to_string(),
                "_start".to_string(),
                "main".to_string()
            ]
        );
    }

    #[wasm_bindgen_test]
    async fn round_trip_cache_module() {
        let wasm: &[u8] = include_bytes!("../../tests/envvar.wasm");
        let engine = wasmer::Engine::default();
        let module = wasmer::Module::new(&engine, wasm).unwrap();
        let msg = PostMessagePayload::CacheModule {
            hash: ModuleHash::sha256(wasm),
            module: module.into(),
        };

        let js = msg.into_js().unwrap();
        let round_tripped = unsafe { PostMessagePayload::try_from_js(js).unwrap() };

        match round_tripped {
            PostMessagePayload::CacheModule { hash, module: _ } => {
                assert_eq!(hash, ModuleHash::sha256(wasm));
            }
            _ => unreachable!(),
        };
    }
}
