use std::{
    cell::RefCell,
    io::SeekFrom,
    pin::Pin,
    sync::{Arc, Mutex},
    task::{ready, Context, Poll, RawWaker},
};

use bytes::{Buf, Bytes};
use futures::{future::BoxFuture, FutureExt};
use tokio::io::{self, AsyncRead, AsyncSeek, AsyncWrite};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use wasmer_wasix::{FsError, VirtualFile};
use web_sys::{ReadableStreamDefaultReader, WritableStreamDefaultWriter};

// mod pipe;

#[derive(Clone, Debug)]
pub struct JsInput {
    reader: Arc<Mutex<JsReader>>,
}
#[derive(Clone, Debug)]
pub struct JsOutput {
    writer: Arc<Mutex<JsWriter>>,
}

impl JsInput {
    pub fn new(reader: ReadableStreamDefaultReader) -> Self {
        Self {
            reader: Arc::new(Mutex::new(JsReader(reader))),
        }
    }
    fn ctx<'a>(cx: &Context<'_>) -> &'a mut (Option<JsFuture>, Bytes) {
        // FIXME: surely there's a better, safer way to do this?
        thread_local! {
            static CTX: RefCell<Vec<(RawWaker, (Option<JsFuture>, Bytes))>> = RefCell::new(Vec::new());
        }
        CTX.with(|l| {
            let mut ctx = l.borrow_mut();
            let ctx_len = ctx.len();
            let ctx_key = unsafe { core::mem::transmute_copy::<_, RawWaker>(cx.waker()) };
            let reborrow = unsafe {
                &mut *(&mut ctx
                    as *mut core::cell::RefMut<'_, Vec<(RawWaker, (Option<JsFuture>, Bytes))>>)
            };
            let val = match ctx.iter_mut().find(|(key, _)| key == &ctx_key) {
                Some((_, val)) => val,
                None => {
                    reborrow.push((ctx_key, (None, Bytes::new())));
                    &mut reborrow[ctx_len].1
                }
            };
            unsafe { &mut *(val as *mut (Option<JsFuture>, Bytes)) }
        })
    }
}
impl JsOutput {
    pub fn new(writer: WritableStreamDefaultWriter) -> Self {
        Self {
            writer: Arc::new(Mutex::new(JsWriter(writer))),
        }
    }
    fn ctx<'a>(cx: &Context<'_>) -> &'a mut Option<JsFuture> {
        // FIXME: surely there's a better, safer way to do this?
        thread_local! {
            static CTX: RefCell<Vec<(RawWaker, Option<JsFuture>)>> = RefCell::new(Vec::new());
        }
        CTX.with(|l| {
            let mut ctx = l.borrow_mut();
            let ctx_len = ctx.len();
            let ctx_key = unsafe { core::mem::transmute_copy::<_, RawWaker>(cx.waker()) };
            let reborrow = unsafe {
                &mut *(&mut ctx as *mut core::cell::RefMut<'_, Vec<(RawWaker, Option<JsFuture>)>>)
            };
            let val = match ctx.iter_mut().find(|(key, _)| key == &ctx_key) {
                Some((_, val)) => val,
                None => {
                    reborrow.push((ctx_key, None));
                    &mut reborrow[ctx_len].1
                }
            };
            unsafe { &mut *(val as *mut _) }
        })
    }
}

// REVIEW: Unless the owned JsValue-table in the wasm runtime is sent with this WebAssembly.Memory snapshot, this is not Send/Sync.

// SAFETY: We manually ensure the Arc<Mutex<T>> is Send/Sync.
unsafe impl Send for JsInput {}
unsafe impl Sync for JsInput {}
// SAFETY: We manually ensure the Arc<Mutex<T>> is Send/Sync.
unsafe impl Send for JsOutput {}
unsafe impl Sync for JsOutput {}

