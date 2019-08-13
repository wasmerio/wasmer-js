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
pub fn traverse_wasm_binary(passed_wasm_binary: &JsValue) -> js_sys::Uint8Array {
    let wasm_binary = js_sys::Uint8Array::new(passed_wasm_binary);
    let mut wasm_binary_vec = vec![0; wasm_binary.length() as usize];
    wasm_binary.copy_to(&mut wasm_binary_vec);
    let converted_wasm_binary = convert(&mut wasm_binary_vec);
    let response: js_sys::Uint8Array;
    unsafe {
        response = js_sys::Uint8Array::view(converted_wasm_binary.as_slice());
    }
    return response;
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
// 8. Add the new functions to function section (Where the signature is defined, which the body is later in the code section)
// 9. Add the function body. Update Code section

#[derive(Debug, Copy, Clone)]
struct WasmSection<'a> {
    code: wasmparser::SectionCode<'a>,
    start_position: usize,
    end_position: usize
}

#[derive(Debug)]
struct WasmTypeSignature {
    position: usize,
    num_params: usize,
    num_returns: usize,
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

#[derive(Debug)]
struct LoweredSignature {
    bytes: Vec<u8>
}

#[derive(Debug)]
struct TrampolineFunction {
    signature_index: usize,
    bytes: Vec<u8>
}

pub fn convert(original_wasm_binary_vec: &mut Vec<u8>) -> Vec<u8> {

    let mut wasm_type_signatures: Vec<WasmTypeSignature> = Vec::new();
    let mut wasm_sections: Vec<WasmSection> = Vec::new();
    let mut wasm_functions: Vec<WasmFunction> = Vec::new();
    let mut wasm_calls: Vec<WasmCall> = Vec::new();
    let mut current_function_index: usize = 0;

    let mut wasm_binary_vec = original_wasm_binary_vec.to_vec();

    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Parsing...");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");


