#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

mod fs;
mod io;
mod pool;
mod runtime;
mod tty;
mod wasi;

pub use crate::fs::{JSVirtualFile, MemFS};
pub use crate::pool::{wasm_entry_point, worker_entry_point};
pub use crate::tty::{JSTtyBridge, JSTtyState};
pub use crate::wasi::{WasiConfig, WASI};
