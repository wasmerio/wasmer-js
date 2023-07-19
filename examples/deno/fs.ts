import init, { WASI } from "../../wasix.ts";
Error.stackTraceLimit += 30;

// This is needed to load the WASI library first
await init();

const decoder = new TextDecoder("utf-8");
const strategy = new ByteLengthQueuingStrategy({ highWaterMark: 4096 });
const stdout = new WritableStream({
  /** @argument {Uint8Array} chunk */
  write(chunk) {
    let text = decoder.decode(chunk, { stream: true });
    console.log(text);
  },
  close() { console.log("stdout closed"); },
  abort() { console.log("stdout aborted"); },
}, strategy);

const wasi = new WASI({
  env: {},
  args: [],
  stdout: stdout.getWriter(),
});

const moduleBytes = fetch(
  new URL('../../tests/mapdir.wasm', import.meta.url),
);
const module = await WebAssembly.compileStreaming(moduleBytes);
await wasi.instantiate(module, {});

wasi.fs.createDir("/a");
wasi.fs.createDir("/b");

{
  const file = wasi.fs.open("/file", { read: true, write: true, create: true });
  await file.writeString("fileContents");
  await file.flush();
  console.log("readString: ", await file.readString());
  file.free();
}

const exitCode = wasi.start();
wasi.free();
// This should print "hello world (exit code: 0)"
console.log(`(exit code: ${exitCode})`);
