#![no_std]
#![no_main]

#![feature(core_intrinsics, alloc_error_handler)]

// Use `wee_alloc` as the global allocator.
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[no_mangle]
fn hex_color() -> &'static [u8] {
      let ref buf: &[u8] = &[][..];
      return buf
}

// #[lang = "eh_personality"] extern fn eh_personality() {}

#[panic_handler]
#[no_mangle]
pub fn panic(_info: &::core::panic::PanicInfo) -> ! {
    unsafe {
        ::core::intrinsics::abort();
    }
}

#[alloc_error_handler]
#[no_mangle]
pub extern "C" fn oom(_: ::core::alloc::Layout) -> ! {
    unsafe {
        ::core::intrinsics::abort();
    }
}
