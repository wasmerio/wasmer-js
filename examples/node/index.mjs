import fs from "fs";
import { init, WASI } from "@wasmer/wasi";

// This is needed to load the WASI library first
await init();

let wasi = new WASI({
  env: {},
  args: [],
});

const buf = fs.readFileSync('../../tests/demo.wasm');

const module = await WebAssembly.compile(
  new Uint8Array(buf)
);
await wasi.instantiate(module, {});

let exitCode = wasi.start();
let stdout = wasi.getStdoutString();
// This should print "hello world (exit code: 0)"
console.log(`${stdout}(exit code: ${exitCode})`);
