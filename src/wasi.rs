use crate::{
    fs::MemFS,
    pool::WebThreadPool,
    runtime::WebRuntime,
    tty::{Tty, TtyState},
};

use std::sync::Arc;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use wasm_bindgen_downcast::DowncastJS;
use wasmer::{AsJs, Imports, Instance, Module, Store};
use wasmer_wasix::fs::WasiFsRoot;
use wasmer_wasix::{WasiEnvBuilder, WasiError, WasiFunctionEnv};
use web_sys::{ReadableStream, WritableStream};

#[cfg(any(feature = "console_error_panic_hook", feature = "tracing"))]
static START: std::sync::Once = std::sync::Once::new();

#[wasm_bindgen(typescript_custom_section)]
const WASI_CONFIG_TYPE_DEFINITION: &str = r#"
/** Options used when configuring a new WASI instance.  */
export interface WasiConfig {
    /** The command-line arguments passed to the WASI executable. */
    readonly args?: string[];
    /** Additional environment variables made available to the WASI executable. */
    readonly env?: Record<string, string>;
    /** Preopened directories. */
    readonly preopens?: Record<string, string>;
    /** The in-memory filesystem that should be used. */
    readonly fs?: MemFS;
    /** Maximum concurrency to use (minimum of 1) */
    readonly concurrency?: number;
    /** The initial tty state */
    readonly tty?: TtyState;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "WasiConfig")]
    pub type WasiConfig;
}

#[wasm_bindgen]
pub struct WASI {
    store: Store,
    wasi_env: WasiFunctionEnv,
    module: Option<Module>,
    instance: Option<Instance>,
    _tty: Tty,
    io: (WritableStream, ReadableStream, ReadableStream),
}

