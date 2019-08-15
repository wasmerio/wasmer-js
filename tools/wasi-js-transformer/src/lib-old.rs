// Library to be consumed on the browser

use js_sys::*;
use std::*;
use wasm_bindgen::prelude::*;
use wasmparser::Parser;
use wasmparser::ParserState;
use wasmparser::WasmDecoder;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
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

pub fn convert(original_wasm_binary_vec: &mut Vec<u8>) -> Vec<u8> {
    let mut wasm_type_signatures: Vec<WasmTypeSignature> = Vec::new();
    let mut wasm_sections: Vec<WasmSection> = Vec::new();
    let mut wasm_functions: Vec<WasmFunction> = Vec::new();
    let mut wasm_calls: Vec<WasmCall> = Vec::new();
    let mut current_function_index: usize = 0;

    let mut wasm_binary_vec = original_wasm_binary_vec.to_vec();

    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Doing actual transformations");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");

    // Iterate through the imported functions, and grab data we need to insert
    let mut signatures_to_add = Vec::new();
    let mut trampoline_functions = Vec::new();

    // 1. Find if an imported function has i64. If it does, continue...
    let imported_i64_wasm_function_filter = wasm_functions
        .iter()
        .filter(|&x| x.is_import && (x.has_i64_param || x.has_i64_returns));

    if wasm_functions
        .iter()
        .filter(|&x| x.is_import && (x.has_i64_param || x.has_i64_returns))
        .count()
        == 0
    {
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

    for imported_i64_wasm_function in wasm_functions
        .iter()
        .filter(|&x| x.is_import && (x.has_i64_param || x.has_i64_returns))
    {
        // 2. Make a copy of its function signature
        // Get it's signature position and length

        let wasm_type_signature = wasm_type_signatures
            .get(imported_i64_wasm_function.signature_index as usize)
            .unwrap();

        // Create a copy of of this memory
        let mut new_type_signature_data = LoweredSignature {
            bytes: vec![0; wasm_type_signature.end_position - wasm_type_signature.start_position],
        };
        let original_signature_slice = wasm_binary_vec
            .get(wasm_type_signature.start_position..wasm_type_signature.end_position)
            .unwrap();
        new_type_signature_data
            .bytes
            .copy_from_slice(original_signature_slice);

        // 3. Modify the function signature copy to only use i32

        // Edit the signature to only use i32
        // Params
        for i in (1 + wasm_type_signature.num_params_byte_length)
            ..(1 + wasm_type_signature.num_params_byte_length + wasm_type_signature.num_params)
        {
            // If the param or return byte at the index is i64, set to i32
            let mut byte = new_type_signature_data.bytes.get_mut(i).unwrap();
            if *byte == 0x7e {
                *byte = 0x7f;
            }
        }
        // Returns
        if wasm_type_signature.num_returns == 1 {
            let bytes_len = new_type_signature_data.bytes.len();
            let mut byte = new_type_signature_data
                .bytes
                .get_mut(bytes_len - 1)
                .unwrap();
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
            signature_index: imported_i64_wasm_function.signature_index,
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
            if *wasm_binary_vec
                .get(
                    wasm_type_signature.start_position
                        + 1
                        + wasm_type_signature.num_params_byte_length
                        + i,
                )
                .unwrap()
                == 0x7e
            {
                // i32.wrap_i64
                trampoline_function.bytes.push(0xa7);
            }
        }
        // Returns
        if wasm_type_signature.num_returns == 1 {
            let byte = *wasm_binary_vec
                .get(wasm_type_signature.end_position - 1)
                .unwrap();
            if byte == 0x7e {
                // i32.wrap_i64
                trampoline_function.bytes.push(0xa7);
            }
        }

        // Finally call the original function
        // Call
        trampoline_function.bytes.push(0x10);
        // Function index
        trampoline_function
            .bytes
            .push(imported_i64_wasm_function.function_index as u8);

        // end
        trampoline_function.bytes.push(0x0b);

        // Add the function body length
        trampoline_function
            .bytes
            .insert(0, trampoline_function.bytes.len() as u8);

        // Add the trampoline function
        trampoline_functions.push(trampoline_function);

        // 5. Edit the original function to point at the new function signature

        // Edit the original function to point at the new signature index
        // NOTE: For some reason, the first imported function points at the beginning of the import section,
        // NOT the beginning of the function
        let mut function_position = imported_i64_wasm_function.position;
        let import_section_workaround = wasm_sections
            .iter()
            .find(|&x| x.code == wasmparser::SectionCode::Import)
            .unwrap();
        if imported_i64_wasm_function.is_import && imported_i64_wasm_function.function_index == 0 {
            function_position += 1
                + import_section_workaround.size_byte_length
                + import_section_workaround.count_byte_length;
        }
        let (import_module_name_length, import_module_name_length_byte_length) =
            read_bytes_as_varunit32_and_byte_length(
                wasm_binary_vec
                    .get(function_position..(function_position + 4))
                    .unwrap(),
            );
        let (import_field_name_length, import_field_name_length_byte_length) =
            read_bytes_as_varunit32_and_byte_length(
                wasm_binary_vec
                    .get(
                        (function_position + (import_module_name_length as usize) + 1)
                            ..(function_position + (import_module_name_length as usize) + 5),
                    )
                    .unwrap(),
            );
        // Get the position of the actual signature
        let import_signature_position = function_position
            + import_module_name_length_byte_length
            + (import_module_name_length as usize)
            + import_field_name_length_byte_length
            + (import_field_name_length as usize)
            + 1;
        // Get the signature
        let (_, import_signature_byte_length) = read_bytes_as_varunit32_and_byte_length(
            wasm_binary_vec
                .get(function_position..(function_position + 4))
                .unwrap(),
        );

        // Change the signature index to our newly created import index
        // -1 since it is an index
        let new_signature_index = (wasm_type_signatures.len() + signatures_to_add.len() - 1) as u32;
        let new_signature_bytes = get_u32_as_bytes_for_varunit32(new_signature_index);
        remove_number_of_bytes_at_position(
            &mut wasm_binary_vec,
            import_signature_position,
            import_signature_byte_length,
        );
        insert_bytes_at_position(
            &mut wasm_binary_vec,
            import_signature_position,
            new_signature_bytes,
        );

        // 6. Edit calls to the original function, to now point at the trampoline function
        let trampoline_function_index = wasm_functions.len() + trampoline_functions.len() - 1;
        let trampoline_function_bytes =
            get_u32_as_bytes_for_varunit32(trampoline_function_index as u32);
        for wasm_call_to_old_function in wasm_calls
            .iter()
            .filter(|&x| x.function_index == imported_i64_wasm_function.function_index)
        {
            let trampoline_function_bytes =
                get_u32_as_bytes_for_varunit32(trampoline_function_index as u32);
            // Get the old call
            let start = wasm_call_to_old_function.position + 1;
            let mut end = wasm_call_to_old_function.position + 1 + 4;
            if end > wasm_binary_vec.len() {
                end = wasm_binary_vec.len();
            }
            let wasm_call_function_index_bytes = wasm_binary_vec.get(start..end).unwrap();
            let (_, call_index_byte_length) =
                read_bytes_as_varunit32_and_byte_length(wasm_call_function_index_bytes);
            remove_number_of_bytes_at_position(
                &mut wasm_binary_vec,
                wasm_call_to_old_function.position + 1,
                call_index_byte_length,
            );
            insert_bytes_at_position(
                &mut wasm_binary_vec,
                wasm_call_to_old_function.position + 1,
                trampoline_function_bytes.to_vec(),
            );
        }

        console_log!(" ");
        console_log!(
            "Imported i64 Wasm Function: {:#?}",
            imported_i64_wasm_function
        );
        console_log!("function_position: {:#?}", function_position);
        console_log!(
            "import_module_name_length: {:#?}",
            import_module_name_length
        );
        console_log!("import_field_name_length: {:#?}", import_field_name_length);
        console_log!(
            "import_signature_position: {:#?}",
            import_signature_position
        );
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
    let old_types_section = wasm_sections
        .iter()
        .find(|&x| x.code == wasmparser::SectionCode::Type)
        .unwrap();
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
            wasm_binary_vec.insert(
                types_section.end_position + i,
                *signature_to_add.bytes.get(i).unwrap(),
            );
            bytes_added_to_types_section += 1;
            position_offset += 1;
        }
    }
    // Types section size
    let original_types_section_length = *wasm_binary_vec
        .get(types_section.start_position + 1)
        .unwrap();
    let new_types_section_length = original_types_section_length + bytes_added_to_types_section;
    wasm_binary_vec.insert(types_section.start_position + 1, new_types_section_length);
    wasm_binary_vec.remove(types_section.start_position + 2);

    // Number of Types
    let original_types_number_of_types = *wasm_binary_vec
        .get(types_section.start_position + 2)
        .unwrap();
    let new_types_number_of_types = original_types_number_of_types + signatures_to_add.len() as u8;
    wasm_binary_vec.insert(types_section.start_position + 2, new_types_number_of_types);
    wasm_binary_vec.remove(types_section.start_position + 3);

    console_log!(" ");
    console_log!("==========");
    console_log!("Type Section Update");
    console_log!("==========");
    console_log!(" ");
    console_log!(
        "Type Section start position: {:?}",
        types_section.start_position
    );
    console_log!(
        "Type Section original byte length: {:?}",
        original_types_section_length
    );
    console_log!(
        "Type Section bytes added to byte length: {:?}",
        bytes_added_to_types_section
    );
    console_log!(
        "Type Section new byte length: {:?}",
        new_types_section_length
    );
    console_log!(
        "Type Section original number of types: {:?}",
        original_types_number_of_types
    );
    console_log!(
        "Type Section new number of types: {:?}",
        new_types_number_of_types
    );

    // 8. Add the new functions to function section (Where the signature is defined, which the body is later in the code section)
    let old_function_section = wasm_sections
        .iter()
        .find(|&x| x.code == wasmparser::SectionCode::Function)
        .unwrap();
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
        wasm_binary_vec.insert(
            function_section.end_position + i,
            trampoline_functions.get(i).unwrap().signature_index as u8,
        );
        position_offset += 1;
        bytes_added_to_function_section += 1;
    }
    // Functions section size
    let original_function_section_length = *wasm_binary_vec
        .get(function_section.start_position + 1)
        .unwrap();
    let new_function_section_length =
        original_function_section_length + bytes_added_to_function_section;
    wasm_binary_vec.insert(
        function_section.start_position + 1,
        new_function_section_length,
    );
    wasm_binary_vec.remove(function_section.start_position + 2);

    // Number of Functions
    let original_function_section_number_of_functions = *wasm_binary_vec
        .get(function_section.start_position + 2)
        .unwrap();
    let new_function_section_number_of_functions =
        original_function_section_number_of_functions + trampoline_functions.len() as u8;
    wasm_binary_vec.insert(
        function_section.start_position + 2,
        new_function_section_number_of_functions,
    );
    wasm_binary_vec.remove(function_section.start_position + 3);

    console_log!(" ");
    console_log!(
        "Function Section bytes, starting -> starting + 5 {:?}",
        wasm_binary_vec
            .get(function_section.start_position..(function_section.start_position + 5))
            .unwrap()
    );
    console_log!("==========");
    console_log!("Function Section Update");
    console_log!("==========");
    console_log!(" ");
    console_log!(
        "Function Section start position: {:?}",
        function_section.start_position
    );
    console_log!(
        "Function Section original byte length: {:?}",
        original_function_section_length
    );
    console_log!(
        "Function Section bytes added to byte length: {:?}",
        bytes_added_to_function_section
    );
    console_log!(
        "Function Section new byte length: {:?}",
        new_function_section_length
    );
    console_log!(
        "Function Section original number of functions: {:?}",
        original_function_section_number_of_functions
    );
    console_log!(
        "Function Section new number of functions: {:?}",
        new_function_section_number_of_functions
    );

    // 9. Add the function bodies to the Code. Update Code section
    let old_code_section = wasm_sections
        .iter()
        .find(|&x| x.code == wasmparser::SectionCode::Code)
        .unwrap();
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
            wasm_binary_vec.insert(
                code_section.end_position + i,
                *trampoline_function.bytes.get(i).unwrap() as u8,
            );
            bytes_added_to_code_section += 1;
            position_offset += 1;
        }
    }

    // Code section size
    let original_code_section_length_position = code_section.start_position + 1;
    let (original_code_section_length, original_code_section_length_byte_length) =
        read_bytes_as_varunit32_and_byte_length(
            wasm_binary_vec
                .get(
                    original_code_section_length_position
                        ..(original_code_section_length_position + 4),
                )
                .unwrap(),
        );
    let new_code_section_length = original_code_section_length + bytes_added_to_code_section as u32;
    let new_code_section_length_bytes = get_u32_as_bytes_for_varunit32(new_code_section_length);
    let new_code_section_length_bytes_length = new_code_section_length_bytes.len();
    remove_number_of_bytes_at_position(
        &mut wasm_binary_vec,
        original_code_section_length_position,
        original_code_section_length_byte_length,
    );
    insert_bytes_at_position(
        &mut wasm_binary_vec,
        original_code_section_length_position,
        new_code_section_length_bytes,
    );

    // Number of Functions
    let original_code_number_of_functions_position =
        code_section.start_position + new_code_section_length_bytes_length + 1;
    let (original_code_number_of_functions, original_code_number_of_functions_byte_length) =
        read_bytes_as_varunit32_and_byte_length(
            wasm_binary_vec
                .get(
                    original_code_number_of_functions_position
                        ..(original_code_number_of_functions_position + 4),
                )
                .unwrap(),
        );
    let new_code_number_of_functions =
        original_code_number_of_functions + trampoline_functions.len() as u32;
    let new_code_number_of_functions_bytes =
        get_u32_as_bytes_for_varunit32(new_code_number_of_functions);
    remove_number_of_bytes_at_position(
        &mut wasm_binary_vec,
        original_code_number_of_functions_position,
        original_code_number_of_functions_byte_length,
    );
    insert_bytes_at_position(
        &mut wasm_binary_vec,
        original_code_number_of_functions_position,
        new_code_number_of_functions_bytes,
    );

    console_log!(" ");
    console_log!(
        "code Section bytes, starting -> starting + 5 {:?}",
        wasm_binary_vec
            .get(code_section.start_position..(code_section.start_position + 5))
            .unwrap()
    );
    console_log!("==========");
    console_log!("Code Section Update");
    console_log!("==========");
    console_log!(" ");
    console_log!("Original Code Section: {:?}", code_section);
    console_log!(
        "Code Section start position: {:?}",
        code_section.start_position
    );
    console_log!(
        "Code Section original byte length: {:?}",
        original_code_section_length
    );
    console_log!(
        "Code Section bytes added to byte length: {:?}",
        bytes_added_to_code_section
    );
    console_log!(
        "Code Section new byte length: {:?}",
        new_code_section_length
    );
    console_log!(
        "Code Section original number of functions: {:?}",
        original_code_number_of_functions
    );
    console_log!(
        "Code Section new number of functions: {:?}",
        new_code_number_of_functions
    );

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

        let wat_string =
            fs::read_to_string(test_file_path).expect("Something went wrong reading the file");

        let mut wasm = wabt::wat2wasm(&wat_string).expect("parsed properly");

        assert!(
            wasmparser::validate(&wasm, None),
            "original wasm is not valid"
        );

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
            }
            _ => (),
        }

        assert!(
            wasmparser::validate(&converted, None),
            "converted wasm is not valid"
        );
    }
}
