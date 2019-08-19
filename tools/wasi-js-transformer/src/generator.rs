// Module that will generate trampoline functions, and type signatures.
// As well as modify the binary to point at the generated trampolines.

use crate::parser::*;
use crate::utils::*;
use std::*;

#[derive(Debug)]
pub struct LoweredSignature {
    pub original_signature_index: usize,
    pub bytes: Vec<u8>,
    pub num_params: usize,
    pub num_returns: usize,
}

#[derive(Debug)]
pub struct TrampolineFunction {
    pub signature_index: usize,
    pub bytes: Vec<u8>,
    pub num_params: usize,
    pub num_returns: usize,
}

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
    for i in params_start..params_end {
        // If the param or return byte at the index is i64, set to i32
        let mut byte = lowered_type_signature.bytes.get_mut(i).unwrap();
        if *byte == 0x7e {
            *byte = 0x7f;
        }
    }

    // Edit the signature to only use i32 returns
    // TODO: Support multiple return values once formalized in the spec
    if type_signature.num_returns == 1 {
        let bytes_len = lowered_type_signature.bytes.len();
        let byte = lowered_type_signature.bytes.get_mut(bytes_len - 1).unwrap();
        if *byte == 0x7e {
            *byte = 0x7f;
        }
    }

    // Return the lowered signature
    return lowered_type_signature;
}

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
        trampoline_function.bytes.push(0x20);
        // local index
        trampoline_function.bytes.push(i as u8);

        //Get our param value type
        if *wasm_binary_vec
            .get(type_signature.start_position + 1 + type_signature.num_params_byte_length + i)
            .unwrap()
            == 0x7e
        {
            // Param was an i64, wrap as i32
            // i32.wrap_i64
            trampoline_function.bytes.push(0xa7);
        }
    }

    // Returns
    if type_signature.num_returns == 1 {
        let byte = *wasm_binary_vec
            .get(type_signature.end_position - 1)
            .unwrap();
        if byte == 0x7e {
            // Return was an i64, wrap as i32
            // i32.wrap_i64
            trampoline_function.bytes.push(0xa7);
        }
    }

    // Call the original function
    // Call
    trampoline_function.bytes.push(0x10);
    // Function index
    trampoline_function
        .bytes
        .push(imported_i64_function.function_index as u8);

    // end
    trampoline_function.bytes.push(0x0b);

    // Add the function body length
    trampoline_function
        .bytes
        .insert(0, trampoline_function.bytes.len() as u8);

    return trampoline_function;
}
