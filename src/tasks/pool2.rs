use std::{collections::VecDeque, fmt::Debug, num::NonZeroUsize, pin::Pin};

use anyhow::{Context, Error};
use futures::{future::LocalBoxFuture, Future};
use tokio::sync::mpsc::{self, UnboundedSender};
use wasmer_wasix::{runtime::task_manager::TaskWasm, WasiThreadError};

use crate::tasks::worker_handle::WorkerHandle;

/// A handle to a threadpool backed by Web Workers.
#[derive(Debug, Clone)]
pub struct ThreadPool {
    sender: UnboundedSender<Message>,
}

impl ThreadPool {
    pub fn new(capacity: NonZeroUsize) -> Self {
        let sender = Scheduler::spawn(capacity);
        ThreadPool { sender }
    }

    pub fn new_with_max_threads() -> Result<ThreadPool, anyhow::Error> {
        let concurrency = crate::utils::hardware_concurrency()
            .context("Unable to determine the hardware concurrency")?;
        Ok(ThreadPool::new(concurrency))
    }

    /// Run an `async` function to completion on the threadpool.
    pub fn spawn(
        &self,
        task: Box<dyn FnOnce() -> LocalBoxFuture<'static, ()> + Send>,
    ) -> Result<(), WasiThreadError> {
        self.sender
            .send(Message::SpawnAsync(task))
            .expect("scheduler is dead");

        Ok(())
    }

    pub fn spawn_wasm(&self, _task: TaskWasm) -> Result<(), WasiThreadError> {
        todo!();
    }

    /// Run a blocking task on the threadpool.
    pub fn spawn_blocking(&self, task: Box<dyn FnOnce() + Send>) -> Result<(), WasiThreadError> {
        self.sender
            .send(Message::SpawnBlocking(task))
            .expect("scheduler is dead");

        Ok(())
    }
}

/// Messages sent from the [`ThreadPool`] handle to the [`Scheduler`].
pub(crate) enum Message {
    /// Run a promise on a worker thread.
    SpawnAsync(Box<dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>> + Send + 'static>),
    /// Run a blocking operation on a worker thread.
    SpawnBlocking(Box<dyn FnOnce() + Send + 'static>),
    /// Mark a worker as busy.
    MarkBusy { worker_id: usize },
    /// Mark a worker as idle.
    MarkIdle { worker_id: usize },
}

impl Debug for Message {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        struct Hidden;

        impl Debug for Hidden {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                f.write_str("_")
            }
        }

        match self {
            Message::SpawnAsync(_) => f.debug_tuple("SpawnAsync").field(&Hidden).finish(),
            Message::SpawnBlocking(_) => f.debug_tuple("SpawnBlocking").field(&Hidden).finish(),
            Message::MarkBusy { worker_id } => f
                .debug_struct("MarkBusy")
                .field("worker_id", worker_id)
                .finish(),
            Message::MarkIdle { worker_id } => f
                .debug_struct("MarkIdle")
                .field("worker_id", worker_id)
                .finish(),
        }
    }
}

/// The actor in charge of the threadpool.
#[derive(Debug)]
struct Scheduler {
    /// The ID of the next worker to be spawned.
    next_id: usize,
    /// The maximum number of workers we will start.
    capacity: NonZeroUsize,
    /// Workers that are able to receive work.
    idle: VecDeque<WorkerHandle>,
    /// Workers that are currently blocked on synchronous operations and can't
    /// receive work at this time.
    busy: VecDeque<WorkerHandle>,
    /// An [`UnboundedSender`] used to send the [`Scheduler`] more messages.
    mailbox: UnboundedSender<Message>,
}

impl Scheduler {
    /// Spin up a scheduler on the current thread and get a channel that can be
    /// used to communicate with it.
    fn spawn(capacity: NonZeroUsize) -> UnboundedSender<Message> {
        let (sender, mut receiver) = mpsc::unbounded_channel();
        let mut scheduler = Scheduler::new(capacity, sender.clone());

        wasm_bindgen_futures::spawn_local(async move {
            let _span = tracing::debug_span!("scheduler").entered();

            while let Some(message) = receiver.recv().await {
                if let Err(e) = scheduler.execute(message) {
                    tracing::warn!(error = &*e, "An error occurred while handling a message");
                }
            }
        });

        sender
    }

    fn new(capacity: NonZeroUsize, mailbox: UnboundedSender<Message>) -> Self {
        Scheduler {
            next_id: 0,
            capacity,
            idle: VecDeque::new(),
            busy: VecDeque::new(),
            mailbox,
        }
    }

    fn execute(&mut self, message: Message) -> Result<(), Error> {
        match message {
            Message::SpawnAsync(task) => self.post_message(PostMessagePayload::SpawnAsync(task)),
            Message::SpawnBlocking(task) => {
                self.post_message(PostMessagePayload::SpawnBlocking(task))
            }
            Message::MarkBusy { worker_id } => {
                move_worker(worker_id, &mut self.idle, &mut self.busy)
            }
            Message::MarkIdle { worker_id } => {
                move_worker(worker_id, &mut self.busy, &mut self.idle)
            }
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
        let id = self.next_id;
        self.next_id += 1;
        WorkerHandle::spawn(id, self.mailbox.clone())
    }
}

fn move_worker(
    worker_id: usize,
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

/// A message that will be sent to a worker using `postMessage()`.
pub(crate) enum PostMessagePayload {
    SpawnAsync(Box<dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>> + Send + 'static>),
    SpawnBlocking(Box<dyn FnOnce() + Send + 'static>),
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
        let message = Message::SpawnAsync(Box::new(move || {
            Box::pin(async move {
                let _ = sender.send(42);
            })
        }));

        // we start off with no workers
        assert_eq!(scheduler.idle.len(), 0);
        assert_eq!(scheduler.busy.len(), 0);
        assert_eq!(scheduler.next_id, 0);

        // then we run the message, which should start up a worker and send it
        // the job
        scheduler.execute(message).unwrap();

        // One worker should have been created and added to the "ready" queue
        // because it's just handling async workloads.
        assert_eq!(scheduler.idle.len(), 1);
        assert_eq!(scheduler.busy.len(), 0);
        assert_eq!(scheduler.next_id, 1);

        // Make sure the background thread actually ran something and sent us
        // back a result
        assert_eq!(receiver.await.unwrap(), 42);
    }
}
