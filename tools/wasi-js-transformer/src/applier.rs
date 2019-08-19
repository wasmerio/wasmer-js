// Module to update and insert bytes into the wasm binary

use crate::generator::*;
use crate::parser::*;
use crate::utils::*;
use std::*;

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
    // TODO: Remove this:
    let test_vec = vec![0xe2, 0x06];
    let (test, _) = read_bytes_as_varunit(test_vec.as_slice());
    console_log!(" ");
    console_log!("Testing a conversion from bytes to varuint: {:?}", test);
    console_log!(" ");

    // Must apply updates in order acording to the binary spec to preserve the position offset,
    // https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#high-level-structure

    let mut position_offset: usize = 0;

    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Adding Lowered signatures...");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");
    console_log!("Lowered Signatures: {:?}", lowered_signatures);

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
        0,
        lowered_signature_bytes,
        *types_section,
    );

    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Updating Import signatures...");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");

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
        // +1 because of the external_kind (a single byte)
        let import_function_signature_position = field_length_start_position
            + import_field_name_length_byte_length
            + import_field_name_length as usize
            + 1;

        // Get the signature byte length (to remove later)
        let (import_function_signature, import_function_signature_byte_length) =
            read_bytes_as_varunit(
                wasm_binary_vec
                    .get(
                        import_function_signature_position
                            ..(import_function_signature_position + 4),
                    )
                    .unwrap(),
            );

        // Change the signature index to our newly created import index
        let lowered_signature_vec_index = lowered_signatures
            .iter()
            .position(|x| x.original_signature_index == import_function_signature as usize)
            .unwrap();
        let new_signature_index = (type_signatures.len() + lowered_signature_vec_index) as u32;
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

        let byte_length_difference =
            (new_signature_bytes.len() - import_function_signature_byte_length) as usize;
        position_offset += byte_length_difference;

        console_log!(" ");
        console_log!(
            "Original Import: {:?}, lowered sig: {:?}",
            imported_i64_function,
            new_signature_index
        );

        console_log!(" ");
        console_log!(
            "Original sig index: {:?}, new sig index: {:?}",
            import_function_signature,
            new_signature_index
        );
    }

    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Adding Trampoline signatures...");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");

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
    console_log!("Trampoline Signatures: {:?}", trampoline_signatures);
    position_offset += add_entries_to_section(
        wasm_binary_vec,
        position_offset,
        0,
        trampoline_signatures,
        *functions_section,
    );

    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Updating Calls in Code Section...");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");

    // Edit calls to the original function, to now point at the trampoline functions'
    // NOTE: Since Calls are a part of the function body, we need to calculate the offset
    // from modifying the calls, before adding the trampoline functions. Thus, we get an,
    // insertion_offset.
    let mut calls_byte_offset: usize = 0;
    for i in 0..imported_i64_functions.len() {
        let imported_i64_function = imported_i64_functions.get(i).unwrap();

        console_log!(" ");
        console_log!("===========================");
        console_log!("Imported: {:?}", imported_i64_function);

        for wasm_call_to_old_function in wasm_calls
            .iter()
            .filter(|&x| x.function_index == imported_i64_function.function_index)
        {
            console_log!(" ");
            console_log!("Call: {:?}", wasm_call_to_old_function);
            console_log!("Call in hex: {:x?}", wasm_call_to_old_function);

            // Get the old call
            let call_index_start_position =
                position_offset + calls_byte_offset + wasm_call_to_old_function.position + 1;
            let mut call_index_end_position = call_index_start_position + 4;
            if call_index_end_position > wasm_binary_vec.len() {
                call_index_end_position = wasm_binary_vec.len();
            }

            console_log!(
                "Call Bytes: {:?}",
                wasm_binary_vec
                    .get((call_index_start_position - 1)..call_index_end_position)
                    .unwrap()
            );

            let wasm_call_function_index_bytes = wasm_binary_vec
                .get(call_index_start_position..call_index_end_position)
                .unwrap();
            let (call_index, call_index_byte_length) =
                read_bytes_as_varunit(wasm_call_function_index_bytes);
            remove_number_of_bytes_in_vec_at_position(
                &mut wasm_binary_vec,
                call_index_start_position,
                call_index_byte_length,
            );

            let trampoline_function_vec_index = trampoline_functions
                .iter()
                .position(|x| x.signature_index == imported_i64_function.signature_index)
                .unwrap();
            let trampoline_function_index = wasm_functions.len() + trampoline_function_vec_index;
            let trampoline_function_bytes =
                get_u32_as_bytes_for_varunit(trampoline_function_index as u32);
            insert_bytes_into_vec_at_position(
                &mut wasm_binary_vec,
                call_index_start_position,
                trampoline_function_bytes.to_vec(),
            );

            let byte_length_difference =
                (trampoline_function_bytes.len() - call_index_byte_length) as usize;
            calls_byte_offset += byte_length_difference;

            console_log!(
                "Original function: {:?}, new function: {:?}",
                imported_i64_function,
                trampoline_functions
                    .get(trampoline_function_vec_index)
                    .unwrap()
            );
            console_log!(
                "Original function index: {:?}, new function vec index {:?}, new function index: {:?}",
                call_index,
                trampoline_function_vec_index,
                trampoline_function_index
            );
            console_log!(
                "Testing... {:?} - {:?} = {:?}",
                trampoline_function_bytes.len(),
                call_index_byte_length,
                byte_length_difference
            );

            // Also, we may need to update the function body size
            if byte_length_difference > 0 {
                // We need to subtract what we just added here, since the body size is BEFORE the call
                let function_size_position = position_offset + calls_byte_offset
                    - byte_length_difference
                    + wasm_call_to_old_function.function_body_position;

                let function_size_bytes = wasm_binary_vec
                    .get(function_size_position..(function_size_position + 4))
                    .unwrap();
                let (function_size, function_size_byte_length) =
                    read_bytes_as_varunit(function_size_bytes);
                remove_number_of_bytes_in_vec_at_position(
                    &mut wasm_binary_vec,
                    function_size_position,
                    function_size_byte_length,
                );

                let new_function_size = function_size + byte_length_difference as u32;
                let new_function_size_bytes =
                    get_u32_as_bytes_for_varunit(new_function_size as u32);
                insert_bytes_into_vec_at_position(
                    &mut wasm_binary_vec,
                    function_size_position,
                    new_function_size_bytes.to_vec(),
                );

                let function_size_byte_length_difference =
                    (new_function_size_bytes.len() - function_size_byte_length) as usize;
                calls_byte_offset += function_size_byte_length_difference;

                console_log!(
                    "Original function body size: {:?}, new function body size: {:?}",
                    function_size,
                    new_function_size
                );
                console_log!(
                    "Testing... {:?} - {:?} = {:?}",
                    new_function_size_bytes.len(),
                    function_size_byte_length,
                    function_size_byte_length_difference
                );
            }
        }
    }

    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Adding Trampoline functions...");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");
    console_log!("Trampoline Functions: {:?}", trampoline_functions);

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
        calls_byte_offset,
        trampoline_function_bytes,
        *code_section,
    );

    //Done!
}

