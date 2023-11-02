import "xterm/css/xterm.css";

import { Wasmer, init, initializeLogger } from "@wasmer/wasix";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const encoder = new TextEncoder();
const logFilter = ["info"].join(",");

async function main() {
    await init();
    initializeLogger(logFilter);

    // Create a terminal
    const term = new Terminal({ cursorBlink: true, convertEol: true });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(document.getElementById("terminal")!);
    fit.fit();

    const wasmer = new Wasmer();

    const runtime = wasmer.runtime();

    term.writeln("Starting...");

    while (true) {
        const instance = await wasmer.spawn("sharrattj/bash", {
            args: [],
            runtime,
        });

        // Connect stdin/stdout/stderr to the terminal
        const stdin: WritableStreamDefaultWriter<Uint8Array> = instance.stdin!.getWriter();
        term.onData(line => stdin.write(encoder.encode(line)));
        copyStream(instance.stdout, term);
        copyStream(instance.stderr, term);

        // Now, wait until bash exits
        const { code } = await instance.wait();

        if (code != 0) {
            term.writeln(`\nExit code: ${code}`);
            term.writeln("Rebooting...");
        }
    }
}

function copyStream(reader: ReadableStream<Uint8Array>, term: Terminal) {
    const writer = new WritableStream<Uint8Array>({
        write: chunk => { term.write(chunk); }
    });
    reader.pipeTo(writer);
}

addEventListener("DOMContentLoaded", () => main());
