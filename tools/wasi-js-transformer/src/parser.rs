// Parser to build a minimal AST

use std::*;
use wasmparser::Parser;
use wasmparser::ParserState;
use wasmparser::WasmDecoder;
#[macro_use]
use crate::utils::*;

// Modified from: https://docs.rs/wasmparser/0.35.3/src/wasmparser/primitives.rs.html#54-71
#[derive(Debug, Copy, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum WasmSectionCode {
    Type,      // Function signature declarations
    Import,    // Import declarations
    Function,  // Function declarations
    Table,     // Indirect function table and other tables
    Memory,    // Memory attributes
    Global,    // Global declarations
    Export,    // Exports
    Start,     // Start function declaration
    Element,   // Elements section
    Code,      // Function bodies (code)
    Data,      // Data segments
    DataCount, // Count of passive data segments
    Custom,    // Custom section declarations
}

#[derive(Debug, Copy, Clone)]
pub struct WasmSection {
    pub start_position: usize,
    pub end_position: usize,
    pub code: WasmSectionCode,
    pub size: u32,
    pub size_byte_length: usize,
    pub count: u32,
    pub count_byte_length: usize,
}

#[derive(Debug)]
pub struct WasmTypeSignature {
    pub start_position: usize,
    pub end_position: usize,
    pub num_params: usize,
    pub num_params_byte_length: usize,
    pub num_returns: usize,
    pub num_returns_byte_length: usize,
    pub has_i64_param: bool,
    pub has_i64_returns: bool,
}

#[derive(Debug)]
pub struct WasmFunction {
    pub is_import: bool,
    pub position: usize,
    pub function_index: usize,
    pub signature_index: usize,
    pub has_i64_param: bool,
    pub has_i64_returns: bool,
}

#[derive(Debug)]
pub struct WasmCall {
    pub position: usize,
    pub function_index: usize,
}

#[derive(Debug)]
pub struct ParsedWasmInfo {
    pub wasm_type_signatures: Vec<WasmTypeSignature>,
    pub wasm_sections: Vec<WasmSection>,
    pub wasm_functions: Vec<WasmFunction>,
    pub wasm_calls: Vec<WasmCall>,
}

