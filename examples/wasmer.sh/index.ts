import "xterm/css/xterm.css";

import { SpawnConfig, Tty, Wasmer, init } from "@wasmer/wasix";
import { Terminal } from "xterm";

const encoder = new TextEncoder();

const packageName = "sharrattj/bash";
const args: string[] = [];
const uses: string[] = ["sharrattj/coreutils"];

async function main() {
    await init();

    const term = new Terminal({ cursorBlink: true, convertEol: true });

    const element = document.getElementById("app")!;
    term.open(element);

    term.writeln("Starting...");
    const wasmer = new Wasmer();

    // Attach the TTY
    const tty = new Tty();
    tty.state = {...tty.state, cols: term.cols, rows: term.rows};
    term.onResize(({cols, rows}) => {
        tty.state = {...tty.state, cols, rows};
    });
    wasmer.runtime().set_tty(tty);

    while (true) {
        await runInstance(term, wasmer, packageName, { args, uses });
        term.writeln("Rebooting...");
    }
}

async function runInstance(term: Terminal, wasmer: Wasmer, packageName: string, config: SpawnConfig) {
    const instance = await wasmer.spawn(packageName, config);
    term.clear();

    const stdin: WritableStreamDefaultWriter<Uint8Array> = instance.stdin!.getWriter();
    term.onData(line => { stdin.write(encoder.encode(line)); });

    const stdout: ReadableStreamDefaultReader<Uint8Array> = instance.stdout.getReader();
    copyStream(stdout, line => writeMultiline(term, line));

    const stderr: ReadableStreamDefaultReader<Uint8Array> = instance.stderr.getReader();
    copyStream(stderr, line => writeMultiline(term, line));

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

function writeMultiline(term: Terminal, text: string) {
    term.write(text);
    return;
    const lines = text.split("\n").map(l => l.trimEnd());

    if (lines.length == 1) {
        term.write(text);
    } else {
        for (const line of lines) {
            term.writeln(line);
        }
    }
}

addEventListener("DOMContentLoaded", () => main());
