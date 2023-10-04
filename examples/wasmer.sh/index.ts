import "xterm/css/xterm.css";

import { SpawnConfig, Wasmer, init } from "@wasmer/wasix";
import { Terminal } from "xterm";

const encoder = new TextEncoder();

const packageName = "sharrattj/bash";
const args: string[] = [];
const uses: string[] = ["sharrattj/coreutils"];

async function main() {
    console.log("Initializing");
    await init();

    const term = new Terminal();

    const element = document.getElementById("app")!;
    term.open(element);
    term.onResize(console.log);
    term.writeln("Starting...");
    term.onData(console.error);

    console.log("Starting instance");

    const wasmer = new Wasmer();

    while (true) {
        await runInstance(term, wasmer, packageName, { args, uses });
        console.log("Rebooting...");
    }
}

async function runInstance(term: Terminal, wasmer: Wasmer, packageName: string, config: SpawnConfig) {
    const instance = await wasmer.spawn(packageName, config);
    term.clear();

    const stdin: WritableStreamDefaultWriter<Uint8Array> = instance.stdin!.getWriter();
    term.onData(line => { stdin.write(encoder.encode(line)); });

    const stdout: ReadableStreamDefaultReader<Uint8Array> = instance.stdout.getReader();
    copyStream(stdout, line => term.write(line));

    const stderr: ReadableStreamDefaultReader<Uint8Array> = instance.stderr.getReader();
    copyStream(stderr, line => term.write(line));

    const { code } = await instance.wait();

    if (code != 0) {
        term.writeln(`\nExit code: ${code}`);
    }
}

async function copyStream(reader: ReadableStreamDefaultReader<Uint8Array>, cb: (line: string) => void) {
    const decoder = new TextDecoder("utf-8");

    while(true) {
        const {done, value} = await reader.read();

        if (done || !value) {
            break;
        }
        const chunk = decoder.decode(value);
        cb(chunk);
    }
}

addEventListener("DOMContentLoaded", () => main());
