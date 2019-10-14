/*ROLLUP_REPLACE_INLINE
import wasmTransformerWasmUrl from '../wasm-pack/web/wasm_transformer_bg.wasm'; 
ROLLUP_REPLACE_INLINE*/

export * from "../wasm-pack/web/wasm_transformer";

import init from "../wasm-pack/web/wasm_transformer";

const wasmTransformerInit = async passedWasmTransformerUrl => {
  let initWasmTransformerWasmUrl = passedWasmTransformerUrl;

  // If we inline it, used the inlined version, error if they pass a URL
  /*ROLLUP_REPLACE_INLINE
  if (passedWasmTransformerUrl) {
    throw new Error('You are currently using the inlined version of wasm-transformer. If you want to pass the wasm-transformer Wasm URL manually, please take a look at the documentation, and use that version instead.');
  }
  initWasmTransformerWasmUrl = wasmTransformerWasmUrl;
  ROLLUP_REPLACE_INLINE*/

  await init(initWasmTransformerWasmUrl);
};

export default wasmTransformerInit;
