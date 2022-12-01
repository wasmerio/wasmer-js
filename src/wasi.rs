use crate::fs::MemFS;

use std::io::{Read, Write};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasmer::{Imports, Instance, Module, Store};
use wasmer_wasi::Pipe;
use wasmer_wasi::{WasiError, WasiFunctionEnv, WasiState};

#[wasm_bindgen(typescript_custom_section)]
const WASI_CONFIG_TYPE_DEFINITION: &str = r#"
/** Options used when configuring a new WASI instance.  */
export type WasiConfig = {
    /** The command-line arguments passed to the WASI executable. */
    readonly args?: string[];
    /** Additional environment variables made available to the WASI executable. */
    readonly env?: Record<string, string>;
    /** Preopened directories. */
    readonly preopens?: Record<string, string>;
    /** The in-memory filesystem that should be used. */
    readonly fs?: MemFS;
};
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "WasiConfig")]
    pub type WasiConfig;
}

#[wasm_bindgen]
pub struct WASI {
    store: Store,
    stdout: Pipe,
    stdin: Pipe,
    stderr: Pipe,
    wasi_env: WasiFunctionEnv,
    module: Option<Module>,
    instance: Option<Instance>,
}

#[wasm_bindgen]
impl WASI {
    #[wasm_bindgen(constructor)]
    pub fn new(config: WasiConfig) -> Result<WASI, JsValue> {
        let args: Vec<String> = {
            let args = js_sys::Reflect::get(&config, &"args".into())?;
            if args.is_undefined() {
                vec![]
            } else {
                let args_array: js_sys::Array = args.dyn_into()?;
                args_array
                    .iter()
                    .map(|arg| {
                        arg.as_string()
                            .ok_or(js_sys::Error::new("All arguments must be strings").into())
                    })
                    .collect::<Result<Vec<String>, JsValue>>()?
            }
        };
        let env: Vec<(String, String)> = {
            let env = js_sys::Reflect::get(&config, &"env".into())?;
            if env.is_undefined() {
                vec![]
            } else {
                let env_obj: js_sys::Object = env.dyn_into()?;
                js_sys::Object::entries(&env_obj)
                    .iter()
                    .map(|entry| {
                        let entry: js_sys::Array = entry.unchecked_into();
                        let key: Result<String, JsValue> = entry.get(0).as_string().ok_or(
                            js_sys::Error::new("All environment keys must be strings").into(),
                        );
                        let value: Result<String, JsValue> = entry.get(1).as_string().ok_or(
                            js_sys::Error::new("All environment values must be strings").into(),
                        );
                        key.and_then(|key| Ok((key, value?)))
                    })
                    .collect::<Result<Vec<(String, String)>, JsValue>>()?
            }
        };

        let preopens: Vec<(String, String)> =
            {
                let preopens = js_sys::Reflect::get(&config, &"preopens".into())?;
                if preopens.is_undefined() {
                    vec![(".".to_string(), "/".to_string())]
                } else {
                    let preopens_obj: js_sys::Object = preopens.dyn_into()?;
                    js_sys::Object::entries(&preopens_obj)
                        .iter()
                        .map(|entry| {
                            let entry: js_sys::Array = entry.unchecked_into();
                            let key: Result<String, JsValue> = entry.get(0).as_string().ok_or(
                                js_sys::Error::new("All preopen keys must be strings").into(),
                            );
                            let value: Result<String, JsValue> = entry.get(1).as_string().ok_or(
                                js_sys::Error::new("All preopen values must be strings").into(),
                            );
                            key.and_then(|key| Ok((key, value?)))
                        })
                        .collect::<Result<Vec<(String, String)>, JsValue>>()?
                }
            };

        let fs = {
            let fs = js_sys::Reflect::get(&config, &"fs".into())?;
            if fs.is_undefined() {
                MemFS::new()?
            } else {
                MemFS::from_js(fs)?
            }
        };
        let mut store = Store::default();
        let stdout = Pipe::default();
        let stdin = Pipe::default();
        let stderr = Pipe::default();
        let wasi_env = WasiState::new(args.get(0).unwrap_or(&"".to_string()))
            .args(if !args.is_empty() { &args[1..] } else { &[] })
            .envs(env)
            .set_fs(Box::new(fs))
            .stdout(Box::new(stdout.clone()))
            .stdin(Box::new(stdin.clone()))
            .stderr(Box::new(stderr.clone()))
            .map_dirs(preopens)
            .map_err(|e| js_sys::Error::new(&format!("Couldn't preopen the dir: {}`", e)))?
            // .map_dirs(vec![(".".to_string(), "/".to_string())])
            // .preopen_dir("/").map_err(|e| js_sys::Error::new(&format!("Couldn't preopen the dir: {}`", e)))?
            .finalize(&mut store)
            .map_err(|e| js_sys::Error::new(&format!("Failed to create the WasiState: {}`", e)))?;

        Ok(WASI {
            store,
            stdout,
            stdin,
            stderr,
            wasi_env,
            module: None,
            instance: None,
        })
    }

