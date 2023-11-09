//! A [`FileSystem`] implementation backed by the browser's
//! [`FileSystemDirectoryHandle`].
//!
//! Similar to the [`crate::tasks`] module, this provides multi-threaded access
//! to single-threaded JavaScript objects by encapsulating them in actors that
//! run in the original JavaScript context, then invoking methods by sending
//! messages back and forth.
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

use std::path::{Path, PathBuf};

use tokio::sync::{mpsc, oneshot};
use tracing::Instrument;
use virtual_fs::{FileOpener, FileSystem, FsError, OpenOptionsConfig, VirtualFile};
use wasmer_wasix::runtime::task_manager::InlineWaker;
use web_sys::FileSystemDirectoryHandle;

#[tracing::instrument(level = "debug", skip_all)]
pub(crate) fn spawn(handle: FileSystemDirectoryHandle) -> impl FileSystem + 'static {
    let (sender, receiver) = mpsc::channel(1);
    let original_thread = wasmer::current_thread_id();

    let handler = MessageHandler(handle);
    wasm_bindgen_futures::spawn_local(async move { handler.run(receiver).await }.in_current_span());

    DirectoryProxy {
        sender,
        original_thread,
    }
}

#[derive(Debug)]
struct MessageHandler(FileSystemDirectoryHandle);

impl MessageHandler {
    #[tracing::instrument(level = "debug")]
    async fn run(self, mut receiver: mpsc::Receiver<DirectoryMessage>) {
        while let Some(msg) = receiver.recv().await {
            if let Err(e) = self.handle_msg(msg).await {
                tracing::warn!(error = &*e, "An error occurred while handling a message",);
            }
        }
    }

    #[allow(unused)]
    async fn handle_msg(&self, msg: DirectoryMessage) -> Result<(), anyhow::Error> {
        match msg {
            DirectoryMessage::ReadDir { path, sender } => todo!(),
            DirectoryMessage::CreateDir { path, sender } => todo!(),
            DirectoryMessage::RemoveDir { path, sender } => todo!(),
            DirectoryMessage::Rename { from, to, sender } => todo!(),
            DirectoryMessage::Metadata { path, sender } => todo!(),
            DirectoryMessage::RemoveFile { path, sender } => todo!(),
            DirectoryMessage::Open { path, conf, sender } => todo!(),
        }

        Ok(())
    }
}

/// A [`FileSystem`] implementation which works by proxying messages to a
/// [`FileSystemDirectoryHandle`] running on the original JS thread.
///
/// # Deadlocks
///
/// Calling any [`FileSystem`] methods from the same thread that called
/// [`spawn()`] will trigger a deadlock.
///
/// This happens because
/// This is because communicating with the
/// original [`FileSystemDirectoryHandle`] is an inherently asynchronous
/// operation
#[derive(Debug)]
struct DirectoryProxy {
    sender: mpsc::Sender<DirectoryMessage>,
    original_thread: u32,
}

impl DirectoryProxy {
    fn send<F, Ret>(&self, create_message: F) -> virtual_fs::Result<Ret>
    where
        F: FnOnce(oneshot::Sender<virtual_fs::Result<Ret>>) -> DirectoryMessage,
        Ret: Send + 'static,
    {
        // Note: See the module doc-comments for more context on deadlocks
        let current_thread = wasmer::current_thread_id();
        if self.original_thread == current_thread {
            tracing::error!(
                thread.id=current_thread ,
                "Running a synchronous FileSystem operation on this thread will result in a deadlock"
            );
            return Err(FsError::WouldBlock);
        }

        InlineWaker::block_on(self.do_send(create_message))?
    }

    fn do_send<F, Ret>(
        &self,
        create_message: F,
    ) -> impl std::future::Future<Output = virtual_fs::Result<Ret>> + 'static
    where
        F: FnOnce(oneshot::Sender<Ret>) -> DirectoryMessage,
        Ret: Send + 'static,
    {
        let sender = self.sender.clone();
        let (ret_sender, ret_receiver) = oneshot::channel();
        let msg = create_message(ret_sender);

        async move {
            if let Err(e) = sender.send(msg).await {
                tracing::warn!(
                    error = &e as &dyn std::error::Error,
                    "Message sending failed",
                );
                return Err(FsError::UnknownError);
            }

            match ret_receiver.await {
                Ok(result) => Ok(result),
                Err(e) => {
                    tracing::warn!(
                        error = &e as &dyn std::error::Error,
                        "Unable to receive the result",
                    );
                    Err(FsError::UnknownError)
                }
            }
        }
    }
}

impl FileSystem for DirectoryProxy {
    fn read_dir(&self, path: &Path) -> virtual_fs::Result<virtual_fs::ReadDir> {
        let path = path.to_path_buf();
        self.send(|sender| DirectoryMessage::ReadDir { path, sender })
    }

    fn create_dir(&self, path: &Path) -> virtual_fs::Result<()> {
        let path = path.to_path_buf();
        self.send(|sender| DirectoryMessage::CreateDir { path, sender })
    }

    fn remove_dir(&self, path: &Path) -> virtual_fs::Result<()> {
        let path = path.to_path_buf();
        self.send(|sender| DirectoryMessage::RemoveDir { path, sender })
    }

