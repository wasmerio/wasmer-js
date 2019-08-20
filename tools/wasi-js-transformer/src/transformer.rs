// Main transformation logic

use crate::applier::*;
use crate::generator::*;
use crate::parser::*;
use std::*;

// Function to lower i64 imports for a wasm binary vec
pub fn lower_i64_wasm_for_wasi_js(mut wasm_binary_vec: &mut Vec<u8>) {
    // First parse the wasm vec
    let parsed_info = parse_wasm_vec(&mut wasm_binary_vec);

    // Get our imported wasm_functions
    let imported_i64_function_filter = parsed_info
        .wasm_functions
        .iter()
        .filter(|x| x.is_import && (x.has_i64_param || x.has_i64_returns));

    if imported_i64_function_filter.clone().count() < 1 {
        // We have no imports to lower.
        return;
    }

    // Get our imported functions
    let imported_i64_functions: Vec<_> = imported_i64_function_filter.clone().collect();

    // Generate our trampolines and signatures
    let (trampoline_functions, lowered_signatures) = generate_trampolines_and_signatures(
        &mut wasm_binary_vec,
        &imported_i64_functions,
        &parsed_info.wasm_type_signatures,
    );

    // Update the binary to point at the trampoline and signatures
    // This should be done in order, in order to not have to do continuous passes of the position.
    // https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#high-level-structure
    apply_transformations_to_wasm_binary_vec(
        &mut wasm_binary_vec,
        &imported_i64_functions,
        trampoline_functions,
        lowered_signatures,
        &parsed_info.wasm_sections,
        &parsed_info.wasm_type_signatures,
        &parsed_info.wasm_functions,
        &parsed_info.wasm_calls,
    );
}

#[test]
fn converts() {
    // Run tests for the following strings
    let mut test_file_paths = Vec::new();
    test_file_paths.push("./wasm-module-examples/path_open.wat");
    test_file_paths.push("./wasm-module-examples/clock_time_get.wat");
    test_file_paths.push("./wasm-module-examples/matrix.wat");
    test_file_paths.push("./wasm-module-examples/two-imports.wat");
    test_file_paths.push("./wasm-module-examples/gettimeofday/gettimeofday.wat");
    test_file_paths.push("./wasm-module-examples/qjs.wat");
    test_file_paths.push("./wasm-module-examples/duk.wat");

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

        lower_i64_wasm_for_wasi_js(&mut wasm);

        let transformed_wat = wabt::wasm2wat(wasm.to_vec());

        console_log!(" ");
        console_log!("==========");
        console_log!("Convert Back to Wat for descriptive errors (if there is one)");
        console_log!("==========");
        console_log!(" ");

        match transformed_wat {
            Err(e) => {
                console_log!(" ");
                console_log!("Test File Path: {:?}", test_file_path);
                console_log!(" ");
                console_log!("{:?}", e);
                console_log!(" ");
            }
            Ok(wat) => {
                fs::write("./wasm-module-examples/test_result.wat", wat)
                    .expect("Unable to write file");

                console_log!(" ");
                console_log!("Wrote resulting Wat to: ./wasm-module-examples/test_result.wat");
                console_log!(" ");
            }
        }

        assert!(
            wasmparser::validate(&wasm, None),
            "converted wasm is not valid"
        );
    }
}
