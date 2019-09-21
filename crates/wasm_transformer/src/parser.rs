// Parser to build a minimal AST

use crate::utils::*;
use std::*;
use wasmparser::Parser;
use wasmparser::ParserState;
use wasmparser::WasmDecoder;

/// Modified from: https://docs.rs/wasmparser/0.35.3/src/wasmparser/primitives.rs.html#54-71
// Licensed under Apache: https://github.com/yurydelendik/wasmparser.rs/blob/master/LICENSE
// Changes: Removed the lifetime from the Start Code
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

/// Interface for a general section in the Wasm Bindary
/// https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#module-structure
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

/// Interface for a Fucntion Type signature
/// https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#type-section
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

/// Interface for the binary where the function signatures are defined for an import function declaration / function body
/// https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#function-section
#[derive(Debug)]
pub struct WasmFunction {
    pub is_import: bool,
    pub position: usize,
    pub function_index: usize,
    pub signature_index: usize,
    pub num_params: usize,
    pub num_returns: usize,
    pub has_i64_param: bool,
    pub has_i64_returns: bool,
}

/// Interface for a call expression in a code section function body
/// https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md#call-operators-described-here
#[derive(Debug)]
pub struct WasmCall {
    pub position: usize,
    pub function_index: usize,
    pub function_body_position: usize,
    pub function_body_index: usize,
}

/// Overall psuedo-AST for our parsed wasm
#[derive(Debug)]
pub struct ParsedWasmInfo {
    pub wasm_type_signatures: Vec<WasmTypeSignature>,
    pub wasm_sections: Vec<WasmSection>,
    pub wasm_functions: Vec<WasmFunction>,
    pub wasm_calls: Vec<WasmCall>,
}

