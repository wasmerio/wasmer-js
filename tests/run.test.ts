import { expect } from '@esm-bundle/chai';
import init, { Runtime, run, wat2wasm } from "../pkg/wasmer_wasix_js";

before(async () => {
    await init();
});

it("run noop program", async () => {
    const noop = `(
        module
            (memory $memory 0)
            (export "memory" (memory $memory))
            (func (export "_start") nop)
        )`;
    const wasm = wat2wasm(noop);
    const module = await WebAssembly.compile(wasm);
    const runtime = new Runtime(2);

    const instance = run(module, runtime, { program: "noop" });
    const output = await instance.wait();

    console.log(output);
    expect(output.ok).to.equal(true);
    expect(output.code).to.equal(0);
});
