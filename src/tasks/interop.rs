use anyhow::Context;
use js_sys::{BigInt, JsString, Object, Reflect, WebAssembly};
use serde::de::DeserializeOwned;
use wasm_bindgen::{JsCast, JsValue};
use wasmer::AsJs;

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

    pub fn value(&self) -> &JsValue {
        &self.value
    }

    pub fn string(&self, field: &str) -> Result<String, Error> {
        let string: JsString = self.js(field)?;
        Ok(string.into())
    }

    pub fn ty(&self) -> Result<String, Error> {
        self.string(TYPE)
    }

    pub fn serde<T: DeserializeOwned>(&self, field: &str) -> Result<T, Error> {
        let raw: JsValue = self.js(field)?;
        let deserialized = serde_wasm_bindgen::from_value(raw).map_err(Error::js)?;
        Ok(deserialized)
    }

    /// Deserialize a field by interpreting it as a pointer to some boxed object
    /// and unboxing it.
    ///
    /// # Safety
    ///
    /// The object being deserialized must have been created by a [`Serializer`]
    /// and the field must have been initialized using [`Serializer::boxed()`].
    pub unsafe fn boxed<T>(&self, field: &str) -> Result<T, Error> {
        let raw_address: BigInt = self.js(field)?;
        let address = u64::try_from(raw_address).unwrap() as usize as *mut T;
        let boxed = Box::from_raw(address);
        Ok(*boxed)
    }

    pub fn js<T>(&self, field: &str) -> Result<T, Error>
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

    pub fn memory(&self, field: &str) -> Result<wasmer::Memory, Error> {
        let memory: WebAssembly::Memory = self.js(field)?;
        let ty_name = format!("{field}_ty");
        let ty: wasmer::MemoryType = self.serde(&ty_name)?;

        // HACK: The store isn't used when converting memories, so it's fine to
        // use a dummy one.
        let mut store = wasmer::Store::default();
        let memory = wasmer::Memory::from_jsvalue(&mut store, &ty, &memory).map_err(Error::js)?;

        Ok(memory)
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

    pub fn set(mut self, field: impl AsRef<str>, value: impl Into<JsValue>) -> Self {
        if self.error.is_some() {
            // Short-circuit.
            return self;
        }

        let field = field.as_ref();

        if let Err(e) = Reflect::set(&self.obj, &JsValue::from_str(field), &value.into())
            .map_err(crate::utils::js_error)
            .with_context(|| format!("Unable to set \"{field}\""))
        {
            self.error = Some(e.into());
        }

        self
    }

    /// Set a field by using serde to serialize it to a JavaScript object.
    pub fn serde(mut self, field: impl AsRef<str>, value: &impl serde::Serialize) -> Self {
        if self.error.is_some() {
            // Short-circuit.
            return self;
        }

        match serde_wasm_bindgen::to_value(value) {
            Ok(value) => self.set(field, value),
            Err(err) => {
                self.error = Some(Error::js(err));
                self
            }
        }
    }

    /// Serialize a field by boxing it and passing the address to
    /// `postMessage()`.
    pub fn boxed<T: Send>(self, field: &str, value: T) -> Self {
        let ptr = Box::into_raw(Box::new(value));
        self.set(field, BigInt::from(ptr as usize))
    }

    pub fn module(self, field: &str, m: wasmer::Module) -> Self {
        let module = WebAssembly::Module::from(m);
        self.set(field, module)
    }

    pub fn memory(self, field: &str, memory: wasmer::Memory) -> Self {
        let dummy_store = wasmer::Store::default();
        let ty = memory.ty(&dummy_store);
        let memory = memory.as_jsvalue(&dummy_store);
        self.set(field, memory).serde(format!("{field}_ty"), &ty)
    }

    pub fn finish(self) -> Result<JsValue, Error> {
        let Serializer { obj, error } = self;
        match error {
            None => Ok(obj.into()),
            Some(e) => Err(e),
        }
    }
}
