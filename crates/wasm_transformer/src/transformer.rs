// Main transformation logic

use crate::applier::*;
use crate::generator::*;
use crate::parser::*;
use crate::utils::*;

use std::path::{Path, PathBuf};
use std::*;

// Function to lower i64 imports for a Wasm binary vec
pub fn lower_i64_wasm_for_wasi_js(mut wasm_binary_vec: &mut Vec<u8>) -> Result<(), &'static str> {
    // First parse the Wasm vec
    let parsed_info = parse_wasm_vec(&mut wasm_binary_vec);

    // Get our imported wasm_functions
    let imported_i64_function_filter = parsed_info
        .wasm_functions
        .iter()
        .filter(|x| x.is_import && (x.has_i64_param || x.has_i64_returns));

    if imported_i64_function_filter.clone().count() < 1 {
        // We have no imports to lower.
        return Ok(());
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
        &trampoline_functions,
        &lowered_signatures,
        &parsed_info.wasm_sections,
        &parsed_info.wasm_type_signatures,
        &parsed_info.wasm_functions,
        &parsed_info.wasm_calls,
    )
}

#[cfg(test)]
#[test]
fn converts() {
    // Run tests for the following strings
    let mut test_file_paths = Vec::new();
    test_file_paths.push("./wasm_module_examples/path_open.wasm");
    test_file_paths.push("./wasm_module_examples/clock_time_get.wasm");
    test_file_paths.push("./wasm_module_examples/matrix.wasm");
    test_file_paths.push("./wasm_module_examples/two-imports.wasm");
    test_file_paths.push("./wasm_module_examples/gettimeofday/gettimeofday.wasm");
    test_file_paths.push("./wasm_module_examples/qjs.wasm");
    test_file_paths.push("./wasm_module_examples/duk.wasm");
    test_file_paths.push("./wasm_module_examples/rsign_original.wasm");
    test_file_paths.push("./wasm_module_examples/viu.wasm");
    test_file_paths.push("./wasm_module_examples/busy.wasm");
    test_file_paths.push("./wasm_module_examples/io-as-debug.wasm");
    test_file_paths.push("./wasm_module_examples/wasmboy-wasmer.wasm");
    // test_file_paths.push("./wasm_module_examples/clang.wasm");

    fs::create_dir_all("./wasm_module_examples_transformed/").unwrap();

    // Test varuint
    let (value, _) = read_bytes_as_varunit(&[0x38, 0xB6]).unwrap();
    console_log!("0x38B6 {:x}", value);
    let (value_again, _) = read_bytes_as_varunit(&[0xC8, 0xB3]).unwrap();
    console_log!("0xC8B3 {:x}", value_again);

    for test_file_path in test_file_paths.iter() {
        console_log!(" ");
        console_log!("=======================================");

        console_log!(" ");
        console_log!("Testing: {:?}", test_file_path);
        console_log!(" ");

        let mut wasm = fs::read(test_file_path).unwrap();

        wasmparser::validate(&wasm, None).expect("original Wasm is not valid");

        console_log!(" ");
        console_log!("Original Wasm Size: {}", &wasm.len());
        console_log!(" ");

        lower_i64_wasm_for_wasi_js(&mut wasm).unwrap();

        console_log!(" ");
        console_log!("New Wasm Size: {}", &wasm.len());
        console_log!(" ");

        let filename = Path::new(test_file_path)
            .file_name()
            .unwrap()
            .to_string_lossy();
        let transformed_filename = format!("./wasm_module_examples_transformed/{}", filename);
        fs::write(transformed_filename.clone(), &wasm).expect("Unable to write file");

        console_log!(" ");
        console_log!("Wrote resulting Wasm to: {}", transformed_filename.clone());
        console_log!(" ");

        console_log!(" ");
        console_log!("Outputting errors (if there are some)");
        console_log!(" ");

        let transformed_wat = wabt::wasm2wat(wasm.to_vec());

        match transformed_wat {
            Err(e) => {
                console_log!(" ");
                console_log!("wasm2wat Error:");
                console_log!(" ");
                console_log!("{:?}", e);
                console_log!(" ");
            }
            Ok(wat) => {
                fs::write("./wasm_module_examples/test_result.wat", wat)
                    .expect("Unable to write file");

                console_log!(" ");
                console_log!("Wrote resulting Wat to: ./wasm_module_examples/test_result.wat");
                console_log!(" ");
            }
        }

        let validated = wasmparser::validate(&wasm, None);

        if validated.is_err() {
            console_log!(" ");
            console_log!("wasmparser::validate Error (as Hex Values):");
            console_log!(" ");
            console_log!("{:X?}", validated.err());
            console_log!(" ");
        }

        assert!(!validated.is_err(), "Validation Assertion Failed.");
    }
}
