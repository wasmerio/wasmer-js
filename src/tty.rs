use std::sync::{Arc, Mutex};

use wasm_bindgen::prelude::wasm_bindgen;
use wasmer_wasix::os::TtyBridge as _;

#[wasm_bindgen]
#[derive(Debug, Clone, Default)]
pub struct Tty {
    state: Arc<TtyBridge>,
}

#[wasm_bindgen]
impl Tty {
    /// Create a new TTY.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Tty {
        Tty::default()
    }

    /// Reset the TTY to its default state.
    pub fn reset(&self) {
        self.state.reset();
    }

    #[wasm_bindgen(getter)]
    pub fn state(&self) -> TtyState {
        self.state.tty_get().into()
    }

    #[wasm_bindgen(setter)]
    pub fn set_state(&mut self, state: TtyState) {
        self.state.tty_set(state.into());
    }

    pub(crate) fn bridge(&self) -> Arc<dyn wasmer_wasix::os::TtyBridge + Send + Sync> {
        self.state.clone()
    }
}

#[derive(Debug, Default)]
struct TtyBridge(Mutex<wasmer_wasix::WasiTtyState>);

impl wasmer_wasix::os::TtyBridge for TtyBridge {
    fn reset(&self) {
        self.tty_set(wasmer_wasix::WasiTtyState::default());
    }

    fn tty_get(&self) -> wasmer_wasix::WasiTtyState {
        self.0.lock().unwrap().clone()
    }

    fn tty_set(&self, tty_state: wasmer_wasix::WasiTtyState) {
        *self.0.lock().unwrap() = tty_state;
    }
}

#[wasm_bindgen(inspectable)]
pub struct TtyState {
    pub cols: u32,
    pub rows: u32,
    pub width: u32,
    pub height: u32,
    pub stdin_tty: bool,
    pub stdout_tty: bool,
    pub stderr_tty: bool,
    pub echo: bool,
    pub line_buffered: bool,
    pub line_feeds: bool,
}

impl Default for TtyState {
    fn default() -> Self {
        wasmer_wasix::WasiTtyState::default().into()
    }
}

impl From<wasmer_wasix::WasiTtyState> for TtyState {
    fn from(value: wasmer_wasix::WasiTtyState) -> Self {
        let wasmer_wasix::WasiTtyState {
            cols,
            rows,
            width,
            height,
            stdin_tty,
            stdout_tty,
            stderr_tty,
            echo,
            line_buffered,
            line_feeds,
        } = value;
        TtyState {
            cols,
            rows,
            width,
            height,
            stdin_tty,
            stdout_tty,
            stderr_tty,
            echo,
            line_buffered,
            line_feeds,
        }
    }
}

impl From<TtyState> for wasmer_wasix::WasiTtyState {
    fn from(value: TtyState) -> Self {
        let TtyState {
            cols,
            rows,
            width,
            height,
            stdin_tty,
            stdout_tty,
            stderr_tty,
            echo,
            line_buffered,
            line_feeds,
        } = value;
        wasmer_wasix::WasiTtyState {
            cols,
            rows,
            width,
            height,
            stdin_tty,
            stdout_tty,
            stderr_tty,
            echo,
            line_buffered,
            line_feeds,
        }
    }
}
