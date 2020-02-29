extern crate wasmparser;

use std::str;
use wasmparser::ParserState;
use wasmparser::WasmDecoder;
use wasmparser::{FuncType, ImportSectionEntryType, Operator, Parser, Range, SectionCode, Type};

use crate::utils::{
    generate_trampoline_function, get_u32_as_bytes_for_varunit, lower_func_body,
    read_bytes_as_varunit,
};

#[derive(Debug, Clone, Copy)]
struct PaddedRange {
    pub start: usize,
    pub padding: usize,
    pub end: usize,
}

pub fn lower_i64_imports(wasm_buf: &Vec<u8>) -> Result<Vec<u8>, &'static str> {
    let mut parser = Parser::new(wasm_buf);
    let mut new_buf = Vec::new();
    let last_cursor = 0;
    let mut first_type_section = true;
    let mut last_section_range: Option<Range> = None;
    let mut section_type: Option<PaddedRange> = None;
    let mut section_import: Option<PaddedRange> = None;
    let mut section_function: Option<PaddedRange> = None;
    let mut section_code: Option<PaddedRange> = None;
    let mut visited_section_type = false;
    let mut visited_section_import = false;
    let mut last_functionbody_range: Option<Range> = None;
    let mut function_types: Vec<(FuncType, bool, Range)> = Vec::new();
    let mut lowered_function_types: Vec<Option<usize>> = Vec::new();
    let mut lowered_function_calls: Vec<Option<usize>> = Vec::new();
    let mut function_calls_mapping: Vec<usize> = Vec::new();
    let mut imported_functions: Vec<(usize, Range)> = Vec::new();
    let mut trampolines: Vec<(usize, usize)> = Vec::new();
    let mut call_replacements: Vec<(usize, usize, Range)> = Vec::new();

    let mut first_function = true;

    loop {
        let mut start_position = parser.current_position();
        let mut end_position = 0;
        let state = parser.read();
        // let debug_info = format!("{:?}", state);
        // println_debug!("{}", debug_info);
        match *state {
            ParserState::TypeSectionEntry(ref func_type) => {
                if !visited_section_type {
                    if let Some(range) = section_type {
                        start_position = range.start + range.padding;
                        section_type = Some(range);
                        visited_section_type = true;
                    }
                }
                let func = func_type.clone();
                let has_i64_sig: bool = func.params.iter().any(|sig| *sig == Type::I64);
                let func_range = Range {
                    start: start_position,
                    end: parser.current_position(),
                };
                function_types.push((func.clone(), has_i64_sig, func_range));
                // 96 is the first byte that all function types should have
                assert_eq!(wasm_buf[start_position], 96);
            }
            ParserState::BeginSection { range, code, .. } => {
                end_position = range.end;
                if code == SectionCode::Type {
                    assert!(section_type.is_none(), "Only one section type is allowed");
                    // We get the code size
                    let (code_size, code_size_num_bytes) =
                        read_bytes_as_varunit(&wasm_buf[start_position + 1..]).unwrap();
                    let (num_funcs, num_funcs_num_bytes) = read_bytes_as_varunit(
                        &wasm_buf[start_position + 1 + code_size_num_bytes..],
                    )
                    .unwrap();

                    section_type = Some(PaddedRange {
                        start: start_position,
                        padding: 1 + code_size_num_bytes + num_funcs_num_bytes,
                        end: range.end,
                    });
                } else if code == SectionCode::Import {
                    // We get the code size
                    let (code_size, code_size_num_bytes) =
                        read_bytes_as_varunit(&wasm_buf[start_position + 1..]).unwrap();
                    println_debug!("Code size {} num bytes {}", code_size, code_size_num_bytes);
                    let (num_funcs, num_funcs_num_bytes) = read_bytes_as_varunit(
                        &wasm_buf[start_position + 1 + code_size_num_bytes..],
                    )
                    .unwrap();
                    println_debug!("Num funcs {} num bytes {}", num_funcs, num_funcs_num_bytes);

                    assert!(
                        section_import.is_none(),
                        "Only one section import is allowed"
                    );

                    section_import = Some(PaddedRange {
                        start: start_position,
                        padding: 1 + code_size_num_bytes + num_funcs_num_bytes,
                        end: range.end,
                    });
                } else if code == SectionCode::Function {
                    // We get the code size
                    let (code_size, code_size_num_bytes) =
                        read_bytes_as_varunit(&wasm_buf[start_position + 1..]).unwrap();
                    println_debug!("Code size {} num bytes {}", code_size, code_size_num_bytes);
                    let (num_funcs, num_funcs_num_bytes) = read_bytes_as_varunit(
                        &wasm_buf[start_position + 1 + code_size_num_bytes..],
                    )
                    .unwrap();
                    println_debug!("Num funcs {} num bytes {}", num_funcs, num_funcs_num_bytes);

                    assert!(
                        section_function.is_none(),
                        "Only one section function is allowed"
                    );

                    section_function = Some(PaddedRange {
                        start: start_position,
                        padding: 1 + code_size_num_bytes + num_funcs_num_bytes,
                        end: range.end,
                    });

                    // We recollect all the imports that are lowered
                    for (import_index, (signature_index, _)) in
                        imported_functions.iter().enumerate()
                    {
                        let has_i64_sig = function_types[*signature_index].1;
                        if !has_i64_sig {
                            continue;
                        }
                        // Num of imported functions + num of implemented functions + index in trampoline
                        let new_index =
                            imported_functions.len() + num_funcs as usize + trampolines.len();
                        lowered_function_calls[import_index] = Some(new_index);

                        trampolines.push((import_index, *signature_index));
                    }
                } else if code == SectionCode::Code {
                    assert!(
                        section_code.is_none(),
                        "Only one section code is supported for now"
                    );
                    let last_section = last_section_range.expect("Can't get latest section");

                    start_position = last_section.end + 1;
                    let (code_size, code_size_num_bytes) =
                        read_bytes_as_varunit(&wasm_buf[start_position..]).unwrap();
                    println_debug!("Code size {} num bytes {}", code_size, code_size_num_bytes);
                    let (num_funcs, num_funcs_num_bytes) =
                        read_bytes_as_varunit(&wasm_buf[start_position + code_size_num_bytes..])
                            .unwrap();
                    println_debug!("Num funcs {} num bytes {}", num_funcs, num_funcs_num_bytes);

                    assert!(section_code.is_none(), "Only one section code is allowed");

                    section_code = Some(PaddedRange {
                        start: start_position,
                        padding: code_size_num_bytes + num_funcs_num_bytes,
                        end: range.end,
                    });
                }
                // Update the last section
                last_section_range = Some(range);
            }
            ParserState::CodeOperator(Operator::Call { function_index }) => {
                let index = (function_index as usize);
                if index < lowered_function_calls.len() {
                    if let Some(new_index) = lowered_function_calls[index] {
                        call_replacements.push((
                            start_position + 1,
                            new_index,
                            last_functionbody_range.unwrap().clone(),
                        ));
                    }
                }
            }
            ParserState::BeginFunctionBody { range, .. } => {
                if first_function {
                    // We only fix the bad section start on the first function.
                    // Next are completely fine.
                    let section_range = section_code.unwrap();
                    start_position = section_range.start + section_range.padding;
                    first_function = false;
                } else {
                    start_position = last_functionbody_range.unwrap().end;
                }

                let read = read_bytes_as_varunit(&wasm_buf[start_position..]);
                last_functionbody_range = Some(Range {
                    start: start_position,
                    end: range.end,
                });
            }
            ParserState::ImportSectionEntry {
                module,
                field,
                ty: ImportSectionEntryType::Function(func_index),
                ..
            } => {
                if !visited_section_import {
                    if let Some(range) = section_import {
                        start_position = range.start + range.padding;
                        section_import = Some(range);
                        visited_section_import = true;
                    }
                }
                let (func, has_i64_sig, _) = &function_types[func_index as usize];
                let import_range = Range {
                    start: start_position,
                    end: parser.current_position(),
                };

                imported_functions.push((func_index as _, import_range));
                lowered_function_calls.push(None);
                println_debug!("{}.{} -> has i64 {}", module, field, has_i64_sig);
            }
            ParserState::EndSection => {
                continue;
                last_section_range = None;
            }
            ParserState::EndWasm => {
                break;
            }
            _ => {}
        }
    }

    // If there are no types, return!
    if section_type.is_none()
        || section_import.is_none()
        || section_code.is_none()
        || section_function.is_none()
    {
        return Ok(new_buf);
    }
    let section_type = section_type.unwrap();
    let section_import = section_import.unwrap();
    let section_code = section_code.unwrap();
    let section_function = section_function.unwrap();

    // Changing the type headers
    println_debug!("[Type section]");
    let (code_size, code_size_num_bytes) =
        read_bytes_as_varunit(&wasm_buf[section_type.start + 1..]).unwrap();
    let (num_funcs, num_funcs_num_bytes) =
        read_bytes_as_varunit(&wasm_buf[section_type.start + 1 + code_size_num_bytes..]).unwrap();

    let mut replacement_buf = ReplacementBuf::new(wasm_buf.clone());

    let mut extra_funcs: Vec<Vec<u8>> = Vec::new();
    for (import_function_index, (signature_index, range)) in imported_functions.iter().enumerate() {
        let has_i64_sig = function_types[*signature_index].1;
        if !has_i64_sig {
            lowered_function_types.push(None);
            continue;
        }
        lowered_function_types.push(Some(num_funcs + extra_funcs.len()));
        let func_range = &function_types[*signature_index].2;
        extra_funcs.push(lower_func_body(
            &wasm_buf[func_range.start..func_range.end].to_vec(),
        ));
    }

    let extra_func_bytes: usize = extra_funcs.iter().map(|bytes| bytes.len()).sum();
    let new_code_size: usize = code_size + extra_func_bytes;
    let new_num_funcs: usize = num_funcs + extra_funcs.len();

    println_debug!("Replacing section code size, func size");
    replacement_buf.replace_varuint_with_offset(new_code_size as _, section_type.start + 1);
    replacement_buf.replace_varuint_with_offset(
        new_num_funcs as _,
        section_type.start + 1 + code_size_num_bytes,
    );

    println_debug!("Adding new types");
    for (i, func) in extra_funcs.iter().enumerate() {
        println_debug!("- New Type {}", num_funcs + i);
        replacement_buf.insert_in_position(func.to_vec(), section_type.end);
    }
    println_debug!(
        "=> Section type end: {:?}",
        &replacement_buf.buf[replacement_buf.offset + section_type.end - extra_func_bytes
            ..replacement_buf.offset + section_type.end]
    );
    println_debug!("[Import section]");

    let (code_size, code_size_num_bytes) =
        read_bytes_as_varunit(&wasm_buf[section_import.start + 1..]).unwrap();

    let mut import_diff: isize = 0;
    // Precomputing import change size
    for (import_function_index, (signature_index, range)) in imported_functions.iter().enumerate() {
        let has_i64_sig = function_types[*signature_index].1;
        if !has_i64_sig {
            continue;
        }
        let func_range = &function_types[*signature_index].2;
        let new_type_signature = lowered_function_types[import_function_index].unwrap();
        let diff = replacement_buf.get_size_diff(new_type_signature, range.end - 1);
        import_diff += diff.replacement_bytes.len() as isize - diff.original_bytes.len() as isize
    }
    println_debug!("Code size: {}, diff size: {}", code_size, import_diff);
    let new_code_size = (code_size as isize + import_diff);
    replacement_buf.replace_varuint_with_offset(new_code_size as _, section_import.start + 1);

    // Updating the import function types
    println_debug!("Updating import function types");
    for (import_function_index, (signature_index, range)) in imported_functions.iter().enumerate() {
        let has_i64_sig = function_types[*signature_index].1;
        if !has_i64_sig {
            continue;
        }
        let func_range = &function_types[*signature_index].2;
        let new_type_signature = lowered_function_types[import_function_index].unwrap();
        println_debug!(
            "- Import {} (new type: {}) {:?}",
            import_function_index,
            new_type_signature,
            &wasm_buf[range.start..range.end]
        );
        replacement_buf.replace_varuint_with_offset(new_type_signature, range.end - 1);
    }

    println_debug!("[Function section]");
    // Add the trampolines into the function
    let (code_size, code_size_num_bytes) =
        read_bytes_as_varunit(&wasm_buf[section_function.start + 1..]).unwrap();
    let (num_funcs, num_funcs_num_bytes) =
        read_bytes_as_varunit(&wasm_buf[section_function.start + 1 + code_size_num_bytes..])
            .unwrap();

    let func_trampolines: Vec<Vec<u8>> = trampolines
        .iter()
        .map(|(import_index, signature_index)| get_u32_as_bytes_for_varunit(*signature_index as _))
        .collect();
    let extra_func_bytes: usize = func_trampolines.iter().map(|bytes| bytes.len()).sum();
    let new_code_size: usize = code_size + extra_func_bytes;
    let new_num_funcs: usize = num_funcs + func_trampolines.len();

    println_debug!("Replacing Function section size and num functions");
    replacement_buf.replace_varuint_with_offset(new_code_size as _, section_function.start + 1);
    replacement_buf.replace_varuint_with_offset(
        new_num_funcs as _,
        section_function.start + 1 + code_size_num_bytes,
    );

    println_debug!("Adding new functions");
    for (i, func_trampoline) in func_trampolines.iter().enumerate() {
        println_debug!("- Function {}", imported_functions.len() + num_funcs + i);
        replacement_buf.insert_in_position(func_trampoline.to_vec(), section_function.end);
    }

    // Add the trampolines into the code
    println_debug!("[Code section]");
    println_debug!(
        "Section code start {}, end: {}",
        section_code.start,
        section_code.end
    );
    let (code_size, code_size_num_bytes) =
        read_bytes_as_varunit(&wasm_buf[section_code.start..]).unwrap();
    let (num_funcs, num_funcs_num_bytes) =
        read_bytes_as_varunit(&wasm_buf[section_code.start + code_size_num_bytes..]).unwrap();

    println_debug!("Code size {}, num funcs: {}", code_size, num_funcs);
    let code_trampolines: Vec<Vec<u8>> = trampolines
        .iter()
        .map(|(import_index, signature_index)| {
            generate_trampoline_function(&function_types[*signature_index].0, *import_index)
        })
        .collect();
    let extra_func_bytes: usize = code_trampolines.iter().map(|bytes| bytes.len()).sum();
    let new_num_funcs: usize = num_funcs + trampolines.len();

    let mut call_size: isize = 0;
    let mut init_func_range_start = 0;
    let mut prev_func_sizes: Vec<(usize, usize, Range)> = Vec::new();
    let mut func_sizes: Vec<usize> = Vec::new();
    for (position, new_index, func_range) in call_replacements.iter() {
        if func_range.start != init_func_range_start {
            println_debug!("- Calculating function size");
            let (func_size, func_size_bytes) =
                read_bytes_as_varunit(&wasm_buf[func_range.start..]).unwrap();
            prev_func_sizes.push((func_size, func_size_bytes, func_range.clone()));
            func_sizes.push(func_size);
        }

        let diff = replacement_buf.get_size_diff(*new_index as _, *position);
        let individual_call_change: isize =
            (diff.replacement_bytes.len() as isize - diff.original_bytes.len() as isize) as _;
        call_size += individual_call_change;
        let func_len = func_sizes.len();
        func_sizes[func_len - 1] =
            (func_sizes[func_len - 1] as isize + individual_call_change) as usize;
        println_debug!(
            "Call change {:?} (func: {})",
            individual_call_change,
            func_range.start
        );
        init_func_range_start = func_range.start;
    }

    let mut func_diffs: isize = 0;
    for (i, (_, _, func_range)) in prev_func_sizes.iter().enumerate() {
        let func_new_size = func_sizes[i];
        let func_diff = replacement_buf.get_size_diff(func_new_size as _, func_range.start);
        let func_call_change =
            (func_diff.replacement_bytes.len() - func_diff.original_bytes.len()) as isize;
        func_diffs += func_call_change;
    }

    println_debug!(
        "Old function sizes ({:?})",
        prev_func_sizes
            .iter()
            .map(|(size, _, _)| size)
            .collect::<Vec<_>>()
    );
    println_debug!("New function sizes ({:?})", func_sizes);
    println_debug!(
        "Code size: {}, extra trampoline size: {}, call size: {}, func size diff: {}",
        code_size,
        extra_func_bytes,
        call_size,
        func_diffs
    );
    let new_code_size: usize =
        (code_size as isize + extra_func_bytes as isize + call_size as isize + func_diffs as isize)
            as _;

    println_debug!("Replacing code size and num functions");
    replacement_buf.replace_varuint_with_offset(new_code_size as _, section_code.start);
    replacement_buf
        .replace_varuint_with_offset(new_num_funcs as _, section_code.start + code_size_num_bytes);

    // Call replacements
    println_debug!("Replacing calls");
    let mut init_func_range_start = 0;
    for (position, new_index, func_range) in call_replacements.iter() {
        if func_range.start != init_func_range_start {
            println_debug!("- Replacing function size");
            let func_pos = func_range.start;
            let new_func_size = func_sizes.remove(0);
            replacement_buf.replace_varuint_with_offset(new_func_size as _, func_pos);
        }
        println_debug!("- Replacing function call");
        replacement_buf.replace_varuint_with_offset(*new_index as _, *position);
        init_func_range_start = func_range.start;
    }

    println_debug!("Adding trampolines");
    for trampoline in code_trampolines.iter() {
        replacement_buf.insert_in_position(trampoline.to_vec(), section_code.end);
    }

    Ok(replacement_buf.buf)
}

