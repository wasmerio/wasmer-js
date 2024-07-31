use instant::Duration;
use js_sys::{
    JsString, Object,
    Reflect::{delete_property, get, set},
};
use std::{collections::BTreeMap, path::Path, time::SystemTime};
use wasm_bindgen::{JsCast, JsValue};
use webc::wasmer_package::{MemoryDir, MemoryFile, MemoryNode, MemoryVolume};

use crate::utils;

fn to_systime(modified: &JsValue) -> anyhow::Result<SystemTime> {
    let millis = if let Some(date) = modified.dyn_ref::<js_sys::Date>() {
        date.get_time()
    } else if let Some(millis) = modified.as_f64() {
        millis
    } else {
        anyhow::bail!("'modified' is neither a 'Date' or a number!")
    };

    SystemTime::UNIX_EPOCH
        .checked_add(Duration::from_secs_f64(millis))
        .ok_or_else(|| anyhow::anyhow!("Error creating the timestamp"))
}

fn create_node(value: JsValue) -> anyhow::Result<MemoryNode> {
    // We don't know if the value represents a node or a dir, and the two can share a common
    // pre-structure ({data: <file/dir>, meta: -})

    let data_key = JsString::from("data");
    let modified_key = JsString::from("modified");

    let (data, modified) =
        if let (Ok(data), Ok(modified)) = (get(&value, &data_key), get(&value, &modified_key)) {
            if !data.is_undefined() && !modified.is_undefined() {
                (data, to_systime(&modified)?)
            } else {
                (value, SystemTime::UNIX_EPOCH)
            }
        } else {
            (value, SystemTime::UNIX_EPOCH)
        };

    Ok(
        if data.is_string() || data.is_instance_of::<js_sys::Uint8Array>() {
            MemoryNode::File(create_file(data, modified)?)
        } else {
            MemoryNode::Dir(create_dir(data, modified)?)
        },
    )
}

fn create_file(data: JsValue, modified: SystemTime) -> anyhow::Result<MemoryFile> {
    let data = if data.is_string() {
        data.as_string().unwrap().as_bytes().to_vec()
    } else if data.is_instance_of::<js_sys::Uint8Array>() {
        js_sys::Uint8Array::from(data.clone()).to_vec()
    } else {
        anyhow::bail!("The embedded file is not a string or a 'Uint8Array")
    };

    Ok(MemoryFile { modified, data })
}

fn create_dir(data: JsValue, modified: SystemTime) -> anyhow::Result<MemoryDir> {
    // The assumption is that 'data' is in the form
    //  <embedded_dir> := {
    //   'ident1' : '<node>',
    //   'ident2' : '<node>',
    //   ...
    //  }

    let mut nodes = BTreeMap::new();

    let entries = utils::object_entries(&data.dyn_into::<Object>().unwrap())
        .map_err(|e| anyhow::anyhow!("{e}"))?
        .into_iter();

    for (key, value) in entries {
        nodes.insert(key.as_string().unwrap(), create_node(value)?);
    }

    Ok(MemoryDir { modified, nodes })
}

fn create_volume(value: JsValue) -> anyhow::Result<MemoryVolume> {
    // Each volume is specified on the user-side as an embedded directory.
    //
    // Users can specify directories in two forms:
    //
    // 1. Explicitly setting metadata
    // {
    //  data: '<embedded_dir>',
    //  modified: '<user_time>'
    // }
    //
    // 2. Using default metadata
    // '<embedded_dir>'
    //
    // where <embedded_dir> is an object mapping node names to node contents:
    //
    // <embedded_dir> := {
    //  'ident1' : '<node>',
    //  'ident2' : '<node>',
    //  ...
    // }

    let data_key = JsString::from("data");
    let modified_key = JsString::from("modified");

    if let (Ok(data), Ok(modified)) = (get(&value, &data_key), get(&value, &modified_key)) {
        if !data.is_undefined() && !modified.is_undefined() {
            return Ok(MemoryVolume {
                node: create_dir(data, to_systime(&modified)?)?,
            });
        }
    }
    // Assume it's directly an '<embedded_dir>'.
    Ok(MemoryVolume {
        node: create_dir(value, SystemTime::UNIX_EPOCH)?,
    })
}

