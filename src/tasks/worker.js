Error.stackTraceLimit = 50;
globalThis.onerror = console.error;

let pendingMessages = [];
let handleMessage = async data => {
    // We start off by buffering up all messages until we finish initializing.
    pendingMessages.push(data);
};

globalThis.onmessage = async ev => {
    if (ev.data.type == "init") {
        const { memory, module, id } = ev.data;
        const { default: init, WorkerState } = await import("$IMPORT_META_URL");
        await init(module, memory);

        const worker = new WorkerState(id);

        // Now that we're initialized, we can switch over to the "real" handler
        // function and handle any buffered messages
        handleMessage = msg => worker.handle(msg);
        for (const msg of pendingMessages.splice(0, pendingMessages.length)) {
            await handleMessage(msg);
        }
    } else {
        // Handle the message like normal.
        await handleMessage(ev.data);
    }
};

