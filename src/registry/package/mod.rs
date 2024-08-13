mod package_utils;

use crate::{
    utils::{self, Error},
    wasmer::OptionalRuntime,
    Wasmer,
};
use js_sys::Math::random;
use package_utils::*;
use std::path::PathBuf;
use wasm_bindgen::prelude::wasm_bindgen;
use wasmer_config::package::Manifest;
use webc::wasmer_package::Package;
use webc::wasmer_package::Strictness;

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

#[wasm_bindgen(typescript_custom_section)]
const TYPE_DEFINITIONS: &'static str = r#"
/**
 * A command available in a package
 */
export type PackageCommand = {
    module: string;
    name: string;
    runner: "https://webc.org/runner/wasi";
    annotations?: {
        wasi?: {
            env?: string[];
            "main-args": string[];
        }
    };
};

export type VolumeFileData = string | Uint8Array;
export type VolumeFileDate = Date | Number;
export type VolumeFile = VolumeFileData | { data: VolumeFileData, modified: VolumeFileDate}
export type VolumeTree = {
    [name: string]: VolumeFile | VolumeTree
};

/**
 * Manifest of a package.
 * For more information, please check the package manifest docs:
 * https://docs.wasmer.io/registry/manifest
 */
export type PackageManifest = {
    command?: PackageCommand[],
    dependencies?: {
        [name:string]: string
    },
    fs: VolumeTree;
};
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "PackageManifest", extends = js_sys::Object)]
    pub type PackageManifest;
}

#[wasm_bindgen]
impl Wasmer {
    /// Create a `WasmerPackage`.
    #[wasm_bindgen(js_name = "createPackage")]
    #[allow(non_snake_case)]
    pub async fn createPackage(manifest: PackageManifest) -> Result<Wasmer, Error> {
        let base_dir = PathBuf::from("/");
        let volumes = package_utils::create_volumes(&manifest, &base_dir)?;

        let metadata = package_utils::create_metadata(&manifest, &base_dir)?;

        let atoms = package_utils::create_atoms(&manifest)?;

        let wasmer_manifest: Manifest = serde_wasm_bindgen::from_value(manifest.clone().into())
            .map_err(|e| anyhow::anyhow!("While parsing the manifest: {e}"))?;
        wasmer_manifest.validate()?;

        let pkg: Package = webc::wasmer_package::Package::from_in_memory(
            wasmer_manifest.clone(),
            volumes,
            atoms,
            metadata,
            Strictness::default(),
        )
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;

        let runtime = OptionalRuntime::default().resolve()?.into_inner();
        Wasmer::from_user_package(pkg, wasmer_manifest, runtime).await
    }

    /// Publish a package to the registry.
    #[wasm_bindgen(js_name = "publishPackage")]
    #[allow(non_snake_case)]
    pub async fn publishPackage(wasmerPackage: &Wasmer) -> Result<PublishPackageOutput, Error> {
        match &wasmerPackage.pkg {
            Some(p) => {
                Wasmer::publish_package_inner(&p.hash, p.manifest.clone(), p.data.clone()).await
            }
            None => Err(Error::Rust(anyhow::anyhow!(
                "The selected package has no container!"
            ))),
        }
    }
}

impl Wasmer {
    pub(super) async fn publish_package_inner(
        hash: &str,
        manifest: Manifest,
        bytes: bytes::Bytes,
    ) -> Result<PublishPackageOutput, Error> {
        let client = Wasmer::get_client()?;

        let (id, hash) = if let Some(release) =
            wasmer_api::query::get_package_release(&client, hash).await?
        {
            (release.id, release.webc_v3.map(|v| v.webc_sha256))
        } else {
            let signed_url = wasmer_api::query::get_signed_url_for_package_upload(
                &client,
                Some(60 * 30),
                Some(format!("js-{}", random()).replace('.', "-")).as_deref(),
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

            tracing::debug!("Pushing package release...");
            let out = wasmer_api::query::push_package_release(
                &client,
                name.as_deref(),
                &namespace,
                &signed_url,
                manifest.package.as_ref().map(|p| p.private),
            )
            .await
            .map_err(|e| anyhow::anyhow!("{e:?}"))?
            .ok_or_else(|| anyhow::anyhow!("Backend returned no data!"))?;
            if let Some(package_web) = out.package_webc {
                (package_web.id, package_web.webc_v3.map(|v| v.webc_sha256))
            } else {
                return Err(
                    anyhow::anyhow!("No package identifier was found, tagging failed!").into(),
                );
            }
        };

        let hash =
            hash.ok_or_else(|| anyhow::anyhow!("No hash given for the uploaded package!"))?;

        if let Some(name) = manifest.package.as_ref().and_then(|p| p.name.as_ref()) {
            // We use a hack to deploy with unnamed packages that fills in the namespace in the
            // manifest, so just checking if "name" is some is not enough. The logical solution?
            // Another - smaller - hack!
            let splits = name
                .split('/')
                .filter(|v| !v.is_empty())
                .collect::<Vec<_>>();

            if splits.len() <= 1 {
                return Ok(PublishPackageOutput {
                    manifest: serde_wasm_bindgen::to_value(&manifest)
                        .map_err(|e| anyhow::anyhow!("{e:?}"))?,
                    hash,
                });
            }

            let version =
                if let Some(version) = manifest.package.as_ref().and_then(|p| p.version.as_ref()) {
                    version.to_string()
                } else {
                    return Err(anyhow::anyhow!("No version provided!").into());
                };

            let maybe_description = manifest
                .package
                .as_ref()
                .and_then(|p| p.description.clone());
            let maybe_homepage = manifest.package.as_ref().and_then(|p| p.homepage.clone());
            let maybe_license = manifest.package.as_ref().and_then(|p| p.license.clone());
            let maybe_license_file = manifest
                .package
                .as_ref()
                .and_then(|p| p.license_file.clone())
                .map(|f| f.to_string_lossy().to_string());
            let maybe_readme = manifest
                .package
                .as_ref()
                .and_then(|p| p.readme.clone())
                .map(|f| f.to_string_lossy().to_string());
            let maybe_repository = manifest.package.as_ref().and_then(|p| p.repository.clone());

            let private = if let Some(pkg) = &manifest.package {
                Some(pkg.private)
            } else {
                Some(false)
            };

            let manifest_raw = Some(toml::to_string(&manifest)?);

            let r = wasmer_api::query::tag_package_release(
                &client,
                maybe_description.as_deref(),
                maybe_homepage.as_deref(),
                maybe_license.as_deref(),
                maybe_license_file.as_deref(),
                manifest_raw.as_deref(),
                name,
                None,
                &id,
                private,
                maybe_readme.as_deref(),
                maybe_repository.as_deref(),
                &version,
            );

            r.await?;
        }

        Ok(PublishPackageOutput {
            manifest: serde_wasm_bindgen::to_value(&manifest)
                .map_err(|e| anyhow::anyhow!("{e:?}"))?,
            hash,
        })
    }
}