impl AsyncSeek for JsInput {
    fn start_seek(self: Pin<&mut Self>, _position: SeekFrom) -> io::Result<()> {
        Ok(())
    }
    fn poll_complete(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<u64>> {
        Poll::Ready(Ok(0))
    }
}
impl AsyncSeek for JsOutput {
    fn start_seek(self: Pin<&mut Self>, _position: SeekFrom) -> io::Result<()> {
        Ok(())
    }
    fn poll_complete(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<u64>> {
        Poll::Ready(Ok(0))
    }
}

impl AsyncWrite for JsInput {
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
impl AsyncWrite for JsOutput {
    fn poll_write(
        self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        let this = self.get_mut();
        let future = Self::ctx(cx);
        let fut = match future {
            Some(fut) => fut,
            None => {
                let guard = lock_or_clear(&this.writer);
                future.insert(JsFuture::from(
                    guard.write_with_chunk(&JsValue::from(js_sys::Uint8Array::from(buf))),
                ))
            }
        };
        let result = ready!(fut.poll_unpin(cx));
        *future = None;
        Poll::Ready(match result {
            Ok(_) => Ok(buf.len()),
            Err(e) => Err(io::Error::new(
                io::ErrorKind::BrokenPipe,
                format!("failed to write to stream: {:?}", e),
            )),
        })
    }
    fn poll_flush(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        let this = self.get_mut();
        let future = Self::ctx(cx);
        let fut = match future {
            Some(fut) => fut,
            None => {
                let guard = lock_or_clear(&this.writer);
                future.insert(JsFuture::from(guard.ready()))
            }
        };
        let result = ready!(fut.poll_unpin(cx));
        *future = None;
        Poll::Ready(match result {
            Ok(_) => Ok(()),
            Err(e) => Err(io::Error::new(
                io::ErrorKind::BrokenPipe,
                format!("failed to flush stream: {:?}", e),
            )),
        })
    }
    fn poll_shutdown(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        self.poll_flush(cx)
    }
}

impl AsyncRead for JsInput {
    fn poll_read(
        self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut io::ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        let this = self.get_mut();
        let (future, bytes) = Self::ctx(cx);
        loop {
            {
                let len = bytes.len();
                if len > 0 {
                    let read = len.min(buf.remaining());
                    buf.put_slice(&bytes[..read]);
                    bytes.advance(read);
                    return Poll::Ready(Ok(()));
                }
            }
            let fut = match future {
                Some(fut) => fut,
                None => {
                    let guard = lock_or_clear(&this.reader);
                    future.insert(JsFuture::from(guard.read()))
                }
            };
            let result = ready!(fut.poll_unpin(cx));
            *future = None;
            // [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/read#return_value)
            let result = match result {
                Ok(result) => result,
                Err(err) => {
                    return Poll::Ready(Err(io::Error::new(
                        io::ErrorKind::BrokenPipe,
                        format!("failed to read from stream: {:?}", err),
                    )))
                }
            };
            let result = match result.dyn_into::<ReadableStreamReadResult>() {
                Ok(result) => result,
                Err(err) => {
                    return Poll::Ready(Err(io::Error::new(
                        io::ErrorKind::InvalidData,
                        format!("failed to read from stream: {:?}", err),
                    )))
                }
            };
            match result.value() {
                Some(result) => {
                    let len = result.len();
                    // EOF
                    if len == 0 {
                        return Poll::Ready(Ok(()));
                    }
                    *bytes = Bytes::from(result);
                }
                None => return Poll::Ready(Err(io::ErrorKind::BrokenPipe.into())),
            }
        }
    }
}
impl AsyncRead for JsOutput {
    fn poll_read(
        self: Pin<&mut Self>,
        _cx: &mut Context<'_>,
        _buf: &mut io::ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        Poll::Ready(Err(io::ErrorKind::Unsupported.into()))
    }
}

impl VirtualFile for JsInput {
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
    fn poll_read_ready(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<usize>> {
        let this = self.get_mut();
        let (future, bytes) = Self::ctx(cx);
        loop {
            {
                let len = bytes.len();
                if len > 0 {
                    return Poll::Ready(Ok(len));
                }
            }
            let fut = match future {
                Some(fut) => fut,
                None => {
                    let guard = lock_or_clear(&this.reader);
                    future.insert(JsFuture::from(guard.read()))
                }
            };
            let result = ready!(fut.poll_unpin(cx));
            *future = None;
            // [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/read#return_value)
            let result = match result {
                Ok(result) => result,
                Err(err) => {
                    return Poll::Ready(Err(io::Error::new(
                        io::ErrorKind::BrokenPipe,
                        format!("failed to read from stream: {:?}", err),
                    )))
                }
            };
            let result = match result.dyn_into::<ReadableStreamReadResult>() {
                Ok(result) => result,
                Err(err) => {
                    return Poll::Ready(Err(io::Error::new(
                        io::ErrorKind::InvalidData,
                        format!("failed to read from stream: {:?}", err),
                    )))
                }
            };
            match result.value() {
                Some(result) => {
                    let len = result.len();
                    // EOF
                    if len == 0 {
                        return Poll::Ready(Ok(0));
                    }
                    *bytes = Bytes::from(result);
                }
                None => return Poll::Ready(Err(io::ErrorKind::BrokenPipe.into())),
            }
        }
    }
    fn poll_write_ready(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<usize>> {
        Poll::Ready(Err(io::ErrorKind::Unsupported.into()))
    }
}
impl VirtualFile for JsOutput {
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
        let writer = match self.writer.try_lock() {
            Ok(writer) => writer,
            Err(std::sync::TryLockError::Poisoned(writer)) => writer.into_inner(),
            _ => return false,
        };
        matches!(writer.desired_size(), Ok(Some(x)) if x.is_normal())
    }
    fn poll_read_ready(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<io::Result<usize>> {
        Poll::Ready(Err(io::ErrorKind::Unsupported.into()))
    }
    fn poll_write_ready(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<usize>> {
        let this = self.get_mut();
        let future = Self::ctx(cx);
        let (result, guard) = match future {
            Some(fut) => {
                let result = ready!(fut.poll_unpin(cx));
                (result, lock_or_clear(&this.writer))
            }
            None => {
                let guard = lock_or_clear(&this.writer);
                let result = ready!(future.insert(JsFuture::from(guard.ready())).poll_unpin(cx));
                (result, guard)
            }
        };
        *future = None;
        if let Ok(Ok(Some(x))) = result.map(|_| guard.desired_size()) {
            Poll::Ready(Ok(x as usize))
        } else {
            Poll::Ready(Err(io::Error::new(
                io::ErrorKind::BrokenPipe,
                format!("failed to ready output stream"),
            )))
        }
    }
}

#[derive(Debug)]
#[repr(transparent)]
struct JsWriter(WritableStreamDefaultWriter);
impl std::ops::Deref for JsWriter {
    type Target = WritableStreamDefaultWriter;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
impl std::ops::DerefMut for JsWriter {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}
impl Drop for JsWriter {
    fn drop(&mut self) {
        wasm_bindgen_futures::spawn_local(JsFuture::from(self.0.close()).map(drop));
    }
}

#[derive(Debug)]
#[repr(transparent)]
pub struct JsReader(ReadableStreamDefaultReader);
impl std::ops::Deref for JsReader {
    type Target = ReadableStreamDefaultReader;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
impl std::ops::DerefMut for JsReader {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}
impl Drop for JsReader {
    fn drop(&mut self) {
        wasm_bindgen_futures::spawn_local(JsFuture::from(self.0.cancel()).map(drop));
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends = js_sys::Object, is_type_of = ReadableStreamReadResult::is_type_of)]
    type ReadableStreamReadResult;
    #[wasm_bindgen(method, getter)]
    fn done(this: &ReadableStreamReadResult) -> bool;
    #[wasm_bindgen(method, getter)]
    fn value(this: &ReadableStreamReadResult) -> Option<Box<[u8]>>;
}
impl ReadableStreamReadResult {
    pub fn is_type_of(val: &JsValue) -> bool {
        #[wasm_bindgen]
        extern "C" {
            type Unknown;
            #[wasm_bindgen(method, getter)]
            fn done(this: &Unknown) -> JsValue;
            #[wasm_bindgen(method, getter)]
            fn value(this: &Unknown) -> JsValue;
        }
        val.is_object() && {
            let val = val.unchecked_ref::<Unknown>();
            val.done().as_bool().is_some() && {
                let val: JsValue = val.value();
                val.is_undefined() || val.is_instance_of::<js_sys::Uint8Array>()
            }
        }
    }
}

#[inline]
fn lock_or_clear<T: ?Sized>(mutex: &Mutex<T>) -> std::sync::MutexGuard<'_, T> {
    match mutex.lock() {
        Ok(guard) => guard,
        Err(poison) => poison.into_inner(),
    }
}
