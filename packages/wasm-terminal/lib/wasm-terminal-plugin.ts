interface WasmTerminalPluginConfig {
  [commandOption: string]: any;
}

// A Custom command is a function that takes in a stdin string, and an array of argument strings,
// And returns an stdout string, or undefined.
export type CallbackCommand = (
  args: string[],
  stdin: string
) => Promise<string | undefined>;

export default class WasmTerminalPlugin {
  afterOpen?: () => void;
  beforeFetchCommand?: (
    commandName: string
  ) => Uint8Array | CallbackCommand | undefined;
  afterFetchCommand?: (
    commandName: string,
    commandBinary: Uint8Array
  ) => Uint8Array;
  afterDestroy?: () => void;

  constructor(config: WasmTerminalPluginConfig) {
    if (config.afterOpen) {
      this.afterOpen = config.afterOpen;
    }
    if (config.beforeFetchCommand) {
      this.beforeFetchCommand = config.beforeFetchCommand;
    }
    if (config.afterFetchCommand) {
      this.afterFetchCommand = config.afterFetchCommand;
    }
    if (config.afterDestroy) {
      this.afterDestroy = config.afterDestroy;
    }
  }
}
