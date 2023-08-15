import { expect } from '@esm-bundle/chai';
import init, { Runtime, run, wat2wasm, Wasmer } from "../pkg/wasmer_wasix_js";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

before(async () => {
    await init();
});

it.skip("run noop program", async () => {
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
    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
});

it.skip("Can run python", async () => {
    const wasmer = new Wasmer();

    const instance = await wasmer.spawn("python/python@3.14.0", {
        args: ["-c", "print('Hello, World!')"],
    });
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    const decoder = new TextDecoder("utf-8");
    expect(decoder.decode(output.stdout)).to.equal("Hello, World!");
});

it.skip("Can communicate via stdin", async () => {
    const wasmer = new Wasmer();

    // First, start python up in the background
    const instance = await wasmer.spawn("python/python@3.14.0");
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
});

it("can spawn web workers", async () => {
    const script = `
    console.log("Worker started");

    globalThis.onerror = console.error;

    globalThis.onmessage = async ev => {
        console.log("Received ping...", ev);
        postMessage(ev.data);
    };
    `;
    const url = URL.createObjectURL(new Blob([script], {type: 'text/javascript'}));
    const worker = new Worker(url);

    const response = new Promise((resolve, reject) => {
        worker.addEventListener("message", resolve);
        worker.addEventListener("error", reject);
        worker.addEventListener("messageerror", reject);
    });

    console.log("Sending ping");
    worker.postMessage("Message");
    console.log("Received pong", await response);

    worker.terminate();
});

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
