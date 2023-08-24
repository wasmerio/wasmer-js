use std::sync::{Arc, Mutex};

use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
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

    /// Set/Get the TTY state.
    #[wasm_bindgen(getter)]
    pub fn state(&self) -> Result<TtyState, JsValue> {
        let state: TtyStateRepr = self.state.tty_get().into();
        let value = serde_wasm_bindgen::to_value(&state)?;

        Ok(value.into())
    }

    #[wasm_bindgen(setter)]
    pub fn set_state(&mut self, state: TtyState) -> Result<(), JsValue> {
        let state: TtyStateRepr = serde_wasm_bindgen::from_value(state.into())?;
        self.state.tty_set(state.into());
        Ok(())
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

#[wasm_bindgen(typescript_custom_section)]
const TTY_STATE_TYPE_DEFINITION: &'static str = r#"
/**
 * The state of a TTY.
 */
export type TtyState = {
    readonly cols: number;
    readonly rows: number;
    readonly width: number;
    readonly height: number;
    readonly stdin_tty: boolean;
    readonly stdout_tty: boolean;
    readonly stderr_tty: boolean;
    readonly echo: boolean;
    readonly line_buffered: boolean;
    readonly line_feeds: boolean;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "TtyState")]
    pub type TtyState;
}

/// The deserialized version of [`TtyState`].
#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct TtyStateRepr {
    cols: u32,
    rows: u32,
    width: u32,
    height: u32,
    stdin_tty: bool,
    stdout_tty: bool,
    stderr_tty: bool,
    echo: bool,
    line_buffered: bool,
    line_feeds: bool,
}

impl Default for TtyStateRepr {
    fn default() -> Self {
        wasmer_wasix::WasiTtyState::default().into()
    }
}

impl From<wasmer_wasix::WasiTtyState> for TtyStateRepr {
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
        TtyStateRepr {
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

impl From<TtyStateRepr> for wasmer_wasix::WasiTtyState {
    fn from(value: TtyStateRepr) -> Self {
        let TtyStateRepr {
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
