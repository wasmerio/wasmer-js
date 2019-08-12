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

    console_log!("yooo, {}", &mut wasm_binary_vec[0]);

    convert(&mut wasm_binary_vec);
}



// Steps to convert:
// https://webassembly.github.io/wabt/demo/wat2wasm/
// ===Building a relevant AST===
// 1. Find all wasm sections
// 2. Find all wasm type signatures
// 3. Find all wasm imported functions
// 4. Find all wasm functions (for the function index)
// NOTE: Function index space is not recorded in the binary (https://github.com/WebAssembly/design/blob/master/Modules.md#function-index-space)
// 5. Find all calls to functions
// ===Mutating the Binary===
// 1. Find if an imported function has i64. If it does, continue...
// 2. Make a copy of its function signature
// 3. Modify the function signature copy to only use i32
// 4. Create a tampoline function that points to the old function signature, and wraps i64
// 5. Edit the original function to point at the new function signature
// 6. Edit calls to the original function, to now point at the trampoline function
// 7. Add the copied function signature. Update Types section
// 8. Add the function body. Update Code section
// 9. Update the name section (May not be needed)?

#[derive(Debug)]
struct WasmSection<'a> {
    code: wasmparser::SectionCode<'a>,
    position: usize
}

#[derive(Debug)]
struct WasmTypeSignature {
    position: usize,
     has_i64_param: bool,
    has_i64_returns: bool
}

#[derive(Debug)]
struct WasmFunction {
    is_import: bool,
    position: usize,
    function_index: usize,
    signature_index: usize,
    has_i64_param: bool,
    has_i64_returns: bool
}

#[derive(Debug)]
struct WasmCall {
    position: usize,
    function_index: usize
}