fn add_entries_to_section(
    mut wasm_binary_vec: &mut Vec<u8>,
    starting_offset: usize,
    insertion_offset: usize,
    entries: Vec<Vec<u8>>,
    section: WasmSection,
) -> usize {
    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Added Entries to section...");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");
    console_log!("Section: {:?}", section);
    console_log!("Entries: {:?}", entries);
    console_log!("Starting offset: {:?}", starting_offset);
    console_log!("Insertion offset: {:?}", insertion_offset);
    console_log!(
        "Starting offset + start position: {:?}",
        starting_offset + section.start_position
    );
    let start_pos = starting_offset + section.start_position;
    console_log!(
        "Starting bytes of (starting offset + start position)..+10 in hex: {:x?}",
        wasm_binary_vec.get((start_pos)..(start_pos + 10)).unwrap()
    );

    let mut position_offset: usize = 0;

    // Calculate how many bytes will be added to the end of the section
    let mut added_bytes_from_entries: usize = 0;
    for entry in entries.iter() {
        added_bytes_from_entries += entry.len();
    }

    position_offset += added_bytes_from_entries;

    // Section size
    let section_length_position = starting_offset + section.start_position + 1;
    let (section_length, section_length_byte_length) = read_bytes_as_varunit(
        wasm_binary_vec
            .get(section_length_position..(section_length_position + 4))
            .unwrap(),
    );
    let new_section_length =
        section_length + (insertion_offset as u32) + (added_bytes_from_entries as u32);
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

    let section_length_byte_length_difference =
        (new_section_length_bytes_length - section_length_byte_length) as usize;
    position_offset += section_length_byte_length_difference;

    // Number of Entries (AKA Count)
    let number_of_entries_position =
        starting_offset + section.start_position + 1 + section_length_byte_length;
    let (number_of_entries, number_of_entries_byte_length) = read_bytes_as_varunit(
        wasm_binary_vec
            .get(number_of_entries_position..(number_of_entries_position + 4))
            .unwrap(),
    );
    let new_number_of_entries = number_of_entries + entries.len() as u32;
    let new_number_of_entries_bytes = get_u32_as_bytes_for_varunit(new_number_of_entries);
    remove_number_of_bytes_in_vec_at_position(
        &mut wasm_binary_vec,
        number_of_entries_position,
        number_of_entries_byte_length,
    );
    insert_bytes_into_vec_at_position(
        &mut wasm_binary_vec,
        number_of_entries_position,
        new_number_of_entries_bytes.clone(),
    );

    let section_count_byte_length_difference =
        (number_of_entries_byte_length - new_number_of_entries_bytes.len()) as usize;
    position_offset += section_count_byte_length_difference;

    // Lastly, add the entries
    let mut previous_entry_offset = 0;
    for entry in entries.iter() {
        for i in 0..entry.len() {
            wasm_binary_vec.insert(
                starting_offset
                    + section_length_byte_length_difference
                    + section_count_byte_length_difference
                    + insertion_offset
                    + section.end_position
                    + previous_entry_offset
                    + i,
                *entry.get(i).unwrap(),
            );
        }
        previous_entry_offset += entry.len();
    }

    console_log!("Starting length: {:?}", section_length);
    console_log!("New length: {:?}", new_section_length);
    console_log!("Starting count: {:?}", number_of_entries);
    console_log!("New count: {:?}", new_number_of_entries);
    console_log!(
        "offset: {:?}, bytes added: {:?}, len byte len diff: {:?}, count byte len diff: {:?}",
        position_offset,
        added_bytes_from_entries,
        section_length_byte_length_difference,
        section_count_byte_length_difference
    );

    position_offset += insertion_offset;
    return position_offset;
}
