// Copy of wasi-web/src/pool.rs

use std::{
    fmt::Debug,
    future::Future,
    ops::Deref,
    pin::Pin,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc, Mutex,
    },
};

use bytes::Bytes;
use derivative::*;
use js_sys::{Array, JsString, Uint8Array, WebAssembly};
use tokio::{select, sync::mpsc};
use wasm_bindgen::{prelude::*, JsCast};

use wasmer::AsStoreRef;
use wasmer_wasix::{
    runtime::{
        task_manager::{TaskWasm, TaskWasmRun, TaskWasmRunProperties, WasmResumeTrigger},
        SpawnMemoryType,
    },
    types::wasi::ExitCode,
    wasmer::{AsJs, Memory, MemoryType, Module, Store},
    InstanceSnapshot, WasiEnv, WasiFunctionEnv,
};
use web_sys::{DedicatedWorkerGlobalScope, MessageEvent, Worker, WorkerOptions, WorkerType};

pub type BoxRun<'a> = Box<dyn FnOnce() + Send + 'a>;

pub type BoxRunAsync<'a, T> =
    Box<dyn FnOnce() -> Pin<Box<dyn Future<Output = T> + 'static>> + Send + 'a>;

#[derive(Debug, Clone, Copy)]
enum WasmMemoryType {
    CreateMemory,
    CreateMemoryOfType(MemoryType),
    CopyMemory(MemoryType),
    ShareMemory(MemoryType),
}

#[derive(Derivative)]
#[derivative(Debug)]
struct WasmRunTrigger {
    #[derivative(Debug = "ignore")]
    run: Box<WasmResumeTrigger>,
    memory_ty: MemoryType,
    env: WasiEnv,
}

#[derive(Derivative)]
#[derivative(Debug)]
struct WasmRunCommand {
    #[derivative(Debug = "ignore")]
    run: Box<TaskWasmRun>,
    run_type: WasmMemoryType,
    env: WasiEnv,
    module_bytes: Bytes,
    snapshot: Option<InstanceSnapshot>,
    trigger: Option<WasmRunTrigger>,
    update_layout: bool,
    result: Option<Result<Bytes, ExitCode>>,
}

trait AssertSendSync: Send + Sync {}
impl AssertSendSync for WebThreadPool {}

#[wasm_bindgen]
#[derive(Debug)]
pub struct WebThreadPoolInner {
    pool_reactors: Arc<PoolState>,
    pool_dedicated: Arc<PoolState>,
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct WebThreadPool {
    inner: Arc<WebThreadPoolInner>,
}

impl Deref for WebThreadPool {
    type Target = WebThreadPoolInner;

