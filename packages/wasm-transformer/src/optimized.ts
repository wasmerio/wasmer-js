// @ts-ignore
import * as wasmTransformerWasmPack from "../wasm-pack/web/wasm_transformer";

import { bigInt } from "wasm-feature-detect";

let isBigIntSupported = false;

export const wasmTransformerInit = async (passedWasmTransformerUrl: string) => {
  await wasmTransformerWasmPack.default(passedWasmTransformerUrl);
  isBigIntSupported = await bigInt();
};

export const lowerI64Imports = (wasmBinary: Uint8Array) => {
  if (isBigIntSupported) {
    return wasmBinary;
  }

  return wasmTransformerWasmPack.lowerI64Imports(wasmBinary);
};

export const version = () => {
  return wasmTransformerWasmPack.version();
};

export default wasmTransformerInit;
