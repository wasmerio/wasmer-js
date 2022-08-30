import { init, WASI } from 'https://deno.land/x/wasm/wasi.ts';

// This is needed to load the WASI library first
await init();

let wasi = new WASI({
  env: {},
  args: [],
});

const moduleBytes = fetch("https://cdn.deno.land/wasm/versions/v1.0.1/raw/tests/mapdir.wasm");
const module = await WebAssembly.compileStreaming(moduleBytes);
let instance = await wasi.instantiate(module, {});

wasi.fs.createDir("/a");
wasi.fs.createDir("/b");

let file = wasi.fs.open("/file", {read: true, write: true, create: true});
file.writeString("fileContents");
file.seek(0);

let exitCode = wasi.start(instance);
let stdout = wasi.getStdoutString();
// This should print "hello world (exit code: 0)"
console.log(`${stdout}(exit code: ${exitCode})`);
