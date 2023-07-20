import fs from "fs";
// import init, { WASI } from "@wasmer/wasi";
import init, { WASI } from "../../dist/lib.min.mjs";

// This is needed to load the WASI library first
await init();

let wasi = new WASI({
  env: {},
  args: [],
});

// Keep track of open handles (Promises)
let handles = [];

// pipe wasi.stdout to `stdout` string
let stdout = "";
const DecodeStream = () => new TextDecoderStream("utf-8", { ignoreBOM: false, fatal: true });
const StdoutWritable = () => new WritableStream({
  write(chunk, _controller) { stdout += chunk; }
});
handles.push(wasi.stdout.pipeThrough(DecodeStream()).pipeTo(StdoutWritable()));

const buf = fs.readFileSync(new URL('../../tests/mapdir.wasm', import.meta.url));

const module = await WebAssembly.compile(
  new Uint8Array(buf)
);
wasi.instantiate(module, {});

wasi.fs.createDir("/a");
wasi.fs.createDir("/b");

let file = wasi.fs.open("/file", { read: true, write: true, create: true });
await file.writeString("fileContents");
await file.seek(0);

let exitCode = wasi.start();

// WASI must be freed before handles are closed, either manually, "wasi.free()", or by garbage collection
wasi.free();
// Wait for handles to finish before proceeding
await Promise.all(handles);

// This should print:
// "./a"
// "./b"
// "./file"
// (exit code: 0)
console.log(`${stdout}(exit code: ${exitCode})`);
