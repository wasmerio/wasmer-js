// Module to update and insert bytes into the wasm binary

use std::*;
#[macro_use]
use crate::utils::*;
use crate::generator::*;
use crate::parser::*;

pub fn apply_transformations_to_wasm_binary_vec(
    mut wasm_binary_vec: &mut Vec<u8>,
    imported_i64_functions: &Vec<&WasmFunction>,
    trampoline_functions: Vec<TrampolineFunction>,
    lowered_signatures: Vec<LoweredSignature>,
    wasm_sections: &Vec<WasmSection>,
    type_signatures: &Vec<WasmTypeSignature>,
    wasm_functions: &Vec<WasmFunction>,
    wasm_calls: &Vec<WasmCall>,
) {
    // Must apply updates in order acording to the binary spec to preserve the position offset,
    // https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#high-level-structure

    let mut position_offset: usize = 0;

    // Add the new lowered signatures to the Types Section
    let types_section = wasm_sections
        .iter()
        .find(|&x| x.code == WasmSectionCode::Type)
        .unwrap();
    let mut lowered_signature_bytes = Vec::new();
    for lowered_signature in lowered_signatures.iter() {
        lowered_signature_bytes.push(lowered_signature.bytes.clone());
    }
    position_offset += add_entries_to_section(
        wasm_binary_vec,
        position_offset,
        lowered_signature_bytes,
        *types_section,
    );

    // Update the imports to point at the new lowered_signatures
    for i in 0..imported_i64_functions.len() {
        let imported_i64_function = imported_i64_functions.get(i).unwrap();

        // Get the name length (module_len)
        let name_length_start_position = position_offset + imported_i64_function.position;
        let (import_module_name_length, import_module_name_length_byte_length) =
            read_bytes_as_varunit(
                wasm_binary_vec
                    .get(name_length_start_position..(name_length_start_position + 4))
                    .unwrap(),
            );

        // Get the field length (field_len)
        let field_length_start_position = name_length_start_position
            + import_module_name_length_byte_length
            + import_module_name_length as usize;
        let (import_field_name_length, import_field_name_length_byte_length) =
            read_bytes_as_varunit(
                wasm_binary_vec
                    .get(field_length_start_position..(field_length_start_position + 4))
                    .unwrap(),
            );

        // Get the function signature position (type)
        let import_function_signature_position = field_length_start_position
            + import_field_name_length_byte_length
            + import_field_name_length as usize;

        // Get the signature byte length (to remove later)
        let (_, import_function_signature_byte_length) = read_bytes_as_varunit(
            wasm_binary_vec
                .get(import_function_signature_position..(import_function_signature_position + 4))
                .unwrap(),
        );

        // Change the signature index to our newly created import index
        let new_signature_index = (type_signatures.len() + i) as u32;
        let new_signature_bytes = get_u32_as_bytes_for_varunit(new_signature_index);
        remove_number_of_bytes_in_vec_at_position(
            &mut wasm_binary_vec,
            import_function_signature_position,
            import_function_signature_byte_length,
        );
        insert_bytes_into_vec_at_position(
            &mut wasm_binary_vec,
            import_function_signature_position,
            new_signature_bytes.clone(),
        );

        position_offset +=
            (import_function_signature_byte_length - new_signature_bytes.len()) as usize;
    }

    // Add the signatures for the trampoline functions in the Functions section
    let functions_section = wasm_sections
        .iter()
        .find(|&x| x.code == WasmSectionCode::Function)
        .unwrap();
    let mut trampoline_signatures = Vec::new();
    for trampoline_function in trampoline_functions.iter() {
        let trampoline_signature_bytes =
            get_u32_as_bytes_for_varunit(trampoline_function.signature_index as u32);
        trampoline_signatures.push(trampoline_signature_bytes.clone());
    }
    position_offset += add_entries_to_section(
        wasm_binary_vec,
        position_offset,
        trampoline_signatures,
        *functions_section,
    );

    // Edit calls to the original function, to now point at the trampoline functions
    for i in 0..imported_i64_functions.len() {
        let imported_i64_function = imported_i64_functions.get(i).unwrap();

        for wasm_call_to_old_function in wasm_calls
            .iter()
            .filter(|&x| x.function_index == imported_i64_function.function_index)
        {
            // Get the old call
            // TODO: Rename start and end
            let start = position_offset + wasm_call_to_old_function.position + 1;
            let mut end = start + 4;
            if end > wasm_binary_vec.len() {
                end = wasm_binary_vec.len();
            }
            let wasm_call_function_index_bytes = wasm_binary_vec.get(start..end).unwrap();
            let (_, call_index_byte_length) = read_bytes_as_varunit(wasm_call_function_index_bytes);
            remove_number_of_bytes_in_vec_at_position(
                &mut wasm_binary_vec,
                start,
                call_index_byte_length,
            );

            let trampoline_function_index = wasm_functions.len() + i;
            let trampoline_function_bytes =
                get_u32_as_bytes_for_varunit(trampoline_function_index as u32);
            insert_bytes_into_vec_at_position(
                &mut wasm_binary_vec,
                start,
                trampoline_function_bytes.to_vec(),
            );

            position_offset += (call_index_byte_length - trampoline_function_bytes.len()) as usize;
        }
    }

    // Add the trampoline functions to the code section
    let code_section = wasm_sections
        .iter()
        .find(|&x| x.code == WasmSectionCode::Code)
        .unwrap();
    let mut trampoline_function_bytes = Vec::new();
    for trampoline_function in trampoline_functions.iter() {
        trampoline_function_bytes.push(trampoline_function.bytes.clone());
    }
    position_offset += add_entries_to_section(
        wasm_binary_vec,
        position_offset,
        trampoline_function_bytes,
        *code_section,
    );
}

