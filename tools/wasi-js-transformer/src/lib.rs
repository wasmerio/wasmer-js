mod utils;

use std::*;
use js_sys::*;
use wasm_bindgen::prelude::*;
use wasmparser::WasmDecoder;
use wasmparser::Parser;
use wasmparser::ParserState;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

#[cfg(target_arch = "wasm32")]
macro_rules! console_log {
    ($($t:tt)*) => {
        log(&format_args!($($t)*).to_string());
    }
}

#[cfg(not(target_arch = "wasm32"))]
macro_rules! console_log {
    ($($t:tt)*) => {
        println!($($t)*);
    }
}


#[wasm_bindgen]
pub fn traverse_wasm_binary(passed_wasm_binary: &JsValue) {
    let wasm_binary = js_sys::Uint8Array::new(passed_wasm_binary);
    let mut wasm_binary_vec = vec![0; wasm_binary.length() as usize];
    wasm_binary.copy_to(&mut wasm_binary_vec);

    unsafe {
        console_log!("yooo, {}", &mut wasm_binary_vec[0]);
    }

    convert(&wasm_binary_vec);
}

pub fn convert(wasm_binary_vec: &Vec<u8>) -> &Vec<u8> {

    let mut does_type_index_contain_i64: Vec<bool> = Vec::new();

    let mut parser = Parser::new(&wasm_binary_vec);
    loop {

    let position = parser.current_position();
    let state = parser.read();

    match *state {
        ParserState::BeginWasm { .. } => {
            console_log!("====== Module");
        }
        ParserState::TypeSectionEntry(ref state) => {
            console_log!(" TypeSectionEntry {:?}", state);

            let has_i64_param = state.params.iter().any(|&x| {
                match x {
                    wasmparser::Type::I64 => true,
                    _ => false
                }
            });

            let has_i64_returns = state.returns.iter().any(|&x| {
                match x {
                    wasmparser::Type::I64 => true,
                    _ => false
                }
            });

            does_type_index_contain_i64.push(has_i64_param || has_i64_returns);
        }
        ParserState::ImportSectionEntry { module, field, ty } => {
            console_log!("  Import {}::{}, {:?}", module, field, ty);

            let has_i64_param = match ty {
                wasmparser::ImportSectionEntryType::Function(index) => {
                    console_log!("hi {} {:?}", index, does_type_index_contain_i64);
    
                    if does_type_index_contain_i64[index as usize] {
                        console_log!("yooo");
                    }            
                },
                _ => ()
            };

            // Find if this import has an i64
        }
        ParserState::EndWasm => break,
        _ => ( /* console_log!(" Other {:?}", state) */ )
    }
  }  

  return wasm_binary_vec;
}

#[test]
fn converts() {
    let s = r#"(module
  (type $t0 (func (result i32)))
  (type $t1 (func (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
  (import "wasi_unstable" "path_open" (func $path_open (type $t1)))
  (func $_start (type $t0)
    i32.const 12
    i32.const 12
    i32.const 12
    i32.const 12
    i32.const 12
    i64.const 12
    i64.const 12
    i32.const 12
    i32.const 12
    call $path_open
  )
  (memory $memory 17)
  (export "memory" (memory 0))
  (export "_start" (func $_start))
)
"#;
    let wasm = wabt::wat2wasm(s).expect("parsed properly");
    let converted = convert(&wasm);
    assert!(wasmparser::validate(&converted, None), "wasm is not valid");
}
