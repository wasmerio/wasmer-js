// @deno-types="./pkg/wasmer_wasix_js.d.ts"
import _init from "./pkg/wasmer_wasix_js.js";
// @deno-types="./pkg/wasmer_wasix_js.d.ts"
export * from "./pkg/wasmer_wasix_js";
export * from "./common";

let inited: Promise<any> | null = null;
export default async function init(...args: any[]) {
    if (inited === null) {
        inited = _init(...args);
    }
    await inited;
}
