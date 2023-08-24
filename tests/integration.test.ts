import { expect } from '@esm-bundle/chai';
import init, { Runtime, run, wat2wasm, Wasmer } from "../pkg/wasmer_wasix_js";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

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
    console.log("WASM", wasm);
    const module = await WebAssembly.compile(wasm);
    const runtime = new Runtime(2);
    console.log("RUNTIME", runtime);

    const instance = run(module, runtime, { program: "noop" });
    console.log("INSTANCE", instance);
    const stdout = instance.stdout.getReader();
    const stderr = instance.stderr.getReader();
    console.log("READERS", stdout, stderr);
    const output = await instance.wait();
    console.log("OUTPUT", output);

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
    console.log(stdout, stderr);
});

it("Can run python", async () => {
    const wasmer = new Wasmer();
    console.log(wasmer);

    const instance = await wasmer.spawn("python/python", {
        args: ["-c", "print('Hello, World!')"],
    });
    console.log(instance);
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    const decoder = new TextDecoder("utf-8");
    expect(decoder.decode(output.stdout)).to.equal("Hello, World!");
}).timeout(10*1000);

it("Can communicate via stdin", async () => {
    const wasmer = new Wasmer();

    // First, start python up in the background
    const instance = await wasmer.spawn("python/python");
    // Then, send the command to the REPL
    const stdin = instance.stdin!.getWriter();
    await stdin.write(encoder.encode("print('Hello, World!')\n"));
    await stdin.write(encoder.encode("exit()\n"));
    await stdin.close();
    // Now make sure we read stdout (this won't complete until after the
    // instance exits).
    const stdout = readToEnd(instance.stdout);
    // Wait for the instance to shut down.
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(await stdout).to.equal("Hello, World!");
}).timeout(10*1000);

async function readToEnd(stream: ReadableStream<Uint8Array>): Promise<string> {
    let reader = stream.getReader();
    let pieces: string[] =[];
    let chunk: ReadableStreamReadResult<Uint8Array>;

    do {
        chunk = await reader.read();

        if (chunk.value) {
            const sentence = decoder.decode(chunk.value);
            pieces.push(sentence);
        }
    } while(!chunk.done);

    return pieces.join("");
}
