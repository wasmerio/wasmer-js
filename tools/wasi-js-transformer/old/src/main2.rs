// #![no_std]
#![no_main]

// #![feature( core_intrinsics, alloc_error_handler)]

// extern crate wee_alloc;
// extern crate wasm_bindgen;
// extern crate hashmap_core;
// extern crate wasmparser;

use wasmparser::WasmDecoder;
use wasmparser::Parser;
use wasmparser::ParserState;

// use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[wasm_bindgen]
#[no_mangle]
pub fn convert() {
  let ref buf: &[u8] = &[][..];
  let mut parser = Parser::new(buf);
  loop {
    let state = parser.read();
    match *state {
        ParserState::BeginWasm { .. } => {
            return ();
            // println!("====== Module");
        }
        ParserState::ExportSectionEntry { field, ref kind, .. } => {
            return ();
            // println!("  Export");
        }
        ParserState::ImportSectionEntry { module, field, .. } => {
            return ();
            // println!("  Import");
        }
        ParserState::EndWasm => break,
        _ => ( /* println!(" Other {:?}", state) */ )
    }
  }
  return ();
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
