import { readFile } from "node:fs/promises";
import { init, WASI } from "@wasmer/wasi";

// This is needed to load the WASI library first
await init();

const wasi = new WASI({
  env: {},
  args: [],
});

const buf = await readFile("../../tests/mapdir.wasm");

const module = await WebAssembly.compile(buf);
wasi.instantiate(module, {});

wasi.fs.createDir("/a");
wasi.fs.createDir("/b");

const file = wasi.fs.open("/file", { read: true, write: true, create: true });
file.writeString("fileContents");
file.seek(0);

const exitCode = wasi.start();
const stdout = wasi.getStdoutString();

// This should print "hello world (exit code: 0)"
console.log(`${stdout}(exit code: ${exitCode})`);
