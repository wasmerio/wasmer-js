import { expect } from '@esm-bundle/chai';
import { Runtime, run, wat2wasm, Wasmer, Container, init } from "..";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");
const wasmerPython = "python/python@0.1.0";

describe("run", function() {
    this.timeout("60s")
        .beforeAll(async () => await init());

    it("can execute a noop program", async function() {
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

    it("can start python", async function() {
        let wasmer = new Wasmer();
        const python = getPython(wasmer);
        const runtime = wasmer.runtime();
        const { module } = await python;

        const instance = run(module, { program: "python", args: ["--version"], runtime });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
        expect(decoder.decode(output.stdout)).to.equal("Python 3.6.7\n");
        expect(decoder.decode(output.stderr)).to.be.empty;
    });
});

describe("Wasmer.spawn", function() {
    let wasmer: Wasmer;

    this.timeout("120s")
        .beforeAll(async () => {
            await init();
            // Note: technically we should use a separate Wasmer instance so tests can't
            // interact with each other, but in this case the caching benefits mean we
            // complete in tens of seconds rather than several minutes.
            wasmer = new Wasmer();
        });

    it("Can run python", async function () {
        const instance = await wasmer.spawn("python/python@0.1.0", {
            args: ["--version"],
        });
        const output = await instance.wait();

        expect(output.code).to.equal(0);
        expect(output.ok).to.be.true;
        expect(decoder.decode(output.stdout)).to.equal("Python 3.6.7\n");
        expect(output.stderr.length).to.equal(0);
    });

    it("Can capture exit codes", async function() {
        const instance = await wasmer.spawn("saghul/quickjs", {
            args: ["-e", "process.exit(42)"],
            command: "quickjs",
        });
        const output = await instance.wait();

        expect(output.code).to.equal(42);
        expect(output.ok).to.be.false;
        expect(output.stdout.length).to.equal(0);
        expect(output.stderr.length).to.equal(0);
    });

    it("Can communicate via stdin", async function() {
        // First, start python up in the background
        const instance = await wasmer.spawn("python/python@0.1.0");
        // Then, send the command to the REPL
        const stdin = instance.stdin!.getWriter();
        await stdin.write(encoder.encode("print(1 + 1)\n"));
        await stdin.close();
        // Now make sure we read stdout (this won't complete until after the
        // instance exits).
        const stdout = readToEnd(instance.stdout);
        // Wait for the instance to shut down.
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(await stdout).to.equal("2\n");
    });

    it("can run a bash session", async function() {
        const instance = await wasmer.spawn("sharrattj/bash", {
            stdin: "ls / && exit 42\n",
        });
        const { code, stdout, stderr } = await instance.wait();

        expect(code).to.equal(42);
        expect(decoder.decode(stdout)).to.equal("bin\nlib\ntmp\n");
        expect(decoder.decode(stderr)).to.equal("");
    });

    it("can communicate with a subprocess", async function() {
        const instance = await wasmer.spawn("sharrattj/bash", {
            args: ["-c", "python"],
            uses: ["python/python@0.1.0"],
        });
        const stdin = instance.stdin!.getWriter();
        // Tell Bash to start Python
        await stdin.write(encoder.encode("python\n"));
        await stdin.write(encoder.encode("import sys; print(sys.version)\nexit()\n"));
        await stdin.close();

        const { code, stdout, stderr } = await instance.wait();

        expect(code).to.equal(42);
        expect(decoder.decode(stdout)).to.equal("bin\nlib\ntmp\n");
        expect(decoder.decode(stderr)).to.equal("");
    });
});

async function readWhile(stream: ReadableStream<Uint8Array>, predicate: (chunk: ReadableStreamReadResult<Uint8Array>) => boolean): Promise<string> {
    let reader = stream.getReader();
    let pieces: string[] = [];
    let chunk: ReadableStreamReadResult<Uint8Array>;

    try {
        do {
            chunk = await reader.read();

            if (chunk.value) {
                const sentence = decoder.decode(chunk.value);
                pieces.push(sentence);
            }
        } while(predicate(chunk));

        return pieces.join("");
    } finally {
        reader.releaseLock();
    }
}

async function readToEnd(stream: ReadableStream<Uint8Array>): Promise<string> {
    return await readWhile(stream, chunk => !chunk.done);
}

async function getPython(wasmer: Wasmer): Promise<{container: Container, python: Uint8Array, module: WebAssembly.Module}> {
    const container = await Container.from_registry(wasmerPython, wasmer.runtime());
    const python = container.get_atom("python");
    if (!python) {
        throw new Error("Can't find the 'python' atom");
    }
    const module = await WebAssembly.compile(python);

    return {
        container, python, module
    };
}
