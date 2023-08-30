use anyhow::Error;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};
use web_sys::DedicatedWorkerGlobalScope;

use crate::tasks::PostMessagePayload;

#[wasm_bindgen(skip_typescript)]
#[derive(Debug)]
pub struct WorkerState {
    id: u64,
}

impl WorkerState {
    fn emit(&self, msg: WorkerMessage) -> Result<(), Error> {
        let scope: DedicatedWorkerGlobalScope = js_sys::global().dyn_into().unwrap();

        let value =
            serde_wasm_bindgen::to_value(&msg).map_err(|e| crate::utils::js_error(e.into()))?;
        scope.post_message(&value).map_err(crate::utils::js_error)?;

        Ok(())
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
            PostMessagePayload::SpawnAsync(thunk) => thunk().await,
            PostMessagePayload::SpawnBlocking(thunk) => {
                self.emit(WorkerMessage::MarkBusy)?;
                thunk();
                self.emit(WorkerMessage::MarkIdle)?;
            }
            PostMessagePayload::CacheModule { hash, .. } => {
                tracing::warn!(%hash, "XXX Caching module");
            }
            PostMessagePayload::SpawnWithModule { module, task } => {
                task(module.into());
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
