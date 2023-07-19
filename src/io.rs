use std::{
    io::SeekFrom,
    pin::Pin,
    sync::{Arc, Mutex, MutexGuard},
    task::{Context, Poll},
};

use bytes::{Buf, Bytes};
use futures::future::BoxFuture;
use tokio::{
    io::{self, AsyncRead, AsyncSeek, AsyncWrite},
    sync::mpsc,
};
#[allow(unused_imports, dead_code)]
use tracing::{debug, error, info, trace, warn};
use wasm_bindgen::prelude::*;
use wasmer_wasix::{FsError, VirtualFile};

/// readable pipe that becomes an `Empty` when channel is closed
#[derive(Clone, Debug)]
pub struct WebStdin {
    rx: Arc<Mutex<mpsc::UnboundedReceiver<Box<[u8]>>>>,
    buf: Bytes,
}
/// writable pipe that becomes a `Sink` when channel is closed
#[derive(Clone, Debug)]
pub struct WebStdout {
    tx: mpsc::UnboundedSender<Box<[u8]>>,
}
/// writable pipe that becomes a `Sink` when channel is closed
pub type WebStderr = WebStdout;

impl AsyncSeek for WebStdin {
    fn start_seek(self: Pin<&mut Self>, _position: SeekFrom) -> io::Result<()> {
        Ok(())
    }
    fn poll_complete(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<u64>> {
        Poll::Ready(Ok(0))
    }
}
impl AsyncSeek for WebStdout {
    fn start_seek(self: Pin<&mut Self>, _position: SeekFrom) -> io::Result<()> {
        Ok(())
    }
    fn poll_complete(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<u64>> {
        Poll::Ready(Ok(0))
    }
}

impl AsyncWrite for WebStdin {
    fn poll_write(
        self: Pin<&mut Self>,
        _cx: &mut Context<'_>,
        _buf: &[u8],
    ) -> Poll<Result<usize, io::Error>> {
        Poll::Ready(Err(std::io::ErrorKind::Unsupported.into()))
    }
    fn poll_flush(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Result<(), io::Error>> {
        Poll::Ready(Err(std::io::ErrorKind::Unsupported.into()))
    }
    fn poll_shutdown(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Result<(), io::Error>> {
        Poll::Ready(Err(std::io::ErrorKind::Unsupported.into()))
    }
}
impl AsyncWrite for WebStdout {
    fn poll_write(
        self: Pin<&mut Self>,
        _cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        let _ = self.tx.send(Box::from(buf));
        Poll::Ready(Ok(buf.len()))
    }
    fn poll_flush(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        Poll::Ready(Ok(()))
    }
    fn poll_shutdown(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        Poll::Ready(Ok(()))
    }
}

impl AsyncRead for WebStdin {
    fn poll_read(
        self: Pin<&mut Self>,
        _cx: &mut Context<'_>,
        buf: &mut io::ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        let this = self.get_mut();
        loop {
            {
                let len = this.buf.len();
                if len > 0 {
                    let read = len.min(buf.remaining());
                    buf.put_slice(&this.buf[..read]);
                    this.buf.advance(read);
                    return Poll::Ready(Ok(()));
                }
            }
            match try_lock_clear(&this.rx) {
                Some(mut guard) => match guard.try_recv() {
                    Ok(bytes) if bytes.len() > 0 => {
                        this.buf = bytes.into();
                    }
                    _ => return Poll::Ready(Ok(())),
                },
                None => return Poll::Ready(Err(io::ErrorKind::WouldBlock.into())),
            }
        }
    }
}
impl AsyncRead for WebStdout {
    fn poll_read(
        self: Pin<&mut Self>,
        _cx: &mut Context<'_>,
        _buf: &mut io::ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        Poll::Ready(Err(io::ErrorKind::Unsupported.into()))
    }
}
impl VirtualFile for WebStdin {
    fn last_accessed(&self) -> u64 {
        0
    }
    fn last_modified(&self) -> u64 {
        0
    }
    fn created_time(&self) -> u64 {
        0
    }
    fn size(&self) -> u64 {
        0
    }
    fn set_len(&mut self, _new_size: u64) -> Result<(), FsError> {
        Ok(())
    }
    fn unlink(&mut self) -> BoxFuture<'static, Result<(), FsError>> {
        Box::pin(async { Ok(()) })
    }
    fn is_open(&self) -> bool {
        true
    }
    fn poll_read_ready(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<usize>> {
        let this = self.get_mut();
        {
            let len = this.buf.len();
            if len > 0 {
                return Poll::Ready(Ok(len));
            }
        }
        match try_lock_clear(&this.rx) {
            Some(mut guard) => match guard.try_recv() {
                Ok(bytes) if bytes.len() > 0 => {
                    this.buf = bytes.into();
                    Poll::Ready(Ok(this.buf.len()))
                }
                _ => Poll::Ready(Ok(0)),
            },
            None => Poll::Ready(Err(io::ErrorKind::WouldBlock.into())),
        }
    }
    fn poll_write_ready(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<usize>> {
        Poll::Ready(Err(io::ErrorKind::Unsupported.into()))
    }
}
impl VirtualFile for WebStdout {
    fn last_accessed(&self) -> u64 {
        0
    }
    fn last_modified(&self) -> u64 {
        0
    }
    fn created_time(&self) -> u64 {
        0
    }
    fn size(&self) -> u64 {
        0
    }
    fn set_len(&mut self, _new_size: u64) -> Result<(), FsError> {
        Ok(())
    }
    fn unlink(&mut self) -> BoxFuture<'static, Result<(), FsError>> {
        Box::pin(async { Ok(()) })
    }
    fn is_open(&self) -> bool {
        true
    }
    fn poll_read_ready(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<usize>> {
        Poll::Ready(Err(io::ErrorKind::Unsupported.into()))
    }
    fn poll_write_ready(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<usize>> {
        Poll::Ready(Ok(8192))
    }
}

pub fn stdin() -> (web_sys::WritableStream, WebStdin) {
    #[wasm_bindgen]
    #[derive(Clone)]
    struct IoSink {
        tx: mpsc::UnboundedSender<Box<[u8]>>,
    }
    #[wasm_bindgen]
    impl IoSink {
        pub fn write(
            &self,
            chunk: js_sys::Uint8Array,
            controller: web_sys::WritableStreamDefaultController,
        ) -> Result<(), JsValue> {
            match self.tx.send(chunk.to_vec().into_boxed_slice()) {
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

    let (tx, rx) = mpsc::unbounded_channel();
    (
        web_sys::WritableStream::new_with_underlying_sink(&js_sys::Object::unchecked_from_js(
            JsValue::from(IoSink { tx }),
        ))
        .unwrap_throw(),
        WebStdin {
            rx: Arc::new(Mutex::new(rx)),
            buf: Bytes::new(),
        },
    )
}
pub fn stdout() -> (WebStdout, web_sys::ReadableStream) {
    #[wasm_bindgen]
    struct IoSource {
        rx: mpsc::UnboundedReceiver<Box<[u8]>>,
    }
    #[wasm_bindgen]
    impl IoSource {
        pub async fn pull(
            &mut self,
            controller: web_sys::ReadableStreamDefaultController,
        ) -> Result<(), JsValue> {
            match self.rx.recv().await {
                Some(bytes) => {
                    if bytes.len() > 0 {
                        let array = js_sys::Uint8Array::from(bytes.as_ref());
                        controller.enqueue_with_chunk(&array.into())
                    } else {
                        Ok(())
                    }
                }
                None => controller.close(),
            }
        }
        pub fn cancel(&mut self) {
            self.rx.close();
        }
    }

    let (tx, rx) = mpsc::unbounded_channel();
    (
        WebStdout { tx },
        web_sys::ReadableStream::new_with_underlying_source(&js_sys::Object::unchecked_from_js(
            JsValue::from(IoSource { rx }),
        ))
        .unwrap_throw(),
    )
}
#[inline]
pub fn stderr() -> (WebStderr, web_sys::ReadableStream) {
    stdout()
}

#[inline]
fn try_lock_clear<T: ?Sized>(mutex: &Mutex<T>) -> Option<MutexGuard<'_, T>> {
    use std::sync::TryLockError::*;
    match mutex.try_lock() {
        Ok(guard) => Some(guard),
        Err(Poisoned(e)) => Some(e.into_inner()),
        Err(WouldBlock) => None,
    }
}
