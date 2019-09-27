// The configuration options passed when creating the Wasm terminal

// A Custom command is a function that takes in a stdin string, and an array of argument strings,
// And returns an stdout string, or undefined.
export type CallbackCommand = (
  args: string[],
  stdin: string
) => Promise<string>;

type FetchCommandFunction = (
  commandName: string
) => Promise<Uint8Array | CallbackCommand>;

export default class WasmTerminalConfig {
  fetchCommand: FetchCommandFunction;
  processWorkerUrl?: string;

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

    // Assign our values
    this.fetchCommand = config.fetchCommand;
    this.processWorkerUrl = config.processWorkerUrl;
  }
}
