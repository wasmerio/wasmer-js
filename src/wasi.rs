use crate::fs::MemFS;
use std::io::{Read, Write};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasmer::{
    ChainableNamedResolver, ImportObject, Instance, JsImportObject, Module, NamedResolverChain,
};
use wasmer_wasi::{Stderr, Stdin, Stdout, WasiEnv, WasiError, WasiState};

struct InstantiatedWASI {
    instance: Instance,
    #[allow(dead_code)]
    resolver: NamedResolverChain<ImportObject, JsImportObject>,
}

#[wasm_bindgen]
pub struct WASI {
    wasi_env: WasiEnv,
    instantiated: Option<InstantiatedWASI>,
}

#[wasm_bindgen]
impl WASI {
    #[wasm_bindgen(constructor)]
    pub fn new(config: JsValue) -> Result<WASI, JsValue> {
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
                MemFS::new()?
                // let mem_fs: MemFS = fs.dyn_into()?;
                // mem_fs
            }
        };
        let wasi_env = WasiState::new(&args.get(0).unwrap_or(&"".to_string()))
            .args(if args.len() > 0 { &args[1..] } else { &[] })
            .envs(env)
            .set_fs(Box::new(fs))
            .map_dirs(preopens)
            .map_err(|e| js_sys::Error::new(&format!("Couldn't preopen the dir: {}`", e)))?
            // .map_dirs(vec![(".".to_string(), "/".to_string())])
            // .preopen_dir("/").map_err(|e| js_sys::Error::new(&format!("Couldn't preopen the dir: {}`", e)))?
            .finalize()
            .map_err(|e| js_sys::Error::new(&format!("Failed to create the WasiState: {}`", e)))?;

        Ok(WASI {
            wasi_env,
            instantiated: None,
        })
    }

    #[wasm_bindgen(getter)]
    pub fn fs(&self) -> Result<MemFS, JsValue> {
        let mut state = self.wasi_env.state();
        let mem_fs = state
            .fs
            .fs_backing
            .downcast_ref::<MemFS>()
            .ok_or_else(|| js_sys::Error::new(&format!("Failed to downcast to MemFS")))?;
        Ok(mem_fs.clone())
    }

    pub fn instantiate(&mut self, module: JsValue, imports: js_sys::Object) -> Result<js_sys::WebAssembly::Instance, JsValue> {
        let module: js_sys::WebAssembly::Module = module.dyn_into().map_err(|_e| {
            js_sys::Error::new(
                "You must provide a module to the WASI new. `let module = new WASI({}, module);`",
            )
        })?;
        let module: Module = module.into();
        let import_object = self.wasi_env.import_object(&module).map_err(|e| {
            js_sys::Error::new(&format!("Failed to create the Import Object: {}`", e))
        })?;

        let resolver = JsImportObject::new(&module, imports);
        let resolver = resolver.chain_front(import_object);

        let instance = Instance::new(&module, &resolver)
            .map_err(|e| js_sys::Error::new(&format!("Failed to instantiate WASI: {}`", e)))?;
        
        let raw_instance = instance.raw().clone();
        self.instantiated = Some(InstantiatedWASI { resolver, instance });

        Ok(raw_instance)
    }

    /// Start the WASI Instance, it returns the status code when calling the start
    /// function
    pub fn start(&self) -> Result<u32, JsValue> {
        let start = self
            .instantiated
            .as_ref()
            .unwrap()
            .instance
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
    pub fn get_stdout_buffer(&self) -> Result<Vec<u8>, JsValue> {
        let mut state = self.wasi_env.state();
        let stdout = state.fs.stdout_mut().unwrap().as_mut().unwrap();
        let stdout = stdout.downcast_mut::<Stdout>().unwrap();
        let buf = stdout.buf.clone();
        stdout.buf = vec![];
        // let mut buf: Vec<u8> = vec![];
        // stdout
        //     .read_to_end(&mut buf)
        //     .map_err(|e| js_sys::Error::new(&format!("Error when reading stdout: {}`", e)))?;
        Ok(buf)
    }

    /// Get the stdout data as a string
    /// Note: this method flushes the stdout
    #[wasm_bindgen(js_name = getStdoutString)]
    pub fn get_stdout_string(&self) -> Result<String, JsValue> {
        String::from_utf8(self.get_stdout_buffer()?).map_err(|e| {
            js_sys::Error::new(&format!(
                "Could not convert the stdout bytes to a String: {}`",
                e
            ))
            .into()
        })
    }

    /// Get the stderr buffer
    /// Note: this method flushes the stderr
    #[wasm_bindgen(js_name = getStderrBuffer)]
    pub fn get_stderr_buffer(&self) -> Result<Vec<u8>, JsValue> {
        let mut state = self.wasi_env.state();
        let stderr = state.fs.stderr_mut().unwrap().as_mut().unwrap();
        let stderr = stderr.downcast_mut::<Stderr>().unwrap();
        let buf = stderr.buf.clone();
        stderr.buf = vec![];
        // let mut buf: Vec<u8> = vec![];
        // stderr
        //     .read_to_end(&mut buf)
        //     .map_err(|e| js_sys::Error::new(&format!("Error when reading stderr: {}`", e)))?;
        Ok(buf)
    }

    /// Get the stderr data as a string
    /// Note: this method flushes the stderr
    #[wasm_bindgen(js_name = getStderrString)]
    pub fn get_stderr_string(&self) -> Result<String, JsValue> {
        String::from_utf8(self.get_stderr_buffer()?).map_err(|e| {
            js_sys::Error::new(&format!(
                "Could not convert the stderr bytes to a String: {}`",
                e
            ))
            .into()
        })
    }

    /// Set the stdin buffer
    #[wasm_bindgen(js_name = setStdinBuffer)]
    pub fn set_stdin_buffer(&self, mut buf: Vec<u8>) -> Result<(), JsValue> {
        let mut state = self.wasi_env.state();
        let stdin = state.fs.stdin_mut().unwrap().as_mut().unwrap();
        let stdin = stdin.downcast_mut::<Stdin>().unwrap();
        stdin.buf.append(&mut buf);
        // stdin
        //     .write(&mut input)
        //     .map_err(|e| js_sys::Error::new(&format!("Error when writing stdin: {}`", e)))?;
        Ok(())
    }

    /// Set the stdin data as a string
    #[wasm_bindgen(js_name = setStdinString)]
    pub fn set_stdin_string(&self, input: String) -> Result<(), JsValue> {
        self.set_stdin_buffer(input.into_bytes())
    }
}
