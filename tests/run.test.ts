import { expect } from '@esm-bundle/chai';
import { Runtime, run, wat2wasm, Wasmer, Container, init, initializeLogger, Directory } from "..";

let wasmer: Wasmer;
const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

const initialized = (async () => {
    await init();
    initializeLogger("info,wasmer_js::run=trace,wasmer_js::fs=trace,wasmer_wasix::syscalls=debug");
    wasmer = new Wasmer();
})();

describe.skip("run", function() {
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
});

describe("run with mounts", function() {
    this.timeout("60s")
        .beforeAll(async () => await initialized);

    it("can read files", async () => {
        const runtime = wasmer.runtime();
        const tmp = new Directory();
        await tmp.writeFile("/file.txt", encoder.encode("Hello, World!\n"));
        const coreutils = await Container.from_registry("sharrattj/coreutils@1.0.16", runtime);
        const module = coreutils.get_atom("coreutils")!;

        const instance = await run(module, {
            program: "ls",
            args: ["--help"],
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

    it.skip("can write files", async () => {
        const runtime = wasmer.runtime();
        const tmp = new Directory();
        const container = await Container.from_registry("saghul/quickjs@0.0.3", runtime);
        const module = await WebAssembly.compile(container.get_atom("quickjs")!);
        const script = `
            const f = std.open('/tmp/file.txt', os.O_RDWR | os.O_CREAT);
            f.puts('Hello, World!\\n');
            f.close();
        `;

        const instance = run(module, {
            program: "quickjs",
            args: ["--std", "--eval", script],
            runtime,
            mount: {
                "/tmp": tmp,
            }
         });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(await tmp.readFile("/file.txt")).to.equal("Hello, World!\n");
    });
});
