//! A thread pool implementation backed by web workers.
//!
//! # Design
//!
//! The thread pool implementation is based on the actor model, where the
//! various components will send messages to each other.
//!
//! The main components:
//! - [`Scheduler`] - the core logic for communicating with workers and
//!   scheduling work
//! - [`ThreadPool`] - a cheaply copyable implementation of
//!   [`wasmer_wasix::runtime::task_manager::VirtualTaskManager`] that works by
//!   sending messages to the [`Scheduler`]
//! - [`WorkerHandle`] - a `!Send` handle used by the [`Scheduler`] to manage
//!   a worker's lifecycle and communicate back and forth with it
//! - [`worker::WorkerState`] - a worker's internal state
//!
//! Communicating with workers is a bit tricky because of their asynchronous
//! nature and the requirement to use `postMessage()` when transferring certain
//! JavaScript objects between workers and the main thread.

mod scheduler;
mod thread_pool;
mod worker;
mod worker_handle;

pub(crate) use self::{
    scheduler::{Scheduler, SchedulerMessage},
    thread_pool::ThreadPool,
    worker::WorkerMessage,
    worker_handle::{PostMessagePayload, WorkerHandle},
};
