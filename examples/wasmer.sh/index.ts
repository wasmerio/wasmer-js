import "xterm/css/xterm.css";

import type { Instance } from "@wasmer/sdk";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const encoder = new TextEncoder();

async function main() {
    // Note: We dynamically import the Wasmer SDK to make sure the bundler puts
    // it in its own chunk. This works around an issue where just importing
    // xterm.js runs top-level code which accesses the DOM, and if it's in the
    // same chunk as @wasmer/sdk, each Web Worker will try to run this code and
    // crash.
    // See https://github.com/wasmerio/wasmer-js/issues/373
    const { Wasmer, init, initializeLogger } = await import("@wasmer/sdk");

    await init();
    initializeLogger("debug");

    const term = new Terminal({ cursorBlink: true, convertEol: true });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(document.getElementById("terminal")!);
    fit.fit();

    term.writeln("Starting...");
    const pkg = await Wasmer.fromRegistry("sharrattj/bash");
    term.reset();
    const instance = await pkg.entrypoint!.run();
    connectStreams(instance, term);
}

function connectStreams(instance: Instance, term: Terminal) {
    const stdin = instance.stdin?.getWriter();
    term.onData(data => stdin?.write(encoder.encode(data)));
    instance.stdout.pipeTo(new WritableStream({ write: chunk => term.write(chunk) }));
    instance.stderr.pipeTo(new WritableStream({ write: chunk => term.write(chunk) }));
}

main();