pub fn create_volumes(
    manifest: &js_sys::Object,
    base_dir: &Path,
) -> anyhow::Result<BTreeMap<String, MemoryVolume>> {
    let fs_key = JsString::from("fs");

    if let Ok(fs) = get(manifest, &fs_key) {
        if !fs.is_undefined() && fs.is_object() {
            // Remove the original 'fs' property on the manifest object.
            delete_property(manifest, &fs_key)
                .map_err(|e| anyhow::anyhow!("while deleting fs property: {e:?}"))?;

            // The 'fs' property's value must be a map in the form
            //
            // {
            //     '<guest_dir>' : '<embedded_dir>'
            // }

            let fs = fs
                .dyn_into::<Object>()
                .map_err(|e| anyhow::anyhow!("{e:?}"))?;

            let mut volumes = BTreeMap::new();
            let new_fs = js_sys::Object::new();

            let entries = utils::object_entries(&fs)
                .map_err(|e| anyhow::anyhow!("{e}"))?
                .into_iter();

            for (key, value) in entries {
                let key_str = key.as_string().unwrap();
                volumes.insert(
                    base_dir.join(key_str).display().to_string(),
                    create_volume(value)?,
                );
                set(&new_fs, &key, &key)
                    .map_err(|e| anyhow::anyhow!("while setting fs property: {e:?}"))?;
            }

            set(manifest, &fs_key, &new_fs)
                .map_err(|e| anyhow::anyhow!("while deleting fs property: {e:?}"))?;

            return Ok(volumes);
        }
    }

    Ok(BTreeMap::new())
}

pub fn create_atoms(
    manifest: &js_sys::Object,
) -> anyhow::Result<BTreeMap<String, (Option<String>, webc::compat::SharedBytes)>> {
    // [todo]:
    // [module]
    // name = .sdasd
    // source = []
    //
    // ->
    //
    // [module]
    // name = .sdasda
    // source = .sdasda
    let module_key = JsString::from("module");
    let mut atoms_data = BTreeMap::new();

    if let Ok(modules) = get(manifest, &module_key) {
        if !modules.is_undefined() {
            if !modules.is_array() {
                anyhow::bail!("'module' must be an array!")
            } else {
                let modules = js_sys::Array::from(&modules);
                let name_key = JsString::from("name");
                let source_key = JsString::from("source");
                for o in modules.to_vec().into_iter() {
                    let (name, source) = (
                        get(&o, &name_key).map_err(|e| anyhow::anyhow!("{e:?}"))?,
                        get(&o, &source_key).map_err(|e| anyhow::anyhow!("{e:?}"))?,
                    );

                    if name.is_undefined()
                        || name.is_null()
                        || source.is_undefined()
                        || source.is_null()
                    {
                        anyhow::bail!("'name', or 'source' undefined")
                    }

                    if !name.is_string() {
                        anyhow::bail!("'name' must be a string")
                    }

                    let name = name.as_string().unwrap();

                    let MemoryFile { data, .. } = match create_node(source)? {
                        MemoryNode::File(f) => f,
                        MemoryNode::Dir(_) => anyhow::bail!("The atom must be a file!"),
                    };

                    atoms_data.insert(
                        name.clone(),
                        (None, webc::compat::SharedBytes::from_bytes(data)),
                    );
                    set(&o, &source_key, &JsValue::from_str(&name))
                        .map_err(|e| anyhow::anyhow!("While setting object values: {e:?}"))?;
                }
            }
        }
    }

    Ok(atoms_data)
}

pub fn create_metadata(manifest: &js_sys::Object, base_dir: &Path) -> anyhow::Result<MemoryVolume> {
    let pkg_key = JsString::from("package");
    let readme_key = JsString::from("readme");
    let license_key = JsString::from("license");

    let guest_readme_key = JsString::from(base_dir.join("README.md").display().to_string());
    let guest_license_key = JsString::from(base_dir.join("License").display().to_string());

    let meta_obj = js_sys::Object::new();

    let dir = if let Ok(pkg) = get(manifest, &pkg_key) {
        if let Ok(readme_file) = get(&pkg, &readme_key) {
            if !readme_file.is_undefined() {
                set(&meta_obj, &guest_readme_key, &readme_file)
                    .map_err(|e| anyhow::anyhow!("{e:?}"))?;
                set(&pkg, &readme_key, &guest_readme_key)
                    .map_err(|e| anyhow::anyhow!("While setting object values: {e:?}"))?;
            }
        }
        if let Ok(license_file) = get(&pkg, &license_key) {
            if !license_file.is_undefined() {
                set(&meta_obj, &guest_license_key, &license_file)
                    .map_err(|e| anyhow::anyhow!("{e:?}"))?;
                set(&pkg, &license_key, &guest_license_key)
                    .map_err(|e| anyhow::anyhow!("While setting object values: {e:?}"))?;
            }
        }

        create_dir(meta_obj.into(), SystemTime::UNIX_EPOCH)?
    } else {
        MemoryDir {
            modified: SystemTime::UNIX_EPOCH,
            nodes: BTreeMap::default(),
        }
    };

    Ok(MemoryVolume { node: dir })
}
