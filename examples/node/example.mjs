// import fs from "node:fs";
import process from "node:process";
import { init, Wasmer } from "../../dist/node.mjs"

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async  function connectStreams(instance) {
// process.stdin.
const stdin = instance.stdin?.getWriter();
process.stdin.resume();

process.stdin.on("data", data => stdin?.write(encoder.encode(data)));

  instance.stdout.pipeTo(
    new WritableStream({ write: chunk => process.stdout.write(decoder.decode(chunk)) }),
  );
  instance.stderr.pipeTo(
    new WritableStream({ write: chunk => process.stderr.write(decoder.decode(chunk)) }),
  );
}

// let path = new URL("../../dist/node.,js", import.meta.url);
// let wasmPath = new URL("../../dist/wasmer_js_bg.wasm", import.meta.url);
// let wasmFile = fs.readFileSync(wasmPath);


// Replace __filename with "/Users/syrusakbary/Development/wasmer-js/node_modules/.deno/web-worker@1.3.0/node_modules/web-worker/node.js"

async function run() {
    // await init({log: "trace"});
    await init();

let cowsay = await Wasmer.fromRegistry("python/python")

// let instance = await cowsay.entrypoint.run({args: ["hello world"]});
let instance = await cowsay.entrypoint.run({args: []});

await connectStreams(instance);
// const output = await instance.wait();
// console.log(output.stdout);

}

run();
