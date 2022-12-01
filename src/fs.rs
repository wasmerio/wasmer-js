use js_sys::Reflect;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use wasm_bindgen::prelude::*;
use wasm_bindgen_downcast::DowncastJS;

use wasmer_vfs::mem_fs::FileSystem as MemoryFilesystem;
use wasmer_vfs::{
    DirEntry, FileSystem, FileType, FsError, Metadata, OpenOptions, ReadDir, VirtualFile,
};

#[wasm_bindgen]
#[derive(Debug, Clone, DowncastJS)]
pub struct MemFS {
    inner: Arc<MemoryFilesystem>,
}

fn metadata_to_object(metadata: &Metadata) -> Result<js_sys::Object, JsValue> {
    let metadata_obj = js_sys::Object::new();
    Reflect::set(
        &metadata_obj,
        &"filetype".into(),
        &filetype_to_object(&metadata.ft)?.into(),
    )?;
    Reflect::set(&metadata_obj, &"accessed".into(), &metadata.accessed.into())?;
    Reflect::set(&metadata_obj, &"created".into(), &metadata.created.into())?;
    Reflect::set(&metadata_obj, &"modified".into(), &metadata.modified.into())?;
    // Reflect::set(&metadata_obj, &"len".into(), &metadata.len.into())?;
    Ok(metadata_obj)
}

fn filetype_to_object(filetype: &FileType) -> Result<js_sys::Object, JsValue> {
    let filetype_obj = js_sys::Object::new();
    Reflect::set(&filetype_obj, &"dir".into(), &filetype.dir.into())?;
    Reflect::set(&filetype_obj, &"file".into(), &filetype.file.into())?;
    Reflect::set(&filetype_obj, &"symlink".into(), &filetype.symlink.into())?;
    // Reflect::set(&filetype_obj, &"charDevice".into(), &filetype.char_device.into())?;
    // Reflect::set(&filetype_obj, &"blockDevice".into(), &filetype.block_device.into())?;
    // Reflect::set(&filetype_obj, &"socket".into(), &filetype.socket.into())?;
    // Reflect::set(&filetype_obj, &"fifo".into(), &filetype.fifo.into())?;
    Ok(filetype_obj)
}

fn direntry_to_object(direntry: &DirEntry) -> Result<js_sys::Object, JsValue> {
    let direntry_obj = js_sys::Object::new();
    Reflect::set(
        &direntry_obj,
        &"path".into(),
        &direntry.path.to_str().into(),
    )?;
    Reflect::set(
        &direntry_obj,
        &"metadata".into(),
        &metadata_to_object(direntry.metadata.as_ref().unwrap())?.into(),
    )?;
    Ok(direntry_obj)
}

// Filesystem
#[wasm_bindgen]
impl MemFS {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<MemFS, JsValue> {
        Ok(MemFS {
            inner: Arc::new(MemoryFilesystem::default()),
        })
    }

    pub fn from_js(jso: JsValue) -> Result<MemFS, JsValue> {
        MemFS::downcast_js(jso)
    }

    #[wasm_bindgen(js_name = readDir)]
    pub fn js_read_dir(&self, path: &str) -> Result<js_sys::Array, JsValue> {
        let dir_entries = self
            .inner
            .read_dir(&PathBuf::from(path))
            .map_err(|e| js_sys::Error::new(&format!("Error when reading the dir: {}`", e)))?;
        dir_entries
            .map(|entry| {
                let entry = entry
                    .map_err(|e| js_sys::Error::new(&format!("Failed to get entry: {}`", e)))?;
                direntry_to_object(&entry)
            })
            .collect::<Result<js_sys::Array, JsValue>>()
    }

    #[wasm_bindgen(js_name = createDir)]
    pub fn js_create_dir(&self, path: &str) -> Result<(), JsValue> {
        self.inner
            .create_dir(&PathBuf::from(path))
            .map_err(|e| js_sys::Error::new(&format!("Error when creating the dir: {}`", e)).into())
    }

    #[wasm_bindgen(js_name = removeDir)]
    pub fn js_remove_dir(&self, path: &str) -> Result<(), JsValue> {
        self.inner
            .remove_dir(&PathBuf::from(path))
            .map_err(|e| js_sys::Error::new(&format!("Error when removing the dir: {}`", e)).into())
    }

    #[wasm_bindgen(js_name = removeFile)]
    pub fn js_remove_file(&self, path: &str) -> Result<(), JsValue> {
        self.inner.remove_file(&PathBuf::from(path)).map_err(|e| {
            js_sys::Error::new(&format!("Error when removing the file: {}`", e)).into()
        })
    }

    #[wasm_bindgen(js_name = rename)]
    pub fn js_rename(&self, path: &str, to: &str) -> Result<(), JsValue> {
        self.inner
            .rename(&PathBuf::from(path), &PathBuf::from(to))
            .map_err(|e| js_sys::Error::new(&format!("Error when renaming: {}`", e)).into())
    }

    #[wasm_bindgen(js_name = metadata)]
    pub fn js_metadata(&self, path: &str) -> Result<js_sys::Object, JsValue> {
        let metadata = self
            .inner
            .metadata(&PathBuf::from(path))
            .map_err(|e| js_sys::Error::new(&format!("Error when creating the dir: {}`", e)))?;
        metadata_to_object(&metadata)
    }

