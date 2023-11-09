import { expect } from '@esm-bundle/chai';
import { Runtime, run, wat2wasm, Wasmer, Container, init, initializeLogger, Directory } from "..";

let wasmer: Wasmer;
const decoder = new TextDecoder("utf-8");

const initialized = (async () => {
    await init();
    initializeLogger("info");
    wasmer = new Wasmer();
})();

describe("run", function() {
    this.timeout("60s")
        .beforeAll(async () => await initialized);

    it("can execute a noop program", async () => {
        const noop = `(
            module
                (memory $memory 0)
                (export "memory" (memory $memory))
                (func (export "_start") nop)
            )`;
        const wasm = wat2wasm(noop);
        const module = await WebAssembly.compile(wasm);
        const runtime = new Runtime(2);

        const instance = run(module, { program: "noop", runtime });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
    });

    it("can start quickjs", async () => {
        const runtime = wasmer.runtime();
        const container = await Container.from_registry("saghul/quickjs@0.0.3", runtime);
        const module = await WebAssembly.compile(container.get_atom("quickjs")!);

        const instance = run(module, { program: "quickjs", args: ["--eval", "console.log('Hello, World!')"], runtime });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
        expect(decoder.decode(output.stdout)).to.contain("Hello, World!");
        expect(decoder.decode(output.stderr)).to.be.empty;
    });

    it("can read files", async () => {
        const runtime = wasmer.runtime();
        const tmp = new Directory();
        const container = await Container.from_registry("saghul/quickjs@0.0.3", runtime);
        const module = await WebAssembly.compile(container.get_atom("quickjs")!);
        const script = [
            "const f = std.open('/tmp/file.txt', 'rw')",
            "f.puts('Hello, World!\\n')",
            "f.close()",
            "console.log(std.loadFile('/tmp/file.txt'))",
        ].join(";\n");

        const instance = run(module, {
            program: "quickjs",
            args: ["--std", "--eval", script],
            runtime,
            mount: {
                "/tmp": tmp,
            }
         });
        const output = await instance.wait();

        console.log({
            ...output,
            stdout: decoder.decode(output.stdout),
            stderr: decoder.decode(output.stderr),
        });

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
        expect(decoder.decode(output.stdout)).to.contain("Hello, World!");
        expect(decoder.decode(output.stderr)).to.be.empty;
    });
});
