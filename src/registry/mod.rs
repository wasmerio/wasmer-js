pub mod app;
pub mod package;

use anyhow::anyhow;
use js_sys::Reflect::{get, has};
use wasm_bindgen::{convert::TryFromJsValue, JsValue};
use wasmer_api::WasmerClient;

use crate::{utils::Error, Wasmer};

static WASMER_CLIENT: std::sync::OnceLock<WasmerClient> = std::sync::OnceLock::new();

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
    pub fn get_client() -> Result<&'static WasmerClient, Error> {
        WASMER_CLIENT.get_or_try_init(|| {
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
                crate::USER_AGENT
            )?;
            if let Some(token) = registry_input.token {
                client = client.with_auth_token(token);
            }

            Ok(client)
        })
    }
}
