use anyhow::Error;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};
use web_sys::DedicatedWorkerGlobalScope;

use crate::tasks::PostMessagePayload;

#[wasm_bindgen(skip_typescript)]
#[derive(Debug)]
pub struct WorkerState {
    id: u32,
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
    pub fn new(id: u32) -> WorkerState {
        WorkerState { id }
    }

    pub async fn handle(&mut self, msg: JsValue) -> Result<(), crate::utils::Error> {
        let _span = tracing::debug_span!("handle", worker_id = self.id).entered();

        // Safety: The message was created using PostMessagePayload::to_js()
        let msg = unsafe { PostMessagePayload::try_from_js(msg)? };

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
                tracing::warn!(%hash, "TODO Caching module");
            }
            PostMessagePayload::SpawnWithModule { module, task } => {
                task(module.into());
            }
            PostMessagePayload::SpawnWithModuleAndMemory {
                module,
                memory,
                spawn_wasm,
            } => {
                tracing::warn!("Spawn with module and memory");
                spawn_wasm.execute(module, memory.into()).await?;
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
