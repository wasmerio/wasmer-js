import { WasmFs } from "@wasmer/wasmfs";

import CommandOptions from "../command/command-options";
import Command from "../command/command";
import WASICommand from "../command/wasi-command";
import CallbackCommand from "../command/callback-command";

export default class Process {
  commandOptions: CommandOptions;
  wasmFs: WasmFs;
  originalWasmFsJson: any;
  dataCallback: Function;
  endCallback: Function;
  errorCallback: Function;
  sharedStdin?: Int32Array;
  startStdinReadCallback?: Function;

  command: Command;

  constructor(
    commandOptions: CommandOptions,
    wasmFsJson: any,
    dataCallback: Function,
    endCallback: Function,
    errorCallback: Function,
    sharedStdinBuffer?: SharedArrayBuffer,
    startStdinReadCallback?: Function
  ) {
    this.commandOptions = commandOptions;

    this.wasmFs = new WasmFs();
    this.wasmFs.fromJSON(wasmFsJson);
    this.originalWasmFsJson = wasmFsJson;

    this.dataCallback = dataCallback;
    this.endCallback = endCallback;
    this.errorCallback = errorCallback;

    let sharedStdin: Int32Array | undefined = undefined;
    if (sharedStdinBuffer) {
      sharedStdin = new Int32Array(sharedStdinBuffer);
    }

    if (commandOptions.module) {
      this.command = new WASICommand(
        commandOptions,
        this.wasmFs,
        sharedStdin,
        startStdinReadCallback
      );
    } else {
      this.command = new CallbackCommand(commandOptions, this.wasmFs);
    }
  }

  async start(pipedStdinData?: Uint8Array) {
    const end = () => {
      setTimeout(() => {
        this.endCallback(this.wasmFs.toJSON());
      }, 50);
    };

    try {
      await this.command.run(pipedStdinData, this.dataCallback);
      end();
    } catch (e) {
      if (e.code === 0) {
        // Command was successful, but ended early.
        end();
        // Set timeout to allow any lingering data callback to be launched out
        return;
      }

      let error = "Unknown Error";

      if (e.code !== undefined) {
        error = `exited with code: ${e.code}`;
      } else if (e.signal !== undefined) {
        error = `killed with signal: ${e.signal}`;
      } else if (e.user !== undefined) {
        error = e.message;
      }
      console.error(e);
      this.errorCallback(error, this.wasmFs.toJSON());
    }
  }
}
