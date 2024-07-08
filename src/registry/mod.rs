pub mod app;
pub mod package;

use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasmer_api::WasmerClient;

use crate::{utils::Error, Wasmer};

static WASMER_CLIENT: std::sync::OnceLock<WasmerClient> = std::sync::OnceLock::new();

#[wasm_bindgen(getter_with_clone)]
pub struct RegistryConfig {
    pub registry_url: String,
    pub token: Option<String>,
}

impl Default for RegistryConfig {
    fn default() -> Self {
        Self {
            registry_url: String::from("https://registry.wasmer.io/graphql"),
            token: Default::default(),
        }
    }
}

impl Wasmer {
    pub fn get_client() -> Result<&'static WasmerClient, Error> {
        WASMER_CLIENT.get_or_try_init(|| {
            let registry_input = if let Some(registry_info) =
                web_sys::window().and_then(|w| w.get("__WASMER_REGISTRY__"))
            {
                if registry_info.is_undefined() {
                    RegistryConfig::default()
                } else {
                    let registry_url = js_sys::Reflect::get(
                        &registry_info,
                        &JsValue::from(String::from("registry_url")),
                    )
                    .ok()
                    .and_then(|u| u.as_string());
                    let token =
                        js_sys::Reflect::get(&registry_info, &JsValue::from(String::from("token")))
                            .ok()
                            .and_then(|u| u.as_string());

                    if let Some(registry_url) = registry_url {
                        RegistryConfig {
                            registry_url,
                            token,
                        }
                    } else {
                        RegistryConfig {
                            token,
                            ..Default::default()
                        }
                    }
                }
            } else {
                RegistryConfig::default()
            };

            let mut client = wasmer_api::WasmerClient::new(
                url::Url::parse(&registry_input.registry_url)?,
                "Wasmer JS SDK",
            )?;
            if let Some(token) = registry_input.token {
                client = client.with_auth_token(token);
            }

            Ok(client)
        })
    }
}
