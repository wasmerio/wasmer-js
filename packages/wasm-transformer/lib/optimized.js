export * from "../wasm-pack/web/wasm_transformer";

import init from "../wasm-pack/web/wasm_transformer";

export const wasmTransformerInit = async passedWasmTransformerUrl => {
  await init(passedWasmTransformerUrl);
};

export default wasmTransformerInit;