struct ReplacementBuf {
    pub buf: Vec<u8>,
    pub last_position: usize,
    pub offset: usize,
}

#[derive(Debug, Clone)]
struct VarUintDiff<'a> {
    original: usize,
    original_bytes: &'a [u8],

    replacement: usize,
    replacement_bytes: Vec<u8>,
}

impl ReplacementBuf {
    fn new<'a>(buf: Vec<u8>) -> Self {
        Self {
            buf,
            offset: 0,
            last_position: 0,
        }
    }

    fn get_size_diff(&self, replacement: usize, position: usize) -> VarUintDiff {
        assert!(
            position >= self.last_position,
            "The new position {} should be ahead of previous position {}",
            position,
            self.last_position
        );
        let replacement_as_bytes = get_u32_as_bytes_for_varunit(replacement as _);
        let (num, num_bytes) = read_bytes_as_varunit(&self.buf[position + self.offset..]).unwrap();
        VarUintDiff {
            original: num,
            original_bytes: &self.buf[position + self.offset..position + self.offset + num_bytes],

            replacement: replacement,
            replacement_bytes: replacement_as_bytes,
        }
    }

    #[inline(always)]
    fn assert_previous_position(&self, position: usize) {
        assert!(
            position >= self.last_position,
            "The provided position {} should be ahead of previous position {}",
            position,
            self.last_position
        );
    }

    fn replace_varuint_with_offset(&mut self, replacement: usize, position: usize) {
        self.assert_previous_position(position);
        let diff = self.get_size_diff(replacement, position);
        let replacement_as_bytes_len = diff.replacement_bytes.len() as isize;
        let num_bytes = diff.original_bytes.len() as isize;
        println_debug!(
            "* Replacing (index: {}) {}:{:?} -> {}:{:?}",
            position,
            diff.original,
            diff.original_bytes,
            diff.replacement,
            diff.replacement_bytes
        );
        self.buf.splice(
            self.offset + position
                ..(self.offset as isize + position as isize + num_bytes as isize) as usize,
            diff.replacement_bytes,
        );
        self.offset = (self.offset as isize + replacement_as_bytes_len as isize
            - num_bytes as isize) as usize;
        self.last_position = position;
    }

    fn insert_in_position(&mut self, data: Vec<u8>, position: usize) {
        self.assert_previous_position(position);
        let data_len = data.len();
        println_debug!("* Inserting (index: {}) -> {:?}", position, data);
        self.buf
            .splice((self.offset + position)..(self.offset + position), data);
        self.offset += data_len;
        self.last_position = position;
    }
}

