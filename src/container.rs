use std::collections::BTreeMap;

use anyhow::Context;
use bytes::Bytes;
use js_sys::{JsString, Uint8Array};
use shared_buffer::OwnedBuffer;
use wasm_bindgen::{prelude::wasm_bindgen, JsCast};
use wasmer_wasix::{runtime::resolver::PackageSpecifier, Runtime as _};

use crate::{utils::Error, Runtime};

#[wasm_bindgen]
pub struct Container {
    _raw: Bytes,
    webc: webc::Container,
    atoms: BTreeMap<String, OwnedBuffer>,
    volumes: BTreeMap<String, webc::Volume>,
}

#[wasm_bindgen]
impl Container {
    /// Parse a `Container` from its binary representation.
    #[wasm_bindgen(constructor)]
    pub fn new(raw: Vec<u8>) -> Result<Container, Error> {
        Container::from_bytes(raw.into())
    }

    /// Download a package from the registry.
    pub async fn from_registry(
        package_specifier: &str,
        runtime: &Runtime,
    ) -> Result<Container, Error> {
        let source = runtime.source();
        let package_specifier: PackageSpecifier = package_specifier
            .parse()
            .context("Invalid package specifier")?;

        let summary = source.latest(&package_specifier).await?;
        let webc = runtime
            .package_loader()
            .download_cached(&summary.dist)
            .await?;

        Container::from_bytes(webc)
    }

    pub fn manifest(&self) -> Result<Manifest, serde_wasm_bindgen::Error> {
        serde_wasm_bindgen::to_value(self.webc.manifest()).map(JsCast::unchecked_into)
    }

    pub fn atom_names(&self) -> Vec<JsString> {
        self.atoms
            .keys()
            .map(|s| JsString::from(s.as_str()))
            .collect()
    }

    pub fn get_atom(&self, name: &str) -> Option<Uint8Array> {
        // Note: It'd be nice if we could avoid this copy, but we risk giving
        // the user a dangling pointer if we use unsafe { Uint8Array::view() }
        // and this container goes away.
        self.atoms
            .get(name)
            .map(|atom| Uint8Array::from(atom.as_slice()))
    }

    pub fn volume_names(&self) -> Vec<JsString> {
        self.volumes
            .keys()
            .map(|s| JsString::from(s.as_str()))
            .collect()
    }

    pub fn get_volume(&self, _name: &str) -> Option<Volume> {
        todo!();
    }
}

impl Container {
    fn from_bytes(bytes: Bytes) -> Result<Self, Error> {
        let webc = webc::Container::from_bytes(bytes.clone())?;
        let atoms = webc.atoms();
        let volumes = webc.volumes();

        Ok(Container {
            _raw: bytes,
            webc,
            atoms,
            volumes,
        })
    }
}

#[wasm_bindgen(typescript_custom_section)]
const MANIFEST_TYPE_DEFINITION: &'static str = r#"
/**
 * Metadata associated with a webc file.
 */
export type Manifest = {
    annotations?: Record<string, any>;
};
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Manifest")]
    pub type Manifest;
}

#[wasm_bindgen]
pub struct Volume {}
