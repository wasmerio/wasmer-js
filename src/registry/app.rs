use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasmer_api::types::{DeployAppVersion, PublishDeployAppVars};
use wasmer_config::app::AppConfigV1;

use crate::{
    utils::{self, Error},
    Wasmer,
};

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone)]
pub struct DeployedApp {
    pub id: String,
    pub created_at: String,
    pub version: String,
    pub description: Option<String>,
    pub yaml_config: String,
    pub user_yaml_config: String,
    pub config: String,
    pub json_config: String,
    pub url: String,
}

impl From<DeployAppVersion> for DeployedApp {
    fn from(value: DeployAppVersion) -> Self {
        Self {
            id: value.id.inner().to_string(),
            created_at: value.created_at.0,
            version: value.version,
            description: value.description,
            yaml_config: value.yaml_config,
            user_yaml_config: value.user_yaml_config,
            config: value.config,
            json_config: value.json_config,
            url: value.url,
        }
    }
}

fn resolve_pkg(app_config: &JsValue) -> anyhow::Result<()> {
    // The app config must have a 'package' field.
    //
    // The package field can either be a raw string or a [`Wasmer`].

    let package_key = JsValue::from_str("package");
    let package = js_sys::Reflect::get(app_config, &package_key).map_err(|e| {
        anyhow::anyhow!("While trying to get the package field from the app config: {e:?}")
    })?;

    if package.is_undefined() {
        anyhow::bail!(
            "While trying to get the package field from the app config: undefined field name"
        )
    }

    tracing::error!("{package:?}");

    let pkg_key = JsValue::from_str("pkg");

    if package.is_string() {
        // Do nothing
        Ok(())
    } else if js_sys::Reflect::has(&package, &pkg_key).map_err(|e| anyhow::anyhow!("{e:?}"))? {
        let pkg = js_sys::Reflect::get(&package, &pkg_key).unwrap();
        let hash_key = JsValue::from_str("hash");
        if js_sys::Reflect::has(&pkg, &hash_key).map_err(|e| anyhow::anyhow!("{e:?}"))? {
            let hash = js_sys::Reflect::get(&pkg, &hash_key).unwrap();
            js_sys::Reflect::set(app_config, &package_key, &hash)
                .map_err(|e| anyhow::anyhow!("{e:?}"))?;

            Ok(())
        } else {
            anyhow::bail!("No package information provided! Set the 'package'")
        }
    } else {
        anyhow::bail!("No package information provided! Set the 'package'")
    }
}

#[wasm_bindgen]
impl Wasmer {
    /// Deploy an app to the registry.
    #[wasm_bindgen(js_name = "deployApp")]
    #[allow(non_snake_case)]
    pub async fn deploy_app(appConfig: JsValue) -> Result<DeployedApp, Error> {
        resolve_pkg(&appConfig)?;

        let default = js_sys::Reflect::get(&appConfig, &(String::from("default").into()))
            .map_err(utils::js_error)?
            .as_bool();
        let app_config = serde_wasm_bindgen::from_value(appConfig)
            .map_err(|e| anyhow::anyhow!("{e:?}"))?;

        Wasmer::deploy_app_inner(app_config, default).await
    }
}

impl Wasmer {
    async fn deploy_app_inner(
        app_config: AppConfigV1,
        make_default: Option<bool>,
    ) -> Result<DeployedApp, Error> {
        let client = Wasmer::get_client()?;
        let config = app_config.clone().to_yaml()?;

        wasmer_api::query::publish_deploy_app(
            client,
            PublishDeployAppVars {
                config,
                name: app_config.name.into(),
                owner: app_config.owner.map(Into::into),
                make_default,
            },
        )
        .await
        .map(|v| v.into())
        .map_err(|e| utils::Error::Rust(anyhow::anyhow!("{e:?}")))
    }
}
