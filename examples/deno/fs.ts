import { init, WASI } from "https://deno.land/x/wasm/wasi.ts";

// This is needed to load the WASI library first
await init();

const wasi = new WASI({
  env: {},
  args: [],
});

const moduleBytes = fetch(
  "https://cdn.deno.land/wasm/versions/v1.0.2/raw/tests/mapdir.wasm",
);
const module = await WebAssembly.compileStreaming(moduleBytes);
await wasi.instantiate(module, {});

wasi.fs.createDir("/a");
wasi.fs.createDir("/b");

const file = wasi.fs.open("/file", { read: true, write: true, create: true });
file.writeString("fileContents");
file.seek(0);

const exitCode = wasi.start();
const stdout = wasi.getStdoutString();
// This should print "hello world (exit code: 0)"
console.log(`${stdout}(exit code: ${exitCode})`);