    #[wasm_bindgen(getter)]
    pub fn fs(&mut self) -> Result<MemFS, JsValue> {
        let state = self.wasi_env.data_mut(&mut self.store).state();
        let mem_fs = state
            .fs
            .fs_backing
            .downcast_ref::<MemFS>()
            .ok_or_else(|| js_sys::Error::new("Failed to downcast to MemFS"))?;
        Ok(mem_fs.clone())
    }

    #[wasm_bindgen(js_name = getImports)]
    pub fn get_imports(
        &mut self,
        module: js_sys::WebAssembly::Module,
    ) -> Result<js_sys::Object, JsValue> {
        let module: js_sys::WebAssembly::Module = module.dyn_into().map_err(|_e| {
            js_sys::Error::new(
                "You must provide a module to the WASI new. `let module = new WASI({}, module);`",
            )
        })?;
        let module: Module = module.into();
        let import_object = self.get_wasi_imports(&module)?;

        self.module = Some(module);

        Ok(import_object.as_jsobject(&self.store))
    }

    fn get_wasi_imports(&mut self, module: &Module) -> Result<Imports, JsValue> {
        let import_object = self
            .wasi_env
            .import_object(&mut self.store, module)
            .map_err(|e| {
                js_sys::Error::new(&format!("Failed to create the Import Object: {}`", e))
            })?;
        Ok(import_object)
    }

    pub fn instantiate(
        &mut self,
        module_or_instance: JsValue,
        imports: Option<js_sys::Object>,
    ) -> Result<js_sys::WebAssembly::Instance, JsValue> {
        let instance = if module_or_instance.has_type::<js_sys::WebAssembly::Module>() {
            let js_module: js_sys::WebAssembly::Module = module_or_instance.unchecked_into();
            let module: Module = js_module.into();
            let import_object = self.get_wasi_imports(&module)?;
            let imports = if let Some(base_imports) = imports {
                let mut imports =
                    Imports::new_from_js_object(&mut self.store, &module, base_imports).map_err(
                        |e| js_sys::Error::new(&format!("Failed to get user imports: {}", e)),
                    )?;
                imports.extend(&import_object);
                imports
            } else {
                import_object
            };

            let instance = Instance::new(&mut self.store, &module, &imports)
                .map_err(|e| js_sys::Error::new(&format!("Failed to instantiate WASI: {}`", e)))?;
            self.module = Some(module);
            instance
        } else if module_or_instance.has_type::<js_sys::WebAssembly::Instance>() {
            if let Some(instance) = &self.instance {
                // We completely skip the set instance step
                return Ok(instance.raw(&self.store).clone());
            }
            let module = self.module.as_ref().ok_or(js_sys::Error::new("When providing an instance, the `wasi.getImports` must be called with the module first"))?;
            let js_instance: js_sys::WebAssembly::Instance = module_or_instance.unchecked_into();

            Instance::from_module_and_instance(&mut self.store, module, js_instance).map_err(
                |e| js_sys::Error::new(&format!("Can't get the Wasmer Instance: {:?}", e)),
            )?
        } else {
            return Err(
                js_sys::Error::new("You need to provide a `WebAssembly.Module` or `WebAssembly.Instance` as first argument to `wasi.instantiate`").into(),
            );
        };

        self.wasi_env
            .data_mut(&mut self.store)
            .set_memory(instance.exports.get_memory("memory").unwrap().clone());

        let raw_instance = instance.raw(&self.store).clone();
        self.instance = Some(instance);
        Ok(raw_instance)
    }