    fn deref(&self) -> &Self::Target {
        self.inner.deref()
    }
}

enum Message {
    Run(BoxRun<'static>),
    RunAsync(BoxRunAsync<'static, ()>),
}

impl Debug for Message {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Message::Run(_) => write!(f, "run"),
            Message::RunAsync(_) => write!(f, "run-async"),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum PoolType {
    Shared,
    Dedicated,
}

#[derive(Derivative)]
#[derivative(Debug)]
struct IdleThread {
    idx: usize,
    #[derivative(Debug = "ignore")]
    work: mpsc::UnboundedSender<Message>,
}

impl IdleThread {
    #[allow(dead_code)]
    fn consume(self, msg: Message) {
        let _ = self.work.send(msg);
    }
}

#[derive(Derivative)]
#[derivative(Debug)]
pub struct PoolState {
    #[derivative(Debug = "ignore")]
    idle_rx: Mutex<mpsc::UnboundedReceiver<IdleThread>>,
    idle_tx: mpsc::UnboundedSender<IdleThread>,
    idx_seed: AtomicUsize,
    idle_size: usize,
    blocking: bool,
    spawn: mpsc::UnboundedSender<Message>,
    #[allow(dead_code)]
    type_: PoolType,
}

pub struct ThreadState {
    pool: Arc<PoolState>,
    #[allow(dead_code)]
    idx: usize,
    tx: mpsc::UnboundedSender<Message>,
    rx: Mutex<Option<mpsc::UnboundedReceiver<Message>>>,
    init: Mutex<Option<Message>>,
}

fn import_meta_url() -> JsValue {
    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = ["import", "meta"], js_name = url)]
        static URL: JsString;
    }
    URL.clone().into()
}

impl WebThreadPool {
    pub fn new(size: usize) -> Result<WebThreadPool, JsValue> {
        /* info!("pool::create(size={})", size); */

        let (idle_tx1, idle_rx1) = mpsc::unbounded_channel();
        let (idle_tx3, idle_rx3) = mpsc::unbounded_channel();

        let (spawn_tx1, mut spawn_rx1) = mpsc::unbounded_channel();
        let (spawn_tx3, mut spawn_rx3) = mpsc::unbounded_channel();

        let pool_reactors = PoolState {
            idle_rx: Mutex::new(idle_rx1),
            idle_tx: idle_tx1,
            idx_seed: AtomicUsize::new(0),
            blocking: false,
            idle_size: 2usize.max(size),
            type_: PoolType::Shared,
            spawn: spawn_tx1,
        };

        let pool_dedicated = PoolState {
            idle_rx: Mutex::new(idle_rx3),
            idle_tx: idle_tx3,
            idx_seed: AtomicUsize::new(0),
            blocking: true,
            idle_size: 1usize.max(size),
            type_: PoolType::Dedicated,
            spawn: spawn_tx3,
        };

        let inner = Arc::new(WebThreadPoolInner {
            pool_dedicated: Arc::new(pool_dedicated),
            pool_reactors: Arc::new(pool_reactors),
        });

        let inner1 = inner.clone();
        let inner3 = inner.clone();

        // The management thread will spawn other threads - this thread is safe from
        // being blocked by other threads
        wasm_bindgen_futures::spawn_local(async move {
            loop {
                select! {
                    spawn = spawn_rx1.recv() => {
                        if let Some(spawn) = spawn { inner1.pool_reactors.expand(spawn); } else { break; }
                    }
                    spawn = spawn_rx3.recv() => {
                        if let Some(spawn) = spawn { inner3.pool_dedicated.expand(spawn); } else { break; }
                    }
                }
            }
        });

        let pool = WebThreadPool { inner };

        Ok(pool)
    }

    pub fn new_with_max_threads() -> Result<WebThreadPool, JsValue> {
        let nav = js_sys::global()
            .unchecked_into::<web_sys::Window>()
            .navigator();
        Self::new(if !nav.is_undefined() {
            std::cmp::max(nav.hardware_concurrency() as usize, 1)
        } else {
            1
        })
    }

    pub fn spawn_shared(&self, task: BoxRunAsync<'static, ()>) {
        self.inner.pool_reactors.spawn(Message::RunAsync(task));
    }

    pub fn spawn_wasm(&self, task: TaskWasm) {
        let run = task.run;
        let env = task.env;
        let module = task.module;
        let module_bytes = module.serialize().unwrap();
        let snapshot = task.snapshot.map(|s| s.clone());
        let trigger = task.trigger;
        let update_layout = task.update_layout;

        let mut memory_ty = None;
        let mut memory = JsValue::null();
        let run_type = match task.spawn_type {
            SpawnMemoryType::CreateMemory => WasmMemoryType::CreateMemory,
            SpawnMemoryType::CreateMemoryOfType(ty) => {
                memory_ty = Some(ty.clone());
                WasmMemoryType::CreateMemoryOfType(ty)
            }
            SpawnMemoryType::CopyMemory(m, store) => {
                memory_ty = Some(m.ty(&store));
                memory = m.as_jsvalue(&store);
                WasmMemoryType::CopyMemory(m.ty(&store))
            }
            SpawnMemoryType::ShareMemory(m, store) => {
                memory_ty = Some(m.ty(&store));
                memory = m.as_jsvalue(&store);
                WasmMemoryType::ShareMemory(m.ty(&store))
            }
        };

        let task = Box::new(WasmRunCommand {
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
        });

        let task = JsValue::from(Box::into_raw(task) as u32);
        let module = JsValue::from(module);
        js_sys::global()
            .unchecked_into::<web_sys::DedicatedWorkerGlobalScope>()
            .post_message(&Array::from_iter([task, module, memory].into_iter()))
            .unwrap_throw();
    }

