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

const moduleBytes = fetch(new URL("../../tests/demo.wasm", import.meta.url));
const module = await WebAssembly.compileStreaming(moduleBytes);
await wasi.instantiate(module, {});

let exitCode = wasi.start();

// WASI must be freed before handles are closed, either manually, "wasi.free()", or by garbage collection
wasi.free();
// Wait for handles to finish before proceeding
await Promise.all(handles);

document.body.innerHTML += `<h2>helloworld.js</h2><pre>${stdout}(exit code: ${exitCode})</pre>`;
