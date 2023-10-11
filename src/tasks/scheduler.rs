use std::{
    collections::{BTreeMap, VecDeque},
    fmt::Debug,
    future::Future,
    num::NonZeroUsize,
    pin::Pin,
    sync::atomic::{AtomicU64, Ordering},
};

use anyhow::{Context, Error};
use tokio::sync::mpsc::{self, UnboundedSender};
use tracing::Instrument;
use wasm_bindgen::{JsCast, JsValue};
use wasmer::AsJs;
use wasmer_wasix::runtime::resolver::WebcHash;

use crate::{
    tasks::{PostMessagePayload, WorkerHandle, WorkerMessage},
    utils::Hidden,
};

/// The actor in charge of the threadpool.
#[derive(Debug)]
pub(crate) struct Scheduler {
    /// The maximum number of workers we will start.
    capacity: NonZeroUsize,
    /// Workers that are able to receive work.
    idle: VecDeque<WorkerHandle>,
    /// Workers that are currently blocked on synchronous operations and can't
    /// receive work at this time.
    busy: VecDeque<WorkerHandle>,
    /// An [`UnboundedSender`] used to send the [`Scheduler`] more messages.
    mailbox: UnboundedSender<SchedulerMessage>,
    cached_modules: BTreeMap<WebcHash, js_sys::WebAssembly::Module>,
}

impl Scheduler {
    /// Spin up a scheduler on the current thread and get a channel that can be
    /// used to communicate with it.
    pub(crate) fn spawn(capacity: NonZeroUsize) -> UnboundedSender<SchedulerMessage> {
        let (sender, mut receiver) = mpsc::unbounded_channel();
        let mut scheduler = Scheduler::new(capacity, sender.clone());

        wasm_bindgen_futures::spawn_local(
            async move {
                let _span = tracing::debug_span!("scheduler").entered();

                while let Some(msg) = receiver.recv().await {
                    tracing::warn!(?msg, "XXX Executing a message");
                    tracing::trace!(?msg, "Executing a message");

                    if let Err(e) = scheduler.execute(msg) {
                        tracing::warn!(error = &*e, "An error occurred while handling a message");
                    }
                }

                tracing::debug!("Shutting down the scheduler");
                drop(scheduler);
            }
            .in_current_span(),
        );

        sender
    }

    fn new(capacity: NonZeroUsize, mailbox: UnboundedSender<SchedulerMessage>) -> Self {
        Scheduler {
            capacity,
            idle: VecDeque::new(),
            busy: VecDeque::new(),
            mailbox,
            cached_modules: BTreeMap::new(),
        }
    }

    fn execute(&mut self, message: SchedulerMessage) -> Result<(), Error> {
        match message {
            SchedulerMessage::SpawnAsync(task) => {
                self.post_message(PostMessagePayload::SpawnAsync(task))
            }
            SchedulerMessage::SpawnBlocking(task) => {
                self.post_message(PostMessagePayload::SpawnBlocking(task))
            }
            SchedulerMessage::CacheModule { hash, module } => {
                let module: js_sys::WebAssembly::Module = JsValue::from(module).unchecked_into();
                self.cached_modules.insert(hash, module.clone());

                for worker in self.idle.iter().chain(self.busy.iter()) {
                    worker.send(PostMessagePayload::CacheModule {
                        hash,
                        module: module.clone(),
                    })?;
                }

                Ok(())
            }
            SchedulerMessage::SpawnWithModule { module, task } => {
                self.post_message(PostMessagePayload::SpawnWithModule {
                    module: JsValue::from(module).unchecked_into(),
                    task,
                })
            }
            SchedulerMessage::SpawnWithModuleAndMemory {
                module,
                memory,
                task,
            } => {
                let temp_store = wasmer::Store::default();
                let memory = memory.map(|m| m.as_jsvalue(&temp_store).unchecked_into());

                self.post_message(PostMessagePayload::SpawnWithModuleAndMemory {
                    module: JsValue::from(module).unchecked_into(),
                    memory,
                    task,
                })
            }
            SchedulerMessage::Worker {
                worker_id,
                msg: WorkerMessage::MarkBusy,
            } => move_worker(worker_id, &mut self.idle, &mut self.busy),
            SchedulerMessage::Worker {
                worker_id,
                msg: WorkerMessage::MarkIdle,
            } => move_worker(worker_id, &mut self.busy, &mut self.idle),
        }
    }

    /// Send a task to one of the worker threads, preferring workers that aren't
    /// running synchronous work.
    fn post_message(&mut self, msg: PostMessagePayload) -> Result<(), Error> {
        // First, try to send the message to an idle worker
        if let Some(worker) = self.idle.pop_front() {
            tracing::trace!(
                worker.id = worker.id(),
                "Sending the message to an idle worker"
            );

            // send the job to the worker and move it to the back of the queue
            worker.send(msg)?;
            self.idle.push_back(worker);

            return Ok(());
        }

        if self.busy.len() + self.idle.len() < self.capacity.get() {
            // Rather than sending the task to one of the blocking workers,
            // let's spawn a new worker

            let worker = self.start_worker()?;
            tracing::trace!(
                worker.id = worker.id(),
                "Sending the message to a new worker"
            );

            worker.send(msg)?;

            // Make sure the worker starts off in the idle queue
            self.idle.push_back(worker);

            return Ok(());
        }

        // Oh well, looks like there aren't any more idle workers and we can't
        // spin up any new workers, so we'll need to add load to a worker that
        // is already blocking.
        //
        // Note: This shouldn't panic because if there were no idle workers and
        // we didn't start a new worker, there should always be at least one
        // busy worker because our capacity is non-zero.
        let worker = self.busy.pop_front().unwrap();

        tracing::trace!(
            worker.id = worker.id(),
            "Sending the message to a busy worker"
        );

        // send the job to the worker
        worker.send(msg)?;

        // Put the worker back in the queue
        self.busy.push_back(worker);

        Ok(())
    }

