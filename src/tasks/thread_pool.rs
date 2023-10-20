use std::{fmt::Debug, future::Future, num::NonZeroUsize, pin::Pin};

use anyhow::Context;
use futures::future::LocalBoxFuture;
use instant::Duration;
use wasm_bindgen_futures::JsFuture;
use wasmer_wasix::{runtime::task_manager::TaskWasm, VirtualTaskManager, WasiThreadError};

use crate::tasks::{Scheduler, SchedulerMessage};

/// A handle to a threadpool backed by Web Workers.
#[derive(Debug, Clone)]
pub struct ThreadPool {
    scheduler: Scheduler,
}

impl ThreadPool {
    pub fn new(capacity: NonZeroUsize) -> Self {
        let sender = Scheduler::spawn(capacity);
        ThreadPool { scheduler: sender }
    }

    pub fn new_with_max_threads() -> Result<ThreadPool, anyhow::Error> {
        let concurrency = crate::utils::hardware_concurrency()
            .context("Unable to determine the hardware concurrency")?;
        // Note: We want to deliberately over-commit to avoid accidental
        // deadlocks.
        let concurrency = concurrency
            .checked_mul(NonZeroUsize::new(16).unwrap())
            .unwrap();
        Ok(ThreadPool::new(concurrency))
    }

    /// Run an `async` function to completion on the threadpool.
    pub fn spawn(
        &self,
        task: Box<dyn FnOnce() -> LocalBoxFuture<'static, ()> + Send>,
    ) -> Result<(), WasiThreadError> {
        self.send(SchedulerMessage::SpawnAsync(task));

        Ok(())
    }

    pub(crate) fn send(&self, msg: SchedulerMessage) {
        self.scheduler.send(msg).expect("scheduler is dead");
    }
}

#[async_trait::async_trait]
impl VirtualTaskManager for ThreadPool {
    /// Invokes whenever a WASM thread goes idle. In some runtimes (like
    /// singlethreaded execution environments) they will need to do asynchronous
    /// work whenever the main thread goes idle and this is the place to hook
    /// for that.
    fn sleep_now(
        &self,
        time: Duration,
    ) -> Pin<Box<dyn Future<Output = ()> + Send + Sync + 'static>> {
        let (tx, rx) = tokio::sync::oneshot::channel();

        let time = if time.as_millis() < i32::MAX as u128 {
            time.as_millis() as i32
        } else {
            i32::MAX
        };

        wasm_bindgen_futures::spawn_local(async move {
            let _ = JsFuture::from(crate::utils::bindgen_sleep(time)).await;
            let _ = tx.send(());
        });

        Box::pin(async move {
            let _ = rx.await;
        })
    }

    /// Starts an asynchronous task that will run on a shared worker pool
    /// This task must not block the execution or it could cause a deadlock
    fn task_shared(
        &self,
        task: Box<
            dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + Send + 'static>> + Send + 'static,
        >,
    ) -> Result<(), WasiThreadError> {
        self.spawn(Box::new(move || Box::pin(async move { task().await })))
    }

    /// Starts an asynchronous task will will run on a dedicated thread
    /// pulled from the worker pool that has a stateful thread local variable
    /// It is ok for this task to block execution and any async futures within its scope
    fn task_wasm(&self, task: TaskWasm<'_, '_>) -> Result<(), WasiThreadError> {
        let msg = crate::tasks::task_wasm::to_scheduler_message(task)?;
        self.send(msg);
        Ok(())
    }

    /// Starts an asynchronous task will will run on a dedicated thread
    /// pulled from the worker pool. It is ok for this task to block execution
    /// and any async futures within its scope
    fn task_dedicated(
        &self,
        task: Box<dyn FnOnce() + Send + 'static>,
    ) -> Result<(), WasiThreadError> {
        self.send(SchedulerMessage::SpawnBlocking(task));

        Ok(())
    }

    /// Returns the amount of parallelism that is possible on this platform
    fn thread_parallelism(&self) -> Result<usize, WasiThreadError> {
        Ok(self.scheduler.capacity().get())
    }

    fn spawn_with_module(
        &self,
        module: wasmer::Module,
        task: Box<dyn FnOnce(wasmer::Module) + Send + 'static>,
    ) -> Result<(), WasiThreadError> {
        self.send(SchedulerMessage::SpawnWithModule { task, module });

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use futures::channel::oneshot;
    use js_sys::Uint8Array;
    use wasm_bindgen::JsCast;
    use wasm_bindgen_futures::JsFuture;
    use wasm_bindgen_test::wasm_bindgen_test;

    use super::*;

    #[wasm_bindgen_test]
    async fn transfer_module_to_worker() {
        let wasm: &[u8] = include_bytes!("../../tests/envvar.wasm");
        let data = Uint8Array::from(wasm);
        let module: js_sys::WebAssembly::Module =
            JsFuture::from(js_sys::WebAssembly::compile(&data))
                .await
                .unwrap()
                .dyn_into()
                .unwrap();
        let module = wasmer::Module::from(module);
        let pool = ThreadPool::new_with_max_threads().unwrap();

        let (sender, receiver) = oneshot::channel();
        pool.spawn_with_module(
            module.clone(),
            Box::new(move |module| {
                let exports = module.exports().count();
                sender.send(exports).unwrap();
            }),
        )
        .unwrap();

        let exports = receiver.await.unwrap();
        assert_eq!(exports, 5);
    }

    #[wasm_bindgen_test]
    async fn spawned_tasks_can_communicate_with_the_main_thread() {
        let pool = ThreadPool::new(2.try_into().unwrap());
        let (sender, receiver) = oneshot::channel();

        pool.task_shared(Box::new(move || {
            Box::pin(async move {
                sender.send(42_u32).unwrap();
            })
        }))
        .unwrap();

        tracing::info!("Waiting for result");
        let result = receiver.await.unwrap();
        tracing::info!("Received {result}");
        assert_eq!(result, 42);
    }
}
