use anyhow::Error;
use bytes::Bytes;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};
use wasmer::{AsJs, AsStoreRef, Memory, Module, Store};
use wasmer_wasix::{runtime::SpawnMemoryType, InstanceSnapshot, WasiEnv, WasiFunctionEnv};
use web_sys::DedicatedWorkerGlobalScope;

use crate::tasks::{task_wasm::WasmMemoryType, PostMessagePayload};

#[wasm_bindgen(skip_typescript)]
#[derive(Debug)]
pub struct WorkerState {
    id: u64,
}

impl WorkerState {
    fn busy(&self) -> impl Drop {
        struct BusyGuard;
        impl Drop for BusyGuard {
            fn drop(&mut self) {
                let _ = emit(WorkerMessage::MarkIdle);
            }
        }

        let _ = emit(WorkerMessage::MarkBusy);

        BusyGuard
    }
}

#[wasm_bindgen]
impl WorkerState {
    #[wasm_bindgen(constructor)]
    pub fn new(id: u64) -> WorkerState {
        WorkerState { id }
    }

    pub async fn handle(&mut self, msg: JsValue) -> Result<(), crate::utils::Error> {
        let _span = tracing::debug_span!("handle", worker_id = self.id).entered();
        let msg = PostMessagePayload::try_from_js(msg)?;
        tracing::trace!(?msg, "Handling a message");

        match msg {
            PostMessagePayload::SpawnAsync(thunk) => {
                thunk().await;
            }
            PostMessagePayload::SpawnBlocking(thunk) => {
                let _guard = self.busy();
                thunk();
            }
            PostMessagePayload::CacheModule { hash, .. } => {
                tracing::warn!(%hash, "XXX Caching module");
            }
            PostMessagePayload::SpawnWithModule { module, task } => {
                task(module.into());
            }
            PostMessagePayload::SpawnWithModuleAndMemory {
                module,
                memory,
                task,
            } => {
                tracing::warn!("Spawn with module and memory");
                todo!();
                // task(module.into(), memory.into());
            }
        }

        Ok(())
    }
}

/// A message the worker sends back to the scheduler.
#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type", rename_all = "kebab-case")]
pub(crate) enum WorkerMessage {
    /// Mark this worker as busy.
    MarkBusy,
    /// Mark this worker as idle.
    MarkIdle,
}

/// Send a message to the scheduler.
fn emit(msg: WorkerMessage) -> Result<(), Error> {
    let scope: DedicatedWorkerGlobalScope = js_sys::global().dyn_into().unwrap();

    let value = serde_wasm_bindgen::to_value(&msg).map_err(|e| crate::utils::js_error(e.into()))?;
    scope.post_message(&value).map_err(crate::utils::js_error)?;

    Ok(())
}

fn build_ctx_and_store(
    module: js_sys::WebAssembly::Module,
    memory: JsValue,
    module_bytes: Bytes,
    env: WasiEnv,
    run_type: WasmMemoryType,
    snapshot: Option<InstanceSnapshot>,
    update_layout: bool,
) -> Option<(WasiFunctionEnv, Store)> {
    // Convert back to a wasmer::Module
    let module: Module = (module, module_bytes).into();

    // Make a fake store which will hold the memory we just transferred
    let mut temp_store = env.runtime().new_store();
    let spawn_type = match run_type {
        WasmMemoryType::CreateMemory => SpawnMemoryType::CreateMemory,
        WasmMemoryType::CreateMemoryOfType(mem) => SpawnMemoryType::CreateMemoryOfType(mem),
        WasmMemoryType::ShareMemory(ty) => {
            let memory = match Memory::from_jsvalue(&mut temp_store, &ty, &memory) {
                Ok(a) => a,
                Err(err) => {
                    let err = crate::utils::js_error(err.into());
                    tracing::error!(error = &*err, "Failed to receive memory for module");
                    return None;
                }
            };
            SpawnMemoryType::ShareMemory(memory, temp_store.as_store_ref())
        }
    };

    let snapshot = snapshot.as_ref();
    let (ctx, store) =
        match WasiFunctionEnv::new_with_store(module, env, snapshot, spawn_type, update_layout) {
            Ok(a) => a,
            Err(err) => {
                tracing::error!(
                    error = &err as &dyn std::error::Error,
                    "Failed to crate wasi context",
                );
                return None;
            }
        };
    Some((ctx, store))
}
