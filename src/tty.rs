use tokio::sync::{mpsc, watch};
use wasm_bindgen::prelude::*;
use wasm_bindgen_downcast::DowncastJS;
use wasmer_wasix::{os::TtyBridge, WasiTtyState};

#[wasm_bindgen(inspectable)]
#[derive(Clone, Debug, DowncastJS)]
/// TTY state. `Object.assign(new JsTtyState(), { ... })`
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

#[wasm_bindgen]
impl TtyState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self::default()
    }
}

impl Default for TtyState {
    fn default() -> Self {
        Self::from(WasiTtyState::default())
    }
}

impl From<WasiTtyState> for TtyState {
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

impl From<TtyState> for WasiTtyState {
    fn from(tty_state: TtyState) -> Self {
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

#[derive(Clone, Debug)]
pub struct WebTty {
    tx: mpsc::UnboundedSender<Option<WasiTtyState>>,
    rx: watch::Receiver<WasiTtyState>,
}
impl TtyBridge for WebTty {
    fn reset(&self) {
        let _ = self.tx.send(None);
    }
    fn tty_get(&self) -> WasiTtyState {
        self.rx.borrow().clone()
    }
    fn tty_set(&self, tty_state: WasiTtyState) {
        let _ = self.tx.send(Some(tty_state));
    }
}

#[wasm_bindgen]
struct TtySink {
    tx: watch::Sender<WasiTtyState>,
}
#[wasm_bindgen]
impl TtySink {
    pub fn write(
        &self,
        chunk: TtyState,
        controller: web_sys::WritableStreamDefaultController,
    ) -> Result<(), JsValue> {
        match self.tx.send(chunk.into()) {
            Ok(()) => Ok(()),
            Err(e) => {
                let e = JsValue::from_str(&e.to_string());
                controller.error_with_e(&e);
                Err(e)
            }
        }
    }
    pub fn close(self, _controller: JsValue) {}
    pub fn abort(self) {}
}

#[wasm_bindgen]
struct TtySource {
    rx: mpsc::UnboundedReceiver<Option<WasiTtyState>>,
}
#[wasm_bindgen]
impl TtySource {
    pub async fn pull(
        &mut self,
        controller: web_sys::ReadableStreamDefaultController,
    ) -> Result<(), JsValue> {
        match self.rx.recv().await {
            Some(state) => controller.enqueue_with_chunk(&state.map(TtyState::from).into()),
            None => controller.close(),
        }
    }
    pub fn cancel(&mut self) {
        self.rx.close();
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Tty {
    tx: web_sys::WritableStream,
    rx: web_sys::ReadableStream,
}
#[wasm_bindgen]
impl Tty {
    #[wasm_bindgen(getter)]
    pub fn writable(&self) -> web_sys::WritableStream {
        self.tx.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn readable(&self) -> web_sys::ReadableStream {
        self.rx.clone()
    }
}

pub fn tty(init: Option<TtyState>) -> (Tty, WebTty) {
    let (tx_wa, rx_js) = mpsc::unbounded_channel();
    let (tx_js, rx_wa) = watch::channel(match init {
        Some(state) => state.into(),
        None => WasiTtyState::default(),
    });
    (
        Tty {
            tx: web_sys::WritableStream::new_with_underlying_sink(
                &js_sys::Object::unchecked_from_js(JsValue::from(TtySink { tx: tx_js })),
            )
            .unwrap_throw(),
            rx: web_sys::ReadableStream::new_with_underlying_source(
                &js_sys::Object::unchecked_from_js(JsValue::from(TtySource { rx: rx_js })),
            )
            .unwrap_throw(),
        },
        WebTty {
            tx: tx_wa,
            rx: rx_wa,
        },
    )
}
