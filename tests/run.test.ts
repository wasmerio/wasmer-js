import { expect } from "@esm-bundle/chai";
import {
    Runtime,
    run,
    wat2wasm,
    Wasmer,
    init,
    initializeLogger,
    Directory,
} from "..";

let runtime: Runtime;
const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

const initialized = (async () => {
    await init();
    initializeLogger("warn");
    runtime = new Runtime();
})();

describe("run", function () {
    this.timeout("60s").beforeAll(async () => await initialized);

    it("can execute a noop program", async () => {
        const noop = `(
            module
                (memory $memory 0)
                (export "memory" (memory $memory))
                (func (export "_start") nop)
            )`;
        const wasm = wat2wasm(noop);
        const module = await WebAssembly.compile(wasm);

        const instance = await run(module, { program: "noop", runtime });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
    });

    it("can start quickjs", async () => {
        const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
        const quickjs = pkg.commands["quickjs"].binary();
        const module = await WebAssembly.compile(quickjs);

        const instance = await run(module, {
            program: "quickjs",
            args: ["--eval", "console.log('Hello, World!')"],
            runtime,
        });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
        expect(decoder.decode(output.stdout)).to.contain("Hello, World!");
        expect(decoder.decode(output.stderr)).to.be.empty;
    });

    it("can read directories", async () => {
        const dir = new Directory();
        await dir.writeFile("/file.txt", "");
        const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
        const quickjs = pkg.commands["quickjs"].binary();
        const module = await WebAssembly.compile(quickjs);

        const instance = await run(module, {
            program: "quickjs",
            args: [
                "--std",
                "--eval",
                `[dirs] = os.readdir("/"); console.log(dirs.join("\\n"))`,
            ],
            runtime,
            mount: {
                "/mount": dir,
            },
        });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
        expect(decoder.decode(output.stdout)).to.equal(".\n..\nmount\n");
        expect(decoder.decode(output.stderr)).to.be.empty;
    });

    it("can read files", async () => {
        const tmp = new Directory();
        await tmp.writeFile("/file.txt", encoder.encode("Hello, World!"));
        const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
        const quickjs = pkg.commands["quickjs"].binary();
        const module = await WebAssembly.compile(quickjs);

        const instance = await run(module, {
            program: "quickjs",
            args: [
                "--std",
                "--eval",
                `console.log(std.open('/tmp/file.txt', "r").readAsString())`,
            ],
            runtime,
            mount: {
                "/tmp": tmp,
            },
        });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
        expect(decoder.decode(output.stdout)).to.equal("Hello, World!\n");
        expect(decoder.decode(output.stderr)).to.be.empty;
    });

    it("can write files", async () => {
        const dir = new Directory();
        const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
        const quickjs = pkg.commands["quickjs"].binary();
        const module = await WebAssembly.compile(quickjs);
        const script = `
            const f = std.open('/mount/file.txt', 'w');
            f.puts('Hello, World!');
            f.close();
        `;

        const instance = await run(module, {
            program: "quickjs",
            args: ["--std", "--eval", script],
            runtime,
            mount: {
                "/mount": dir,
            },
        });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(await dir.readTextFile("/file.txt")).to.equal("Hello, World!");
    });
});
