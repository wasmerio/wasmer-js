// Parser to build a minimal AST

#[derive(Debug, Copy, Clone)]
struct WasmSection<'a> {
    start_position: usize,
    end_position: usize,
    code: wasmparser::SectionCode<'a>,
    size: u32,
    size_byte_length: usize,
    count: u32,
    count_byte_length: usize
}

#[derive(Debug)]
struct WasmTypeSignature {
    start_position: usize,
    end_position: usize,
    num_params: usize,
    num_params_byte_length: usize,
    num_returns: usize,
    num_returns_byte_length: usize,
    has_i64_param: bool,
    has_i64_returns: bool
}

#[derive(Debug)]
struct WasmFunction {
    is_import: bool,
    position: usize,
    function_index: usize,
    signature_index: usize,
    has_i64_param: bool,
    has_i64_returns: bool
}

#[derive(Debug)]
struct WasmCall {
    position: usize,
    function_index: usize
}




