use std::{fmt::Debug, future::Future, pin::Pin, time::Duration};

use js_sys::Promise;

use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use wasmer_wasix::{runtime::task_manager::TaskWasm, VirtualTaskManager, WasiThreadError};
use web_sys::{Window, WorkerGlobalScope};

use crate::task_manager::ThreadPool;

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
        self.pool.spawn_shared(Box::new(move || {
            Box::pin(async move {
                let time = if time.as_millis() < i32::MAX as u128 {
                    time.as_millis() as i32
                } else {
                    i32::MAX
                };
                let promise = bindgen_sleep(time);
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
            .spawn_shared(Box::new(move || Box::pin(async move { task().await })));
        Ok(())
    }

    /// Starts an asynchronous task will will run on a dedicated thread
    /// pulled from the worker pool that has a stateful thread local variable
    /// It is ok for this task to block execution and any async futures within its scope
    fn task_wasm(&self, task: TaskWasm) -> Result<(), WasiThreadError> {
        self.pool.spawn_wasm(task)?;
        Ok(())
    }

    /// Starts an asynchronous task will will run on a dedicated thread
    /// pulled from the worker pool. It is ok for this task to block execution
    /// and any async futures within its scope
    fn task_dedicated(
        &self,
        task: Box<dyn FnOnce() + Send + 'static>,
    ) -> Result<(), WasiThreadError> {
        self.pool.spawn_dedicated(task);
        Ok(())
    }
    /// Returns the amount of parallelism that is possible on this platform
    fn thread_parallelism(&self) -> Result<usize, WasiThreadError> {
        Ok(8)
    }
}

pub(crate) fn bindgen_sleep(milliseconds: i32) -> Promise {
    Promise::new(&mut |resolve, reject| {
        let global_scope = js_sys::global();

        if let Some(window) = global_scope.dyn_ref::<Window>() {
            window
                .set_timeout_with_callback_and_timeout_and_arguments_0(&resolve, milliseconds)
                .unwrap();
        } else if let Some(worker_global_scope) = global_scope.dyn_ref::<WorkerGlobalScope>() {
            worker_global_scope
                .set_timeout_with_callback_and_timeout_and_arguments_0(&resolve, milliseconds)
                .unwrap();
        } else {
            let error = js_sys::Error::new("Unable to call setTimeout()");
            reject.call1(&reject, &error).unwrap();
        }
    })
}

#[cfg(test)]
mod tests {
    use tokio::sync::oneshot;

    use super::*;

    #[wasm_bindgen_test::wasm_bindgen_test]
    async fn spawned_tasks_can_communicate_with_the_main_thread() {
        let pool = ThreadPool::new(2);
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