    #[wasm_bindgen(js_name = open)]
    pub fn js_open(&self, path: &str, options: JsValue) -> Result<JSVirtualFile, JsValue> {
        let mut open_options = self.new_open_options();
        open_options.read(
            js_sys::Reflect::get(&options, &"read".into())?
                .as_bool()
                .unwrap_or(true),
        );
        open_options.write(
            js_sys::Reflect::get(&options, &"write".into())?
                .as_bool()
                .unwrap_or(false),
        );
        open_options.append(
            js_sys::Reflect::get(&options, &"append".into())?
                .as_bool()
                .unwrap_or(false),
        );
        open_options.truncate(
            js_sys::Reflect::get(&options, &"truncate".into())?
                .as_bool()
                .unwrap_or(false),
        );
        open_options.create(
            js_sys::Reflect::get(&options, &"create".into())?
                .as_bool()
                .unwrap_or(false),
        );
        open_options.create_new(
            js_sys::Reflect::get(&options, &"create_new".into())?
                .as_bool()
                .unwrap_or(false),
        );
        let file = open_options
            .open(path)
            .map_err(|e| js_sys::Error::new(&format!("Error when opening the file: {}`", e)))?;
        Ok(JSVirtualFile { handle: file })
    }
}

impl FileSystem for MemFS {
    fn read_dir(&self, path: &Path) -> Result<ReadDir, FsError> {
        self.inner.read_dir(path)
    }
    fn create_dir(&self, path: &Path) -> Result<(), FsError> {
        self.inner.create_dir(path)
    }
    fn remove_dir(&self, path: &Path) -> Result<(), FsError> {
        self.inner.remove_dir(path)
    }
    fn rename(&self, from: &Path, to: &Path) -> Result<(), FsError> {
        self.inner.rename(from, to)
    }
    fn metadata(&self, path: &Path) -> Result<Metadata, FsError> {
        self.inner.metadata(path)
    }
    fn symlink_metadata(&self, path: &Path) -> Result<Metadata, FsError> {
        self.inner.symlink_metadata(path)
    }
    fn remove_file(&self, path: &Path) -> Result<(), FsError> {
        self.inner.remove_file(path)
    }

    fn new_open_options(&self) -> OpenOptions {
        self.inner.new_open_options()
    }
}

// Files
#[wasm_bindgen]
pub struct JSVirtualFile {
    handle: Box<dyn VirtualFile>,
}

#[wasm_bindgen]
impl JSVirtualFile {
    #[wasm_bindgen(js_name = lastAccessed)]
    pub fn last_accessed(&self) -> u64 {
        self.handle.last_accessed()
    }

    #[wasm_bindgen(js_name = lastModified)]
    pub fn last_modified(&self) -> u64 {
        self.handle.last_modified()
    }

    #[wasm_bindgen(js_name = createdTime)]
    pub fn created_time(&self) -> u64 {
        self.handle.created_time()
    }

    pub fn size(&self) -> u64 {
        self.handle.size()
    }

    #[wasm_bindgen(js_name = setLength)]
    pub fn set_len(&mut self, new_size: u64) -> Result<(), JsValue> {
        self.handle.set_len(new_size).map_err(|e| {
            js_sys::Error::new(&format!("Error when setting the file length: {}`", e)).into()
        })
    }

    // Read APIs
    pub fn read(&mut self) -> Result<Vec<u8>, JsValue> {
        let mut buf: Vec<u8> = vec![];
        self.handle
            .read_to_end(&mut buf)
            .map_err(|e| js_sys::Error::new(&format!("Error when reading: {}`", e)))?;
        Ok(buf)
    }

    #[wasm_bindgen(js_name = readString)]
    pub fn read_string(&mut self) -> Result<String, JsValue> {
        String::from_utf8(self.read()?).map_err(|e| {
            js_sys::Error::new(&format!("Could not convert the bytes to a String: {}`", e)).into()
        })
    }

    // Write APIs
    pub fn write(&mut self, buf: &mut [u8]) -> Result<usize, JsValue> {
        self.handle
            .write(buf)
            .map_err(|e| js_sys::Error::new(&format!("Error when writing: {}`", e)).into())
    }

    #[wasm_bindgen(js_name = writeString)]
    pub fn write_string(&mut self, mut buf: String) -> Result<usize, JsValue> {
        self.handle
            .write(unsafe { buf.as_bytes_mut() })
            .map_err(|e| js_sys::Error::new(&format!("Error when writing string: {}`", e)).into())
    }

    pub fn flush(&mut self) -> Result<(), JsValue> {
        self.handle
            .flush()
            .map_err(|e| js_sys::Error::new(&format!("Error when flushing: {}`", e)).into())
    }

    // Seek APIs
    pub fn seek(&mut self, position: u32) -> Result<u32, JsValue> {
        let ret = self
            .handle
            .seek(std::io::SeekFrom::Start(position as _))
            .map_err(|e| js_sys::Error::new(&format!("Error when seeking: {}`", e)))?;
        Ok(ret as _)
    }
}
