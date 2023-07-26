#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

mod common;
mod fs;
mod io;
mod module_cache;
mod pool;
mod runtime;
mod tty;
mod wasi;

pub use crate::fs::{MemFS, MemFile};
pub use crate::tty::{Tty, TtyState};
pub use crate::wasi::{WasiConfig, WASI};