pub fn convert(wasm_binary_vec: &mut Vec<u8>) -> &mut Vec<u8> {


    let mut wasm_type_signatures: Vec<WasmTypeSignature> = Vec::new();
    let mut wasm_sections: Vec<WasmSection> = Vec::new();
    let mut wasm_functions: Vec<WasmFunction> = Vec::new();
    let mut wasm_calls: Vec<WasmCall> = Vec::new();
    let mut current_function_index: usize = 0;

    let mut parser = Parser::new(wasm_binary_vec);
    loop {

    let position = parser.current_position();
    let state = parser.read();

    match *state {
        ParserState::BeginWasm { .. } => {
            console_log!("====== Module");
        }
        ParserState::BeginSection { code, .. } => {
            console_log!(" BeginSection {:?}", code);
            let wasm_section = WasmSection {
                code: code,
                position: position
            };
            wasm_sections.push(wasm_section);
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

            let wasm_type_signature = WasmTypeSignature {
                position: position,
                has_i64_param: has_i64_param,
                has_i64_returns: has_i64_returns
            };
            wasm_type_signatures.push(wasm_type_signature);
        }
        ParserState::ImportSectionEntry { module, field, ty } => {
            console_log!("  Import {}::{}, {:?}", module, field, ty);

            match ty {
                wasmparser::ImportSectionEntryType::Function(index) => {

                    let wasm_type_signature_option = wasm_type_signatures.get(index as usize);

                      let wasm_function: WasmFunction = WasmFunction {
                        is_import: true,
                        position: position,
                        function_index: current_function_index as usize,
                        signature_index: index as usize,
                        has_i64_param:  match wasm_type_signature_option {
                            Some(wasm_type_signature) => wasm_type_signature.has_i64_param,
                            None => false
                        },
                        has_i64_returns:  match wasm_type_signature_option {
                            Some(wasm_type_signature) => wasm_type_signature.has_i64_returns,
                            None => false
                        }
                    };
                    current_function_index += 1;
                    wasm_functions.push(wasm_function);
                },
                _ => ()
            };
        },
        ParserState::FunctionSectionEntry(index) => {
            console_log!(" FunctionSectionEntry {:?}", index);

            let wasm_type_signature_option = wasm_type_signatures.get(index as usize);
            
            let wasm_function: WasmFunction = WasmFunction {
                is_import: false,
                position: position,
                function_index: current_function_index as usize,
                signature_index: index as usize,
                has_i64_param:  match wasm_type_signature_option {
                    Some(wasm_type_signature) => wasm_type_signature.has_i64_param,
                    None => false
                },
                has_i64_returns:  match wasm_type_signature_option {
                    Some(wasm_type_signature) => wasm_type_signature.has_i64_returns,
                    None => false
                }
            };
            current_function_index += 1;
            wasm_functions.push(wasm_function);
        },
        ParserState::CodeOperator(ref state) => {
            match *state {
                wasmparser::Operator::Call {function_index} => {
                    let wasm_call = WasmCall {
                        position: position,
                        function_index: function_index as usize
                    };
                    wasm_calls.push(wasm_call);
                },
                _ => ()
            }
        },
        ParserState::EndWasm => break,
        _ => ( /* console_log!(" Other {:?}", state) */ )
    }
  }  

    console_log!("wasm type signatures {:?}", wasm_type_signatures);
    console_log!("wasm fucntions {:?}", wasm_functions);
    console_log!("wasm sections {:?}", wasm_sections);
    console_log!("wasm calls {:?}", wasm_calls);

    console_log!(" ");
    console_log!("==========");
    console_log!("Doing actual transformations");
    console_log!("==========");
    console_log!(" ");

    // Iterate through the imported functions, and grab data we need to insert
    let mut signatures_to_add = Vec::new();
    let mut trampoline_functions = Vec::new();

    // 1. Find if an imported function has i64. If it does, continue...
    for imported_i64_wasm_function in wasm_functions.iter().filter(|&x| x.is_import && (x.has_i64_param || x.has_i64_returns)) {
        
        // 2. Make a copy of its function signature

        // Get it's signature position and length
        let wasm_type_signature = wasm_type_signatures.get(imported_i64_wasm_function.signature_index as usize).unwrap();
        let wasm_signature_position = wasm_type_signature.position;
        let wasm_signature_num_params = *wasm_binary_vec.get(wasm_signature_position + 1).unwrap() as usize;
        let wasm_signature_num_returns = *wasm_binary_vec.get(wasm_signature_position + wasm_signature_num_params + 2).unwrap() as usize;
        let wasm_signature_end = wasm_signature_position + 3 + wasm_signature_num_params + wasm_signature_num_returns;
        
        // Create a copy of of this memory
        let mut new_type_signature_data = vec![0; wasm_signature_end - wasm_signature_position];
        new_type_signature_data.copy_from_slice(wasm_binary_vec.get(wasm_signature_position..wasm_signature_end).unwrap());

        // 3. Modify the function signature copy to only use i32

        // Edit the signature to only use i32
        let mut index = 0;
        for byte in new_type_signature_data.iter_mut() {
            // If the param or return byte at the index is i64, set to i32
            if index > 2 && index != wasm_signature_num_params + 2 && *byte == 0x7e {
                *byte = 0x7f;
            }    
            index += 1;
        }

        // Add the signature
        signatures_to_add.push(new_type_signature_data);

        // 4. Create a tampoline function that points to the old function signature, and wraps i64

        // Construct our trampoline function
        let mut trampoline_function = Vec::new();
        // We'll add the body size at the end
        // local decl count
        trampoline_function.push(0x0);
        // Local get of our params
        for i in 0..wasm_signature_num_params {
            // local get
            trampoline_function.push(0x20);
            // local index
            trampoline_function.push(0x0);
            if *wasm_binary_vec.get(wasm_signature_position + 2 + i).unwrap() == 0x7e {
                // i32.wrap_i64
                trampoline_function.push(0xa7);
            }
        }

        // Finally call the original function
        // Call
        trampoline_function.push(0x10);
        // Function index
        trampoline_function.push(imported_i64_wasm_function.function_index);

        // end
        trampoline_function.push(0x0b);

        // Add the function body length
        trampoline_function.insert(0, trampoline_function.len());

        // Add the trampoline function
        trampoline_functions.push(trampoline_function);

        // 5. Edit the original function to point at the new function signature

        // Edit the original function to point at the new signature index
        // NOTE: For some reason, the first imported function points at the beginning of the import section,
        // NOT the beginning of the function
        let mut function_position = imported_i64_wasm_function.position;
        if imported_i64_wasm_function.is_import && imported_i64_wasm_function.function_index == 0 {
            function_position += 3;
        }
        let import_module_name_length = *wasm_binary_vec.get(function_position).unwrap() as usize;
        let import_field_name_length = *wasm_binary_vec.get(
            function_position + import_module_name_length + 1
            ).unwrap() as usize;
        // +3 for leftover offset and signature kind byte
        let import_signature_position = function_position +
            import_module_name_length + import_field_name_length + 3;

        // Change the signature index to our newly created import index
        let new_signature_index = (wasm_type_signatures.len() + signatures_to_add.len()) as u8;
        wasm_binary_vec.insert(import_signature_position, new_signature_index);
        wasm_binary_vec.remove(import_signature_position + 1);

        // 6. Edit calls to the original function, to now point at the trampoline function
        let trampoline_function_index = wasm_functions.len() + trampoline_functions.len() as u8;
        for wasm_call_to_old_function in wasm_calls.iter().filter(|&x| x.function_index == imported_i64_wasm_function.function_index) {
            // Call the trampoline function instead
            wasm_binary_vec.insert(wasm_call_to_old_function.position + 1, trampoline_function_index);
            wasm_binary_vec.remove(wasm_call_to_old_function.position + 2);
        }

        console_log!(" ");
        console_log!("Transformation Logs:");
        console_log!(" ");

        console_log!("Wasm Function: {:?}", imported_i64_wasm_function);
        console_log!("function_position: {:?}", function_position);
        console_log!("import_module_name_length: {:?}", import_module_name_length);
        console_log!("import_field_name_length: {:?}", import_field_name_length);
        console_log!("import_signature_position: {:?}", import_signature_position);
        console_log!("new_signature_index: {:?}", new_signature_index);
    }

    // 7. Add the copied function signature. Update Types section


    // 8. Add the function body. Update Code section


    // 9. Update the name section (May not be needed)?


  return wasm_binary_vec;
}

#[test]
fn converts() {
    let s = r#"(module
  (type $t0 (func (result i32)))
  (type $t1 (func (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
  (import "wasi_unstable" "path_open" (func $path_open (type $t1)))
  (import "wasi_unstable" "path_open" (func $testing (type $t1)))
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
    let mut wasm = wabt::wat2wasm(s).expect("parsed properly");
    let converted = convert(&mut wasm);
    assert!(wasmparser::validate(&converted, None), "wasm is not valid");
}
