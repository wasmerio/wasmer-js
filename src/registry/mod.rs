pub mod app;
pub mod package;

use anyhow::anyhow;
use js_sys::Reflect::{get, has};
use wasm_bindgen::{convert::TryFromJsValue, JsValue, prelude::wasm_bindgen};
use wasmer_api::WasmerClient;

use crate::{utils::Error, Wasmer};

#[derive(Debug, Default, Clone)]
pub struct RegistryConfig {
    pub registry_url: Option<String>,
    pub token: Option<String>,
}

impl TryFromJsValue for RegistryConfig {
    type Error = JsValue;

    fn try_from_js_value(value: wasm_bindgen::prelude::JsValue) -> Result<Self, Self::Error> {
        let token_key = JsValue::from_str("token");
        let registry_url_key = JsValue::from_str("registryUrl");
        let token = if has(&value, &token_key)? {
            let token = get(&value, &token_key)?;
            if let Some(token) = token.as_string() {
                Some(token)
            } else {
                return Err(JsValue::from_str(
                    "Cannot create token from non-string object!",
                ));
            }
        } else {
            None
        };

        let registry_url = if has(&value, &registry_url_key)? {
            let registry_url = get(&value, &registry_url_key)?;
            if let Some(registry_url) = registry_url.as_string() {
                Some(registry_url)
            } else if registry_url.is_null() || registry_url.is_undefined() {
                Some(crate::DEFAULT_REGISTRY.into())
            } else {
                return Err(JsValue::from_str(
                    "Cannot create registry url from non-string object!",
                ));
            }
        } else {
            None
        };

        Ok(Self {
            registry_url,
            token,
        })
    }
}

impl Wasmer {
    pub fn get_client() -> Result<WasmerClient, Error> {
        let registry_input = if let Some(registry_info) =
            js_sys::Reflect::get(&js_sys::global(), &"__WASMER_REGISTRY__".into()).ok()
        {
            RegistryConfig::try_from_js_value(registry_info.into())
                .map_err(|e| anyhow!("while reading registry configuration: {e:?}"))?
        } else {
            RegistryConfig::default()
        };

        let mut client = wasmer_api::WasmerClient::new(
            url::Url::parse(
                &registry_input
                    .registry_url
                    .unwrap_or(crate::DEFAULT_REGISTRY.into()),
            )?,
            crate::USER_AGENT,
        )?;
        if let Some(token) = registry_input.token {
            client = client.with_auth_token(token);
        }

        Ok(client)
    }
}


#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone)]
pub struct User {
    pub id: String,
    pub username: String,
}

impl From<wasmer_api::types::User> for User {
    fn from(value: wasmer_api::types::User) -> Self {
        Self {
            id: value.id.inner().to_string(),
            username: value.username,
        }
    }
}

#[wasm_bindgen]
impl Wasmer {
    /// Deploy an app to the registry.
    #[wasm_bindgen(js_name = "whoami")]
    #[allow(non_snake_case)]
    pub async fn whoami() -> Result<Option<User>, Error> {
        let client = Wasmer::get_client()?;

        let result: Result<Option<wasmer_api::types::User>, anyhow::Error> =
            wasmer_api::query::current_user(&client).await;
        
        Ok(result.map_err(|e| crate::utils::Error::Rust(anyhow!("while retrieving the user: {e:?}")))?.map(Into::into))
    }
}
