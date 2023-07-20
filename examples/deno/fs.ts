// import init, { WASI } from "https://deno.land/x/wasm/wasi.ts";
import init, { WASI } from "../../wasix.ts";

// This is needed to load the WASI library first
await init();

const wasi = new WASI({
  env: {},
  args: [],
});

// Keep track of open handles (Promises)
let handles: Promise<void>[] = [];

// pipe wasi.stdout to `stdout` string
let stdout = "";
const DecodeStream = () => new TextDecoderStream("utf-8", { ignoreBOM: false, fatal: true });
const StdoutWritable = () => new WritableStream({
  write(chunk, _controller) { stdout += chunk; }
});
handles.push(wasi.stdout.pipeThrough(DecodeStream()).pipeTo(StdoutWritable()));

const moduleBytes = fetch(new URL("../../tests/mapdir.wasm", import.meta.url));
const module = await WebAssembly.compileStreaming(moduleBytes);
wasi.instantiate(module, {});

wasi.fs.createDir("/a");
wasi.fs.createDir("/b");

const file = wasi.fs.open("/file", { read: true, write: true, create: true });
await file.writeString("fileContents");
await file.seek(0);

const exitCode = wasi.start();

// WASI must be freed before handles are closed, either manually, "wasi.free()", or by garbage collection
wasi.free();
// Wait for handles to finish before proceeding
Promise.all(handles).then(() => {
  // This should print:
  // "./a"
  // "./b"
  // "./file"
  // (exit code: 0)
  console.log(`${stdout}(exit code: ${exitCode})`);
});