#[wasm_bindgen]
impl WASI {
    #[wasm_bindgen(constructor)]
    pub fn new(config: WasiConfig) -> Result<WASI, JsValue> {
        #[cfg(any(feature = "console_error_panic_hook", feature = "tracing"))]
        START.call_once(|| {
            #[cfg(feature = "console_error_panic_hook")]
            std::panic::set_hook(Box::new(console_error_panic_hook::hook));
            #[cfg(feature = "tracing")]
            tracing_wasm::set_as_global_default_with_config(
                tracing_wasm::WASMLayerConfigBuilder::new()
                    .set_report_logs_in_timings(false)
                    .set_max_level(tracing::Level::TRACE)
                    .build(),
            );
        });
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
                            .ok_or(JsError::new("All arguments must be strings").into())
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
                        let key: Result<String, JsValue> = entry
                            .get(0)
                            .as_string()
                            .ok_or(JsError::new("All environment keys must be strings").into());
                        let value: Result<String, JsValue> = entry
                            .get(1)
                            .as_string()
                            .ok_or(JsError::new("All environment values must be strings").into());
                        key.and_then(|key| Ok((key, value?)))
                    })
                    .collect::<Result<Vec<(String, String)>, JsValue>>()?
            }
        };
        let preopens: Vec<(String, String)> = {
            let preopens = js_sys::Reflect::get(&config, &"preopens".into())?;
            if preopens.is_undefined() {
                vec![(".".to_string(), "/".to_string())]
            } else {
                let preopens_obj: js_sys::Object = preopens.dyn_into()?;
                js_sys::Object::entries(&preopens_obj)
                    .iter()
                    .map(|entry| {
                        let entry: js_sys::Array = entry.unchecked_into();
                        let key: Result<String, JsValue> = entry
                            .get(0)
                            .as_string()
                            .ok_or(JsError::new("All preopen keys must be strings").into());
                        let value: Result<String, JsValue> = entry
                            .get(1)
                            .as_string()
                            .ok_or(JsError::new("All preopen values must be strings").into());
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
        let concurrency = {
            let concurrency = js_sys::Reflect::get(&config, &"concurrency".into())?;
            if concurrency.is_undefined() {
                None
            } else {
                match concurrency.as_f64() {
                    Some(concurrency) if concurrency.is_normal() => {
                        Some(concurrency.clamp(1., 16.) as usize)
                    }
                    _ => return Err(JsError::new("Concurrency must be an integer").into()),
                }
            }
        };
        let tty = {
            let tty = js_sys::Reflect::get(&config, &"tty".into())?;
            if tty.is_undefined() {
                None
            } else {
                Some(match TtyState::downcast_js(tty) {
                    Ok(tty) => tty,
                    _ => return Err(JsError::new("Tty must be an TtyState").into()),
                })
            }
        };

        let (tty_js, tty) = crate::tty::tty(tty);
        let (stdin_js, stdin) = crate::io::stdin();
        let (stdout, stdout_js) = crate::io::stdout();
        let (stderr, stderr_js) = crate::io::stderr();
        let mut store = Store::default();
        let wasi_env = WasiEnvBuilder::new(args.get(0).unwrap_or(&"".to_string()))
            .args(if !args.is_empty() { &args[1..] } else { &[] })
            .envs(env)
            .fs(Box::new(fs))
            .stdin(Box::new(stdin))
            .stdout(Box::new(stdout))
            .stderr(Box::new(stderr))
            .map_dirs(preopens)
            .map_err(|e| JsError::new(&format!("Couldn't preopen the dir: {}`", e)))?
            // .map_dirs(vec![(".".to_string(), "/".to_string())])
            // .preopen_dir("/").map_err(|e| js_sys::Error::new(&format!("Couldn't preopen the dir: {}`", e)))?
            .runtime(Arc::new(WebRuntime::new(
                if let Some(concurrency) = concurrency {
                    WebThreadPool::new(concurrency).unwrap()
                } else {
                    WebThreadPool::new_with_max_threads().unwrap()
                },
                tty,
            )))
            .finalize(&mut store)
            .map_err(|e| JsError::new(&format!("Failed to create the WasiState: {}`", e)))?;

        Ok(WASI {
            store,
            wasi_env,
            module: None,
            instance: None,
            _tty: tty_js,
            io: (stdin_js, stdout_js, stderr_js),
        })
    }

    #[wasm_bindgen(getter)]
    pub fn fs(&mut self) -> Result<MemFS, JsValue> {
        match self.wasi_env.data_mut(&mut self.store).fs_root() {
            WasiFsRoot::Backing(backing) => {
                // SAFETY: We know that the backing is a MemFS because we set it to be one.
                Ok(unsafe { backing.downcast_ref::<MemFS>().unwrap_unchecked() }.clone())
            }
            _ => unreachable!(),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn tty(&self) -> Tty {
        self._tty.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn stdin(&self) -> WritableStream {
        self.io.0.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn stdout(&self) -> ReadableStream {
        self.io.1.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn stderr(&self) -> ReadableStream {
        self.io.2.clone()
    }

    #[wasm_bindgen(js_name = getImports)]
    pub fn get_imports(&mut self, module: js_sys::WebAssembly::Module) -> Result<JsValue, JsValue> {
        let module: js_sys::WebAssembly::Module = module.dyn_into().map_err(|_e| {
            JsError::new(
                "You must provide a module to the WASI new. `let module = new WASI({}, module);`",
            )
        })?;

        let module: Module = module.into();
        let import_object = self.get_wasi_imports(&module)?;

        self.module = Some(module);

        Ok(import_object.as_jsvalue(&self.store))
    }

    fn get_wasi_imports(&mut self, module: &Module) -> Result<Imports, JsValue> {
        let import_object = self
            .wasi_env
            // FIXME: this does not define "wasi" namespace for WASI threads proposal (to be fixed upstream in wasmer-wasix?)
            .import_object_for_all_wasi_versions(&mut self.store, module)
            .map_err(|e| JsError::new(&format!("Failed to create the Import Object: {}`", e)))?;
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
                let mut imports = Imports::from_jsvalue(&mut self.store, &module, &base_imports)?;
                imports.extend(&import_object);
                imports
            } else {
                import_object
            };

            let instance = Instance::new(&mut self.store, &module, &imports)
                .map_err(|e| JsError::new(&format!("Failed to instantiate WASI: {}", e)))?;
            self.module = Some(module);
            instance
        } else if module_or_instance.has_type::<js_sys::WebAssembly::Instance>() {
            if let Some(instance) = &self.instance {
                // We completely skip the set instance step
                return Ok(instance.as_jsvalue(&self.store).into());
            }
            let module = self.module.as_ref().ok_or(JsError::new("When providing an instance, the `wasi.getImports` must be called with the module first"))?;
            let js_instance: js_sys::WebAssembly::Instance = module_or_instance.unchecked_into();

            Instance::from_jsvalue(&mut self.store, module, &js_instance)?
        } else {
            return Err(
                JsError::new("You need to provide a `WebAssembly.Module` or `WebAssembly.Instance` as first argument to `wasi.instantiate`").into(),
            );
        };

        self.wasi_env
            .initialize(&mut self.store, instance.clone())
            .unwrap();

        let raw_instance = instance.as_jsvalue(&self.store);
        self.instance = Some(instance);
        Ok(raw_instance.into())
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
                JsError::new("You need to provide an instance as argument to `start`, or call `wasi.instantiate` with the `WebAssembly.Instance` manually").into(),
            );
        }
        let start = self
            .instance
            .as_ref()
            .unwrap()
            .exports
            .get_function("_start")
            .map_err(|_e| JsError::new("The _start function is not present"))?;
        let result = start.call(&mut self.store, &[]);

        match result {
            Ok(_) => Ok(0),
            Err(err) => {
                match err.downcast::<WasiError>() {
                    Ok(WasiError::Exit(exit_code)) => {
                        // We should exit with the provided exit code
                        Ok(exit_code.raw() as u32)
                    }
                    Ok(err) => Err(JsError::new(&format!(
                        "Unexpected WASI error while running start function: {}",
                        err
                    ))
                    .into()),
                    Err(err) => Err(JsError::new(&format!(
                        "Error while running start function: {}",
                        err
                    ))
                    .into()),
                }
            }
        }
    }
}

impl Drop for WASI {
    fn drop(&mut self) {
        // attempt to gracefully close the stdin stream
        let cb = Closure::new(drop);
        let _ = self.io.0.close().catch(&cb);
        cb.forget();
    }
}
