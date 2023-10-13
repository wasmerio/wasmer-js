use anyhow::Context;
use js_sys::{BigInt, JsString, Object, Reflect};
use wasm_bindgen::{JsCast, JsValue};

use crate::utils::Error;

const TYPE: &str = "type";

#[derive(Debug, Clone)]
pub(crate) struct Deserializer {
    value: JsValue,
}

impl Deserializer {
    pub fn new(value: JsValue) -> Self {
        Deserializer { value }
    }

    pub fn get_string(&self, field: &str) -> Result<String, Error> {
        let string: JsString = self.get_js(field)?;
        Ok(string.into())
    }

    pub fn ty(&self) -> Result<String, Error> {
        self.get_string(TYPE)
    }

    /// Deserialize a field by interpreting it as a pointer to some boxed object
    /// and unboxing it.
    ///
    /// # Safety
    ///
    /// The object being deserialized must have been created by a [`Serializer`]
    /// and the field must have been initialized using [`Serializer::boxed()`].
    pub unsafe fn get_boxed<T>(&self, field: &str) -> Result<T, Error> {
        let raw_address: BigInt = self.get_js(field)?;
        let address = u64::try_from(raw_address).unwrap() as usize as *mut T;
        let boxed = Box::from_raw(address);
        Ok(*boxed)
    }

    pub fn get_js<T>(&self, field: &str) -> Result<T, Error>
    where
        T: JsCast,
    {
        let value = Reflect::get(&self.value, &JsValue::from_str(field)).map_err(Error::js)?;
        let value = value.dyn_into().map_err(|_| {
            anyhow::anyhow!(
                "The \"{field}\" field isn't a \"{}\"",
                std::any::type_name::<T>()
            )
        })?;
        Ok(value)
    }
}

#[derive(Debug)]
pub(crate) struct Serializer {
    obj: Object,
    error: Option<Error>,
}

impl Serializer {
    pub fn new(ty: &str) -> Self {
        let ser = Serializer {
            obj: Object::new(),
            error: None,
        };

        ser.set(TYPE, ty)
    }

    pub fn set(mut self, field: &str, value: impl Into<JsValue>) -> Self {
        if self.error.is_some() {
            // Short-circuit.
            return self;
        }

        if let Err(e) = Reflect::set(&self.obj, &JsValue::from_str(field), &value.into())
            .map_err(crate::utils::js_error)
            .with_context(|| format!("Unable to set \"{field}\""))
        {
            self.error = Some(e.into());
        }

        self
    }

    /// Serialize a field by boxing it and passing the address to
    /// `postMessage()`.
    pub fn boxed<T: Send>(self, field: &str, value: T) -> Self {
        let ptr = Box::into_raw(Box::new(value));
        self.set(field, BigInt::from(ptr as usize))
    }

    pub fn finish(self) -> Result<JsValue, Error> {
        let Serializer { obj, error } = self;
        match error {
            None => Ok(obj.into()),
            Some(e) => Err(e),
        }
    }
}

// SpawnAsync(Box<dyn FnOnce() -> Pin<Box<dyn Future<Output = ()> + 'static>> + Send + 'static>),
// SpawnBlocking(Box<dyn FnOnce() + Send + 'static>),
// CacheModule {
//     hash: ModuleHash,
//     module: WebAssembly::Module,
// },
// SpawnWithModule {
//     module: WebAssembly::Module,
//     task: Box<dyn FnOnce(wasmer::Module) + Send + 'static>,
// },
// SpawnWithModuleAndMemory {
//     module: WebAssembly::Module,
//     /// An instance of the WebAssembly linear memory that has already been
//     /// created.
//     memory: Option<WebAssembly::Memory>,
//     spawn_wasm: SpawnWasm,
// },
