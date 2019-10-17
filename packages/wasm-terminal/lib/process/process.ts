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
      this.command = new CallbackCommand(commandOptions);
    }
  }

  async start(pipedStdinData?: Uint8Array) {
    if (this.command instanceof WASICommand) {
      await this.startWASICommand(pipedStdinData);
    } else if (this.command instanceof CallbackCommand) {
      await this.startCallbackCommand(pipedStdinData);
    }
  }

  async startWASICommand(pipedStdinData?: Uint8Array) {
    const commandStream = await this.command.instantiate(
      this.dataCallback,
      pipedStdinData
    );

    commandStream.on("end", () => {
      // TODO: Diff the two objects and only send that back
      const currentWasmFsJson = this.wasmFs.toJSON();
      this.endCallback(currentWasmFsJson);
    });

    try {
      this.command.run();
    } catch (e) {
      let error = "Unknown Error";

      // TODO: Diff the two objects and only send that back
      const currentWasmFsJson = this.wasmFs.toJSON();

      if (e.code === 0) {
        // Command was successful, but ended early.
        this.endCallback(currentWasmFsJson);
        return;
      }

      if (e.code !== undefined) {
        error = `exited with code: ${e.code}`;
      } else if (e.signal !== undefined) {
        error = `killed with signal: ${e.signal}`;
      } else if (e.user !== undefined) {
        error = e.message;
      }

      this.errorCallback(error, currentWasmFsJson);
    }
  }

  async startCallbackCommand(pipedStdinData?: Uint8Array) {
    let stdin = "";
    if (pipedStdinData) {
      stdin = new TextDecoder("utf-8").decode(pipedStdinData);
    }

    try {
      const stdout = await this.command.run(stdin);
      const stdoutAsTypedArray = new TextEncoder().encode(stdout + "\n");
      this.dataCallback(stdoutAsTypedArray);
      // TODO: Diff the two objects and only send that back
      const currentWasmFsJson = this.wasmFs.toJSON();
      this.endCallback(currentWasmFsJson);
    } catch (e) {
      this.errorCallback("There was an error running the callback command");
    }
  }
}
