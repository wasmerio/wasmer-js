use anyhow::Error;
use tokio::sync::mpsc::UnboundedSender;

use crate::tasks::SchedulerMessage;

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
            // We are in a child worker and need to go through postMessage()
            todo!();
        }
    }
}

// Safety: The only way the channel can be used is if we are on the same
unsafe impl Send for SchedulerChannel {}
unsafe impl Sync for SchedulerChannel {}
