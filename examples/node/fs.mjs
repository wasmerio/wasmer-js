// This should print
// ```
// hello world
// (exit code: 0)
// ```

import fs from "node:fs";
import url from "node:url";
import stream from "node:stream";
import init, { WASI, TtyState, VirtualFileReader, VirtualFileWriter } from "../../dist/lib.mjs";
Error.stackTraceLimit += 30;

// This is needed to load the WASI library first, must be called before API can be used
await init();

const defaultTtyState = Object.assign(new TtyState(), {
  columns: 800,
  rows: 250,
});

let wasi = new WASI({
  env: {},
  args: [],
  // define the starting state of the tty
  tty: defaultTtyState,
});

// keep track of tty/io Promises
let handles = [];
let stdoutBuf = "";

{ // setup tty and stdio handlers
  handles.push(
    (() => {
      const handle = wasi.tty;
      const handler = new TransformStream({ transform(chunk, controller) { controller.enqueue(chunk ? chunk : defaultTtyState) } });
      return handle.readable.pipeThrough(handler).pipeTo(handle.writable);
    })()
  );
  handles.push(
    (() => {
      const decoder = new TransformStream({
        start(controller) { this.decoder = new TextDecoder("utf-8"); },
        transform(chunk, controller) { controller.enqueue(this.decoder.decode(chunk, { stream: true })) },
      });
      const handler = new WritableStream({
        write(chunk, _controller) { stdoutBuf += chunk; }
      });
      return wasi.stdout.pipeThrough(decoder).pipeTo(handler);
    })()
  );
}

{ // test fs
  wasi.fs.createDir("/a");
  wasi.fs.createDir("/b");
  let file = wasi.fs.open("/file", { read: true, write: true, create: true });
  console.log("await file.writeString(\"fileContents\") ... ", await file.writeString("fileContents"));
  await file.flush();
  console.log("await file.text() ... ", await file.text());
  file.free();
}

const wasm = fs.readFileSync(url.fileURLToPath(new URL('../../tests/mapdir.wasm', import.meta.url)));
const module = await WebAssembly.compile(
  new Uint8Array(wasm)
);
wasi.instantiate(module, {});
let exitCode = wasi.start();

// You must call WASI.free() before handles can resolve
wasi.free();
// Await handles to flush tty/io
await Promise.all(handles);
console.log(`${stdoutBuf}(exit code: ${exitCode})`);