    pub fn spawn_dedicated(&self, task: BoxRun<'static>) {
        self.inner.pool_dedicated.spawn(Message::Run(task));
    }

    pub fn spawn_dedicated_async(&self, task: BoxRunAsync<'static, ()>) {
        self.inner.pool_dedicated.spawn(Message::RunAsync(task));
    }
}

fn _build_ctx_and_store(
    module: WebAssembly::Module,
    memory: JsValue,
    module_bytes: Bytes,
    env: WasiEnv,
    run_type: WasmMemoryType,
    snapshot: Option<InstanceSnapshot>,
    update_layout: bool,
) -> Option<(WasiFunctionEnv, Store)> {
    // Compile the web assembly module
    let module: Module = (module, module_bytes).into();

    // Make a fake store which will hold the memory we just transferred
    let mut temp_store = env.runtime().new_store();
    let spawn_type = match run_type {
        WasmMemoryType::CreateMemory => SpawnMemoryType::CreateMemory,
        WasmMemoryType::CreateMemoryOfType(mem) => SpawnMemoryType::CreateMemoryOfType(mem),
        WasmMemoryType::CopyMemory(ty) | WasmMemoryType::ShareMemory(ty) => {
            let memory = match Memory::from_jsvalue(&mut temp_store, &ty, &memory) {
                Ok(a) => a,
                Err(_) => {
                    /* error!("Failed to receive memory for module"); */
                    return None;
                }
            };
            match run_type {
                WasmMemoryType::CopyMemory(_) => {
                    SpawnMemoryType::CopyMemory(memory, temp_store.as_store_ref())
                }
                WasmMemoryType::ShareMemory(_) => {
                    SpawnMemoryType::ShareMemory(memory, temp_store.as_store_ref())
                }
                _ => unreachable!(),
            }
        }
    };

    let snapshot = snapshot.as_ref();
    let (ctx, store) =
        match WasiFunctionEnv::new_with_store(module, env, snapshot, spawn_type, update_layout) {
            Ok(a) => a,
            Err(_err) => {
                /* error!("Failed to crate wasi context - {}", err); */
                return None;
            }
        };
    Some((ctx, store))
}

async fn _compile_module(bytes: &[u8]) -> Result<WebAssembly::Module, anyhow::Error> {
    let js_bytes = unsafe { Uint8Array::view(bytes) };
    Ok(
        match wasm_bindgen_futures::JsFuture::from(WebAssembly::compile(&js_bytes.into())).await {
            Ok(a) => match a.dyn_into::<WebAssembly::Module>() {
                Ok(a) => a,
                Err(err) => {
                    return Err(anyhow::format_err!(
                        "Failed to compile module - {}",
                        err.as_string().unwrap_or_else(|| format!("{:?}", err))
                    ));
                }
            },
            Err(err) => {
                return Err(anyhow::format_err!(
                    "WebAssembly failed to compile - {}",
                    err.as_string().unwrap_or_else(|| format!("{:?}", err))
                ));
            }
        }, //js_sys::WebAssembly::Module::new(&js_bytes.into()).unwrap()
    )
}

impl PoolState {
    fn spawn(&self, msg: Message) {
        for _ in 0..10 {
            if let Ok(mut guard) = self.idle_rx.try_lock() {
                if let Ok(thread) = guard.try_recv() {
                    thread.consume(msg);
                    return;
                }
                break;
            }
            std::thread::yield_now();
        }

        self.spawn.send(msg).unwrap();
    }

    fn expand(self: &Arc<Self>, init: Message) {
        let (tx, rx) = mpsc::unbounded_channel();
        let idx = self.idx_seed.fetch_add(1usize, Ordering::Release);
        let state = Arc::new(ThreadState {
            pool: Arc::clone(self),
            idx,
            tx,
            rx: Mutex::new(Some(rx)),
            init: Mutex::new(Some(init)),
        });
        Self::start_worker_now(idx, state /* None */);
    }

