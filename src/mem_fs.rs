use js_sys::Reflect;
use std::path::PathBuf;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasmer_vfs::mem_fs::FileSystem as MemFSFilesystem;
use wasmer_vfs::{FileSystem, ReadDir, VirtualFile};

#[wasm_bindgen]
pub struct MemFS {
    inner: MemFSFilesystem,
}

// Filesystem
#[wasm_bindgen]
impl MemFS {
    #[wasm_bindgen(constructor)]
    pub fn new(config: JsValue) -> Result<MemFS, JsValue> {
        Ok(MemFS {
            inner: MemFSFilesystem::default(),
        })
    }

    #[wasm_bindgen(js_name = readDir)]
    pub fn read_dir(&self, path: &str) -> Result<js_sys::Array, JsValue> {
        let dir_entries = self
            .inner
            .read_dir(&PathBuf::from(path))
            .map_err(|e| js_sys::Error::new(&format!("Error when reading the dir: {}`", e)))?;
        Ok(dir_entries
            .map(|entry| {
                let entry = entry.unwrap(); //.map_err(|e| js_sys::Error::new(&format!("Failed to get entry: {}`", e)))?;
                let obj = js_sys::Object::new();
                Reflect::set(&obj, &"path".into(), &entry.path().to_str().into());
                // Reflect::set(&obj, &"path".into(), &entry.path().to_str().into());
                obj
            })
            .collect::<js_sys::Array>())
    }

    #[wasm_bindgen(js_name = createDir)]
    pub fn create_dir(&self, path: &str) -> Result<(), JsValue> {
        self.inner
            .create_dir(&PathBuf::from(path))
            .map_err(|e| js_sys::Error::new(&format!("Error when creating the dir: {}`", e)).into())
    }

    #[wasm_bindgen(js_name = removeDir)]
    pub fn remove_dir(&self, path: &str) -> Result<(), JsValue> {
        self.inner
            .remove_dir(&PathBuf::from(path))
            .map_err(|e| js_sys::Error::new(&format!("Error when removing the dir: {}`", e)).into())
    }

    #[wasm_bindgen(js_name = removeFile)]
    pub fn remove_file(&self, path: &str) -> Result<(), JsValue> {
        self.inner.remove_file(&PathBuf::from(path)).map_err(|e| {
            js_sys::Error::new(&format!("Error when removing the file: {}`", e)).into()
        })
    }

    pub fn rename(&self, path: &str, to: &str) -> Result<(), JsValue> {
        self.inner
            .rename(&PathBuf::from(path), &PathBuf::from(to))
            .map_err(|e| js_sys::Error::new(&format!("Error when renaming: {}`", e)).into())
    }

    pub fn metadata(&self, path: &str) -> Result<js_sys::Object, JsValue> {
        let metadata = self
            .inner
            .metadata(&PathBuf::from(path))
            .map_err(|e| js_sys::Error::new(&format!("Error when creating the dir: {}`", e)))?;
        let obj = js_sys::Object::new();
        // Reflect::set(&obj, &"path".into(), &entry.path().to_str().into());
        Ok(obj)
    }

    pub fn open(&self, path: &str, options: JsValue) -> Result<MemFSFile, JsValue> {
        unimplemented!();
    }
}

// Files
#[wasm_bindgen]
pub struct MemFSFile {
    handle: Box<dyn VirtualFile>,
}

#[wasm_bindgen]
impl MemFSFile {
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
    pub fn write(&mut self, mut buf: &mut [u8]) -> Result<usize, JsValue> {
        self.handle
            .write(&mut buf)
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
    pub fn seek(&mut self, position: u64) -> Result<u64, JsValue> {
        self.handle
            .seek(std::io::SeekFrom::Start(position))
            .map_err(|e| js_sys::Error::new(&format!("Error when seeking: {}`", e)).into())
    }
}
