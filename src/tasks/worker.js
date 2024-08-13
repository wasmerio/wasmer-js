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
  if (ev.data.type == "init") {
    const { memory, module, id, import_url } = ev.data;
    const imported = await import(new URL(import_url, self.location.origin));

    // HACK: How we load our imports will change depending on how the code
    // is deployed. If we are being used in "wasm-pack test" then we can
    // access the things we want from the imported object. Otherwise, if we
    // are being used from a bundler, chances are those things are no longer
    // directly accessible and we need to get them from the
    // __WASMER_INTERNALS__ object stashed on the global scope when the
    // package was imported.
    let init;
    let ThreadPoolWorker;
    if ("ThreadPoolWorker" in imported) {
      if ("default" in imported) {
        init = imported.default;
      } else if ("init" in imported) {
        init = imported.init;
      }
      ThreadPoolWorker = imported.ThreadPoolWorker;

      //await init(module, memory);
    } else {
      init = globalThis["__WASMER_INTERNALS__"].init;
      ThreadPoolWorker = globalThis["__WASMER_INTERNALS__"].ThreadPoolWorker;
    }

    if (globalThis["__WASMER_INIT__"]) {
      await init({ module: module, memory: memory });
    } else {
      await init(module, memory);
    }

    worker = new ThreadPoolWorker(id);

    // Now that we're initialized, we need to handle any buffered messages
    for (const msg of pendingMessages.splice(0, pendingMessages.length)) {
      await worker.handle(msg);
    }
  } else {
    // Handle the message like normal.
    await handleMessage(ev.data);
  }
};
