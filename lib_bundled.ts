export * from "./lib";
// @ts-ignore
import load, { InitInput, InitOutput, ThreadPoolWorker } from "./pkg/wasmer_js";
import wasm_bytes from "./pkg/wasmer_js_bg.wasm";


/**
 * Initialize the underlying WebAssembly module.
 */
export const init = (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput> => {
    if (!module_or_path) {
        module_or_path = wasm_bytes;
    }
    return load(module_or_path, maybe_memory);
}

// HACK: We save these to the global scope because it's the most reliable way to
// make sure worker.js gets access to them. Normal exports are removed when
// using a bundler.
(globalThis as any)["__WASMER_INTERNALS__"] = { ThreadPoolWorker, init };

// HACK: some bundlers such as webpack uses this on dev mode.
// We add this functions to allow dev mode work in those bundlers.
(globalThis as any).$RefreshReg$ = (globalThis as any).$RefreshReg$ || function () {/**/ };
(globalThis as any).$RefreshSig$ = (globalThis as any).$RefreshSig$ || function () { return function () { } };
