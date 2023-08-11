use std::sync::Mutex;

use wasm_bindgen::prelude::wasm_bindgen;
use wasmer_wasix::os::TtyBridge;

#[wasm_bindgen]
#[derive(Debug, Default)]
pub struct Tty {
    state: Mutex<wasmer_wasix::WasiTtyState>,
}

#[wasm_bindgen]
impl Tty {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Tty {
        Tty::default()
    }

    #[wasm_bindgen(getter)]
    pub fn get_state(&self) -> TtyState {
        self.state.lock().unwrap().clone().into()
    }
    #[wasm_bindgen(setter)]
    pub fn set_state(&mut self, state: TtyState) {
        *self.state.lock().unwrap() = state.into();
    }
}

impl TtyBridge for Tty {
    fn reset(&self) {
        self.tty_set(wasmer_wasix::WasiTtyState::default());
    }

    fn tty_get(&self) -> wasmer_wasix::WasiTtyState {
        self.state.lock().unwrap().clone()
    }

    fn tty_set(&self, tty_state: wasmer_wasix::WasiTtyState) {
        *self.state.lock().unwrap() = tty_state;
    }
}

#[wasm_bindgen(inspectable)]
pub struct TtyState {
    #[wasm_bindgen(readonly)]
    pub cols: u32,
    #[wasm_bindgen(readonly)]
    pub rows: u32,
    #[wasm_bindgen(readonly)]
    pub width: u32,
    #[wasm_bindgen(readonly)]
    pub height: u32,
    #[wasm_bindgen(readonly)]
    pub stdin_tty: bool,
    #[wasm_bindgen(readonly)]
    pub stdout_tty: bool,
    #[wasm_bindgen(readonly)]
    pub stderr_tty: bool,
    #[wasm_bindgen(readonly)]
    pub echo: bool,
    #[wasm_bindgen(readonly)]
    pub line_buffered: bool,
    #[wasm_bindgen(readonly)]
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
