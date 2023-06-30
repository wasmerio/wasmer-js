import { init, WASI } from "../../wasix.ts";

// This is needed to load the WASI library first
await init();

const wasi = new WASI({
  env: {},
  args: [],
});

const moduleBytes = fetch(
  new URL('../../tests/mapdir.wasm', import.meta.url),
);
const module = await WebAssembly.compileStreaming(moduleBytes);
await wasi.instantiate(module, {});

wasi.fs.createDir("/a");
wasi.fs.createDir("/b");

const file = wasi.fs.open("/file", { read: true, write: true, create: true });
await file.writeString("fileContents");
await file.flush();

const exitCode = wasi.start();
const stdout = await wasi.getStdoutString();
// This should print "hello world (exit code: 0)"
console.log(`${stdout}(exit code: ${exitCode})`);
