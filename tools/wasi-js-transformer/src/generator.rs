// Module that will generate trampoline functions, and type signatures.
// As well as modify the binary to point at the generated trampolines.

use crate::parser::*;
use std::*;

/// Constants for the different opcodes of the WASM Binary we will insert
const WASM_OPCODE_I32: u8 = 0x7F;
const WASM_OPCODE_I64: u8 = 0x7E;
const WASM_OPCODE_LOCAL_GET: u8 = 0x20;
const WASM_OPCODE_I32_WRAP_I64: u8 = 0xA7;
const WASM_OPCODE_CALL: u8 = 0x10;
const WASM_OPCODE_END: u8 = 0x0B;

/// Type signatures that have been lowered
#[derive(Debug, Clone)]
pub struct LoweredSignature {
    pub original_signature_index: usize,
    pub bytes: Vec<u8>,
    pub num_params: usize,
    pub num_returns: usize,
}

/// Trampoline functions that replace original import calls, but truncate its i64s.
#[derive(Debug, Clone)]
pub struct TrampolineFunction {
    pub signature_index: usize,
    pub bytes: Vec<u8>,
    pub num_params: usize,
    pub num_returns: usize,
}

/// Function to generate trampoline functions and lowered type signaturtes
pub fn generate_trampolines_and_signatures(
    wasm_binary_vec: &mut Vec<u8>,
    imported_i64_functions: &Vec<&WasmFunction>,
    type_signatures: &Vec<WasmTypeSignature>,
) -> (Vec<TrampolineFunction>, Vec<LoweredSignature>) {
    // Iterate through the imported functions, and grab data we need to insert
    let mut lowered_signatures = Vec::new();
    let mut trampoline_functions = Vec::new();

    for imported_i64_function in imported_i64_functions.iter() {
        let type_signature = type_signatures
            .get(imported_i64_function.signature_index as usize)
            .unwrap();

        // Get its signature
        let lowered_type_signature = get_lowered_signature(
            wasm_binary_vec,
            type_signature,
            imported_i64_function.signature_index as usize,
        );
        lowered_signatures.push(lowered_type_signature);

        // Get its trampoline function
        let trampoline_function =
            get_trampoline_function(wasm_binary_vec, imported_i64_function, type_signature);
        trampoline_functions.push(trampoline_function);
    }

    return (trampoline_functions, lowered_signatures);
}

/// Function to generate a lowered type signature
fn get_lowered_signature(
    wasm_binary_vec: &Vec<u8>,
    type_signature: &WasmTypeSignature,
    signature_index: usize,
) -> LoweredSignature {
    // Create a new lowered signature
    let mut lowered_type_signature = LoweredSignature {
        original_signature_index: signature_index,
        bytes: vec![0; type_signature.end_position - type_signature.start_position],
        num_params: type_signature.num_params,
        num_returns: type_signature.num_returns,
    };

    // Extract the bytes of the type signature
    let type_signature_slice = wasm_binary_vec
        .get(type_signature.start_position..type_signature.end_position)
        .unwrap();
    lowered_type_signature
        .bytes
        .copy_from_slice(type_signature_slice);

    // Edit the signature to only use i32 Params
    let params_start = 1 + type_signature.num_params_byte_length;
    let params_end = params_start + type_signature.num_params;
    lowered_type_signature.bytes[params_start..params_end]
        .iter_mut()
        .filter(|b| **b == 0x7e)
        .for_each(|b| *b = 0x7f);

    // Edit the signature to only use i32 returns
    // TODO: Support multiple return values once formalized in the spec
    assert!(type_signature.num_returns == 1);
    if type_signature.num_returns == 1 {
        let bytes_len = lowered_type_signature.bytes.len();
        let byte = lowered_type_signature.bytes.get_mut(bytes_len - 1).unwrap();
        if *byte == WASM_OPCODE_I64 {
            *byte = WASM_OPCODE_I32;
        }
    }

    // Return the lowered signature
    return lowered_type_signature;
}

/// Function to generate a trampoline function
fn get_trampoline_function(
    wasm_binary_vec: &Vec<u8>,
    imported_i64_function: &&WasmFunction,
    type_signature: &WasmTypeSignature,
) -> TrampolineFunction {
    // Construct our trampoline function
    let mut trampoline_function = TrampolineFunction {
        bytes: Vec::new(),
        signature_index: imported_i64_function.signature_index,
        num_params: imported_i64_function.num_params,
        num_returns: imported_i64_function.num_returns,
    };

    // We'll add the body size at the end

    // local decl count
    trampoline_function.bytes.push(0x0);
    // Local get of all of our params
    for i in 0..type_signature.num_params {
        // local get
        trampoline_function.bytes.push(WASM_OPCODE_LOCAL_GET);
        // local index
        trampoline_function.bytes.push(i as u8);

        //Get our param value type
        if (*wasm_binary_vec)
            [type_signature.start_position + 1 + type_signature.num_params_byte_length + i]
            == WASM_OPCODE_I64
        {
            // Param was an i64, wrap as i32
            // i32.wrap_i64
            trampoline_function.bytes.push(WASM_OPCODE_I32_WRAP_I64);
        }
    }

    // Returns
    if type_signature.num_returns == 1 {
        let byte = *wasm_binary_vec
            .get(type_signature.end_position - 1)
            .unwrap();
        if byte == WASM_OPCODE_I64 {
            // Return was an i64, wrap as i32
            // i32.wrap_i64
            trampoline_function.bytes.push(WASM_OPCODE_I32_WRAP_I64);
        }
    }

    // Call the original function
    // Call
    trampoline_function.bytes.push(WASM_OPCODE_CALL);
    // Function index
    trampoline_function
        .bytes
        .push(imported_i64_function.function_index as u8);

    // end
    trampoline_function.bytes.push(WASM_OPCODE_END);

    // Add the function body length
    trampoline_function
        .bytes
        .insert(0, trampoline_function.bytes.len() as u8);

    return trampoline_function;
}
