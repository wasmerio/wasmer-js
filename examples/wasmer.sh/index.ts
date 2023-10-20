import "xterm/css/xterm.css";

import { Instance, SpawnConfig, Tty, Wasmer, init } from "@wasmer/wasix";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const encoder = new TextEncoder();

async function main() {
    await init();

    // Create a terminal
    const term = new Terminal({ cursorBlink: true, convertEol: true });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(document.getElementById("terminal")!);
    fit.fit();

    const wasmer = new Wasmer();

    // Create a TTY and attach it to the terminal
    const tty = new Tty();
    tty.state = {...tty.state, cols: term.cols, rows: term.rows};
    term.onResize(({cols, rows}) => {
        tty.state = {...tty.state, cols, rows};
    });
    wasmer.runtime().set_tty(tty);

    term.writeln("Starting...");

    while (true) {
        const instance = await wasmer.spawn("sharrattj/bash", {
            args: [],
            uses: ["python/python@0.1.0"],
        });

        // Connect stdin/stdout/stderr to the terminal
        const stdin: WritableStreamDefaultWriter<Uint8Array> = instance.stdin!.getWriter();
        term.onData(line => { stdin.write(encoder.encode(line)); });
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

async function copyStream(reader: ReadableStream, term: Terminal) {
    const writer = new WritableStream({ write: chunk => term.write(chunk) });
    reader.pipeTo(writer);

}

addEventListener("DOMContentLoaded", () => main());
