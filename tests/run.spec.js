const { init, Runtime, run, wat2wasm } = require('../dist/Library.cjs.js');

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
    expect(output.ok).toBe(true);
    expect(output.code).toBe(0);
});
