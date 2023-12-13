export * from "./lib";
// @ts-ignore
import { init as load, InitInput, InitOutput, ThreadPoolWorker } from "./lib";
// @ts-ignore
import wasm_bytes from "./pkg/wasmer_js_bg.wasm";


/**
 * Initialize the underlying WebAssembly module.
 */

export const init = async (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput> => {
    if (!module_or_path) {
        // @ts-ignore
        module_or_path = await wasm_bytes();
    }
    return load(module_or_path, maybe_memory);
}
