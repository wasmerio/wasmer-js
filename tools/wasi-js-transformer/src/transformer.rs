// Main transformation logic

use std::*;
use wasmparser::*;
#[macro_use]
use utils;

#[derive(Debug)]
struct LoweredSignature {
    bytes: Vec<u8>
}

#[derive(Debug)]
struct TrampolineFunction {
    signature_index: usize,
    bytes: Vec<u8>
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
pub fn transform_wasm_for_wasi_js() {
    
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

        let transformed = transform_wasm_for_wasi_js(&mut wasm);

        let transformed_wat = wabt::wasm2wat(transformed.to_vec());

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

        assert!(wasmparser::validate(&transformed, None), "converted wasm is not valid");
    }
}
