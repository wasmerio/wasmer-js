// Utility functions

pub fn read_bytes_as_varunit(bytes: &[u8]) -> (u32, usize) {
    if bytes.len() < 1 {
        panic!("Did not pass enough bytes")
    }

    // Check if it is only a single byte
    if (bytes[0] & 0x80) == 0 {
        return (bytes[0] as u32, 1);
    } else if bytes.len() < 2 {
        panic!("Error decoding the varuint32, the high bit was incorrectly set");
    }

    let mut response: u32 = 0;
    let mut byte_length: usize = 0;
    let mut shift = 0;
    for i in 0..bytes.len() {
        let byte: u8 = bytes[i];
        let low_order_byte: u32 = (byte & 0x7F) as u32;
        response |= (low_order_byte << shift) as u32;
        byte_length += 1;
        if byte & 0x80 == 0 {
            break;
        }
        shift += 7;
    }

    return (response, byte_length);
}

pub fn get_u32_as_bytes_for_varunit(value: u32) -> Vec<u8> {
    let mut response = Vec::new();

    if value == 0 {
        response.push(0);
        return response;
    }

    let mut currentValue: u32 = value;

    while currentValue > 0 {
        let mut byte = (currentValue & 0x7F) as u8;
        currentValue = currentValue >> 7;
        if currentValue > 0 {
            // Set the top (7th) bit
            byte = byte | 0x80
        }
        response.push(byte);
    }

    return response;
}

pub fn insert_bytes_into_vec_at_position(vec: &mut Vec<u8>, position: usize, bytes: Vec<u8>) {
    for i in 0..bytes.len() {
        vec.insert(position + i, bytes[i]);
    }
}

pub fn remove_number_of_bytes_in_vec_at_position(
    vec: &mut Vec<u8>,
    position: usize,
    number_of_bytes: usize,
) {
    for _i in 0..number_of_bytes {
        vec.remove(position);
    }
}