// ===Building a relevant AST===
// 1. Find all wasm sections
// 2. Find all wasm type signatures
// 3. Find all wasm imported functions
// 4. Find all wasm functions (for the function index)
// NOTE: Function index space is not recorded in the binary (https://github.com/WebAssembly/design/blob/master/Modules.md#function-index-space)
// 5. Find all calls to functions
pub fn parse_wasm_vec(wasm_binary_vec: &Vec<u8>) -> ParsedWasmInfo {
    console_log!(" ");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!("Parsing...");
    console_log!("!!!!!!!!!!!!!!!!");
    console_log!(" ");

    let mut wasm_type_signatures: Vec<WasmTypeSignature> = Vec::new();
    let mut wasm_sections: Vec<WasmSection> = Vec::new();
    let mut wasm_functions: Vec<WasmFunction> = Vec::new();
    let mut wasm_calls: Vec<WasmCall> = Vec::new();
    let mut current_function_index: usize = 0;

    let mut parser = Parser::new(wasm_binary_vec);
    loop {
        let position = parser.current_position();
        let state = parser.read();

        match *state {
            ParserState::BeginSection { code, .. } => {
                // Get the size and count of the section
                // Starts the byte after the section code (current position is section code)
                let size_position = position + 1;
                let (size, size_byte_length) = read_bytes_as_varunit(
                    wasm_binary_vec
                        .get(size_position..(size_position + 4))
                        .unwrap(),
                );

                let mut count = 0;
                let mut count_byte_length = 0;
                match code {
                    // Only the start section does not have a count
                    wasmparser::SectionCode::Start => (),
                    _ => {
                        let count_position = position + size_byte_length;
                        let (response, byte_length) = read_bytes_as_varunit(
                            wasm_binary_vec
                                .get(count_position..(count_position + 4))
                                .unwrap(),
                        );
                        count = response;
                        count_byte_length = byte_length;
                    }
                }

                // Convert their wasmparser's section code to our section code
                let mut section_code = WasmSectionCode::Custom;
                if code == wasmparser::SectionCode::Type {
                    section_code = WasmSectionCode::Type;
                } else if code == wasmparser::SectionCode::Import {
                    section_code = WasmSectionCode::Import;
                } else if code == wasmparser::SectionCode::Function {
                    section_code = WasmSectionCode::Function;
                } else if code == wasmparser::SectionCode::Table {
                    section_code = WasmSectionCode::Table;
                } else if code == wasmparser::SectionCode::Memory {
                    section_code = WasmSectionCode::Memory;
                } else if code == wasmparser::SectionCode::Global {
                    section_code = WasmSectionCode::Global;
                } else if code == wasmparser::SectionCode::Export {
                    section_code = WasmSectionCode::Export;
                } else if code == wasmparser::SectionCode::Start {
                    section_code = WasmSectionCode::Start;
                } else if code == wasmparser::SectionCode::Element {
                    section_code = WasmSectionCode::Element;
                } else if code == wasmparser::SectionCode::Code {
                    section_code = WasmSectionCode::Code;
                } else if code == wasmparser::SectionCode::Data {
                    section_code = WasmSectionCode::Data;
                } else if code == wasmparser::SectionCode::DataCount {
                    section_code = WasmSectionCode::DataCount;
                }

                let wasm_section = WasmSection {
                    code: section_code,
                    size: size,
                    size_byte_length: size_byte_length,
                    count: count,
                    count_byte_length: count_byte_length,
                    start_position: position,
                    end_position: 0,
                };
                wasm_sections.push(wasm_section);
            }
            ParserState::EndSection => {
                let wasm_section_index = wasm_sections.len() - 1;
                wasm_sections
                    .get_mut(wasm_section_index)
                    .unwrap()
                    .end_position = position;
            }
            ParserState::TypeSectionEntry(ref state) => {
                let has_i64_param = state.params.iter().any(|&x| match x {
                    wasmparser::Type::I64 => true,
                    _ => false,
                });

                let has_i64_returns = state.returns.iter().any(|&x| match x {
                    wasmparser::Type::I64 => true,
                    _ => false,
                });

                let num_params = state.params.len();
                let num_returns = state.returns.len();

                let wasm_type_signature = WasmTypeSignature {
                    start_position: position,
                    end_position: 0,
                    num_params: num_params,
                    num_params_byte_length: 0,
                    num_returns: num_returns,
                    num_returns_byte_length: 1,
                    has_i64_param: has_i64_param,
                    has_i64_returns: has_i64_returns,
                };
                wasm_type_signatures.push(wasm_type_signature);
            }
            ParserState::ImportSectionEntry {
                module: _,
                field: _,
                ty,
            } => {
                match ty {
                    wasmparser::ImportSectionEntryType::Function(index) => {
                        let wasm_type_signature_option = wasm_type_signatures.get(index as usize);

                        let wasm_function: WasmFunction = WasmFunction {
                            is_import: true,
                            position: position,
                            function_index: current_function_index as usize,
                            signature_index: index as usize,
                            has_i64_param: match wasm_type_signature_option {
                                Some(wasm_type_signature) => wasm_type_signature.has_i64_param,
                                None => false,
                            },
                            has_i64_returns: match wasm_type_signature_option {
                                Some(wasm_type_signature) => wasm_type_signature.has_i64_returns,
                                None => false,
                            },
                        };
                        current_function_index += 1;
                        wasm_functions.push(wasm_function);
                    }
                    _ => (),
                };
            }
            ParserState::FunctionSectionEntry(index) => {
                let wasm_type_signature_option = wasm_type_signatures.get(index as usize);

                let wasm_function: WasmFunction = WasmFunction {
                    is_import: false,
                    position: position,
                    function_index: current_function_index as usize,
                    signature_index: index as usize,
                    has_i64_param: match wasm_type_signature_option {
                        Some(wasm_type_signature) => wasm_type_signature.has_i64_param,
                        None => false,
                    },
                    has_i64_returns: match wasm_type_signature_option {
                        Some(wasm_type_signature) => wasm_type_signature.has_i64_returns,
                        None => false,
                    },
                };
                current_function_index += 1;
                wasm_functions.push(wasm_function);
            }
            ParserState::CodeOperator(ref state) => match *state {
                wasmparser::Operator::Call { function_index } => {
                    let wasm_call = WasmCall {
                        position: position,
                        function_index: function_index as usize,
                    };
                    wasm_calls.push(wasm_call);
                }
                _ => (),
            },
            ParserState::EndWasm => break,
            _ => (),
        }
    }

    // Type signature positions are buggy, and can return the wrong positions
    // Thus we need to do a second pass to correct some of our required values and add end positions
    // (The order of signatures will be correct, but position will be completely wrong)
    let types_section_workaround = wasm_sections
        .iter()
        .find(|&x| x.code == WasmSectionCode::Type)
        .unwrap();
    let types_section_entries_position = types_section_workaround.start_position
        + types_section_workaround.size_byte_length
        + types_section_workaround.count_byte_length
        + 1;
    for i in 0..wasm_type_signatures.len() + 1 {
        if i == 0 {
            wasm_type_signatures.get_mut(0).unwrap().start_position =
                types_section_entries_position;
        } else {
            let previous_type_signature = wasm_type_signatures.get_mut(i - 1).unwrap();

            // Get the byte length of our values to determine the correct posisition
            let num_params_position = previous_type_signature.start_position + 1;
            let (_, num_params_byte_length) = read_bytes_as_varunit(
                wasm_binary_vec
                    .get(num_params_position..(num_params_position + 4))
                    .unwrap(),
            );
            previous_type_signature.num_params_byte_length = num_params_byte_length;

            let new_position = previous_type_signature.start_position
                + previous_type_signature.num_params_byte_length
                + previous_type_signature.num_params
                + previous_type_signature.num_returns_byte_length
                + previous_type_signature.num_returns
                + 1;
            previous_type_signature.end_position = new_position;

            if i < wasm_type_signatures.len() {
                wasm_type_signatures.get_mut(i).unwrap().start_position = new_position;
            }
        }
    }

    return ParsedWasmInfo {
        wasm_type_signatures: wasm_type_signatures,
        wasm_sections: wasm_sections,
        wasm_functions: wasm_functions,
        wasm_calls: wasm_calls,
    };
}