    let mut parser = Parser::new(original_wasm_binary_vec);
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
                start_position: position,
                end_position: 0
            };
            wasm_sections.push(wasm_section);
        }
        ParserState::EndSection => {
            let wasm_section_index = wasm_sections.len() - 1;
            wasm_sections.get_mut(wasm_section_index).unwrap().end_position = position;

            console_log!(" EndSection {:?}", wasm_sections.get(wasm_section_index).unwrap());
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
                num_params: state.params.len(),
                num_returns: state.returns.len(),
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

    // Type signature positions are buggy, and can return the wrong positions 
    // (The order of signatures will be correct, but position will be completely wrong)
    let types_section_start_position = wasm_sections.iter().find(|&x| x.code == wasmparser::SectionCode::Type).unwrap().start_position;
    if wasm_type_signatures.get(0).unwrap().position != types_section_start_position + 3 {
        // The positions are incorrect, and set to the end of the type, not the beginning
        for i in 0..wasm_type_signatures.len() {
            if i == 0 {
                wasm_type_signatures.get_mut(0).unwrap().position = types_section_start_position + 3;
            } else {
                let previous_type_signature = wasm_type_signatures.get(i - 1).unwrap();
                let new_position = previous_type_signature.position + 3 + previous_type_signature.num_params + previous_type_signature.num_returns;
                wasm_type_signatures.get_mut(i).unwrap().position = new_position;
            }
        }
    }

    console_log!("Wasm Sections: {:#?}", wasm_sections);

    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Doing actual transformations");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");

    // Iterate through the imported functions, and grab data we need to insert
    let mut signatures_to_add = Vec::new();
    let mut trampoline_functions = Vec::new();

    // 1. Find if an imported function has i64. If it does, continue...
    let imported_i64_wasm_function_filter = wasm_functions.iter().filter(|&x| x.is_import && (x.has_i64_param || x.has_i64_returns));


    if wasm_functions.iter().filter(|&x| x.is_import && (x.has_i64_param || x.has_i64_returns)).count() == 0 {
        console_log!(" ");
        console_log!("==========");
        console_log!("No Transformations needed!");
        console_log!("==========");
        console_log!(" ");

        return wasm_binary_vec;
    } 

    console_log!(" ");
    console_log!("==========");
    console_log!("Trampoline Function Logs");
    console_log!("==========");
    console_log!(" ");

    for imported_i64_wasm_function in wasm_functions.iter().filter(|&x| x.is_import && (x.has_i64_param || x.has_i64_returns)) {
        
        // 2. Make a copy of its function signature
        // Get it's signature position and length

        let wasm_type_signature = wasm_type_signatures.get(imported_i64_wasm_function.signature_index as usize).unwrap();
        let mut wasm_signature_position = wasm_type_signature.position;

        // Get the properties of the signature, and it's end position
        let wasm_signature_num_params = wasm_type_signature.num_params;
        let wasm_signature_num_returns = wasm_type_signature.num_returns;
        let wasm_signature_end = wasm_signature_position + 3 + wasm_signature_num_params + wasm_signature_num_returns;
        
        // Create a copy of of this memory
        let mut new_type_signature_data = LoweredSignature {
            bytes: vec![0; wasm_signature_end - wasm_signature_position]
        };
        let original_signature_slice = wasm_binary_vec.get(wasm_signature_position..wasm_signature_end).unwrap();
        new_type_signature_data.bytes.copy_from_slice(original_signature_slice);

        // 3. Modify the function signature copy to only use i32

        // Edit the signature to only use i32
        let mut index = 0;
        for byte in new_type_signature_data.bytes.iter_mut() {
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
        let mut trampoline_function = TrampolineFunction {
            bytes: Vec::new(),
            signature_index: imported_i64_wasm_function.signature_index
        };
        // We'll add the body size at the end
        // local decl count
        trampoline_function.bytes.push(0x0);
        // Local get of our params
        for i in 0..wasm_signature_num_params {
            // local get
            trampoline_function.bytes.push(0x20);
            // local index
            trampoline_function.bytes.push(i as u8);
            if *wasm_binary_vec.get(wasm_signature_position + 2 + i).unwrap() == 0x7e {
                // i32.wrap_i64
                trampoline_function.bytes.push(0xa7);
            }
        }

        // Finally call the original function
        // Call
        trampoline_function.bytes.push(0x10);
        // Function index
        trampoline_function.bytes.push(imported_i64_wasm_function.function_index as u8);

        // end
        trampoline_function.bytes.push(0x0b);

        // Add the function body length
        trampoline_function.bytes.insert(0, trampoline_function.bytes.len() as u8);

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
        // -1 since it is an index
        let new_signature_index = (wasm_type_signatures.len() + signatures_to_add.len() - 1) as u8;
        wasm_binary_vec.insert(import_signature_position, new_signature_index);
        wasm_binary_vec.remove(import_signature_position + 1);

        // 6. Edit calls to the original function, to now point at the trampoline function
        let trampoline_function_index = wasm_functions.len() + trampoline_functions.len() - 1;
        for wasm_call_to_old_function in wasm_calls.iter().filter(|&x| x.function_index == imported_i64_wasm_function.function_index) {
            // Call the trampoline function instead
            wasm_binary_vec.insert(wasm_call_to_old_function.position + 1, trampoline_function_index as u8);
            wasm_binary_vec.remove(wasm_call_to_old_function.position + 2);
        }

        console_log!(" ");
        console_log!("Imported i64 Wasm Function: {:#?}", imported_i64_wasm_function);
        console_log!("function_position: {:#?}", function_position);
        console_log!("import_module_name_length: {:#?}", import_module_name_length);
        console_log!("import_field_name_length: {:#?}", import_field_name_length);
        console_log!("import_signature_position: {:#?}", import_signature_position);
        console_log!("new_signature_index: {:#?}", new_signature_index);
        console_log!(" ");
    }

    console_log!(" ");
    console_log!("==========");
    console_log!("Generated Logs");
    console_log!("==========");
    console_log!(" ");
    console_log!("Signatures to add: {:?}", signatures_to_add);
    console_log!(" ");
    console_log!("Trampoline Functions: {:?}", trampoline_functions);

    // Insert our bytes into the wasm_binary
    let mut position_offset = 0;

    // 7. Add the copied function signatures to the Types Section. Update Types section
    let old_types_section = wasm_sections.iter().find(|&x| x.code == wasmparser::SectionCode::Type).unwrap();
    let types_section = WasmSection {
        code: old_types_section.code,
        start_position: old_types_section.start_position + position_offset,
        end_position: old_types_section.end_position + position_offset,
    };
    let mut bytes_added_to_types_section = 0;
    for signature_to_add in signatures_to_add.iter() {
        for i in 0..signature_to_add.bytes.len() {
            wasm_binary_vec.insert(types_section.end_position + i, *signature_to_add.bytes.get(i).unwrap());
            bytes_added_to_types_section += 1;
            position_offset += 1;
        }
    }
    // Types section size
    let mut original_types_section_length = *wasm_binary_vec.get(types_section.start_position + 1).unwrap();
    let mut new_types_section_length = original_types_section_length + bytes_added_to_types_section;
    wasm_binary_vec.insert(types_section.start_position + 1, new_types_section_length);
    wasm_binary_vec.remove(types_section.start_position + 2);

    // Number of Types
    let mut original_types_number_of_types = *wasm_binary_vec.get(types_section.start_position + 2).unwrap();
    let mut new_types_number_of_types = original_types_number_of_types + signatures_to_add.len() as u8;
    wasm_binary_vec.insert(types_section.start_position + 2, new_types_number_of_types);
    wasm_binary_vec.remove(types_section.start_position + 3);

    console_log!(" ");
    console_log!("==========");
    console_log!("Type Section Update");
    console_log!("==========");
    console_log!(" ");
    console_log!("Type Section start position: {:?}", types_section.start_position);
    console_log!("Type Section original byte length: {:?}", original_types_section_length);
    console_log!("Type Section bytes added to byte length: {:?}", bytes_added_to_types_section);
    console_log!("Type Section new byte length: {:?}",  new_types_section_length);
    console_log!("Type Section original number of types: {:?}", original_types_number_of_types);
    console_log!("Type Section new number of types: {:?}", new_types_number_of_types);

    // 8. Add the new functions to function section (Where the signature is defined, which the body is later in the code section)
    let old_function_section = wasm_sections.iter().find(|&x| x.code == wasmparser::SectionCode::Function).unwrap();
    let function_section = WasmSection {
        code: old_function_section.code,
        start_position: old_function_section.start_position + position_offset,
        end_position: old_function_section.end_position + position_offset,
    };
    let mut bytes_added_to_function_section = 0;
    for i in 0..trampoline_functions.len() {
        wasm_binary_vec.insert(function_section.end_position + i, trampoline_functions.get(i).unwrap().signature_index as u8);
        position_offset += 1;
        bytes_added_to_function_section += 1;
    }
    // Functions section size
    let mut original_function_section_length = *wasm_binary_vec.get(function_section.start_position + 1).unwrap();
    let mut new_function_section_length = original_function_section_length + bytes_added_to_function_section;
    wasm_binary_vec.insert(function_section.start_position + 1, new_function_section_length);
    wasm_binary_vec.remove(function_section.start_position + 2);

    // Number of Functions
    let mut original_function_section_number_of_functions = *wasm_binary_vec.get(function_section.start_position + 2).unwrap();
    let mut new_function_section_number_of_functions = original_function_section_number_of_functions + trampoline_functions.len() as u8;
    wasm_binary_vec.insert(function_section.start_position + 2, new_function_section_number_of_functions);
    wasm_binary_vec.remove(function_section.start_position + 3);

    console_log!(" ");
    console_log!("==========");
    console_log!("Function Section Update");
    console_log!("==========");
    console_log!(" ");
    console_log!("Function Section start position: {:?}", function_section.start_position);
    console_log!("Function Section original byte length: {:?}", original_function_section_length);
    console_log!("Function Section bytes added to byte length: {:?}", bytes_added_to_function_section);
    console_log!("Function Section new byte length: {:?}", new_function_section_length);
    console_log!("Function Section original number of functions: {:?}", original_function_section_number_of_functions);
    console_log!("Function Section new number of functions: {:?}", new_function_section_number_of_functions);

    // 9. Add the function bodies to the Code. Update Code section
    let old_code_section = wasm_sections.iter().find(|&x| x.code == wasmparser::SectionCode::Code).unwrap();
    let code_section = WasmSection {
        code: old_code_section.code,
        start_position: old_code_section.start_position + position_offset,
        end_position: old_code_section.end_position + position_offset,
    };
    let mut bytes_added_to_code_section = 0;
    for trampoline_function in trampoline_functions.iter() {
        for i in 0..trampoline_function.bytes.len() {
            wasm_binary_vec.insert(code_section.end_position + i, *trampoline_function.bytes.get(i).unwrap() as u8);
            bytes_added_to_code_section += 1;
            position_offset += 1;
        }
    }
    // Code section size
    let mut original_code_section_length = *wasm_binary_vec.get(code_section.start_position + 1).unwrap();
    let mut new_code_section_length = original_code_section_length + bytes_added_to_code_section;
    wasm_binary_vec.insert(code_section.start_position + 1, new_code_section_length);
    wasm_binary_vec.remove(code_section.start_position + 2);

    // Number of Functions
    let mut original_code_number_of_functions = *wasm_binary_vec.get(code_section.start_position + 2).unwrap();
    let mut new_code_number_of_functions = original_code_number_of_functions + trampoline_functions.len() as u8;
    wasm_binary_vec.insert(code_section.start_position + 2, new_code_number_of_functions);
    wasm_binary_vec.remove(code_section.start_position + 3);

    console_log!(" ");
    console_log!("==========");
    console_log!("Code Section Update");
    console_log!("==========");
    console_log!(" ");
    console_log!("Code Section start position: {:?}", code_section.start_position);
    console_log!("Code Section original byte length: {:?}", original_code_section_length);
    console_log!("Code Section bytes added to byte length: {:?}", bytes_added_to_code_section);
    console_log!("Code Section new byte length: {:?}", new_code_section_length);
    console_log!("Code Section original number of functions: {:?}", original_code_number_of_functions);
    console_log!("Code Section new number of functions: {:?}", new_code_number_of_functions);


  return wasm_binary_vec;
}

#[test]
fn converts() {
    let wat_string = fs::read_to_string("./wasm-module-examples/matrix.wat")
        .expect("Something went wrong reading the file");
    
    let mut wasm = wabt::wat2wasm(&wat_string).expect("parsed properly");
    let converted = convert(&mut wasm);

    console_log!(" ");
    console_log!("==========");
    console_log!("Convert Back to Wat for descriptive errors (if there is one)");
    console_log!("==========");
    console_log!(" ");

    let wat = wabt::wasm2wat(converted.to_vec());

    assert!(wasmparser::validate(&converted, None), "wasm is not valid");
}
