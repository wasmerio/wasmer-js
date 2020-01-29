// @ts-ignore
import wasmTransformerWasmUrl from "../wasm-pack/web/wasm_transformer_bg.wasm";

// @ts-ignore
import * as wasmTransformerWasmPack from "../wasm-pack/web/wasm_transformer";

import { bigInt } from "wasm-feature-detect";

// @ts-ignore
const initPromise = wasmTransformerWasmPack.default(wasmTransformerWasmUrl);

export const lowerI64Imports = async (wasmBinary: Uint8Array) => {
  let isBigIntSupported = await bigInt();
  if (isBigIntSupported) {
    return wasmBinary;
  }

  await initPromise;
  return wasmTransformerWasmPack.lowerI64Imports(wasmBinary);
};

export const version = async () => {
  await initPromise;
  return wasmTransformerWasmPack.version();
};
