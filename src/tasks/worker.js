Error.stackTraceLimit = 50;
globalThis.onerror = console.error;

let pendingMessages = [];
let worker = undefined;
let handleMessage = async data => {
    if (worker) {
        await worker.handle(data);
    } else {
        // We start off by buffering up all messages until we finish initializing.
        pendingMessages.push(data);
    }
};

globalThis.onmessage = async ev => {
    console.log(globalThis.name, ev.data);

    if (ev.data.type == "init") {
        const { memory, module, id } = ev.data;
        const imported = await import("$IMPORT_META_URL");

        // HACK: How we load our imports will change depending on how the code
        // is deployed. If we are being used in "wasm-pack test" then we can
        // access the things we want from the imported object. Otherwise, if we
        // are being used from a bundler, chances are those things are no longer
        // directly accessible and we need to get them from the
        // __WASMER_INTERNALS__ object stashed on the global scope when the
        // package was imported.
        let init;
        let WorkerState;

        if ('default' in imported && 'WorkerState' in imported) {
            init = imported.default;
            WorkerState = imported.WorkerState;
        } else {
            init = globalThis["__WASMER_INTERNALS__"].init;
            WorkerState = globalThis["__WASMER_INTERNALS__"].WorkerState;
        }

        await init(module, memory);

        worker = new WorkerState(id);

        // Now that we're initialized, we need to handle any buffered messages
        for (const msg of pendingMessages.splice(0, pendingMessages.length)) {
            await worker.handle(msg);
        }
    } else {
        // Handle the message like normal.
        await handleMessage(ev.data);
    }
};