    fn start_worker(&mut self) -> Result<WorkerHandle, Error> {
        // Note: By using a monotonically incrementing counter, we can make sure
        // every single worker created with this shared linear memory will get a
        // unique ID.
        static NEXT_ID: AtomicU64 = AtomicU64::new(0);

        let id = NEXT_ID.fetch_add(1, Ordering::Relaxed);

        let handle = WorkerHandle::spawn(id, self.mailbox.clone())?;

        // Prime the worker's module cache
        for (&hash, module) in &self.cached_modules {
            let msg = PostMessagePayload::CacheModule {
                hash,
                module: module.clone(),
            };
            handle.send(msg)?;
        }

        Ok(handle)
    }
}

fn move_worker(
    worker_id: u64,
    from: &mut VecDeque<WorkerHandle>,
    to: &mut VecDeque<WorkerHandle>,
) -> Result<(), Error> {
    let ix = from
        .iter()
        .position(|w| w.id() == worker_id)
        .with_context(|| format!("Unable to move worker #{worker_id}"))?;

    let worker = from.remove(ix).unwrap();
    to.push_back(worker);

    Ok(())
}

/// Messages sent from the [`crate::tasks::ThreadPool`] handle to the [`Scheduler`].
pub(crate) enum SchedulerMessage {
    /// Run a promise on a worker thread.
    SpawnAsync(Box<dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>> + Send + 'static>),
    /// Run a blocking operation on a worker thread.
    SpawnBlocking(Box<dyn FnOnce() + Send + 'static>),
    /// A message sent from a worker thread.
    Worker {
        /// The worker ID.
        worker_id: u64,
        /// The message.
        msg: WorkerMessage,
    },
    /// Tell all workers to cache a WebAssembly module.
    #[allow(dead_code)]
    CacheModule {
        hash: WebcHash,
        module: wasmer::Module,
    },
    /// Run a task in the background, explicitly transferring the
    /// [`js_sys::WebAssembly::Module`] to the worker.
    SpawnWithModule {
        module: wasmer::Module,
        task: Box<dyn FnOnce(wasmer::Module) + Send + 'static>,
    },
    /// Run a task in the background, explicitly transferring the
    /// [`js_sys::WebAssembly::Module`] to the worker.
    SpawnWithModuleAndMemory {
        module: wasmer::Module,
        memory: Option<wasmer::Memory>,
        task: Box<dyn FnOnce(wasmer::Module, wasmer::Memory) + Send + 'static>,
    },
}

impl Debug for SchedulerMessage {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SchedulerMessage::SpawnAsync(_) => f.debug_tuple("SpawnAsync").field(&Hidden).finish(),
            SchedulerMessage::SpawnBlocking(_) => {
                f.debug_tuple("SpawnBlocking").field(&Hidden).finish()
            }
            SchedulerMessage::Worker { worker_id: id, msg } => f
                .debug_struct("Worker")
                .field("worker_id", id)
                .field("msg", msg)
                .finish(),
            SchedulerMessage::CacheModule { hash, module } => f
                .debug_struct("CacheModule")
                .field("hash", hash)
                .field("module", module)
                .finish(),
            SchedulerMessage::SpawnWithModule { module, task: _ } => f
                .debug_struct("SpawnWithModule")
                .field("module", module)
                .field("task", &Hidden)
                .finish(),
            SchedulerMessage::SpawnWithModuleAndMemory {
                module,
                memory,
                task: _,
            } => f
                .debug_struct("SpawnWithModule")
                .field("module", module)
                .field("memory", memory)
                .field("task", &Hidden)
                .finish(),
        }
    }
}

#[cfg(test)]
mod tests {
    use tokio::sync::oneshot;
    use wasm_bindgen_test::wasm_bindgen_test;

    use super::*;

    #[wasm_bindgen_test]
    async fn spawn_an_async_function() {
        let (sender, receiver) = oneshot::channel();
        let (tx, _) = mpsc::unbounded_channel();
        let mut scheduler = Scheduler::new(NonZeroUsize::MAX, tx);
        let message = SchedulerMessage::SpawnAsync(Box::new(move || {
            Box::pin(async move {
                let _ = sender.send(42);
            })
        }));

        // we start off with no workers
        assert_eq!(scheduler.idle.len(), 0);
        assert_eq!(scheduler.busy.len(), 0);

        // then we run the message, which should start up a worker and send it
        // the job
        scheduler.execute(message).unwrap();

        // One worker should have been created and added to the "ready" queue
        // because it's just handling async workloads.
        assert_eq!(scheduler.idle.len(), 1);
        assert_eq!(scheduler.busy.len(), 0);

        // Make sure the background thread actually ran something and sent us
        // back a result
        assert_eq!(receiver.await.unwrap(), 42);
    }
}