    fn rename<'a>(
        &'a self,
        from: &'a Path,
        to: &'a Path,
    ) -> futures::future::BoxFuture<'a, virtual_fs::Result<()>> {
        let from = from.to_path_buf();
        let to = to.to_path_buf();
        let fut = self.do_send(|sender| DirectoryMessage::Rename { from, to, sender });

        Box::pin(async move { fut.await? })
    }

    fn metadata(&self, path: &Path) -> virtual_fs::Result<virtual_fs::Metadata> {
        let path = path.to_path_buf();
        self.send(|sender| DirectoryMessage::Metadata { path, sender })
    }

    fn remove_file(&self, path: &Path) -> virtual_fs::Result<()> {
        let path = path.to_path_buf();
        self.send(|sender| DirectoryMessage::RemoveFile { path, sender })
    }

    fn new_open_options(&self) -> virtual_fs::OpenOptions<'_> {
        virtual_fs::OpenOptions::new(self)
    }
}

impl FileOpener for DirectoryProxy {
    fn open(
        &self,
        path: &Path,
        conf: &OpenOptionsConfig,
    ) -> virtual_fs::Result<Box<dyn VirtualFile + Send + Sync + 'static>> {
        let path = path.to_path_buf();
        let conf = conf.clone();

        self.send(|sender| DirectoryMessage::Open { path, conf, sender })
    }
}

#[derive(Debug)]
enum DirectoryMessage {
    ReadDir {
        path: PathBuf,
        sender: oneshot::Sender<virtual_fs::Result<virtual_fs::ReadDir>>,
    },
    CreateDir {
        path: PathBuf,
        sender: oneshot::Sender<virtual_fs::Result<()>>,
    },
    RemoveDir {
        path: PathBuf,
        sender: oneshot::Sender<virtual_fs::Result<()>>,
    },
    Rename {
        from: PathBuf,
        to: PathBuf,
        sender: oneshot::Sender<virtual_fs::Result<()>>,
    },
    Metadata {
        path: PathBuf,
        sender: oneshot::Sender<virtual_fs::Result<virtual_fs::Metadata>>,
    },
    RemoveFile {
        path: PathBuf,
        sender: oneshot::Sender<virtual_fs::Result<()>>,
    },
    Open {
        path: PathBuf,
        conf: OpenOptionsConfig,
        sender: oneshot::Sender<virtual_fs::Result<Box<dyn VirtualFile + Send + Sync + 'static>>>,
    },
}

#[cfg(test)]
mod tests {
    use std::{fmt::Debug, num::NonZeroUsize};

    use wasm_bindgen::JsCast;
    use wasm_bindgen_futures::JsFuture;
    use wasm_bindgen_test::wasm_bindgen_test;
    use wasmer_wasix::VirtualTaskManager;

    use super::*;

    #[wasm_bindgen_test]
    async fn detect_deadlocks() {
        let storage = web_sys::window().unwrap().navigator().storage();
        let handle: FileSystemDirectoryHandle = JsFuture::from(storage.get_directory())
            .await
            .unwrap()
            .dyn_into()
            .unwrap();
        let fs = spawn(handle);

        let err = fs.read_dir("/".as_ref()).unwrap_err();

        assert_eq!(err, FsError::WouldBlock);
    }

    /// Create a [`FileSystem`] from a [`FileSystemDirectoryHandle`] and
    /// interact with it in a way that won't create deadlocks.
    async fn use_fs<F, Ret>(handle: FileSystemDirectoryHandle, op: F) -> Ret
    where
        F: FnOnce(&(dyn FileSystem + 'static)) -> Ret + Send + 'static,
        Ret: Debug + Send + 'static,
    {
        let fs = spawn(handle);
        let thread_pool = crate::tasks::ThreadPool::new(NonZeroUsize::new(2).unwrap());
        let (sender, receiver) = oneshot::channel();

        thread_pool
            .task_dedicated(Box::new(move || {
                sender.send(op(&fs)).unwrap();
            }))
            .unwrap();

        receiver.await.unwrap()
    }

    /// Create a [`FileSystem`] from a [`FileSystemDirectoryHandle`] and
    /// interact with it in a way that won't create deadlocks.
    async fn use_fs_async<F, Fut, Ret>(handle: FileSystemDirectoryHandle, op: F) -> Ret
    where
        F: FnOnce(&(dyn FileSystem + 'static)) -> Fut + Send + 'static,
        Fut: std::future::Future<Output = Ret> + Send + 'static,
        Ret: Debug + Send + 'static,
    {
        let fs = spawn(handle);
        let thread_pool = crate::tasks::ThreadPool::new(NonZeroUsize::new(2).unwrap());
        let (sender, receiver) = oneshot::channel();

        thread_pool
            .task_shared(Box::new(move || {
                Box::pin(async move {
                    let ret = op(&fs).await;
                    sender.send(ret).unwrap();
                })
            }))
            .unwrap();

        receiver.await.unwrap()
    }

    #[wasm_bindgen_test]
    async fn use_opfs() {
        let storage = web_sys::window().unwrap().navigator().storage();
        let handle: FileSystemDirectoryHandle = JsFuture::from(storage.get_directory())
            .await
            .unwrap()
            .dyn_into()
            .unwrap();

        let read_dir = use_fs(handle, |fs| fs.read_dir("/".as_ref())).await;
        let entries: Vec<_> = read_dir.unwrap().map(|e| e.unwrap().path()).collect();

        assert!(entries.is_empty());
    }

    #[wasm_bindgen_test]
    #[ignore = "TODO"]
    async fn create_dir() {
        let storage = web_sys::window().unwrap().navigator().storage();
        let handle: FileSystemDirectoryHandle = JsFuture::from(storage.get_directory())
            .await
            .unwrap()
            .dyn_into()
            .unwrap();

        let entries: Vec<_> = use_fs(handle, |fs| {
            fs.create_dir("/tmp".as_ref()).unwrap();
            fs.read_dir("/".as_ref())
                .unwrap()
                .map(|e| e.unwrap().path().display().to_string())
                .collect()
        })
        .await;

        assert_eq!(entries, ["/tmp".to_string()]);
    }
}
