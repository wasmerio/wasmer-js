import { expect } from '@esm-bundle/chai';
import { Runtime, run, wat2wasm, Wasmer, Container, init } from "..";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");
const wasmerPython = "https://wasmer.io/python/python@0.1.0";

before(async () => {
    await init();
});

describe("run", function() {
    this.timeout("60s");
    const python = getPython();

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

        const instance = run(module, runtime, { program: "noop" });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
    });

    it("can start python", async () => {
        const runtime = new Runtime(2);
        const { module } = await python;

        const instance = run(module, runtime, { program: "python", args: ["--version"] });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
        expect(decoder.decode(output.stdout)).to.equal("Python 3.6.7\n");
        expect(decoder.decode(output.stderr)).to.be.empty;
    });
});

describe("Wasmer.spawn", function() {
    this.timeout("60s");

    it("Can run python", async () => {
        const wasmer = new Wasmer();

        const instance = await wasmer.spawn("python/python", {
            args: ["--version"],
        });
        const output = await instance.wait();

        expect(output.code).to.equal(0);
        expect(output.ok).to.be.true;
        expect(decoder.decode(output.stdout)).to.equal("Python 3.6.7\n");
        expect(output.stderr.length).to.equal(0);
    });

    it("Can capture exit codes", async () => {
        const wasmer = new Wasmer();

        const instance = await wasmer.spawn("python/python", {
            args: ["-c", "import sys; sys.exit(42)"],
        });
        const output = await instance.wait();
        console.log({
            stdout: decoder.decode(output.stdout),
            stderr: decoder.decode(output.stderr),
        });

        expect(output.code).to.equal(42);
        expect(output.ok).to.be.false;
        expect(output.stdout.length).to.equal(0);
        expect(output.stderr.length).to.equal(0);
    });

    it("Can communicate via stdin", async () => {
        const wasmer = new Wasmer();

        // First, start python up in the background
        const instance = await wasmer.spawn("python/python");
        // Then, send the command to the REPL
        const stdin = instance.stdin!.getWriter();
        await stdin.write(encoder.encode("1 + 1\n"));
        await stdin.close();
        // Now make sure we read stdout (this won't complete until after the
        // instance exits).
        const stdout = readToEnd(instance.stdout);
        // Wait for the instance to shut down.
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(await stdout).to.equal("2\n");
    });

    it("can start run a bash session", async () => {
        const wasmer = new Wasmer();

        // First, start python up in the background
        const instance = await wasmer.spawn("sharrattj/bash", {
            uses: ["sharrattj/coreutils"],
        });
        // Then, send the command to the REPL
        const stdin = instance.stdin!.getWriter();
        await stdin.write(encoder.encode("1 + 1\n"));
    });
});


async function readUntil(stream: ReadableStream<Uint8Array>, predicate: (chunk: ReadableStreamReadResult<Uint8Array>) => boolean): Promise<string> {
    let reader = stream.getReader();
    let pieces: string[] =[];
    let chunk: ReadableStreamReadResult<Uint8Array>;

    do {
        chunk = await reader.read();

        if (chunk.value) {
            const sentence = decoder.decode(chunk.value);
            pieces.push(sentence);
        }
    } while(predicate(chunk));

    return pieces.join("");
}

async function readToEnd(stream: ReadableStream<Uint8Array>): Promise<string> {
    return await readUntil(stream, chunk => !chunk.done);
}

async function getPython(): Promise<{container: Container, python: Uint8Array, module: WebAssembly.Module}> {
        const response = await fetch(wasmerPython, {
            headers: { "Accept": "application/webc" }
        });
        const raw = await response.arrayBuffer();
        const container = new Container(new Uint8Array(raw));
        const python = container.get_atom("python");
        if (!python) {
            throw new Error("Can't find the 'python' atom");
        }
        const module = await WebAssembly.compile(python);

        return {
            container, python, module
        };
}
