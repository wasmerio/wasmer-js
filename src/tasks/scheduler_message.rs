use std::marker::PhantomData;

use derivative::Derivative;
use wasm_bindgen::JsValue;
use wasmer_wasix::runtime::module_cache::ModuleHash;

use crate::{
    tasks::{task_wasm::SpawnWasm, AsyncTask, BlockingModuleTask, BlockingTask},
    utils::Error,
};

/// Messages sent from the [`crate::tasks::ThreadPool`] handle to the [`Scheduler`].
#[derive(Derivative)]
#[derivative(Debug)]
pub(crate) enum SchedulerMessage {
    /// Run a promise on a worker thread.
    SpawnAsync(#[derivative(Debug(format_with = "crate::utils::hidden"))] AsyncTask),
    /// Run a blocking operation on a worker thread.
    SpawnBlocking(#[derivative(Debug(format_with = "crate::utils::hidden"))] BlockingTask),
    /// A message sent from a worker thread.
    /// Mark a worker as idle.
    WorkerIdle { worker_id: u32 },
    /// Mark a worker as busy.
    WorkerBusy { worker_id: u32 },
    /// Tell all workers to cache a WebAssembly module.
    #[allow(dead_code)]
    CacheModule {
        hash: ModuleHash,
        module: wasmer::Module,
    },
    /// Run a task in the background, explicitly transferring the
    /// [`js_sys::WebAssembly::Module`] to the worker.
    SpawnWithModule {
        module: wasmer::Module,
        #[derivative(Debug(format_with = "crate::utils::hidden"))]
        task: BlockingModuleTask,
    },
    /// Run a task in the background, explicitly transferring the
    /// [`js_sys::WebAssembly::Module`] to the worker.
    SpawnWithModuleAndMemory {
        module: wasmer::Module,
        memory: Option<wasmer::Memory>,
        spawn_wasm: SpawnWasm,
    },
    #[doc(hidden)]
    #[allow(dead_code)]
    Markers {
        /// [`wasmer::Module`] and friends are `!Send` in practice.
        not_send: PhantomData<*const ()>,
        /// Mark this variant as unreachable.
        uninhabited: std::convert::Infallible,
    },
}

impl SchedulerMessage {
    pub(crate) fn try_from_js(value: JsValue) -> Result<Self, Error> {
        todo!();
    }

    pub(crate) fn into_js(self) -> Result<JsValue, Error> {
        match self {
            SchedulerMessage::SpawnAsync(_) => todo!(),
            SchedulerMessage::SpawnBlocking(_) => todo!(),
            SchedulerMessage::WorkerIdle { worker_id } => todo!(),
            SchedulerMessage::WorkerBusy { worker_id } => todo!(),
            SchedulerMessage::CacheModule { hash, module } => todo!(),
            SchedulerMessage::SpawnWithModule { module, task } => todo!(),
            SchedulerMessage::SpawnWithModuleAndMemory { module, memory, spawn_wasm } => todo!(),
            SchedulerMessage::Markers { not_send, uninhabited } => todo!(),
        }
    }
}

mod consts {
    const TYPE_SPAWN_ASYNC: &str = "spawn-async";
    const TYPE_SPAWN_WITH_MODULE_AND_MEMORY: &str = "spawn-with-module-and-memory";
}
