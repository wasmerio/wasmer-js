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

mod interop;
mod scheduler;
mod scheduler_channel;
mod task_wasm;
mod thread_pool;
mod worker;
mod worker_handle;

pub(crate) use self::{
    scheduler::{Scheduler, SchedulerMessage},
    scheduler_channel::SchedulerChannel,
    thread_pool::ThreadPool,
    worker::WorkerMessage,
    worker_handle::{PostMessagePayload, WorkerHandle},
};

use std::{future::Future, pin::Pin};

type AsyncTask = Box<dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>> + Send + 'static>;
type BlockingTask = Box<dyn FnOnce() + Send + 'static>;
type BlockingModuleTask = Box<dyn FnOnce(wasmer::Module) + Send + 'static>;
