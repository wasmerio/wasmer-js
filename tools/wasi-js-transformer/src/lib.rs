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

// TODO: Tommorrow, need to add payload_length to the section info,
// Which is a variable uint32
// https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#high-level-structure
#[derive(Debug, Copy, Clone)]
struct WasmSection<'a> {
    start_position: usize,
    end_position: usize,
    code: wasmparser::SectionCode<'a>,
    size: u32,
    size_byte_length: usize,
    count: u32,
    count_byte_length: usize
}

#[derive(Debug)]
struct WasmTypeSignature {
    start_position: usize,
    end_position: usize,
    num_params: usize,
    num_params_byte_length: usize,
    num_returns: usize,
    num_returns_byte_length: usize,
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

fn read_bytes_as_varunit32_and_byte_length(bytes: &[u8]) -> (Result<u32, &'static str>, Result<usize, &'static str>) {
    if (bytes.len() < 4) {
        let err_message = "Did not pass enough bytes";
        return (Err(err_message), Err(err_message));
    }

    // Check if it is only a single byte
    if (bytes[0] & 0x80) == 0 {
        return (Ok(bytes[0] as u32), Ok(1));
    }

    let mut response: u32 = (bytes[0] & 0x7F) as u32;
    console_log!("Reading response {:034b}, og bytes {:?}, byte {:08b}", response, bytes, bytes[0]);
    let mut byte_length = 1;
    for i in 1..4 {
        let current_byte = bytes[i];
        let shift_amount = (7 * (i + 1));
        let shifted_byte = ((current_byte & 0x7F) as u32) << shift_amount;
        response |= shifted_byte;

        console_log!("Reading response {:034b}, byte {:08b}", response, current_byte);
        
        // Check if we are the last value and the continuation bit is incorrectly set
        if i == 3 && (current_byte & 0xF0) != 0 {
            let err_message = "Error decoding the varuint32, the last nibble was incorrectly set";
            return (Err(err_message), Err(err_message));
        }

        // Update the length in bytes of our number
        byte_length += 1;

        if (current_byte & 0x80) == 0 {
            break;
        }
    }

    return (Ok(response), Ok(byte_length));
}

fn get_u32_as_bytes_for_varunit32(value: u32) -> Vec<u8> {
    let mut response = Vec::new();
    let mut responseVaruint32: u32 = 0;

    // First, encode the whole value as 7 bits per byte, lowest value first
    for i in 0..28 {
        let bit_mask: u32 = (0x01 << i);
        if (value & bit_mask) > 0 {
            // Need to or the bit mask, but make sure to shift extra times
            // for the continuation bits
            // TODO: Something wrong here, writing containues at the wrong place
            let mut bit_mask_with_continuation = bit_mask;
            if i > 6 {
                bit_mask_with_continuation = bit_mask_with_continuation << 1;
            }
            if i > 14 {
                bit_mask_with_continuation = bit_mask_with_continuation << 1;
            }
            if i > 22 {
                bit_mask_with_continuation = bit_mask_with_continuation << 1;
            }

            console_log!("Current i: {:?}", i);
            console_log!("Original bit mask: {:034b}", bit_mask);
            console_log!("Continue bit mask: {:034b}", bit_mask_with_continuation);

            responseVaruint32 |= bit_mask_with_continuation;
            console_log!("         response: {:034b}", responseVaruint32);
        }
    }

    console_log!("No continue, value: {:?} response binary: {:034b}, response decimal: {:?}", value, responseVaruint32, responseVaruint32);

    // Add the continuation bits
    for i in 1..3 {
        let check_shift_amount = (8 * i) - 1;
        if responseVaruint32 >> check_shift_amount > 0 {
            let bit_mask = (0x01 << (check_shift_amount));
            responseVaruint32 |= bit_mask;
        }
    }

    console_log!("Wi continue, value: {:?} response binary: {:034b}, response decimal: {:?}", value, responseVaruint32, responseVaruint32);

    // Split our u32 into bytes
    for i in 0..4 {
        let byte = ((responseVaruint32 >> (8 * i)) & 0xFF) as u8;
        response.push(byte);
    }

    // Get the byte length of the u32
    let (response_result, byte_length_result) = read_bytes_as_varunit32_and_byte_length(response.as_slice());
    console_log!("Final Response: bytes: {:?}, decimal: {:?}", response, response_result.unwrap());
    let byte_length = byte_length_result.unwrap();

    // Remove the extra bytes
    response.split_off(byte_length);
    return response;
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
            
            // Get the size and count of the section
            // Starts the byte after the section code (current position is section code)
            let size_position = position + 1;
            let (size_result, size_byte_length_result) = read_bytes_as_varunit32_and_byte_length(wasm_binary_vec.get(size_position..(size_position + 4)).unwrap());
            let size = size_result.unwrap();
            let size_byte_length = size_byte_length_result.unwrap();

            let mut count = 0;
            let mut count_byte_length = 0;
            match code {
                // Only the start section does not have a count
                wasmparser::SectionCode::Start => (),
                _ => {
                    let count_position = position + size_byte_length;
                    let (count_result, count_byte_length_result) = read_bytes_as_varunit32_and_byte_length(wasm_binary_vec.get(count_position..(count_position + 4)).unwrap());
                    count = count_result.unwrap();
                    count_byte_length = count_byte_length_result.unwrap();
                }
            }

            let wasm_section = WasmSection {
                code: code,
                size: size,
                size_byte_length: size_byte_length,
                count: count,
                count_byte_length: count_byte_length,
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

            let num_params = state.params.len();
            let num_returns = state.returns.len();

            let wasm_type_signature = WasmTypeSignature {
                start_position: position,
                end_position: 0,
                num_params: num_params,
                num_params_byte_length: 0,
                num_returns: num_returns,
                num_returns_byte_length: 1,
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
    // Thus we need to do a second pass to correct some of our required values and add end positions
    // (The order of signatures will be correct, but position will be completely wrong)
    let types_section_workaround = wasm_sections.iter().find(|&x| x.code == wasmparser::SectionCode::Type).unwrap();
    let types_section_entries_position = types_section_workaround.start_position + types_section_workaround.size_byte_length + types_section_workaround.count_byte_length + 1;
    for i in 0..wasm_type_signatures.len() + 1 {
        if i == 0 {
            wasm_type_signatures.get_mut(0).unwrap().start_position = types_section_entries_position;
        } else {
            let previous_type_signature = wasm_type_signatures.get_mut(i - 1).unwrap();

            // Get the byte length of our values to determine the correct posisition
            let num_params_position = previous_type_signature.start_position + 1;
            let (_, num_params_byte_length_result) = read_bytes_as_varunit32_and_byte_length(wasm_binary_vec.get(num_params_position..(num_params_position + 4)).unwrap());
            let num_params_byte_length = num_params_byte_length_result.unwrap();
            previous_type_signature.num_params_byte_length = num_params_byte_length;

            let new_position = previous_type_signature.start_position + 
                previous_type_signature.num_params_byte_length + 
                previous_type_signature.num_params + 
                previous_type_signature.num_returns_byte_length +
                previous_type_signature.num_returns + 1;
            previous_type_signature.end_position = new_position;

            if i < wasm_type_signatures.len() {
                wasm_type_signatures.get_mut(i).unwrap().start_position = new_position;
            }
        }
    }

    console_log!("Wasm Sections: {:#?}", wasm_sections);
    console_log!("Wasm Type Signatures: {:#?}", wasm_type_signatures);

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
        
        // Create a copy of of this memory
        let mut new_type_signature_data = LoweredSignature {
            bytes: vec![0; wasm_type_signature.end_position - wasm_type_signature.start_position]
        };
        let original_signature_slice = wasm_binary_vec.get(wasm_type_signature.start_position..wasm_type_signature.end_position).unwrap();
        new_type_signature_data.bytes.copy_from_slice(original_signature_slice);

        // 3. Modify the function signature copy to only use i32

        // Edit the signature to only use i32
        // Params
        for i in (1 + wasm_type_signature.num_params_byte_length)..(1 + wasm_type_signature.num_params_byte_length + wasm_type_signature.num_params) {
            // If the param or return byte at the index is i64, set to i32
            let mut byte = new_type_signature_data.bytes.get_mut(i).unwrap();
            if *byte == 0x7e {
                *byte = 0x7f;
            }    
        }
        // Returns
        if wasm_type_signature.num_returns == 1 {
            let bytes_len = new_type_signature_data.bytes.len();
            let mut byte = new_type_signature_data.bytes.get_mut(bytes_len - 1).unwrap();
            if *byte == 0x7e {
                *byte = 0x7f;
            }  
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
        for i in 0..wasm_type_signature.num_params {
            // local get
            trampoline_function.bytes.push(0x20);
            // local index
            trampoline_function.bytes.push(i as u8);
            if *wasm_binary_vec.get(wasm_type_signature.start_position + 1 + wasm_type_signature.num_params_byte_length + i).unwrap() == 0x7e {
                // i32.wrap_i64
                trampoline_function.bytes.push(0xa7);
            }
        }
        // Returns
        if wasm_type_signature.num_returns == 1 {
            let byte = *wasm_binary_vec.get(wasm_type_signature.end_position - 1).unwrap();
            if byte == 0x7e {
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
        let import_section_workaround = wasm_sections.iter().find(|&x| x.code == wasmparser::SectionCode::Import).unwrap();
        if imported_i64_wasm_function.is_import && imported_i64_wasm_function.function_index == 0 {
            function_position += 1 + import_section_workaround.size_byte_length + import_section_workaround.count_byte_length;
        }
        let (import_module_name_length_result, import_module_name_length_byte_length_result) = read_bytes_as_varunit32_and_byte_length(wasm_binary_vec.get(function_position..(function_position + 4)).unwrap());
        let import_module_name_length = import_module_name_length_result.unwrap();
        let import_module_name_length_byte_length = import_module_name_length_byte_length_result.unwrap();
        let (import_field_name_length_result, import_field_name_length_byte_length_result) = read_bytes_as_varunit32_and_byte_length(
            wasm_binary_vec.get((function_position + (import_module_name_length as usize) + 1)..(function_position + (import_module_name_length as usize) + 5)
                                ).unwrap());
        let import_field_name_length = import_field_name_length_result.unwrap();
        let import_field_name_length_byte_length = import_field_name_length_byte_length_result.unwrap();
        // Get the position of the actual signature
        let import_signature_position = function_position + 
            import_module_name_length_byte_length +
            (import_module_name_length as usize) + 
            import_field_name_length_byte_length +
            (import_field_name_length as usize) + 1;

        // Change the signature index to our newly created import index
        // -1 since it is an index
        let new_signature_index = (wasm_type_signatures.len() + signatures_to_add.len() - 1) as u32;
        let new_signature_bytes = get_u32_as_bytes_for_varunit32(new_signature_index);
        for i in 0..new_signature_bytes.len() {
            wasm_binary_vec.insert(import_signature_position + i, *new_signature_bytes.get(i).unwrap());
            wasm_binary_vec.remove(import_signature_position + i + 1);
        }

        // 6. Edit calls to the original function, to now point at the trampoline function
        let trampoline_function_index = wasm_functions.len() + trampoline_functions.len() - 1;
        let trampoline_function_bytes = get_u32_as_bytes_for_varunit32(trampoline_function_index as u32);
        for wasm_call_to_old_function in wasm_calls.iter().filter(|&x| x.function_index == imported_i64_wasm_function.function_index) {
            // Call the trampoline function instead
            for i in 0..trampoline_function_bytes.len() {
                wasm_binary_vec.insert(wasm_call_to_old_function.position + 1 + i, *trampoline_function_bytes.get(i).unwrap());
                wasm_binary_vec.remove(wasm_call_to_old_function.position + 1 + i + 1);
            }
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

    // TODO: I am here in u32 conversions

    // Insert our bytes into the wasm_binary
    let mut position_offset = 0;

    // 7. Add the copied function signatures to the Types Section. Update Types section
    let old_types_section = wasm_sections.iter().find(|&x| x.code == wasmparser::SectionCode::Type).unwrap();
    let types_section = WasmSection {
        code: old_types_section.code,
        size: old_types_section.size,
        size_byte_length: old_types_section.size_byte_length,
        count: old_types_section.count,
        count_byte_length: old_types_section.count_byte_length,
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
    let original_types_section_length = *wasm_binary_vec.get(types_section.start_position + 1).unwrap();
    let new_types_section_length = original_types_section_length + bytes_added_to_types_section;
    wasm_binary_vec.insert(types_section.start_position + 1, new_types_section_length);
    wasm_binary_vec.remove(types_section.start_position + 2);

    // Number of Types
    let original_types_number_of_types = *wasm_binary_vec.get(types_section.start_position + 2).unwrap();
    let new_types_number_of_types = original_types_number_of_types + signatures_to_add.len() as u8;
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
        size: old_function_section.size,
        size_byte_length: old_function_section.size_byte_length,
        count: old_function_section.count,
        count_byte_length: old_function_section.count_byte_length,
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
    let original_function_section_length = *wasm_binary_vec.get(function_section.start_position + 1).unwrap();
    let new_function_section_length = original_function_section_length + bytes_added_to_function_section;
    wasm_binary_vec.insert(function_section.start_position + 1, new_function_section_length);
    wasm_binary_vec.remove(function_section.start_position + 2);

    // Number of Functions
    let original_function_section_number_of_functions = *wasm_binary_vec.get(function_section.start_position + 2).unwrap();
    let new_function_section_number_of_functions = original_function_section_number_of_functions + trampoline_functions.len() as u8;
    wasm_binary_vec.insert(function_section.start_position + 2, new_function_section_number_of_functions);
    wasm_binary_vec.remove(function_section.start_position + 3);

    console_log!(" ");
    console_log!("Function Section bytes, starting -> starting + 5 {:?}", wasm_binary_vec.get(function_section.start_position..(function_section.start_position + 5)).unwrap());
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
        size: old_code_section.size,
        size_byte_length: old_code_section.size_byte_length,
        count: old_code_section.count,
        count_byte_length: old_code_section.count_byte_length,
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
    let original_code_section_length_position = code_section.start_position + 1;
    let (original_code_section_length_result, _) = read_bytes_as_varunit32_and_byte_length(
        wasm_binary_vec.get(original_code_section_length_position..(original_code_section_length_position + 4)).unwrap()
        );
    let original_code_section_length = original_code_section_length_result.unwrap();
    let new_code_section_length = original_code_section_length + bytes_added_to_code_section as u32;
    let new_code_section_length_bytes = get_u32_as_bytes_for_varunit32(new_code_section_length);
    for i in 0..new_code_section_length_bytes.len() {
        wasm_binary_vec.insert(original_code_section_length_position + i, *new_code_section_length_bytes.get(i).unwrap());
        wasm_binary_vec.remove(original_code_section_length_position + i + 1);
    }


    // Number of Functions
    let original_code_number_of_functions_position = code_section.start_position + code_section.size_byte_length + 1;
    let (original_code_number_of_functions_result, _) = read_bytes_as_varunit32_and_byte_length(
        wasm_binary_vec.get(original_code_number_of_functions_position..(original_code_number_of_functions_position + 4)).unwrap()
        );
    let original_code_number_of_functions = original_code_number_of_functions_result.unwrap();
    let new_code_number_of_functions = original_code_number_of_functions + trampoline_functions.len() as u32;
    let new_code_number_of_functions_bytes = get_u32_as_bytes_for_varunit32(new_code_number_of_functions);
    for i in 0..new_code_number_of_functions_bytes.len() {
        wasm_binary_vec.insert(original_code_number_of_functions_position + i, *new_code_number_of_functions_bytes.get(i).unwrap());
        wasm_binary_vec.remove(original_code_number_of_functions_position + i + 1);
    }

    console_log!(" ");
    console_log!("Code Section bytes, starting -> starting + 5 {:?}", wasm_binary_vec.get(code_section.start_position..(code_section.start_position + 5)).unwrap());
    console_log!("==========");
    console_log!("Code Section Update");
    console_log!("==========");
    console_log!(" ");
    console_log!("Original Code Section: {:?}", code_section);
    console_log!("Code Section start position: {:?}", code_section.start_position);
    console_log!("Code Section original byte length: {:?}", original_code_section_length);
    console_log!("Code Section bytes added to byte length: {:?}", bytes_added_to_code_section);
    console_log!("Code Section new byte length: {:?}", new_code_section_length);
    console_log!("Code Section new byte length bytes: {:?}", new_code_section_length_bytes);
    console_log!("Code Section original number of functions: {:?}", original_code_number_of_functions);
    console_log!("Code Section new number of functions: {:?}", new_code_number_of_functions);

  return wasm_binary_vec;
}

#[test]
fn converts() {

    // Run tests for the following strings
    let mut test_file_paths = Vec::new();
    test_file_paths.push("./wasm-module-examples/path_open.wat");
    test_file_paths.push("./wasm-module-examples/clock_time_get.wat");
    test_file_paths.push("./wasm-module-examples/matrix.wat");
    // test_file_paths.push("./wasm-module-examples/qjs.wat");
    // test_file_paths.push("./wasm-module-examples/duk.wat");

    for test_file_path in test_file_paths.iter() {

        console_log!(" ");
        console_log!("==========");
        console_log!("Testing: {:?}", test_file_path);
        console_log!("==========");
        console_log!(" ");

        let wat_string = fs::read_to_string(test_file_path)
            .expect("Something went wrong reading the file");

        let mut wasm = wabt::wat2wasm(&wat_string).expect("parsed properly");

        assert!(wasmparser::validate(&wasm, None), "original wasm is not valid");

        let converted = convert(&mut wasm);

        let converted_wat = wabt::wasm2wat(converted.to_vec());

        console_log!(" ");
        console_log!("==========");
        console_log!("Convert Back to Wat for descriptive errors (if there is one)");
        console_log!("==========");
        console_log!(" ");

        match converted_wat {
            Err(e) => {
                console_log!(" ");
                console_log!("Test File Path: {:?}", test_file_path);
                console_log!(" ");
                console_log!("{:?}", e);
                console_log!(" ");
            },
            _ => ()
        }

        assert!(wasmparser::validate(&converted, None), "converted wasm is not valid");
    }
}