fn add_entries_to_section(
    mut wasm_binary_vec: &mut Vec<u8>,
    starting_offset: usize,
    entries: Vec<Vec<u8>>,
    section: WasmSection,
) -> usize {
    let mut position_offset: usize = 0;
    let mut bytes_added: usize = 0;

    for entry in entries.iter() {
        for i in 0..entry.len() {
            wasm_binary_vec.insert(section.end_position + i, *entry.get(i).unwrap());
            bytes_added += 1;
        }
    }

    position_offset += bytes_added;

    // Code section size
    let section_length_position = starting_offset + section.start_position + 1;
    let (section_length, section_length_byte_length) = read_bytes_as_varunit(
        wasm_binary_vec
            .get(section_length_position..(section_length_position + 4))
            .unwrap(),
    );
    let new_section_length = section_length + bytes_added as u32;
    let new_section_length_bytes = get_u32_as_bytes_for_varunit(new_section_length);
    let new_section_length_bytes_length = new_section_length_bytes.len();
    remove_number_of_bytes_in_vec_at_position(
        &mut wasm_binary_vec,
        section_length_position,
        section_length_byte_length,
    );
    insert_bytes_into_vec_at_position(
        &mut wasm_binary_vec,
        section_length_position,
        new_section_length_bytes,
    );

    let section_length_difference = (new_section_length - section_length) as usize;
    position_offset += section_length_difference;

    // Number of Entries (AKA Count)
    let number_of_entries_position =
        starting_offset + section.start_position + 1 + section_length_byte_length;
    let (number_of_entries, number_of_entries_byte_length) = read_bytes_as_varunit(
        wasm_binary_vec
            .get(number_of_entries_position..(number_of_entries_position + 4))
            .unwrap(),
    );
    let new_number_of_entries = number_of_entries + entries.len() as u32;
    let number_of_entries_bytes = get_u32_as_bytes_for_varunit(number_of_entries);
    remove_number_of_bytes_in_vec_at_position(
        &mut wasm_binary_vec,
        number_of_entries_position,
        number_of_entries_byte_length,
    );
    insert_bytes_into_vec_at_position(
        &mut wasm_binary_vec,
        number_of_entries_position,
        number_of_entries_bytes,
    );

    let section_count_difference = (new_section_length - section_length) as usize;
    position_offset += section_count_difference;

    return position_offset;
}
