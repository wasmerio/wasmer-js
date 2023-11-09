use std::sync::Arc;

use virtual_fs::{AsyncReadExt, AsyncWriteExt, FileSystem};
use wasm_bindgen::prelude::wasm_bindgen;
use web_sys::FileSystemDirectoryHandle;

use crate::utils::Error;

/// A directory that can be mounted inside a WASIX instance.
#[derive(Debug, Clone, wasm_bindgen_derive::TryFromJsValue)]
#[wasm_bindgen]
pub struct Directory(Arc<dyn FileSystem>);

#[wasm_bindgen]
impl Directory {
    /// Create a temporary [`Directory`] that holds its contents in memory.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Directory::default()
    }

    /// Create a new [`Directory`] using the [File System API][mdn].
    ///
    /// > **Important:** this API will only work inside a secure context.
    ///
    /// Some ways a [`FileSystemDirectoryHandle`] can be created are...
    ///
    /// - Using the [Origin private file system API][opfs]
    /// - Calling [`window.showDirectoryPicker()`][sdp]
    ///   to access a file on the host machine (i.e. outside of the browser)
    /// - From the [HTML Drag & Drop API][dnd] by calling [`DataTransferItem.getAsFileSystemHandle()`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFileSystemHandle)
    ///
    ///
    /// [mdn]: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
    /// [dnd]: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
    /// [sdp]: https://developer.mozilla.org/en-US/docs/Web/API/window/showDirectoryPicker
    /// [opfs]: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
    #[wasm_bindgen(js_name = "fromBrowser")]
    pub fn from_browser(handle: FileSystemDirectoryHandle) -> Self {
        Directory(Arc::new(crate::fs::web::spawn(handle)))
    }

    #[wasm_bindgen(js_name = "readDir")]
    pub fn read_dir(&self, mut path: String) -> Result<Vec<String>, Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        let mut contents = Vec::new();

        for entry in FileSystem::read_dir(self, path.as_ref())? {
            let entry = entry?;
            contents.push(entry.path.display().to_string());
        }

        Ok(contents)
    }

    /// Write to a file.
    #[wasm_bindgen(js_name = "writeFile")]
    pub async fn write_file(&self, mut path: String, contents: Vec<u8>) -> Result<(), Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        let mut f = self
            .new_open_options()
            .write(true)
            .create(true)
            .open(&path)?;
        f.write_all(&contents).await?;

        Ok(())
    }

    /// Read the contents of a file from this directory.
    ///
    /// Note that the path is relative to the directory's root.
    #[wasm_bindgen(js_name = "readFile")]
    pub async fn read_file(&self, mut path: String) -> Result<js_sys::Uint8Array, Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        let mut f = self.new_open_options().read(true).open(&path)?;
        let mut buffer = Vec::with_capacity(f.size() as usize);
        f.read_to_end(&mut buffer).await?;

        Ok(js_sys::Uint8Array::from(&buffer[..]))
    }

    /// Create a directory.
    #[wasm_bindgen(js_name = "createDir")]
    pub fn create_dir(&self, mut path: String) -> Result<(), Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        FileSystem::create_dir(self, path.as_ref())?;

        Ok(())
    }
}

impl Default for Directory {
    fn default() -> Self {
        Directory(Arc::new(virtual_fs::mem_fs::FileSystem::default()))
    }
}

impl FileSystem for Directory {
    fn read_dir(&self, path: &std::path::Path) -> virtual_fs::Result<virtual_fs::ReadDir> {
        self.0.read_dir(path)
    }

    fn create_dir(&self, path: &std::path::Path) -> virtual_fs::Result<()> {
        self.0.create_dir(path)
    }

    fn remove_dir(&self, path: &std::path::Path) -> virtual_fs::Result<()> {
        self.0.remove_dir(path)
    }

    fn rename<'a>(
        &'a self,
        from: &'a std::path::Path,
        to: &'a std::path::Path,
    ) -> futures::future::BoxFuture<'a, virtual_fs::Result<()>> {
        self.0.rename(from, to)
    }

    fn metadata(&self, path: &std::path::Path) -> virtual_fs::Result<virtual_fs::Metadata> {
        self.0.metadata(path)
    }

    fn remove_file(&self, path: &std::path::Path) -> virtual_fs::Result<()> {
        self.0.remove_file(path)
    }

    fn new_open_options(&self) -> virtual_fs::OpenOptions {
        self.0.new_open_options()
    }
}
