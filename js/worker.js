// import init,{start}from'../worker/pkg/worker.js';await init();await start()

// console.log("pool::worker(entry) started");
globalThis.onmessage = async ev => {
    if (ev.data.length == 4) {
        let [module, memory, state, mainJS] = ev.data;
        const {
            default: init,
            worker_entry_point,
        } = await import(mainJS);
        await init(module, memory);
        worker_entry_point(state);
    } else {
        try {
            // There shouldn't be any additional messages after the first so we
            // need to unhook it
            globalThis.onmessage = ev => {
                console.error("wasm threads can only run a single process then exit", ev);
            }
            let [module, memory, ctx, mainJS, wasm_module, wasm_memory] = ev.data;
            const {
                default: init,
                wasm_entry_point,
            } = await import(mainJS);
            await init(module, memory);
            wasm_entry_point(ctx, wasm_module, wasm_memory);
        } finally {
            //Terminate the worker
            close();
        }
    }
}
