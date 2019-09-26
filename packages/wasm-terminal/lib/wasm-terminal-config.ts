// The configuration options passed when creating the Wasm terminal

import WasmTerminalPlugin from "./wasm-terminal-plugin";

export default class WasmTerminalConfig {
  wasmTransformerWasmUrl: string;
  processWorkerUrl?: string;

  constructor(config: any) {
    if (!config) {
      throw new Error("You must provide a config for the Wasm terminal.");
    }

    if (!config.wasmTransformerWasmUrl) {
      throw new Error(
        "You must provide a wasmTransformerUrl for the Wasm terminal config, to fetch the wasi transformer"
      );
    }

    if (!config.processWorkerUrl) {
      console.warn(
        "Note: It is HIGHLY reccomended you pass in the processWorkerUrl in the terminal config to create process workers. Without this, some wasi programs will not work."
      );
    }

    // Assign our values
    this.wasmTransformerWasmUrl = config.wasmTransformerWasmUrl;
    this.processWorkerUrl = config.processWorkerUrl;
  }
}
