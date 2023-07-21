// @deno-types="./pkg/wasmer_wasix_js.d.ts"
import _init, { InitInput } from "./pkg/wasmer_wasix_js.js";
// @deno-types="./pkg/wasmer_wasix_js.d.ts"
export * from "./pkg/wasmer_wasix_js.js";
// @ts-ignore
export * from "./common.ts";

let inited: Promise<any> | null = null;
export default async function init(module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory, force?: boolean) {
    if (typeof crossOriginIsolated === "boolean" && !crossOriginIsolated) {
        // better error message for web when not in a cross-origin-isolated context
        console.error('@wasmer/wasix uses features that may only be available in a cross-origin-isolated context, read more here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy#certain_features_depend_on_cross-origin_isolation');
    }
    if (inited === null || force === true) {
        inited = _init(module_or_path, maybe_memory);
    }
    await inited;
}
