export * from "./WasmerSDK";
import {
  init as load,
  InitInput,
  InitOutput,
  WasmerInitInput,
} from "./WasmerSDK";
// @ts-ignore

import fs from 'node:fs';

/**
 * Initialize the underlying WebAssembly module, defaulting to an embedded
 * copy of the `*.wasm` file.
 */
export const init = async (initValue: WasmerInitInput | undefined): Promise<InitOutput> => {
  if (!initValue) {
	initValue = {}
  }

  if (!initValue.module) {
    const path = new URL('./wasmer_js_bg.wasm', import.meta.url).pathname;
    initValue.module = fs.readFileSync(path);
  }
  return load(initValue);
};
