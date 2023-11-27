use std::sync::Arc;

use js_sys::{JsString, Reflect};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasmer_wasix::{bin_factory::BinaryPackage, runtime::resolver::PackageSpecifier};

use crate::{options::OptionalRuntime, runtime::Runtime, utils::Error};

/// A package from the Wasmer registry.
#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Wasmer {
    /// The package's entrypoint.
    #[wasm_bindgen(getter_with_clone)]
    pub entrypoint: Option<Command>,
    /// A map containing all commands available to the package (including
    /// dependencies).
    #[wasm_bindgen(getter_with_clone)]
    pub commands: Commands,
}

#[wasm_bindgen]
impl Wasmer {
    #[wasm_bindgen(js_name = "fromRegistry")]
    pub async fn js_from_registry(
        specifier: &str,
        runtime: OptionalRuntime,
    ) -> Result<Wasmer, Error> {
        Wasmer::from_registry(specifier, runtime).await
    }
}

/// The actual impl - with `#[tracing::instrument]` macros.
impl Wasmer {
    #[tracing::instrument(skip(runtime))]
    async fn from_registry(specifier: &str, runtime: OptionalRuntime) -> Result<Wasmer, Error> {
        let specifier = PackageSpecifier::parse(specifier)?;
        let runtime = runtime.resolve()?.into_inner();

        let pkg = BinaryPackage::from_registry(&specifier, &*runtime).await?;
        let pkg = Arc::new(pkg);

        let commands = Commands::default();

        for cmd in &pkg.commands {
            let name = JsString::from(cmd.name());
            let value = JsValue::from(Command {
                name: name.clone(),
                runtime: Arc::clone(&runtime),
                pkg: Arc::clone(&pkg),
            });
            Reflect::set(&commands, &name, &value).map_err(Error::js)?;
        }

        let entrypoint = pkg.entrypoint_cmd.as_deref().map(|name| Command {
            name: name.into(),
            pkg: Arc::clone(&pkg),
            runtime,
        });

        Ok(Wasmer {
            entrypoint,
            commands,
        })
    }
}

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Command {
    #[wasm_bindgen(getter_with_clone)]
    pub name: JsString,
    pkg: Arc<BinaryPackage>,
    runtime: Arc<Runtime>,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Record<string, Command>", extends = js_sys::Object)]
    #[derive(Clone, Default, Debug)]
    pub type Commands;
}
