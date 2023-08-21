use std::{cell::RefCell, collections::HashMap};

use base64::{engine::general_purpose::STANDARD, Engine as _};
use bytes::Bytes;
use wasm_bindgen::{JsCast, JsValue};
use wasmer::{Engine, Module};
use wasmer_wasix::runtime::module_cache::{CacheError, ModuleHash};

std::thread_local! {
    static CACHED_MODULES: RefCell<HashMap<(ModuleHash, String), Module>>
        = RefCell::new(HashMap::new());
}

/// A cache that will automatically share cached modules with other web
/// workers.
#[derive(Debug, Default)]
pub(crate) struct ModuleCache {}

impl ModuleCache {
    fn cache_in_main(&self, key: ModuleHash, module: &Module, deterministic_id: &str) {}

    pub fn export() -> JsValue {
        CACHED_MODULES.with(|m| {
            // Annotation is here to prevent spurious IDE warnings.
            #[allow(unused_unsafe)]
            unsafe {
                let entries = js_sys::Array::new_with_length(m.borrow().len() as u32);

                for (i, ((key, deterministic_id), module)) in m.borrow().iter().enumerate() {
                    let entry = js_sys::Object::new();

                    js_sys::Reflect::set(
                        &entry,
                        &"key".into(),
                        &JsValue::from(STANDARD.encode(key.as_bytes())),
                    )
                    .unwrap();

                    js_sys::Reflect::set(
                        &entry,
                        &"deterministic_id".into(),
                        &JsValue::from(deterministic_id.clone()),
                    )
                    .unwrap();

                    js_sys::Reflect::set(&entry, &"module".into(), &JsValue::from(module.clone()))
                        .unwrap();

                    let module_bytes = Box::new(module.serialize().unwrap());
                    let module_bytes = Box::into_raw(module_bytes);
                    js_sys::Reflect::set(
                        &entry,
                        &"module_bytes".into(),
                        &JsValue::from(module_bytes as u32),
                    )
                    .unwrap();

                    entries.set(i as u32, JsValue::from(entry));
                }

                JsValue::from(entries)
            }
        })
    }

    pub fn import(cache: JsValue) {
        CACHED_MODULES.with(|m| {
            // Annotation is here to prevent spurious IDE warnings.
            #[allow(unused_unsafe)]
            unsafe {
                let entries = cache.dyn_into::<js_sys::Array>().unwrap();

                for i in 0..entries.length() {
                    let entry = entries.get(i);

                    let key = js_sys::Reflect::get(&entry, &"key".into()).unwrap();
                    let key = JsValue::as_string(&key).unwrap();
                    let key = STANDARD.decode(key).unwrap();
                    let key: [u8; 32] = key.try_into().unwrap();
                    let key = ModuleHash::from_bytes(key);

                    let deterministic_id =
                        js_sys::Reflect::get(&entry, &"deterministic_id".into()).unwrap();
                    let deterministic_id = JsValue::as_string(&deterministic_id).unwrap();

                    let module_bytes =
                        js_sys::Reflect::get(&entry, &"module_bytes".into()).unwrap();
                    let module_bytes: u32 = module_bytes.as_f64().unwrap() as u32;
                    let module_bytes = module_bytes as *mut Bytes;
                    let module_bytes = unsafe { Box::from_raw(module_bytes) };

                    let module = js_sys::Reflect::get(&entry, &"module".into()).unwrap();
                    let module = module.dyn_into::<js_sys::WebAssembly::Module>().unwrap();
                    let module: Module = (module, *module_bytes).into();

                    let key = (key, deterministic_id);
                    m.borrow_mut().insert(key, module.clone());
                }
            }
        });
    }

    pub fn lookup(&self, key: ModuleHash, deterministic_id: &str) -> Option<Module> {
        let key = (key, deterministic_id.to_string());
        CACHED_MODULES.with(|m| m.borrow().get(&key).cloned())
    }

    /// Add an item to the cache, returning whether that item already exists.
    pub fn insert(&self, key: ModuleHash, module: &Module, deterministic_id: &str) -> bool {
        let key = (key, deterministic_id.to_string());
        let previous_value = CACHED_MODULES.with(|m| m.borrow_mut().insert(key, module.clone()));
        previous_value.is_none()
    }
}

#[async_trait::async_trait]
impl wasmer_wasix::runtime::module_cache::ModuleCache for ModuleCache {
    async fn load(&self, key: ModuleHash, engine: &Engine) -> Result<Module, CacheError> {
        match self.lookup(key, engine.deterministic_id()) {
            Some(m) => {
                tracing::debug!("Cache hit!");
                Ok(m)
            }
            None => Err(CacheError::NotFound),
        }
    }

    async fn save(
        &self,
        key: ModuleHash,
        engine: &Engine,
        module: &Module,
    ) -> Result<(), CacheError> {
        let already_exists = self.insert(key, module, engine.deterministic_id());

        // We also send the module to the main thread via a postMessage
        // which they relays it to all the web works
        if !already_exists {
            self.cache_in_main(key, module, engine.deterministic_id());
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasmer_wasix::runtime::module_cache::ModuleCache as _;

    const ADD_WAT: &[u8] = br#"(
        module
            (func
                (export "add")
                (param $x i64)
                (param $y i64)
                (result i64)
                (i64.add (local.get $x) (local.get $y)))
        )"#;

    #[wasm_bindgen_test::wasm_bindgen_test]
    async fn round_trip_via_cache() {
        let engine = Engine::default();
        let module = Module::new(&engine, ADD_WAT).unwrap();
        let cache = ModuleCache::default();
        let key = ModuleHash::from_bytes([0; 32]);

        cache.save(key, &engine, &module).await.unwrap();
        let round_tripped = cache.load(key, &engine).await.unwrap();

        let exports: Vec<_> = round_tripped
            .exports()
            .map(|export| export.name().to_string())
            .collect();
        assert_eq!(exports, ["add"]);
    }
}
