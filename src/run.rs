use std::sync::Arc;

use futures::channel::oneshot;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast};
use wasmer_wasix::{Runtime as _, WasiEnvBuilder};

use crate::{instance::ExitCondition, utils::Error, Instance, RunOptions, Runtime};

const DEFAULT_PROGRAM_NAME: &str = "wasm";

/// Run a WASIX program.
#[wasm_bindgen]
pub async fn run(wasm_module: WasmModule, config: RunOptions) -> Result<Instance, Error> {
    let _span = tracing::debug_span!("run").entered();

    let runtime = match config.runtime().as_runtime() {
        Some(rt) => Arc::clone(&*rt),
        None => Runtime::lazily_initialized()?,
    };

    let program_name = config
        .program()
        .as_string()
        .unwrap_or_else(|| DEFAULT_PROGRAM_NAME.to_string());

    let mut builder = WasiEnvBuilder::new(program_name).runtime(runtime.clone());
    let (stdin, stdout, stderr) = config.configure_builder(&mut builder)?;

    let (exit_code_tx, exit_code_rx) = oneshot::channel();

    let module: wasmer::Module = wasm_module.to_module(&*runtime).await?;

    // Note: The WasiEnvBuilder::run() method blocks, so we need to run it on
    // the thread pool.
    let tasks = runtime.task_manager().clone();
    tasks.spawn_with_module(
        module,
        Box::new(move |module| {
            let _span = tracing::debug_span!("run").entered();
            let result = builder.run(module).map_err(anyhow::Error::new);
            let _ = exit_code_tx.send(ExitCondition::from_result(result));
        }),
    )?;

    Ok(Instance {
        stdin,
        stdout,
        stderr,
        exit: exit_code_rx,
    })
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "WebAssembly.Module | Uint8Array")]
    pub type WasmModule;
}

impl WasmModule {
    async fn to_module(
        &self,
        runtime: &dyn wasmer_wasix::Runtime,
    ) -> Result<wasmer::Module, Error> {
        if let Some(module) = self.dyn_ref::<js_sys::WebAssembly::Module>() {
            Ok(module.clone().into())
        } else if let Some(buffer) = self.dyn_ref::<js_sys::Uint8Array>() {
            let buffer = buffer.to_vec();
            let module = runtime.load_module(&buffer).await?;
            Ok(module)
        } else {
            unreachable!();
        }
    }
}
