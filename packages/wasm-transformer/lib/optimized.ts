export * from "../wasm-pack/web/wasm_transformer";

// @ts-ignore
import init from "../wasm-pack/web/wasm_transformer";

export const wasmTransformerInit = async (passedWasmTransformerUrl: string) => {
  await init(passedWasmTransformerUrl);
};

export default wasmTransformerInit;
