use crate::{
    utils::{self, Error},
    Wasmer,
};
use anyhow::Context;
use js_sys::{JsString, Math::random};
use std::collections::BTreeMap;
use tokio::io::AsyncBufReadExt as _;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasmer_config::package::Manifest;
use webc::{bytes::Bytes, wasmer_package::Strictness};
use webc::{
    wasmer_package::{MemoryDir, MemoryFile, MemoryNode, MemoryVolume, Package},
    Timestamps,
};

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone)]
pub struct WasmerPackage {
    pub manifest: js_sys::Object,
    pub data: Vec<u8>,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone)]
pub struct Volume {}

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone)]
pub struct Atom {}

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone)]
pub struct PublishPackageOutput {
    pub manifest: wasm_bindgen::JsValue,
    pub hash: String,
}

#[wasm_bindgen]
impl Wasmer {
    /// Create a `WasmerPackage`.
    #[wasm_bindgen(js_name = "createPackage")]
    #[allow(non_snake_case)]
    pub async fn createPackage(manifest: js_sys::Object) -> Result<WasmerPackage, Error> {
        let volumes: BTreeMap<String, MemoryVolume> = if let Ok(volumes) =
            js_sys::Reflect::get(&manifest, &JsValue::from(String::from("fs")))
        {
            js_sys::Reflect::delete_property(&manifest, &JsValue::from(String::from("fs")))
                .map_err(|e| anyhow::anyhow!("while deleting fs property: {e:?}"))?;

            if let Some(volumes) = js_sys::Object::try_from(&volumes) {
                let volumes = create_volumes(volumes)?;
                let fs = js_sys::Object::new();
                for (key, _) in volumes.iter() {
                    js_sys::Reflect::set(
                        &fs,
                        &JsString::from(key.as_str()).into(),
                        &JsString::from(key.as_str()).into(),
                    )
                    .map_err(|e| anyhow::anyhow!("while setting fs property: {e:?}"))?;
                }

                js_sys::Reflect::set(&manifest, &JsValue::from(String::from("fs")), &fs)
                    .map_err(|e| anyhow::anyhow!("while deleting fs property: {e:?}"))?;

                volumes
            } else {
                BTreeMap::default()
            }
        } else {
            BTreeMap::default()
        };

        // let atoms: BTreeMap<String, webc::compat::SharedBytes> = if manifest.is_object() {
        //     if let Ok(atoms) =
        //         js_sys::Reflect::get(&manifest, &JsValue::from(String::from("module")))
        //     {
        //         js_sys::Reflect::delete_property(&manifest, &JsValue::from(String::from("module")))
        //             .map_err(|e| anyhow::anyhow!("while deleting module property: {e:?}"))?;
        //         let atoms: BTreeMap<String, Bytes> = serde_wasm_bindgen::from_value(atoms)
        //             .map_err(|e| anyhow::anyhow!(e.to_string()))?;
        //         let mut ret = BTreeMap::default();
        //         for (k, v) in atoms.into_iter() {
        //             ret.insert(k, webc::compat::SharedBytes::from_bytes(v));
        //         }

        //         ret
        //     } else {
        //         BTreeMap::default()
        //     }
        // } else {
        //     BTreeMap::default()
        // };

        let wasmer_manifest: Manifest = serde_wasm_bindgen::from_value(manifest.clone().into())
            .map_err(|e| anyhow::anyhow!(e.to_string()))?;
        wasmer_manifest.validate()?;

        let pkg: Package = webc::wasmer_package::Package::from_in_memory(
            wasmer_manifest,
            volumes,
            BTreeMap::default(),
            Strictness::default(),
        )
        .context("While parsing the manifest")?;
        let data = pkg
            .serialize()
            .context("While validating the package")?
            .to_vec();

        Ok(WasmerPackage { manifest, data })
    }

    /// Publish a package to the registry.
    #[wasm_bindgen(js_name = "publishPackage")]
    #[allow(non_snake_case)]
    pub async fn publishPackage(
        wasmerPackage: WasmerPackage,
    ) -> Result<PublishPackageOutput, Error> {
        let manifest: Manifest = serde_wasm_bindgen::from_value(wasmerPackage.manifest.into())
            .map_err(|e| anyhow::anyhow!(e.to_string()))?;
        Wasmer::publish_package_inner(manifest, wasmerPackage.data.into()).await
    }
}

impl Wasmer {
    async fn publish_package_inner(
        manifest: Manifest,
        bytes: Bytes,
    ) -> Result<PublishPackageOutput, Error> {
        let client = Wasmer::get_client()?;

        let signed_url = wasmer_api::query::get_signed_url_for_package_upload(
            client,
            Some(60 * 30),
            Some(format!("test-{}", random()).replace('.', "-")).as_deref(),
            None,
            None,
        )
        .await?
        .ok_or_else(|| anyhow::anyhow!("No signed url!"))?
        .url;

        upload(bytes, &signed_url).await?;

        let (namespace, name) =
            if let Some(full_name) = manifest.package.as_ref().and_then(|p| p.name.clone()) {
                let splits: Vec<String> = full_name.split('/').map(|s| s.to_string()).collect();
                (
                    splits
                        .first()
                        .ok_or_else(|| anyhow::anyhow!("No namespace provided!"))?
                        .clone(),
                    splits.get(1).cloned(),
                )
            } else {
                return Err(utils::Error::Rust(anyhow::anyhow!(
                    "No namespace provided!"
                )));
            };

        let out = wasmer_api::query::push_package_release(
            client,
            name.as_deref(),
            &namespace,
            &signed_url,
            manifest.package.as_ref().map(|p| p.private),
        )
        .await?
        .ok_or_else(|| anyhow::anyhow!("Backend returned no data!"))?;

        Ok(PublishPackageOutput {
            manifest: serde_wasm_bindgen::to_value(&manifest)
                .map_err(|e| anyhow::anyhow!(e.to_string()))?,
            hash: out
                .package_webc
                .and_then(|p| p.webc_v3)
                .map(|c| c.webc_sha256)
                .ok_or_else(|| anyhow::anyhow!("No package was published!"))?,
        })
    }
}

