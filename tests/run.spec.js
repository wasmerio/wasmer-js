// Polyfills
const { ReadableStream, ReadableStreamDefaultReader } = require("web-streams-polyfill");
globalThis.ReadableStream = ReadableStream;
globalThis.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
const { Blob } = require("blob-polyfill");
globalThis.Blob = Blob;
const { Worker } = require("node:worker_threads");
globalThis.Worker = Worker;

const { init, Runtime, run, wat2wasm } = require("../dist/Library.cjs.js");

beforeAll(async () => {
    await init();
});

test("run noop program", async () => {
    const noop = `(
        module
            (memory $memory 0)
            (export "memory" (memory $memory))
            (func (export "_start") nop)
        )`;
    const wasm = wat2wasm(noop);
    const module = await WebAssembly.compile(wasm);
    const runtime = new Runtime(2);

    const instance = await run(module, runtime, { program: "noop" });
    const output = await instance.wait();

    console.log(output);
    expect(output.ok).toBe(true);
    expect(output.code).toBe(0);
});
