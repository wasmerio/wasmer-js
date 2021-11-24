// @deno-types="./pkg/wasmer_wasi_js.d.ts"
import baseInit, { WASI } from "./pkg/wasmer_wasi_js.js";
// @deno-types="./pkg/wasmer_wasi_js.d.ts"
export { WASI } from "./pkg/wasmer_wasi_js.js";
export const init = async () => {
    await baseInit();
} 
