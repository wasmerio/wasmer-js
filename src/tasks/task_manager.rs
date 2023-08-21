use std::{fmt::Debug, future::Future, pin::Pin, time::Duration};

use wasm_bindgen_futures::JsFuture;
use wasmer_wasix::{runtime::task_manager::TaskWasm, VirtualTaskManager, WasiThreadError};

use crate::tasks::pool2::ThreadPool;

#[derive(Debug, Clone)]
pub(crate) struct TaskManager {
    pool: ThreadPool,
}

impl TaskManager {
    pub fn new(pool: ThreadPool) -> Self {
        TaskManager { pool }
    }
}

#[async_trait::async_trait]
impl VirtualTaskManager for TaskManager {
    /// Invokes whenever a WASM thread goes idle. In some runtimes (like
    /// singlethreaded execution environments) they will need to do asynchronous
    /// work whenever the main thread goes idle and this is the place to hook
    /// for that.
    fn sleep_now(
        &self,
        time: Duration,
    ) -> Pin<Box<dyn Future<Output = ()> + Send + Sync + 'static>> {
        // The async code itself has to be sent to a main JS thread as this is
        // where time can be handled properly - later we can look at running a
        // JS runtime on the dedicated threads but that will require that
        // processes can be unwound using asyncify
        let (tx, rx) = tokio::sync::oneshot::channel();
        let _ = self.pool.spawn(Box::new(move || {
            Box::pin(async move {
                let time = if time.as_millis() < i32::MAX as u128 {
                    time.as_millis() as i32
                } else {
                    i32::MAX
                };
                let promise = crate::utils::bindgen_sleep(time);
                let js_fut = JsFuture::from(promise);
                let _ = js_fut.await;
                let _ = tx.send(());
            })
        }));
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
        self.pool
            .spawn(Box::new(move || Box::pin(async move { task().await })))
    }

    /// Starts an asynchronous task will will run on a dedicated thread
    /// pulled from the worker pool that has a stateful thread local variable
    /// It is ok for this task to block execution and any async futures within its scope
    fn task_wasm(&self, task: TaskWasm) -> Result<(), WasiThreadError> {
        self.pool.spawn_wasm(task)
    }

    /// Starts an asynchronous task will will run on a dedicated thread
    /// pulled from the worker pool. It is ok for this task to block execution
    /// and any async futures within its scope
    fn task_dedicated(
        &self,
        task: Box<dyn FnOnce() + Send + 'static>,
    ) -> Result<(), WasiThreadError> {
        self.pool.spawn_blocking(task)
    }

    /// Returns the amount of parallelism that is possible on this platform
    fn thread_parallelism(&self) -> Result<usize, WasiThreadError> {
        crate::utils::hardware_concurrency()
            .map(|c| c.get())
            .ok_or(WasiThreadError::Unsupported)
    }
}

#[cfg(test)]
mod tests {
    use tokio::sync::oneshot;

    use super::*;

    #[wasm_bindgen_test::wasm_bindgen_test]
    async fn spawned_tasks_can_communicate_with_the_main_thread() {
        let pool = ThreadPool::new(2.try_into().unwrap());
        let task_manager = TaskManager::new(pool);
        let (sender, receiver) = oneshot::channel();

        task_manager
            .task_shared(Box::new(move || {
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
