//! A quick'n'dirty JS-friendly actor framework, inspired by Actix.
//!
//! ## Deadlocks
//!
//! Most [`FileSystem`] methods are synchronous, whereas all
//! [`FileSystemDirectoryHandle`] operations are asynchronous. To implement a
//! synchronous API on top of an inherently asynchronous mechanism, we use
//! [`InlineWaker`] to block in-place until a future is resolved.
//!
//! When a blocking method is invoked from the same thread that called
//! [`spawn()`], we open ourselves up to a chicken-and-egg scenario where the
//! synchronous operation can't return until the future resolves, but in order
//! for the future to resolve we have to yield to the JavaScript event loop so
//! the asynchronous operations get a chance to make progress.
//!
//! This causes a deadlock.
//!
//! In the spirit of [Pre-Pooping Your Pants][poop], we use
//! [`wasmer::current_thread_id()`] to detect these scenarios and crash instead.
//!
//! [poop]: https://cglab.ca/~abeinges/blah/everyone-poops/

use futures::{channel::mpsc, future::LocalBoxFuture, SinkExt, StreamExt};
use tokio::sync::oneshot;
use tracing::Instrument;
use virtual_fs::FsError;
use wasmer_wasix::runtime::task_manager::InlineWaker;

#[async_trait::async_trait(?Send)]
pub(crate) trait Handler<Msg> {
    type Output: Send + 'static;

    async fn handle(&mut self, msg: Msg) -> Result<Self::Output, FsError>;
}

type Thunk<A> = Box<dyn FnOnce(&mut A) -> LocalBoxFuture<'_, ()> + Send>;

#[derive(Debug, Clone)]
pub(crate) struct Mailbox<A> {
    original_thread: u32,
    sender: mpsc::Sender<Thunk<A>>,
}

impl<A> Mailbox<A> {
    /// Spawn an actor on the current thread.
    pub(crate) fn spawn(mut actor: A) -> Self
    where
        A: 'static,
    {
        let (sender, mut receiver) = mpsc::channel::<Thunk<A>>(1);
        let original_thread = wasmer::current_thread_id();

        wasm_bindgen_futures::spawn_local(
            async move {
                while let Some(thunk) = receiver.next().await {
                    thunk(&mut actor).await;
                }
            }
            .in_current_span(),
        );

        Mailbox {
            original_thread,
            sender,
        }
    }

    /// Asynchronously send a message to the actor.
    pub(crate) async fn send<M>(&self, msg: M) -> Result<<A as Handler<M>>::Output, FsError>
    where
        A: Handler<M>,
        M: Send + 'static,
    {
        let (ret_sender, ret_receiver) = oneshot::channel();

        let thunk: Thunk<A> = Box::new(move |actor: &mut A| {
            Box::pin(async move {
                let result = actor.handle(msg).await;

                if ret_sender.send(result).is_err() {
                    tracing::warn!(
                        message_type = std::any::type_name::<M>(),
                        "Unable to send the result back",
                    );
                }
            })
        });

        // Note: This isn't technically necessary, but it means our methods can
        // take &self rather than forcing higher layers to add unnecessary
        // synchronisation.
        let mut sender = self.sender.clone();

        if let Err(e) = sender.send(thunk).await {
            tracing::warn!(
                error = &e as &dyn std::error::Error,
                message_type = std::any::type_name::<M>(),
                actor_type = std::any::type_name::<A>(),
                "Message sending failed",
            );
            return Err(FsError::UnknownError);
        }

        match ret_receiver.await {
            Ok(result) => result,
            Err(e) => {
                tracing::warn!(
                    error = &e as &dyn std::error::Error,
                    message_type = std::any::type_name::<M>(),
                    actor_type = std::any::type_name::<A>(),
                    "Unable to receive the result",
                );
                Err(FsError::UnknownError)
            }
        }
    }

    /// Send a message to the actor and synchronously block until a response
    /// is received.
    ///
    /// # Deadlocks
    ///
    /// To avoid deadlocks, this will error out with [`FsError::Lock`] if called
    /// from the thread that the actor was spawned on.
    pub(crate) fn handle<M>(&self, msg: M) -> Result<<A as Handler<M>>::Output, FsError>
    where
        A: Handler<M>,
        M: Send + 'static,
    {
        // Note: See the module doc-comments for more context on deadlocks
        let current_thread = wasmer::current_thread_id();
        if self.original_thread == current_thread {
            tracing::error!(
                thread.id=current_thread,
                caller=%std::panic::Location::caller(),
                "Running a synchronous FileSystem operation on this thread will result in a deadlock"
            );
            return Err(FsError::Lock);
        }

        InlineWaker::block_on(self.send(msg))
    }
}