/// Function to walk the Wasm binary, and produce a minimal psuedo-AST representation
pub fn parse_wasm_vec(wasm_binary_vec: &mut Vec<u8>) -> ParsedWasmInfo {
    let mut wasm_type_signatures: Vec<WasmTypeSignature> = Vec::new();
    let mut wasm_sections: Vec<WasmSection> = Vec::new();
    let mut wasm_functions: Vec<WasmFunction> = Vec::new();
    let mut wasm_calls: Vec<WasmCall> = Vec::new();

    // Indexes and counters for relevant information pertaining to our interfaces
    let mut current_function_index: usize = 0;
    let mut current_function_body_start_position: usize = 0;
    let mut current_function_body_index: usize = 0;

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
                        .get(size_position..(size_position + 5))
                        .unwrap(),
                )
                .unwrap();

                let mut count = 0;
                let mut count_byte_length = 0;
                match code {
                    // Only the start section does not have a count
                    wasmparser::SectionCode::Start => (),
                    _ => {
                        let count_position = position + size_byte_length;
                        let (response, byte_length) = read_bytes_as_varunit(
                            wasm_binary_vec
                                .get(count_position..(count_position + 5))
                                .unwrap(),
                        )
                        .unwrap();
                        count = response;
                        count_byte_length = byte_length;
                    }
                }

                // Convert their wasmparser's section code to our section code
                let section_code = match code {
                    wasmparser::SectionCode::Type => WasmSectionCode::Type,
                    wasmparser::SectionCode::Import => WasmSectionCode::Import,
                    wasmparser::SectionCode::Function => WasmSectionCode::Function,
                    wasmparser::SectionCode::Table => WasmSectionCode::Table,
                    wasmparser::SectionCode::Memory => WasmSectionCode::Memory,
                    wasmparser::SectionCode::Global => WasmSectionCode::Global,
                    wasmparser::SectionCode::Export => WasmSectionCode::Export,
                    wasmparser::SectionCode::Start => WasmSectionCode::Start,
                    wasmparser::SectionCode::Element => WasmSectionCode::Element,
                    wasmparser::SectionCode::Code => WasmSectionCode::Code,
                    wasmparser::SectionCode::Data => WasmSectionCode::Data,
                    wasmparser::SectionCode::DataCount => WasmSectionCode::DataCount,
                    _ => WasmSectionCode::Custom,
                };

                let wasm_section = WasmSection {
                    code: section_code,
                    size,
                    size_byte_length,
                    count,
                    count_byte_length,
                    start_position: position,
                    end_position: 0,
                };
                wasm_sections.push(wasm_section);
            }
            ParserState::EndSection => {
                wasm_sections.last_mut().unwrap().end_position = position;
            }
            ParserState::TypeSectionEntry(ref state) => {
                let has_i64_param = state.params.iter().any(|&x| x == wasmparser::Type::I64);
                let has_i64_returns = state.returns.iter().any(|&x| x == wasmparser::Type::I64);

                let num_params = state.params.len();
                let num_returns = state.returns.len();

                let wasm_type_signature = WasmTypeSignature {
                    start_position: position,
                    end_position: 0,
                    num_params,
                    num_params_byte_length: 0,
                    num_returns,
                    num_returns_byte_length: 1,
                    has_i64_param,
                    has_i64_returns,
                };
                wasm_type_signatures.push(wasm_type_signature);
            }
            ParserState::ImportSectionEntry { ty, .. } => {
                if let wasmparser::ImportSectionEntryType::Function(index) = ty {
                    let wasm_type_signature = &wasm_type_signatures[index as usize];

                    let wasm_function: WasmFunction = WasmFunction {
                        is_import: true,
                        position,
                        function_index: current_function_index as usize,
                        signature_index: index as usize,
                        num_params: wasm_type_signature.num_params,
                        num_returns: wasm_type_signature.num_returns,
                        has_i64_param: wasm_type_signature.has_i64_param,
                        has_i64_returns: wasm_type_signature.has_i64_returns,
                    };
                    current_function_index += 1;
                    wasm_functions.push(wasm_function);
                }
            }
            ParserState::FunctionSectionEntry(index) => {
                let wasm_type_signature = &wasm_type_signatures[index as usize];

                let wasm_function: WasmFunction = WasmFunction {
                    is_import: false,
                    position,
                    function_index: current_function_index as usize,
                    signature_index: index as usize,
                    num_params: wasm_type_signature.num_params,
                    num_returns: wasm_type_signature.num_returns,
                    has_i64_param: wasm_type_signature.has_i64_param,
                    has_i64_returns: wasm_type_signature.has_i64_returns,
                };
                current_function_index += 1;
                wasm_functions.push(wasm_function);
            }
            ParserState::BeginFunctionBody { .. } => {
                current_function_body_start_position = position;
            }
            ParserState::CodeOperator(ref state) => match *state {
                wasmparser::Operator::Call { function_index } => {
                    let wasm_call = WasmCall {
                        position,
                        function_index: function_index as usize,
                        function_body_position: current_function_body_start_position,
                        function_body_index: current_function_body_index,
                    };
                    wasm_calls.push(wasm_call);
                }
                _ => (),
            },
            ParserState::EndFunctionBody { .. } => {
                current_function_body_index += 1;
            }
            ParserState::EndWasm => break,
            _ => (),
        }
    }

    // NOTE: For some reason, the first imported function points at the beginning of the import section,
    // NOT the beginning of the function
    let import_section = wasm_sections
        .iter()
        .find(|&x| x.code == WasmSectionCode::Import)
        .unwrap();
    wasm_functions
        .iter_mut()
        .filter(|function| function.is_import && function.function_index == 0)
        .for_each(|function| {
            function.position +=
                1 + import_section.size_byte_length + import_section.count_byte_length
        });

    // NOTE: Type signature positions are buggy, and can return the wrong positions
    // Thus we need to do a second pass to correct some of our required values and add end positions
    // (The order of signatures will be correct, but position will be completely wrong)
    if !wasm_type_signatures.is_empty() {
        let types_section = wasm_sections
            .iter()
            .find(|&x| x.code == WasmSectionCode::Type)
            .unwrap();
        let types_section_entries_position = types_section.start_position
            + types_section.size_byte_length
            + types_section.count_byte_length
            + 1;
        wasm_type_signatures.first_mut().unwrap().start_position = types_section_entries_position;
        for i in 1..wasm_type_signatures.len() + 1 {
            let previous_type_signature = wasm_type_signatures.get_mut(i - 1).unwrap();

            // Get the byte length of our values to determine the correct posisition
            let num_params_position = previous_type_signature.start_position + 1;
            let (_, num_params_byte_length) = read_bytes_as_varunit(
                wasm_binary_vec
                    .get(num_params_position..(num_params_position + 5))
                    .unwrap(),
            )
            .unwrap();
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

    ParsedWasmInfo {
        wasm_type_signatures,
        wasm_sections,
        wasm_functions,
        wasm_calls,
    }
}
