use anyhow::Error;
use tokio::sync::mpsc::UnboundedSender;

use crate::tasks::{SchedulerMessage, WorkerMessage};

/// A fancy [`UnboundedSender`] which sends messages to the scheduler.
///
/// # Implementation Details
///
///
#[derive(Debug, Clone)]
pub(crate) struct SchedulerChannel {
    scheduler_thread_id: u32,
    channel: UnboundedSender<SchedulerMessage>,
}

impl SchedulerChannel {
    /// # Safety
    ///
    /// The [`SchedulerMessage`] type is marked as `!Send` because
    /// [`wasmer::Module`] and friends are `!Send` when compiled for the
    /// browser.
    ///
    /// The `scheduler_thread_id` must match the [`wasmer::current_thread_id()`]
    /// otherwise these `!Send` values will be sent between threads.
    ///
    pub(crate) unsafe fn new(
        channel: UnboundedSender<SchedulerMessage>,
        scheduler_thread_id: u32,
    ) -> Self {
        SchedulerChannel {
            channel,
            scheduler_thread_id,
        }
    }

    pub fn send(&self, msg: SchedulerMessage) -> Result<(), Error> {
        if wasmer::current_thread_id() == self.scheduler_thread_id {
            // It's safe to send the message to the scheduler.
            self.channel
                .send(msg)
                .map_err(|_| Error::msg("Scheduler is dead"))?;
            Ok(())
        } else {
            // We are in a child worker so we need to emit the message via
            // postMessage() and let the WorkerHandle forward it to the
            // scheduler.
            WorkerMessage::Scheduler(msg)
                .emit()
                .map_err(|e| e.into_anyhow())?;
            Ok(())
        }
    }
}

// Safety: The only way our !Send messages will be sent to the scheduler is if
// they are on the same thread.
unsafe impl Send for SchedulerChannel {}
unsafe impl Sync for SchedulerChannel {}
