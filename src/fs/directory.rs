use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::Context;
use tracing::Instrument;
use virtual_fs::{AsyncReadExt, AsyncWriteExt, FileSystem};
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};

use crate::{utils::Error, StringOrBytes};

/// A directory that can be mounted inside a WASIX instance.
#[derive(Debug, Clone, wasm_bindgen_derive::TryFromJsValue)]
#[wasm_bindgen]
pub struct Directory(Arc<dyn FileSystem>);

#[wasm_bindgen]
impl Directory {
    /// Create a temporary [`Directory`] that holds its contents in memory.
    #[wasm_bindgen(constructor)]
    pub fn new(init: Option<DirectoryInit>) -> Result<Directory, Error> {
        match init {
            Some(init) => {
                let fs = init.initialize()?;
                Ok(Directory(fs))
            }
            None => Ok(Directory::default()),
        }
    }

    /// Read the contents of a directory.
    #[wasm_bindgen(js_name = "readDir")]
    pub async fn read_dir(&self, mut path: String) -> Result<ListOfStrings, Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        let contents = js_sys::Array::new();

        for entry in FileSystem::read_dir(self, path.as_ref())? {
            let entry = entry?;
            let value = JsValue::from(entry.path.display().to_string());
            contents.push(&value);
        }

        Ok(contents.unchecked_into())
    }

    /// Write to a file.
    ///
    /// If a string is provided, it is encoded as UTF-8.
    #[wasm_bindgen(js_name = "writeFile")]
    pub async fn write_file(&self, mut path: String, contents: StringOrBytes) -> Result<(), Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        let mut f = self
            .new_open_options()
            .write(true)
            .create(true)
            .open(&path)?;

        let contents = contents.as_bytes();
        f.write_all(&contents).await?;

        Ok(())
    }

    /// Read the contents of a file from this directory.
    ///
    /// Note that the path is relative to the directory's root.
    #[wasm_bindgen(js_name = "readFile")]
    pub async fn read_file(&self, path: String) -> Result<js_sys::Uint8Array, Error> {
        let buffer = self._read_file(path).await?;
        Ok(js_sys::Uint8Array::from(&buffer[..]))
    }

    /// Read the contents of a file from this directory as a UTF-8 string.
    ///
    /// Note that the path is relative to the directory's root.
    #[wasm_bindgen(js_name = "readTextFile")]
    pub async fn read_text_file(&self, path: String) -> Result<js_sys::JsString, Error> {
        let buffer = self._read_file(path).await?;
        let string = String::from_utf8(buffer)?;
        Ok(string.into())
    }

    /// Create a directory.
    #[wasm_bindgen(js_name = "createDir")]
    pub async fn create_dir(&self, mut path: String) -> Result<(), Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        FileSystem::create_dir(self, path.as_ref())?;

        Ok(())
    }

    /// Remove a directory.
    #[wasm_bindgen(js_name = "removeDir")]
    pub async fn remove_dir(&self, mut path: String) -> Result<(), Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        FileSystem::remove_dir(self, path.as_ref())?;

        Ok(())
    }

    /// Remove a file.
    #[wasm_bindgen(js_name = "removeFile")]
    pub async fn remove_file(&self, mut path: String) -> Result<(), Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        FileSystem::remove_file(self, path.as_ref())?;

        Ok(())
    }
}

impl Directory {
    async fn _read_file(&self, mut path: String) -> Result<Vec<u8>, Error> {
        if !path.starts_with('/') {
            path.insert(0, '/');
        }

        let mut f = self.new_open_options().read(true).open(&path)?;
        let mut buffer = Vec::with_capacity(f.size() as usize);
        f.read_to_end(&mut buffer).await?;

        Ok(buffer)
    }
}

impl Default for Directory {
    fn default() -> Self {
        Directory(Arc::new(virtual_fs::mem_fs::FileSystem::default()))
    }
}

impl FileSystem for Directory {
    #[tracing::instrument(level = "trace", skip(self))]
    fn read_dir(&self, path: &std::path::Path) -> virtual_fs::Result<virtual_fs::ReadDir> {
        self.0.read_dir(path)
    }

    #[tracing::instrument(level = "trace", skip(self))]
    fn create_dir(&self, path: &std::path::Path) -> virtual_fs::Result<()> {
        self.0.create_dir(path)
    }

    #[tracing::instrument(level = "trace", skip(self))]
    fn remove_dir(&self, path: &std::path::Path) -> virtual_fs::Result<()> {
        self.0.remove_dir(path)
    }

    #[tracing::instrument(level = "trace", skip(self))]
    fn rename<'a>(
        &'a self,
        from: &'a std::path::Path,
        to: &'a std::path::Path,
    ) -> futures::future::BoxFuture<'a, virtual_fs::Result<()>> {
        Box::pin(self.0.rename(from, to).in_current_span())
    }

    #[tracing::instrument(level = "trace", skip(self))]
    fn metadata(&self, path: &std::path::Path) -> virtual_fs::Result<virtual_fs::Metadata> {
        self.0.metadata(path)
    }

    #[tracing::instrument(level = "trace", skip(self))]
    fn remove_file(&self, path: &std::path::Path) -> virtual_fs::Result<()> {
        self.0.remove_file(path)
    }

    fn new_open_options(&self) -> virtual_fs::OpenOptions {
        virtual_fs::OpenOptions::new(self)
    }
}

impl virtual_fs::FileOpener for Directory {
    #[tracing::instrument(level = "trace", skip(self))]
    fn open(
        &self,
        path: &std::path::Path,
        conf: &virtual_fs::OpenOptionsConfig,
    ) -> virtual_fs::Result<Box<dyn virtual_fs::VirtualFile + Send + Sync + 'static>> {
        self.0.new_open_options().options(conf.clone()).open(path)
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "string[]")]
    pub type ListOfStrings;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Record<string, string|Uint8Array>", extends = js_sys::Object)]
    pub type DirectoryInit;
}

impl DirectoryInit {
    fn initialize(&self) -> Result<Arc<dyn FileSystem>, Error> {
        if let Some(record) = self.dyn_ref::<js_sys::Object>() {
            let fs = in_memory_filesystem(record)?;
            Ok(Arc::new(fs))
        } else {
            unreachable!()
        }
    }
}

/// Construct an in-memory [`FileSystem`] based on an object mapping paths to
/// their contents (`Record<string, string | Uint8Array>`).
fn in_memory_filesystem(record: &js_sys::Object) -> Result<virtual_fs::mem_fs::FileSystem, Error> {
    let fs = virtual_fs::mem_fs::FileSystem::default();

    for (key, contents) in crate::utils::object_entries(record)? {
        let mut path = String::from(key);
        if !path.starts_with('/') {
            path.insert(0, '/');
        }
        let path = PathBuf::from(path);

        let contents: StringOrBytes = contents.unchecked_into();
        let contents = contents.as_bytes();

        if let Some(parent) = path.parent() {
            create_dir_all(&fs, parent)?;
        }

        fs.insert_ro_file(&path, contents.into())
            .with_context(|| format!("Unable to write to \"{}\"", path.display()))?;
    }

    Ok(fs)
}

fn create_dir_all(fs: &dyn FileSystem, path: &Path) -> Result<(), anyhow::Error> {
    let ancestors: Vec<&Path> = path.ancestors().collect();

    for ancestor in ancestors.into_iter().rev() {
        fs.create_dir(ancestor).with_context(|| {
            format!("Unable to create the \"{}\" directory", ancestor.display())
        })?;
    }

    Ok(())
}
