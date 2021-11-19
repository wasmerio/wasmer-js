extern crate wasm_bindgen;
extern crate wasmer;
extern crate wasmer_wasi;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasmer::{ImportObject, Instance, Module, Store};
use wasmer_wasi::{Stdin, Stdout, WasiEnv, WasiState, WasiError};

#[wasm_bindgen]
pub struct WASI {
    wasi_env: WasiEnv,
    module: Module,
    import_object: ImportObject,
}

#[wasm_bindgen]
impl WASI {
    #[wasm_bindgen(constructor)]
    pub fn new(config: JsValue, module: JsValue) -> Result<WASI, JsValue> {
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

        let mut wasi_env = WasiState::new(&args.get(0).unwrap_or(&"".to_string()))
            .args(if args.len() > 0 { &args[1..] } else { &[] })
            .envs(env)
            .finalize().map_err(|e| {
                js_sys::Error::new(
                    &format!("Failed to create the WasiState: {}`", e)
                )
            })?;

        let module: js_sys::WebAssembly::Module = module.dyn_into().map_err(|_e| {
            js_sys::Error::new(
                "You must provide a module to the WASI new. `let module = new WASI({}, module);`",
            )
        })?;
        let module: Module = module.into();
        let import_object = wasi_env.import_object(&module).map_err(|e| {
            js_sys::Error::new(
                &format!("Failed to create the Import Object: {}`", e)
            )
        })?;

        Ok(WASI {
            wasi_env,
            module,
            import_object,
        })
    }

    async pub fn instantiate(&mut self, imports: js_sys::Object) -> Result<(), JsValue> {
        unimplemented!()
    }

    #[wasm_bindgen(js_name = getImports)]
    pub fn get_imports(&mut self) -> js_sys::Object {
        self.import_object.clone().into()
    }

    /// Start the WASI Instance, it returns the status code when calling the start
    /// function
    pub fn start(&self, instance: js_sys::WebAssembly::Instance) -> Result<u32, JsValue> {
        let instance = Instance::from_module_and_instance(&self.module, instance).map_err(|e| js_sys::Error::new(&format!("Error while creating the Wasmer instance: {}", e)))?;
        let externs = self
            .import_object
            .clone()
            .into_iter()
            .map(|((namespace, field), extern_)| extern_)
            .collect::<Vec<_>>();
        instance.init_envs(&externs);

        let start = instance
            .exports
            .get_function("_start")
            .map_err(|_e| js_sys::Error::new("The _start function is not present"))?;
        let result = start.call(&[]);

        match result {
            Ok(_) => Ok(0),
            Err(err) => {
                match err.downcast::<WasiError>() {
                    Ok(WasiError::Exit(exit_code)) => {
                        // We should exit with the provided exit code
                        return Ok(exit_code);
                    }
                    Ok(err) => {
                        unimplemented!();
                    },
                    Err(err) => Err(err.into()),
                }
            }
        }
    }

    #[wasm_bindgen(js_name = getStdoutBuffer)]
    pub fn get_stdout_buffer(&self) -> Vec<u8> {
        let state = self.wasi_env.state();
        let stdout = state.fs.stdout().unwrap().as_ref().unwrap();
        let stdout = stdout.downcast_ref::<Stdout>().unwrap();
        stdout.buf.clone()
    }

    #[wasm_bindgen(js_name = getStdoutString)]
    pub fn get_stdout_string(&self) -> String {
        String::from_utf8(self.get_stdout_buffer()).unwrap()
    }
}
