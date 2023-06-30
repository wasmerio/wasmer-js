use std::sync::{Arc, Mutex};

use wasm_bindgen::prelude::*;
use wasm_bindgen_downcast::DowncastJS;
use wasmer_wasix::{os::TtyBridge, WasiTtyState};

#[wasm_bindgen(inspectable)]
#[derive(Clone, Debug, DowncastJS)]
/// TTY state. `Object.assign(new JSTtyState(), { ... })`
pub struct JSTtyState {
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

#[wasm_bindgen]
impl JSTtyState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self::default()
    }
}

impl Default for JSTtyState {
    fn default() -> Self {
        Self::from(WasiTtyState::default())
    }
}

impl From<WasiTtyState> for JSTtyState {
    fn from(tty_state: WasiTtyState) -> Self {
        Self {
            cols: tty_state.cols,
            rows: tty_state.rows,
            width: tty_state.width,
            height: tty_state.height,
            stdin_tty: tty_state.stdin_tty,
            stdout_tty: tty_state.stdout_tty,
            stderr_tty: tty_state.stderr_tty,
            echo: tty_state.echo,
            line_buffered: tty_state.line_buffered,
            line_feeds: tty_state.line_feeds,
        }
    }
}

impl From<JSTtyState> for WasiTtyState {
    fn from(tty_state: JSTtyState) -> Self {
        Self {
            cols: tty_state.cols,
            rows: tty_state.rows,
            width: tty_state.width,
            height: tty_state.height,
            stdin_tty: tty_state.stdin_tty,
            stdout_tty: tty_state.stdout_tty,
            stderr_tty: tty_state.stderr_tty,
            echo: tty_state.echo,
            line_buffered: tty_state.line_buffered,
            line_feeds: tty_state.line_feeds,
        }
    }
}

#[wasm_bindgen(typescript_custom_section)]
const JS_TTY_BRIDGE: &'static str = r##"
/** WASIX JavaScript TTY handler. */
export interface JSTty {
    /** Reset TTY state. */
    ttyReset(): void;
    /** Get TTY state. */
    ttyGet(): JSTtyState;
    /** Set TTY state. */
    ttySet(state: JSTtyState): void;
}
"##;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "JSTty", js_name = JSTty, extends = js_sys::Object, is_type_of = JSTtyBridge::looks_like_bridge)]
    pub type JSTtyBridge;
    #[wasm_bindgen(method, js_name = "ttyReset")]
    pub fn tty_reset(this: &JSTtyBridge);
    #[wasm_bindgen(method, js_name = "ttyGet")]
    pub fn tty_get(this: &JSTtyBridge) -> JsValue;
    #[wasm_bindgen(method, js_name = "ttySet")]
    pub fn tty_set(this: &JSTtyBridge, tty_state: &JsValue);
}

impl JSTtyBridge {
    pub fn looks_like_bridge(val: &JsValue) -> bool {
        #[wasm_bindgen]
        extern "C" {
            type Unknown;
            #[wasm_bindgen(method, getter)]
            fn ttyReset(this: &Unknown) -> JsValue;
            #[wasm_bindgen(method, getter)]
            fn ttyGet(this: &Unknown) -> JsValue;
            #[wasm_bindgen(method, getter)]
            fn ttySet(this: &Unknown) -> JsValue;
        }
        val.is_object() && {
            let val = val.unchecked_ref::<Unknown>();
            val.ttyReset().is_function() && val.ttyGet().is_function() && val.ttySet().is_function()
        }
    }
}

#[derive(Clone)]
pub struct JSTty {
    inner: Arc<Mutex<JSTtyBridge>>,
}

impl JSTty {
    pub fn new(bridge: JSTtyBridge) -> Self {
        Self {
            inner: Arc::new(Mutex::new(bridge)),
        }
    }
    fn lock(&self) -> std::sync::MutexGuard<'_, JSTtyBridge> {
        self.inner.lock().unwrap_or_else(|e| e.into_inner())
    }
}

impl TtyBridge for JSTty {
    fn reset(&self) {
        self.lock().tty_reset();
    }
    fn tty_get(&self) -> WasiTtyState {
        match JSTtyState::downcast_js(self.lock().tty_get()) {
            Ok(state) => state.into(),
            _ => WasiTtyState::default(), // ignore malformed state
        }
    }
    fn tty_set(&self, tty_state: WasiTtyState) {
        self.lock().tty_set(&JSTtyState::from(tty_state).into());
    }
}

// REVIEW: Unless the owned JsValue-table in the wasm runtime is sent with this WebAssembly.Memory, this is not Send/Sync.

// SAFETY: We manually ensure the Arc<Mutex<T>> contract is upheld for Send/Sync.
unsafe impl Send for JSTty {}
unsafe impl Sync for JSTty {}
