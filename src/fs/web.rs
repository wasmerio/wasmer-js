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

use async_trait::async_trait;
use futures::{SinkExt, TryStream, TryStreamExt};
use js_sys::{JsString, Reflect};
use virtual_fs::{
    DirEntry, FileOpener, FileSystem, FileType, FsError, OpenOptionsConfig, ReadDir, VirtualFile,
};
use wasm_bindgen::{JsCast, JsValue};
use web_sys::{DomException, FileSystemDirectoryHandle, FileSystemGetDirectoryOptions};

use crate::fs::actors::{Handler, Mailbox};

#[tracing::instrument(level = "debug", skip_all)]
pub(crate) fn spawn(handle: FileSystemDirectoryHandle) -> impl FileSystem + 'static {
    Mailbox::spawn(Directory(handle))
}

#[derive(Debug, Clone)]
struct Directory(FileSystemDirectoryHandle);

impl Directory {
    /// Execute a thunk and use [`JsCast`] to downcast its result.
    ///
    /// # Implementation Details
    ///
    /// Note that this will do string matching against [`DomException::name()`]
    /// to try and interpret an exception as a [`FsError`].  Technically, there
    /// is [`DomException::code()`] that we could `match` against, but the docs
    /// mark it as a legacy feature and recomend against using it.
    ///
    /// See [the MDN page][mdn] for more.
    ///
    /// [mdn]: https://developer.mozilla.org/en-US/docs/Web/API/DOMException
    async fn exec<F, Ret>(&self, error_codes: &[(&str, FsError)], thunk: F) -> Result<Ret, FsError>
    where
        F: FnOnce(&FileSystemDirectoryHandle) -> js_sys::Promise,
        Ret: JsCast,
    {
        let promise = thunk(&self.0);

        match wasm_bindgen_futures::JsFuture::from(promise).await {
            Ok(value) => match value.dyn_into() {
                Ok(v) => Ok(v),
                Err(other) => unreachable!(
                    "Unable to cast {other:?} to a {}",
                    std::any::type_name::<Ret>()
                ),
            },
            Err(e) => {
                if let Some(e) = e
                    .dyn_ref::<DomException>()
                    .and_then(|ex| interpret_dom_exception(ex, error_codes))
                {
                    Err(e)
                } else {
                    let error = crate::utils::js_error(e);
                    tracing::error!(
                        error = &*error,
                        operation = %std::any::type_name::<F>().replace("::{{closure}}", ""),
                        "An error occurred while interacting with the FileSystemDirectoryHandle",
                    );
                    Err(FsError::UnknownError)
                }
            }
        }
    }

    /// Evaluate a thunk and throw away the result.
    async fn eval<F>(&self, error_codes: &[(&str, FsError)], thunk: F) -> Result<(), FsError>
    where
        F: FnOnce(&FileSystemDirectoryHandle) -> js_sys::Promise,
    {
        let _: JsValue = self.exec(error_codes, thunk).await?;
        Ok(())
    }
}

/// Convert a [`DomException`] into a known [`FsError`].
///
fn interpret_dom_exception(e: &DomException, error_codes: &[(&str, FsError)]) -> Option<FsError> {
    let name = e.name();

    for (error_name, fs_error) in error_codes.iter().copied() {
        if name == error_name {
            return Some(fs_error);
        }
    }

    None
}

#[derive(Debug, Clone)]
struct ReadDirectory(PathBuf);

#[async_trait(?Send)]
impl Handler<ReadDirectory> for Directory {
    type Output = ReadDir;

    #[tracing::instrument(level = "trace", skip(self))]
    async fn handle(&mut self, msg: ReadDirectory) -> Result<Self::Output, FsError> {
        let path = msg.0.as_os_str().to_str().ok_or(FsError::InvalidInput)?;

        let error_codes = [
            ("NotAllowedError", FsError::PermissionDenied),
            ("TypeMismatchError", FsError::BaseNotDirectory),
            ("NotFoundError", FsError::EntryNotFound),
        ];

        let dir: FileSystemDirectoryHandle = self
            .exec(&error_codes, |d| {
                d.get_directory_handle_with_options(
                    path,
                    FileSystemGetDirectoryOptions::new().create(true),
                )
            })
            .await?;

        let iter: js_sys::AsyncIterator = Reflect::get(&dir, &JsValue::from_str("entries"))
            .unwrap()
            .unchecked_into::<js_sys::Function>()
            .call0(&dir)
            .unwrap()
            .unchecked_into();

        let dir_entries = async_iterator_to_stream(iter)
            .and_then(|pair| async {
                let array: js_sys::Array = pair.dyn_into().unwrap();

                let key: JsString = array.get(0).dyn_into().unwrap();
                let name = String::from(key);
                let full_path = msg.0.join(name);

                let handle: web_sys::FileSystemHandle = array.get(1).dyn_into().unwrap();

                let metadata = metadata_from_fs_handle(&handle).await.map_err(|e| {
                    tracing::debug!(
                        path=%full_path.display(),
                        error=&*e,
                        "Unable to get an item's metadata"
                    );
                    FsError::UnknownError
                });

                Ok(DirEntry {
                    path: full_path,
                    metadata,
                })
            })
            .try_collect::<Vec<DirEntry>>()
            .await;

        match dir_entries {
            Ok(entries) => Ok(ReadDir::new(entries)),
            Err(e) => {
                let error = crate::utils::js_error(e);
                tracing::debug!(
                    path,
                    error = &*error,
                    "Unable to read a directory's metadata",
                );
                Err(FsError::UnknownError)
            }
        }
    }
}

