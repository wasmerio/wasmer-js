export * from "./WasmerSDK";
import {
  init as load,
  InitInput,
  InitOutput,
  WasmerInitInput,
} from "./WasmerSDK";
// @ts-ignore
import wasm_bytes from "./pkg/wasmer_js_bg.wasm";

/**
 * Initialize the underlying WebAssembly module, defaulting to an embedded
 * copy of the `*.wasm` file.
 */
export const init = async (initValue: WasmerInitInput): Promise<InitOutput> => {
  if (!initValue.module) {
    // @ts-ignore
    initValue.module = await wasm_bytes();
  }
  return load(initValue);
};
