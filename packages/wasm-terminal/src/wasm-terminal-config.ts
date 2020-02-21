// The configuration options passed when creating the Wasm terminal

import { WasmFs } from "@wasmer/wasmfs";
import CommandOptions from "./command/command-options";

// A Custom command is a function that takes in a stdin string, and an array of argument strings,
// And returns an stdout string, or undefined.
export type CallbackCommand = (
  args: string[],
  stdin: string
) => Promise<string>;

type FetchCommandFunction = (options: {
  args: Array<string>,
  env?: {[key: string]: string}
}) => Promise<Uint8Array | CallbackCommand | CommandOptions>;

export default class WasmTerminalConfig {
  fetchCommand: FetchCommandFunction;
  processWorkerUrl?: string;

  wasmFs: WasmFs;

  constructor(config: any) {
    if (!config) {
      throw new Error("You must provide a config for the Wasm terminal.");
    }

    if (!config.fetchCommand) {
      throw new Error(
        "You must provide a fetchCommand for the Wasm terminal config, to handle fetching commands to be run"
      );
    }

    if (!config.processWorkerUrl) {
      console.warn(
        "Note: It is HIGHLY reccomended you pass in the processWorkerUrl in the terminal config to create process workers. Without this, some wasi programs will not work."
      );
    }

    /*ROLLUP_REPLACE_INLINE
    if (config.processWorkerUrl) {
      console.warn(
        "The unoptimized bundle of wasm-terminal is currently being used. The process worker does not need to be passed, as it is already inlined into the bundle. If you would like to pass in the process worker url and improve performance, please use the optimized bundle. Instructions can be found in the documentation."
      );
    }
    ROLLUP_REPLACE_INLINE*/

    // Assign our values
    this.fetchCommand = config.fetchCommand;
    this.processWorkerUrl = config.processWorkerUrl;

    if (config.wasmFs) {
      this.wasmFs = config.wasmFs;
    } else {
      this.wasmFs = new WasmFs();
    }
  }
}
