//! Execute code from a running WebAssembly instance on another thread.

use bytes::Bytes;
use js_sys::WebAssembly;
use tokio::sync::mpsc::UnboundedSender;
use wasm_bindgen::{JsCast, JsValue};
use wasmer::{AsJs, MemoryType};
use wasmer_wasix::{
    runtime::task_manager::{TaskWasm, TaskWasmRun, WasmResumeTrigger},
    wasmer_wasix_types::wasi::ExitCode,
    InstanceSnapshot, WasiEnv, WasiThreadError,
};

use crate::tasks::SchedulerMessage;

pub(crate) fn to_scheduler_message(
    task: TaskWasm<'_, '_>,
    pool: UnboundedSender<SchedulerMessage>,
) -> Result<SchedulerMessage, WasiThreadError> {
    let TaskWasm {
        run,
        env,
        module,
        snapshot,
        spawn_type,
        trigger,
        update_layout,
    } = task;

    let module_bytes = module.serialize().unwrap();
    let snapshot = snapshot.map(|s| s.clone());

    let mut memory_ty = None;
    let mut memory = None;
    let run_type = match spawn_type {
        wasmer_wasix::runtime::SpawnMemoryType::CreateMemory => WasmMemoryType::CreateMemory,
        wasmer_wasix::runtime::SpawnMemoryType::CreateMemoryOfType(ty) => {
            memory_ty = Some(ty.clone());
            WasmMemoryType::CreateMemoryOfType(ty)
        }
        wasmer_wasix::runtime::SpawnMemoryType::CopyMemory(m, store) => {
            memory_ty = Some(m.ty(&store));
            let memory = m.as_jsvalue(&store);

            // We copy the memory here rather than later as
            // the fork syscalls need to copy the memory
            // synchronously before the next thread accesses
            // and before the fork parent resumes, otherwise
            // there will be memory corruption
            let memory = copy_memory(&memory, m.ty(&store))?;

            WasmMemoryType::ShareMemory(m.ty(&store))
        }
        wasmer_wasix::runtime::SpawnMemoryType::ShareMemory(m, store) => {
            memory_ty = Some(m.ty(&store));
            let memory = m.as_jsvalue(&store);
            WasmMemoryType::ShareMemory(m.ty(&store))
        }
    };

    let task = SpawnWasm {
        trigger: trigger.map(|trigger| WasmRunTrigger {
            run: trigger,
            memory_ty: memory_ty.expect("triggers must have the a known memory type"),
            env: env.clone(),
        }),
        run,
        run_type,
        env,
        module_bytes,
        snapshot,
        update_layout,
        result: None,
        pool,
        memory_ty,
    };

    Ok(SchedulerMessage::SpawnWithModuleAndMemory {
        module,
        memory,
        task: Box::new(|_, _| panic!()),
    })
}

#[derive(Debug, Clone)]
pub(crate) enum WasmMemoryType {
    CreateMemory,
    CreateMemoryOfType(MemoryType),
    ShareMemory(MemoryType),
}

/// Duplicate a [`WebAssembly::Memory`] instance.
fn copy_memory(memory: &JsValue, ty: MemoryType) -> Result<JsValue, WasiThreadError> {
    let memory_js = memory.dyn_ref::<WebAssembly::Memory>().unwrap();

    let descriptor = js_sys::Object::new();

    // Annotation is here to prevent spurious IDE warnings.
    js_sys::Reflect::set(&descriptor, &"initial".into(), &ty.minimum.0.into()).unwrap();
    if let Some(max) = ty.maximum {
        js_sys::Reflect::set(&descriptor, &"maximum".into(), &max.0.into()).unwrap();
    }
    js_sys::Reflect::set(&descriptor, &"shared".into(), &ty.shared.into()).unwrap();

    let new_memory = WebAssembly::Memory::new(&descriptor).map_err(|_e| {
        WasiThreadError::MemoryCreateFailed(wasmer::MemoryError::Generic(
            "Error while creating the memory".to_owned(),
        ))
    })?;

    let src_buffer = memory_js.buffer();
    let src_size: u64 = src_buffer
        .unchecked_ref::<js_sys::ArrayBuffer>()
        .byte_length()
        .into();
    let src_view = js_sys::Uint8Array::new(&src_buffer);

    let pages = ((src_size as usize - 1) / wasmer::WASM_PAGE_SIZE) + 1;
    new_memory.grow(pages as u32);

    let dst_buffer = new_memory.buffer();
    let dst_view = js_sys::Uint8Array::new(&dst_buffer);

    tracing::trace!(src_size, "memory copy started");

    {
        let mut offset = 0_u64;
        let mut chunk = [0u8; 40960];
        while offset < src_size {
            let remaining = src_size - offset;
            let sublen = remaining.min(chunk.len() as u64) as usize;
            let end = offset.checked_add(sublen.try_into().unwrap()).unwrap();
            src_view
                .subarray(offset.try_into().unwrap(), end.try_into().unwrap())
                .copy_to(&mut chunk[..sublen]);
            dst_view
                .subarray(offset.try_into().unwrap(), end.try_into().unwrap())
                .copy_from(&chunk[..sublen]);
            offset += sublen as u64;
        }
    }

    Ok(new_memory.into())
}

struct WasmRunTrigger {
    run: Box<WasmResumeTrigger>,
    memory_ty: MemoryType,
    env: WasiEnv,
}

struct SpawnWasm {
    run: Box<TaskWasmRun>,
    run_type: WasmMemoryType,
    env: WasiEnv,
    module_bytes: Bytes,
    snapshot: Option<InstanceSnapshot>,
    trigger: Option<WasmRunTrigger>,
    update_layout: bool,
    result: Option<Result<Bytes, ExitCode>>,
    pool: UnboundedSender<SchedulerMessage>,
    memory_ty: Option<MemoryType>,
}
