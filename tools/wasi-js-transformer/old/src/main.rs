// #![no_std]
// #![no_main]

// #![feature( core_intrinsics, alloc_error_handler)]

// extern crate wee_alloc;
// extern crate wasm_bindgen;
// extern crate hashmap_core;
extern crate wasmparser;

use wasmparser::WasmDecoder;
use wasmparser::Parser;
use wasmparser::ParserState;
use wasmparser::Operator;
use wasmparser::validate;

use wabt::{wat2wasm};

// use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[wasm_bindgen]
#[no_mangle]
pub fn convert(buf: &[u8]) -> Vec<u8> {
  let mut parser = Parser::new(&buf[..]);
  let mut new_buf: Vec<u8> = buf.clone().to_owned();
  let mut injected = false;
  println!("    BUF {:?}", buf);
  let mut previous_position = 0;
  let mut offset_type_section_start = 0;
  let mut offset_type_section_end = 0;
  let mut last_type_index = 0;
  let mut offset_import_wasi_path_open = 0;
  let mut imported_func_index = 0;
  let mut path_preopen_func_index = 0;
  let mut offset_path_type = 0;
  let mut operation_stack = 0;
  loop {
    let position = parser.current_position();
    let state = parser.read();
    let content = if position > previous_position {
      &buf[previous_position..position]
    }
    else {
      &buf[position..previous_position]
    };
    println!("===== state {:?} => ({:?}) {:?}", state, previous_position..position, content);
    match *state {
        ParserState::BeginWasm { .. } => {
            // return ();
            println!("====== Module");
        }
        // ParserState::TypeSectionEntry
        ParserState::TypeSectionEntry(_) => {
            // println!("====== TypeSectionEntry {} {:?}", position, previous_position);
          if content == &[96, 9, 127, 127, 127, 127, 127, 126, 126, 127, 127, 1, 127] {
            offset_path_type = position;
          }
          if !injected {
            offset_type_section_start = previous_position;
            injected = true;
          }
          offset_type_section_end = previous_position;
          last_type_index += 1;
        }
        ParserState::ImportSectionEntry { module, field, ..} => {
          println!("====== ImportSectionEntry {:?} {:?}", buf[position], buf[position+1]);
          if module == "wasi_unstable" && field == "path_open" {
            println!("==> Previous call signature {}", buf[position + 28]);
            offset_import_wasi_path_open = position + 28;
            path_preopen_func_index = imported_func_index;
          }
          imported_func_index += 1;
        }
        ParserState::BeginFunctionBody {..} => {
          operation_stack += 1;
        }
        ParserState::CodeOperator(Operator::Call {
          function_index
        }) => {
          println!("====== CodeOperator {:?} {:?}", buf[position], buf[position+1]);
          println!("====== Operator::Call {:?}", function_index);
          if function_index == path_preopen_func_index {
            println!("IS PREOPEN CALL");
          }
        }
        // ParserState::ExportSectionEntry { field, ref kind, .. } => {
        //     // return ();
        //     // println!("  Export");
        // }
        // ParserState::ImportSectionEntry { module, field, .. } => {
        //     // return ();
        //     // println!("  Import");
        // }
        ParserState::EndWasm => break,
        _ => ( /* println!(" Other {:?}", state) */ )
    }
    previous_position = position;

  }

  let mut offset = 0;
  // Inject the new path_open type function
  {
    // let inject_position = offset_type_section_start+3;
    // new_buf[inject_position-1] = new_buf[inject_position-1]+1;
    // let slice: Vec<u8> = vec![0x60, 0x09, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x01, 0x7f];
    // new_buf[inject_position-2] = new_buf[inject_position-2]+slice.len() as u8;

    // new_buf.splice(offset_type_section_end..offset_type_section_end, slice.iter().cloned());
    // offset += slice.len();
    let slice: Vec<u8> = vec![0x60, 0x09, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x01, 0x7f];
    new_buf.splice(offset_path_type..offset_path_type+slice.len(), slice.iter().cloned());
  }

  // Change the function signature offset
  {
    new_buf[offset+offset_import_wasi_path_open] = last_type_index;
  }

  println!("NEW BUF {:?}", new_buf);
  return new_buf.to_owned();
}

// #[lang = "eh_personality"] extern fn eh_personality() {}

// #[panic_handler]
// #[no_mangle]
// pub fn panic(_info: &::core::panic::PanicInfo) -> ! {
//     unsafe {
//         ::core::intrinsics::abort();
//     }
// }

// #[alloc_error_handler]
// #[no_mangle]
// pub extern "C" fn oom(_: ::core::alloc::Layout) -> ! {
//     unsafe {
//         ::core::intrinsics::abort();
//     }
// }

#[test]
fn converts() {
    let s = r#"(module
  (type $t0 (func (result i32)))
  (type $t1 (func (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
  (import "wasi_unstable" "path_open" (func $path_open (type $t1)))
  (func $_start (type $t0)
    i32.const 12
    i32.const 12
    i32.const 12
    i32.const 12
    i32.const 12
    i64.const 12
    i64.const 12
    i32.const 12
    i32.const 12
    call $path_open
  )
  (memory $memory 17)
  (export "memory" (memory 0))
  (export "_start" (func $_start))
)
"#;
    let wasm = wat2wasm(s).expect("parsed properly");
    let converted = convert(&wasm);
    assert!(validate(&converted, None), "wasm is not valid");
}