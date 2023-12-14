export * from "./pkg/wasmer_js";
// @ts-ignore
import load, { InitInput, InitOutput, ThreadPoolWorker } from "./pkg/wasmer_js";

/**
 * Initialize the underlying WebAssembly module.
 */

export const init = async (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput> => {
    let regex = new RegExp("^(https?:\/\/unpkg\.com\/@wasmer\/sdk(@[^/\?]*)?)(.*)\??(.*)");
    if (!module_or_path) {
        // Patch the unpkg url to load Wasmer from the right location
        let baseUrl = import.meta.url.match(regex);
        if (baseUrl) {
            let _version = baseUrl[2];
            let path = baseUrl[3];
            // If there's a path determined, then we don't need to calculate the wasm path
            if (!path) {
                module_or_path = new URL(`${baseUrl[1]}/dist/wasmer_js_bg.wasm`);
            }
        }
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