// Upload a package to a signed url.
pub(super) async fn upload(bytes: Bytes, signed_url: &str) -> anyhow::Result<String> {
    let client = reqwest::Client::builder()
        .default_headers(reqwest::header::HeaderMap::default())
        .build()
        .unwrap();

    let res = client
        .request(reqwest::Method::POST, signed_url)
        .header(reqwest::header::CONTENT_LENGTH, "0")
        .header(reqwest::header::CONTENT_TYPE, "application/octet-stream")
        .header("x-goog-resumable", "start")
        .header(reqwest::header::ACCEPT, "*/*")
        .header(reqwest::header::ACCESS_CONTROL_ALLOW_HEADERS, "*")
        .header(reqwest::header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header(reqwest::header::ACCESS_CONTROL_ALLOW_METHODS, "*")
        .header(reqwest::header::ACCESS_CONTROL_MAX_AGE, "43200");

    let result = res.send().await?;

    if result.status() != reqwest::StatusCode::from_u16(201).unwrap() {
        return Err(anyhow::anyhow!(
            "Uploading package failed: got HTTP {:?} when uploading",
            result.status()
        ));
    }

    let headers = result
        .headers()
        .into_iter()
        .filter_map(|(k, v)| {
            let k = k.to_string();
            let v = v.to_str().ok()?.to_string();
            Some((k.to_lowercase(), v))
        })
        .collect::<BTreeMap<_, _>>();

    let session_uri = headers
        .get("location")
        .ok_or_else(|| {
            anyhow::anyhow!("The upload server did not provide the upload URL correctly")
        })?
        .clone();

    //* XXX: If the package is large this line may result in
    // * a surge in memory use.
    // *
    // * In the future, we might want a way to stream bytes
    // * from the webc instead of a complete in-memory
    // * representation.
    // */
    let total_bytes = bytes.len();

    let chunk_size = 2_097_152; // 2MB

    let mut reader = tokio::io::BufReader::with_capacity(chunk_size, &bytes[..]);
    let mut cursor = 0;

    while let Some(chunk) = reader.fill_buf().await.ok().map(|s| s.to_vec()) {
        let n = chunk.len();

        if chunk.is_empty() {
            break;
        }

        let start = cursor;
        let end = cursor + chunk.len().saturating_sub(1);
        let content_range = format!("bytes {start}-{end}/{total_bytes}");

        let res = client
            .put(&session_uri)
            .header(reqwest::header::CONTENT_TYPE, "application/octet-stream")
            .header(reqwest::header::CONTENT_LENGTH, format!("{}", chunk.len()))
            .header("Content-Range".to_string(), content_range)
            .body(chunk.to_vec());

        let res = res.send().await;
        res.map(|response| response.error_for_status())
            .map_err(|e| {
                anyhow::anyhow!(
                    "cannot send request to {session_uri} (chunk {}..{}): {e}",
                    cursor,
                    cursor + chunk_size
                )
            })??;

        if n < chunk_size {
            break;
        }

        reader.consume(n);
        cursor += n;
    }
    Ok(signed_url.to_string())
}

fn create_volumes(volumes: &js_sys::Object) -> Result<BTreeMap<String, MemoryVolume>, Error> {
    let mut ret = BTreeMap::default();
    for (key, value) in utils::object_entries(volumes)?.into_iter() {
        ret.insert(
            format!(
                "/{}",
                key.as_string()
                    .ok_or_else(|| anyhow::anyhow!("Error making a string out of the key!"))?
            ),
            create_memory_volume(value)?,
        );
    }
    Ok(ret)
}

fn create_memory_volume(value: JsValue) -> Result<MemoryVolume, Error> {
    let node = create_memory_node(value)?;

    match node {
        MemoryNode::File(f) => Err(Error::Rust(anyhow::anyhow!(
            "Cannot create a volume from the single file {f:?}!"
        ))),
        MemoryNode::Dir(node) => Ok(MemoryVolume { node }),
    }
}

fn create_memory_node(value: JsValue) -> Result<MemoryNode, Error> {
    if value.is_array() {
        let data = js_sys::Uint8Array::from(value).to_vec();

        let file = MemoryNode::File(MemoryFile {
            metadata: Some(webc::Metadata::File {
                timestamps: Some(Timestamps::default()),
                length: data.len(),
            }),
            data,
        });

        Ok(file)
    } else if value.is_object() {
        let obj = js_sys::Object::try_from(&value)
            .ok_or_else(|| anyhow::anyhow!("Cannot create a directory out of non-object value!"))?;
        let mut nodes = BTreeMap::default();
        for (key, value) in utils::object_entries(obj)?.into_iter() {
            nodes.insert(
                key.as_string()
                    .ok_or_else(|| anyhow::anyhow!("Error making a string out of the key!"))?,
                create_memory_node(value)?,
            );
        }

        let dir = MemoryNode::Dir(MemoryDir {
            metadata: Some(webc::Metadata::Dir {
                timestamps: Some(Timestamps::default()),
            }),
            nodes,
        });

        Ok(dir)
    } else {
        Err(Error::Rust(anyhow::anyhow!(
            "Cannot create a memory node out of {value:#?}"
        )))
    }
}
