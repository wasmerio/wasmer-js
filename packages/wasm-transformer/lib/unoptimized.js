import wasmTransformerWasmUrl from "../wasm-pack/web/wasm_transformer_bg.wasm";

import * as wasmTransformerWasmPack from "../wasm-pack/web/wasm_transformer";

const initPromise = wasmTransformerWasmPack.init(wasmTransformerWasmUrl);

export const lowerI64Imports = async wasmBinary => {
  await initPromise;
  return wasmTransformerWasmPack.lowerI64Imports(wasmBinary);
};

export const version = async () => {
  await initPromise;
  return wasmTransformerWasmPack.version();
};