#[cfg(test)]
mod test {
    use super::lower_i64_imports;
    use std::fs::File;
    use std::io;
    use std::io::prelude::*;

    fn read_wasm(file: &str) -> io::Result<Vec<u8>> {
        let mut data = Vec::new();
        let mut f = File::open(file)?;
        f.read_to_end(&mut data)?;
        Ok(data)
    }

    #[test]
    fn test_lower_i64_imports() {
        let test_file_paths = vec![
            "./wasm_module_examples/clock_time_get.wasm",
            "./wasm_module_examples/path_open.wasm",
            "./wasm_module_examples/matrix.wasm",
            "./wasm_module_examples/two-imports.wasm",
            "./wasm_module_examples/gettimeofday/gettimeofday.wasm",
            "./wasm_module_examples/qjs.wasm",
            "./wasm_module_examples/duk.wasm",
            "./wasm_module_examples/rsign_original.wasm",
            "./wasm_module_examples/viu.wasm",
            "./wasm_module_examples/busy.wasm",
            "./wasm_module_examples/io-as-debug.wasm",
            "./wasm_module_examples/wasmboy-wasmer.wasm",
            "./wasm_module_examples/clang_original.wasm",
        ];

        for test_file in test_file_paths.iter() {
            println!("Processing {}", test_file);
            let data = read_wasm(test_file).unwrap();
            let new_data = lower_i64_imports(&data).unwrap();
            println!("Validating {}", test_file);
            let validated = wasmparser::validate(&new_data, None);
            validated.expect("is valid");
            // let new_wat = wabt::wasm2wat(new_data.to_vec()).expect("can't convert");
            // println!("New wat: {}", new_wat);

            // fs::create_dir_all("./wasm_module_examples_transformed/").unwrap();

            // let filename = Path::new(test_file_path)
            //     .file_name()
            //     .unwrap()
            //     .to_string_lossy();
            // let transformed_filename = format!("./wasm_module_examples_transformed/{}", filename);
            // fs::write(transformed_filename.clone(), &wasm).expect("Unable to write file");
        }
    }
}
