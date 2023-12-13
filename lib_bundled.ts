export * from "./lib";
// @ts-ignore
import { init as load, InitInput, InitOutput, ThreadPoolWorker } from "./lib";
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
