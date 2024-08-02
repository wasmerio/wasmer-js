use anyhow::{anyhow, bail};
use js_sys::Reflect::{get, has, set};
use wasm_bindgen::{convert::TryFromJsValue, prelude::wasm_bindgen, JsValue};
use wasmer_api::types::{DeployAppVersion, PublishDeployAppVars};
use wasmer_config::{app::AppConfigV1, package::PackageBuilder};

use crate::{
    utils::{self, Error},
    wasmer::UserPackageDefinition,
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

async fn resolve_pkg(app_config: &JsValue) -> anyhow::Result<()> {
    // The app config must have a 'package' field.
    //
    // The package field can either be a raw string or a [`Wasmer`].

    let package_key = JsValue::from_str("package");
    let package = get(app_config, &package_key)
        .map_err(|e| anyhow!("While trying to get the package field from the app config: {e:?}"))?;

    if package.is_undefined() {
        bail!("While trying to get the package field from the app config: undefined field name")
    }

    let pkg_key = JsValue::from_str("pkg");

    if package.is_string() {
        // Do nothing
        Ok(())
    } else if has(&package, &pkg_key).map_err(|e| anyhow!("{e:?}"))? {
        let pkg = get(&package, &pkg_key).unwrap();
        let mut u = UserPackageDefinition::try_from_js_value(pkg).map_err(|e| {
            anyhow!("Error while casting 'pkg' field back to inner rust type: {e:?}")
        })?;

        // Set the app to use the package hash to deploy the app.
        set(app_config, &package_key, &JsValue::from(u.hash.clone()))
            .map_err(|e| anyhow!("{e:?}"))?;

        if u.manifest.package.is_none() || u.manifest.package.and_then(|v| v.name).is_none() {
            // The package was left unnamed - we need to publish it!
            let owner_key = JsValue::from_str("owner");
            if has(app_config, &owner_key).map_err(|e| anyhow!("{e:?}"))? {
                let owner = get(app_config, &owner_key).map_err(|e| anyhow!("{e:?}"))?;
                if !owner.is_string() {
                    anyhow::bail!("'owner' in the provided app config is not a string!")
                }

                let owner = owner.as_string().unwrap();
                u.manifest.package = Some(
                    PackageBuilder::default()
                        .name(format!("{owner}/"))
                        .build()?,
                );

                Wasmer::publish_package_inner(&u.hash, u.manifest.clone(), u.data.clone())
                    .await
                    .map_err(|e| anyhow!("{e:?}"))?;
            } else {
                anyhow::bail!("app config has no owner specified! Specify one with 'owner'")
            }
        }

        Ok(())
    } else {
        bail!("no package information provided! Set the 'package' field!")
    }
}

#[wasm_bindgen]
impl Wasmer {
    /// Deploy an app to the registry.
    #[wasm_bindgen(js_name = "deployApp")]
    #[allow(non_snake_case)]
    pub async fn deploy_app(appConfig: JsValue) -> Result<DeployedApp, Error> {
        resolve_pkg(&appConfig).await?;

        let default = get(&appConfig, &(String::from("default").into()))
            .map_err(utils::js_error)?
            .as_bool();

        let app_config = serde_wasm_bindgen::from_value(appConfig)
            .map_err(|e| anyhow!("while deserializing the app config: {e:?}"))?;
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
        .map_err(|e| utils::Error::Rust(anyhow!("while deploying the app: {e:?}")))
    }
}
