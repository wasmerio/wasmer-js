export * from "./";
import {
  init as load,
  InitOutput,
  WasmerInitInput,
} from "./";
import fs from 'node:fs';

/**
 * Initialize the underlying WebAssembly module, defaulting to an embedded
 * copy of the `*.wasm` file.
 */
export const init = async (initValue?: WasmerInitInput): Promise<InitOutput> => {
  if (!initValue) {
    initValue = {}
  }

  if (!initValue.module) {
    const path = new URL('wasmer_js_bg.wasm', import.meta.url).pathname;
    initValue.module = fs.readFileSync(path);
  }
  return load(initValue);
};