async fn metadata_from_fs_handle(
    handle: &web_sys::FileSystemHandle,
) -> Result<virtual_fs::Metadata, anyhow::Error> {
    if let Some(_dir_handle) = handle.dyn_ref::<FileSystemDirectoryHandle>() {
        Ok(virtual_fs::Metadata {
            ft: FileType::new_dir(),
            accessed: 0,
            created: 0,
            modified: 0,
            len: 0,
        })
    } else if let Some(file_handle) = handle.dyn_ref::<web_sys::FileSystemFileHandle>() {
        let file: web_sys::File = wasm_bindgen_futures::JsFuture::from(file_handle.get_file())
            .await
            .map_err(crate::utils::js_error)?
            .dyn_into()
            .unwrap();

        Ok(virtual_fs::Metadata {
            ft: FileType {
                file: true,
                ..Default::default()
            },
            accessed: 0,
            created: 0,
            modified: 0,
            len: file.size() as u64,
        })
    } else {
        unreachable!()
    }
}

fn async_iterator_to_stream(
    iter: js_sys::AsyncIterator,
) -> impl TryStream<Ok = JsValue, Error = JsValue> {
    let (mut sender, receiver) = futures::channel::mpsc::channel(1);

    async fn iter_next(iter: &js_sys::AsyncIterator) -> Result<Option<JsValue>, JsValue> {
        let promise = iter.next()?;
        let result = wasm_bindgen_futures::JsFuture::from(promise).await?;

        let done = js_sys::Reflect::get(&result, &JsValue::from_str("done"))?
            .as_bool()
            .unwrap_or(true);

        if done {
            return Ok(None);
        }

        let value = js_sys::Reflect::get(&result, &JsValue::from_str("value"))
            .unwrap_or(JsValue::UNDEFINED);

        Ok(Some(value))
    }

    wasm_bindgen_futures::spawn_local(async move {
        loop {
            match iter_next(&iter).await {
                Ok(Some(value)) => {
                    if sender.send(Ok(value)).await.is_err() {
                        break;
                    }
                }
                Ok(None) => break,
                Err(e) => {
                    let _ = sender.send(Err(e)).await;
                    break;
                }
            }
        }
    });

    receiver
}

#[derive(Debug, Clone)]
struct CreateDirectory(PathBuf);

#[async_trait(?Send)]
impl Handler<CreateDirectory> for Directory {
    type Output = ();

    #[tracing::instrument(level = "trace", skip(self))]
    async fn handle(&mut self, msg: CreateDirectory) -> Result<Self::Output, FsError> {
        let path = msg.0.as_os_str().to_str().ok_or(FsError::InvalidInput)?;

        let error_codes = [
            ("NotAllowedError", FsError::PermissionDenied),
            ("TypeMismatchError", FsError::BaseNotDirectory),
            ("NotFoundError", FsError::EntryNotFound),
        ];

        self.eval(&error_codes, |d| {
            d.get_directory_handle_with_options(
                path,
                FileSystemGetDirectoryOptions::new().create(true),
            )
        })
        .await?;

        Ok(())
    }
}

#[derive(Debug, Clone)]
struct RemoveDirectory(PathBuf);

#[async_trait(?Send)]
impl Handler<RemoveDirectory> for Directory {
    type Output = ();

    #[tracing::instrument(level = "trace", skip(self))]
    async fn handle(&mut self, msg: RemoveDirectory) -> Result<Self::Output, FsError> {
        let path = msg.0.as_os_str().to_str().ok_or(FsError::InvalidInput)?;

        let error_codes = [
            ("NotAllowedError", FsError::PermissionDenied),
            ("InvalidModificationError", FsError::DirectoryNotEmpty),
            ("NotFoundError", FsError::EntryNotFound),
        ];

        self.eval(&error_codes, |d| d.remove_entry(path)).await?;

        Ok(())
    }
}

#[derive(Debug, Clone)]
struct Rename {
    from: PathBuf,
    to: PathBuf,
}

#[async_trait(?Send)]
impl Handler<Rename> for Directory {
    type Output = ();

    #[tracing::instrument(level = "trace", skip(self))]
    async fn handle(&mut self, Rename { from, to }: Rename) -> Result<Self::Output, FsError> {
        // TODO: Add a polyfill for renaming an item
        tracing::warn!(
            ?from,
            ?to,
            "Renaming isn't implemented by the FileSystem API"
        );
        Err(FsError::UnknownError)
    }
}

#[derive(Debug, Clone)]
struct RemoveFile(PathBuf);

#[async_trait(?Send)]
impl Handler<RemoveFile> for Directory {
    type Output = ();