    /// Start the WASI Instance, it returns the status code when calling the start
    /// function
    pub fn start(
        &mut self,
        instance: Option<js_sys::WebAssembly::Instance>,
    ) -> Result<u32, JsValue> {
        if let Some(instance) = instance {
            self.instantiate(instance.into(), None)?;
        } else if self.instance.is_none() {
            return Err(
                js_sys::Error::new("You need to provide an instance as argument to `start`, or call `wasi.instantiate` with the `WebAssembly.Instance` manually").into(),
            );
        }
        let start = self
            .instance
            .as_ref()
            .unwrap()
            .exports
            .get_function("_start")
            .map_err(|_e| js_sys::Error::new("The _start function is not present"))?;
        let result = start.call(&mut self.store, &[]);

        match result {
            Ok(_) => Ok(0),
            Err(err) => {
                match err.downcast::<WasiError>() {
                    Ok(WasiError::Exit(exit_code)) => {
                        // We should exit with the provided exit code
                        Ok(exit_code)
                    }
                    Ok(err) => {
                        return Err(js_sys::Error::new(&format!(
                            "Unexpected WASI error while running start function: {}",
                            err
                        ))
                        .into())
                    }
                    Err(err) => {
                        return Err(js_sys::Error::new(&format!(
                            "Error while running start function: {}",
                            err
                        ))
                        .into())
                    }
                }
            }
        }
    }

    // Stdio methods below

    /// Get the stdout buffer
    /// Note: this method flushes the stdout
    #[wasm_bindgen(js_name = getStdoutBuffer)]
    pub fn get_stdout_buffer(&mut self) -> Result<Vec<u8>, JsValue> {
        let mut buf = Vec::new();
        self.stdout
            .read_to_end(&mut buf)
            .map_err(|e| js_sys::Error::new(&format!("Could not get the stdout bytes: {}`", e)))?;
        Ok(buf)
    }

    /// Get the stdout data as a string
    /// Note: this method flushes the stdout
    #[wasm_bindgen(js_name = getStdoutString)]
    pub fn get_stdout_string(&mut self) -> Result<String, JsValue> {
        let mut stdout_str = String::new();
        self.stdout.read_to_string(&mut stdout_str).map_err(|e| {
            js_sys::Error::new(&format!(
                "Could not convert the stdout bytes to a String: {}`",
                e
            ))
        })?;
        Ok(stdout_str)
    }

    /// Get the stderr buffer
    /// Note: this method flushes the stderr
    #[wasm_bindgen(js_name = getStderrBuffer)]
    pub fn get_stderr_buffer(&mut self) -> Result<Vec<u8>, JsValue> {
        let mut buf = Vec::new();
        self.stderr
            .read_to_end(&mut buf)
            .map_err(|e| js_sys::Error::new(&format!("Could not get the stderr bytes: {}`", e)))?;
        Ok(buf)
    }

    /// Get the stderr data as a string
    /// Note: this method flushes the stderr
    #[wasm_bindgen(js_name = getStderrString)]
    pub fn get_stderr_string(&mut self) -> Result<String, JsValue> {
        let mut stderr_str = String::new();
        self.stderr.read_to_string(&mut stderr_str).map_err(|e| {
            js_sys::Error::new(&format!(
                "Could not convert the stderr bytes to a String: {}`",
                e
            ))
        })?;
        Ok(stderr_str)
    }

    /// Set the stdin buffer
    #[wasm_bindgen(js_name = setStdinBuffer)]
    pub fn set_stdin_buffer(&mut self, buf: &[u8]) -> Result<(), JsValue> {
        self.stdin
            .write_all(buf)
            .map_err(|e| js_sys::Error::new(&format!("Error writing stdin: {}`", e)))?;
        Ok(())
    }

    /// Set the stdin data as a string
    #[wasm_bindgen(js_name = setStdinString)]
    pub fn set_stdin_string(&mut self, input: String) -> Result<(), JsValue> {
        self.set_stdin_buffer(input.as_bytes())
    }
}
