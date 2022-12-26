import { readFile } from "node:fs/promises";
import { init, WASI } from "@wasmer/wasi";

// This is needed to load the WASI library first
await init();

let wasi = new WASI({
  env: {},
  args: [],
});

const buf = await readFile('../../tests/demo.wasm');

const module = await WebAssembly.compile(buf);
wasi.instantiate(module, {});

let exitCode = wasi.start();
let stdout = wasi.getStdoutString();
// This should print "hello world (exit code: 0)"
console.log(`${stdout}(exit code: ${exitCode})`);
