/* tslint:disable */
/**
 * i64 lowering that can be done by the browser
 * @param {any} passed_wasm_binary
 * @returns {any}
 */
export function lower_i64_imports(passed_wasm_binary: any): any;

/**
 * If `module_or_path` is {RequestInfo}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
 *
 * @returns {Promise<any>}
 */
export default function init(
  module_or_path?: RequestInfo | BufferSource | WebAssembly.Module
): Promise<any>;