    #[tracing::instrument(level = "trace", skip(self))]
    async fn handle(&mut self, msg: RemoveFile) -> Result<Self::Output, FsError> {
        let path = msg.0.as_os_str().to_str().ok_or(FsError::InvalidInput)?;

        let error_codes = [
            ("NotAllowedError", FsError::PermissionDenied),
            ("InvalidModificationError", FsError::DirectoryNotEmpty),
            ("NotFoundError", FsError::EntryNotFound),
        ];

        self.eval(&error_codes, |d| d.remove_entry(path)).await?;

        Ok(())
    }
}

#[derive(Debug, Clone)]
struct Open {
    path: PathBuf,
    conf: OpenOptionsConfig,
}

#[async_trait(?Send)]
impl Handler<Open> for Directory {
    type Output = Box<dyn VirtualFile + Send + Sync>;

    #[tracing::instrument(level = "trace", skip(self))]
    async fn handle(&mut self, _msg: Open) -> Result<Self::Output, FsError> {
        todo!();
    }
}

#[derive(Debug, Clone)]
struct Metadata(PathBuf);

#[async_trait(?Send)]
impl Handler<Metadata> for Directory {
    type Output = virtual_fs::Metadata;

    #[tracing::instrument(level = "trace", skip(self))]
    async fn handle(&mut self, _msg: Metadata) -> Result<Self::Output, FsError> {
        todo!();
    }
}

impl FileSystem for Mailbox<Directory> {
    fn read_dir(&self, path: &Path) -> virtual_fs::Result<ReadDir> {
        self.handle(ReadDirectory(path.to_path_buf()))
    }

    fn create_dir(&self, path: &Path) -> virtual_fs::Result<()> {
        self.handle(CreateDirectory(path.to_path_buf()))
    }

    fn remove_dir(&self, path: &Path) -> virtual_fs::Result<()> {
        self.handle(RemoveDirectory(path.to_path_buf()))
    }

    fn rename<'a>(
        &'a self,
        from: &'a Path,
        to: &'a Path,
    ) -> futures::prelude::future::BoxFuture<'a, virtual_fs::Result<()>> {
        Box::pin(self.send(Rename {
            from: from.to_path_buf(),
            to: to.to_path_buf(),
        }))
    }

    fn metadata(&self, path: &Path) -> virtual_fs::Result<virtual_fs::Metadata> {
        self.handle(Metadata(path.to_path_buf()))
    }

    fn remove_file(&self, path: &Path) -> virtual_fs::Result<()> {
        self.handle(RemoveFile(path.to_path_buf()))
    }

    fn new_open_options(&self) -> virtual_fs::OpenOptions {
        virtual_fs::OpenOptions::new(self)
    }
}

impl FileOpener for Mailbox<Directory> {
    fn open(
        &self,
        path: &Path,
        conf: &OpenOptionsConfig,
    ) -> virtual_fs::Result<Box<dyn VirtualFile + Send + Sync + 'static>> {
        let path = path.to_path_buf();
        let conf = conf.clone();

        self.handle(Open { path, conf })
    }
}

#[cfg(test)]
mod tests {
    use std::{fmt::Debug, num::NonZeroUsize};

    use tokio::sync::oneshot;
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

        assert_eq!(err, FsError::Lock);
    }

    /// Create a [`FileSystem`] from a [`FileSystemDirectoryHandle`] and
    /// interact with it in a way that won't create deadlocks.
    async fn with_fs<F, Ret>(handle: FileSystemDirectoryHandle, op: F) -> Ret
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

    #[wasm_bindgen_test]
    async fn read_dir() {
        crate::on_start();
        let _ = crate::initialize_logger(Some("info,wasmer_js::fs=trace".into()));
        let storage = web_sys::window().unwrap().navigator().storage();
        let handle: FileSystemDirectoryHandle = JsFuture::from(storage.get_directory())
            .await
            .unwrap()
            .dyn_into()
            .unwrap();

        let read_dir = with_fs(handle, |fs| fs.read_dir("/".as_ref())).await;

        let entries: Vec<_> = read_dir.unwrap().map(|e| e.unwrap().path()).collect();
        assert!(entries.is_empty());
    }

    #[wasm_bindgen_test]
    async fn create_dir() {
        crate::on_start();
        let _ = crate::initialize_logger(Some("info,wasmer_js::fs=trace".into()));
        let storage = web_sys::window().unwrap().navigator().storage();
        let handle: FileSystemDirectoryHandle = JsFuture::from(storage.get_directory())
            .await
            .unwrap()
            .dyn_into()
            .unwrap();

        let entries: Vec<_> = with_fs(handle.clone(), |fs| {
            fs.create_dir("root".as_ref()).unwrap();
            fs.create_dir("root/nested".as_ref()).unwrap();
            fs.read_dir("root".as_ref()).unwrap()
        })
        .await
        .map(|result| result.unwrap())
        .collect();

        assert_eq!(
            entries,
            vec![DirEntry {
                path: PathBuf::from("/root/nested"),
                metadata: Ok(virtual_fs::Metadata {
                    ft: FileType::new_dir(),
                    ..Default::default()
                })
            }]
        );
    }
}