    pub fn start_worker_now(
        idx: usize,
        state: Arc<ThreadState>,
        /* should_warn_on_error: Option<Terminal>, */
    ) {
        let mut opts = WorkerOptions::new();
        opts.type_(WorkerType::Module);
        opts.name(&*format!("Worker-{:?}-{}", state.pool.type_, idx));

        let (module, memory) = get_module_and_memory().unwrap_throw();
        let state = JsValue::from(Arc::into_raw(state) as u32);
        let main_js = import_meta_url();

        let worker = WasixWorker::new(&opts);
        worker
            .post_message(&Array::from_iter(
                [module, memory, state, main_js].into_iter(),
            ))
            .unwrap_throw();
    }
}

impl ThreadState {
    fn work(state: Arc<ThreadState>) {
        let thread_index = state.idx;
        /* info!(
            "worker started (index={}, type={:?})",
            thread_index, state.pool.type_
        ); */

        // Load the work queue receiver where other people will
        // send us the work that needs to be done
        let mut work_rx = {
            let mut lock = state.rx.lock().unwrap();
            lock.take().unwrap()
        };

        // Load the initial work
        let mut work = {
            let mut lock = state.init.lock().unwrap();
            lock.take()
        };

        // The work is done in an asynchronous engine (that supports Javascript)
        let work_tx = state.tx.clone();
        let pool = Arc::clone(&state.pool);
        let driver = async move {
            let global = js_sys::global().unchecked_into::<DedicatedWorkerGlobalScope>();

            loop {
                // Process work until we need to go idle
                while let Some(task) = work {
                    match task {
                        Message::Run(task) => {
                            task();
                        }
                        Message::RunAsync(task) => {
                            let future = task();
                            if pool.blocking {
                                future.await;
                            } else {
                                wasm_bindgen_futures::spawn_local(async move {
                                    future.await;
                                });
                            }
                        }
                    }

                    // Grab the next work
                    work = work_rx.try_recv().ok();
                }

                // If there iss already an idle thread thats older then
                // keep that one (otherwise ditch it) - this creates negative
                // pressure on the pool size.
                // The reason we keep older threads is to maximize cache hits such
                // as module compile caches.
                if let Ok(mut lock) = state.pool.idle_rx.try_lock() {
                    let mut others = Vec::new();
                    while let Ok(other) = lock.try_recv() {
                        others.push(other);
                    }

                    // Sort them in the order of index (so older ones come first)
                    others.sort_by_key(|k| k.idx);

                    // If the number of others (plus us) exceeds the maximum then
                    // we either drop ourselves or one of the others
                    if others.len() + 1 > pool.idle_size {
                        // How many are there already there that have a lower index - are we the one without a chair?
                        let existing = others
                            .iter()
                            .map(|a| a.idx)
                            .filter(|a| *a < thread_index)
                            .count();
                        if existing >= pool.idle_size {
                            for other in others {
                                state.pool.idle_tx.send(other).unwrap();
                            }
                            /* info!(
                                "worker closed (index={}, type={:?})",
                                thread_index, pool.type_
                            ); */
                            break;
                        } else {
                            // Someone else is the one (the last one)
                            let leftover_chairs = others.len() - 1;
                            for other in others.into_iter().take(leftover_chairs) {
                                state.pool.idle_tx.send(other).unwrap();
                            }
                        }
                    } else {
                        // Add them all back in again (but in the right order)
                        for other in others {
                            state.pool.idle_tx.send(other).unwrap();
                        }
                    }
                }

                // Now register ourselves as idle
                /* trace!(
                    "pool is idle (thread_index={}, type={:?})",
                    thread_index,
                    pool.type_
                ); */
                let idle = IdleThread {
                    idx: thread_index,
                    work: work_tx.clone(),
                };
                if let Err(_) = state.pool.idle_tx.send(idle) {
                    /* info!(
                        "pool is closed (thread_index={}, type={:?})",
                        thread_index, pool.type_
                    ); */
                    break;
                }

                // Do a blocking recv (if this fails the thread is closed)
                work = match work_rx.recv().await {
                    Some(a) => Some(a),
                    None => {
                        /* info!(
                            "worker closed (index={}, type={:?})",
                            thread_index, pool.type_
                        ); */
                        break;
                    }
                };
            }

            global.close();
        };
        wasm_bindgen_futures::spawn_local(driver);
    }
}

#[wasm_bindgen(skip_typescript)]
pub fn worker_entry_point(state_ptr: u32) {
    let state = unsafe { Arc::<ThreadState>::from_raw(state_ptr as *const ThreadState) };

    /* let name = js_sys::global()
        .unchecked_into::<DedicatedWorkerGlobalScope>()
        .name();
    debug!("{}: Entry", name); */
    ThreadState::work(state);
}

#[wasm_bindgen(skip_typescript)]
pub fn wasm_entry_point(task_ptr: u32, wasm_module: WebAssembly::Module, wasm_memory: JsValue) {
    // Grab the run wrapper that passes us the rust variables (and extract the callback)
    let task = task_ptr as *mut WasmRunCommand;
    let task = unsafe { Box::from_raw(task) };
    let run = (*task).run;

    // Invoke the callback which will run the web assembly module
    if let Some((ctx, store)) = _build_ctx_and_store(
        wasm_module,
        wasm_memory,
        task.module_bytes,
        task.env,
        task.run_type,
        task.snapshot,
        task.update_layout,
    ) {
        run(TaskWasmRunProperties {
            ctx,
            store,
            trigger_result: task.result,
        });
    };
}

struct WasixWorker;
impl WasixWorker {
    pub fn new(opts: &WorkerOptions) -> Worker {
        // FIXME: include_bytes and use URL.createObjectURL with Blob to avoid relying on the bundler to resolve/load the path

        // let bundler polyfill Worker and resolve the path to the worker script
        #[wasm_bindgen(
            inline_js = r#"export function wasix_worker(opts){return new Worker(new URL("../../../js/worker.js",import.meta.url),opts)}"#
        )]
        extern "C" {
            fn wasix_worker(opts: &WorkerOptions) -> Worker;
        }
        let worker = wasix_worker(opts);
        worker.set_onmessage(Some(
            &Closure::<dyn Fn(MessageEvent) + 'static>::new(WasixWorker::onmessage)
                .as_ref()
                .unchecked_ref(),
        ));
        worker
    }
    fn onmessage(event: MessageEvent) {
        let data = event.data().unchecked_into::<Array>();

        let task_ptr = data.get(0).unchecked_into_f64() as u32;
        let wasm_module = data.get(1);
        let wasm_memory = data.get(2);

        // Grab the run wrapper that passes us the rust variables
        let mut task = unsafe { Box::from_raw(task_ptr as *mut WasmRunCommand) };

        // We will pass it on now
        let trigger = task.trigger.take();

        // We will now spawn the process in its own thread
        let mut opts = WorkerOptions::new();
        opts.type_(WorkerType::Module);
        opts.name(&*format!("Wasm-Thread"));

        wasm_bindgen_futures::spawn_local(async move {
            if let Some(trigger) = trigger {
                let run = trigger.run;
                task.result = Some(run().await);
            }

            let (module, memory) = get_module_and_memory().unwrap_throw();
            let task = JsValue::from(task_ptr);
            let main_js = import_meta_url();

            let worker = WasixWorker::new(&opts);
            worker
                .post_message(&Array::from_iter(
                    [module, memory, task, main_js, wasm_module, wasm_memory].into_iter(),
                ))
                .unwrap_throw();
        });
    }
}

fn get_module_and_memory() -> Result<(JsValue, JsValue), JsValue> {
    let module = wasm_bindgen::module();
    if !module.is_instance_of::<WebAssembly::Module>() {
        return Err(JsValue::from_str(
            "Could not obtain WASIX WebAssembly module",
        ));
    }
    let memory = wasm_bindgen::memory();
    if !module.is_instance_of::<WebAssembly::Memory>() {
        return Err(JsValue::from_str(
            "Could not obtain WASIX WebAssembly memory",
        ));
    }
    Ok((module, memory))
}
