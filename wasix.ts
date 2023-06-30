// @deno-types="./pkg/wasmer_wasix_js.d.ts"
import _init from "./pkg/wasmer_wasix_js.js";
// @deno-types="./pkg/wasmer_wasix_js.d.ts"
export { WASI, type WasiConfig, MemFS, JSVirtualFile, type JSTty, JSTtyState } from "./pkg/wasmer_wasix_js.js";

let inited: Promise<any> | null = null;
export const init = async (force?: boolean) => {
    if (inited === null || force === true) {
        inited = _init();
    }
    await inited;
}

export default init;
