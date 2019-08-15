// Main transformation logic

use std::*;
#[macro_use]
mod utils;
mod parser;

#[derive(Debug)]
struct LoweredSignature {
    bytes: Vec<u8>,
}

#[derive(Debug)]
struct TrampolineFunction {
    signature_index: usize,
    bytes: Vec<u8>,
}

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
pub fn lower_i64_wasm_for_wasi_js(wasm_binary_vec: Vec<u8>) -> Vec<u8> {
    // First parse the wasm vec
    let parsed_wasm_info = parser::parse_wasm_vec(&wasm_binary_vec);

    // Get our imported wasm_functions
    let imported_i64_wasm_function_filter = parsed_wasm_info
        .wasm_functions
        .iter()
        .filter(|&x| x.is_import && (x.has_i64_param || x.has_i64_returns));

    console_log!("{:?}", imported_i64_wasm_function_filter);

    return wasm_binary_vec;
}

#[test]
fn converts() {
    // Run tests for the following strings
    let mut test_file_paths = Vec::new();
    test_file_paths.push("./wasm-module-examples/path_open.wat");
    // test_file_paths.push("./wasm-module-examples/clock_time_get.wat");
    // test_file_paths.push("./wasm-module-examples/matrix.wat");
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

        let wasm = wabt::wat2wasm(&wat_string).expect("parsed properly");

        assert!(
            wasmparser::validate(&wasm, None),
            "original wasm is not valid"
        );

        let transformed = lower_i64_wasm_for_wasi_js(wasm);

        let transformed_wat = wabt::wasm2wat(transformed.to_vec());

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
            _ => (),
        }

        assert!(
            wasmparser::validate(&transformed, None),
            "converted wasm is not valid"
        );
    }
}
