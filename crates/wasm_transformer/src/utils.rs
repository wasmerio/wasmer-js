// Utility functions
use wasmparser::{FuncType, Type};

/// Constants for the different opcodes of the WASM Binary we will insert
const WASM_OPCODE_I32: u8 = 0x7F;
const WASM_OPCODE_I64: u8 = 0x7E;
const WASM_OPCODE_LOCAL_GET: u8 = 0x20;
const WASM_OPCODE_I32_WRAP_I64: u8 = 0xA7;
const WASM_OPCODE_CALL: u8 = 0x10;
const WASM_OPCODE_END: u8 = 0x0B;

fn lower_func_param(param: u8) -> u8 {
    match param {
        WASM_OPCODE_I64 => WASM_OPCODE_I32,
        any => any,
    }
}

// Lower a function body and return the lowered one
pub fn lower_func_body(body: &Vec<u8>) -> Vec<u8> {
    let mut new_body = body.to_vec();
    assert_eq!(body[0], 96, "Provided function is not a function");
    let (num_params, num_params_size) = read_bytes_as_varunit(&body[1..]).unwrap();
    let start_params = 1 + num_params_size;
    for i in start_params..start_params + (num_params as usize) {
        new_body[i] = lower_func_param(body[i]);
    }
    return new_body;
}

/// Function to generate a trampoline function
pub fn generate_trampoline_function(func: &FuncType, original_index: usize) -> Vec<u8> {
    // Construct our trampoline function
    let mut bytes = Vec::new();

    // We'll add the body size at the end

    // local decl count
    bytes.push(0x0);
    // Local get of all of our params
    for (i, param) in func.params.iter().enumerate() {
        // local get
        bytes.push(WASM_OPCODE_LOCAL_GET);
        // local index
        bytes.push(i as u8);

        //Get our param value type
        if *param == Type::I64 {
            // Param was an i64, wrap as i32
            // i32.wrap_i64
            bytes.push(WASM_OPCODE_I32_WRAP_I64);
        }
    }

    // Returns
    if func.returns.len() == 1 {
        if func.returns[0] == Type::I64 {
            // Return was an i64, wrap as i32
            // i32.wrap_i64
            bytes.push(WASM_OPCODE_I32_WRAP_I64);
        }
    }

    // Call the original function
    // Call
    bytes.push(WASM_OPCODE_CALL);
    // Function index
    bytes.push(original_index as u8);

    // end
    bytes.push(WASM_OPCODE_END);

    // Add the function body length
    bytes.insert(0, bytes.len() as u8);

    bytes
}

// Read a set of bytes as a varuint32
// https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#varuintn
// https://en.wikipedia.org/wiki/LEB128
// E.g https://docs.rs/wasmparser/0.35.3/src/wasmparser/binary_reader.rs.html#436
pub fn read_bytes_as_varunit(bytes: &[u8]) -> Result<(usize, usize), &'static str> {
    if bytes.is_empty() {
        return Err("Did not pass enough bytes");
    }

    // Check if it is only a single byte
    if (bytes[0] & 0x80) == 0 {
        return Ok((usize::from(bytes[0]), 1));
    } else if bytes.len() < 2 {
        return Err("Error decoding the varuint32, the high bit was incorrectly set");
    }

    let mut response: usize = 0;
    let mut byte_length: usize = 0;
    let mut shift = 0;
    for byte in bytes.iter() {
        let low_order_byte: usize = usize::from(byte & 0x7F);
        response |= low_order_byte << shift;
        byte_length += 1;
        if byte & 0x80 == 0 {
            break;
        }
        shift += 7;
    }

    Ok((response, byte_length))
}

// Take a u32, and output a vec of bytes that represent the value as a varuint32
pub fn get_u32_as_bytes_for_varunit(value: u32) -> Vec<u8> {
    let mut response = Vec::new();

    if value == 0 {
        response.push(0);
        return response;
    }

    let mut current_value: u32 = value;

    while current_value > 0 {
        let mut byte = (current_value & 0x7F) as u8;
        current_value >>= 7;
        if current_value > 0 {
            // Set the top (7th) bit
            byte |= 0x80;
        }
        response.push(byte);
    }

    response
}

#[cfg(test)]
#[test]
fn test_read_bytes_as_varunit() {
    // Test varuint
    let (value, _) = read_bytes_as_varunit(&[0x38, 0xB6]).unwrap();
    println!("0x38B6 {:x}", value);
    // Test varuint again
    let (value_again, _) = read_bytes_as_varunit(&[0xC8, 0xB3]).unwrap();
    println!("0xC8B3 {:x}", value_again);
}
