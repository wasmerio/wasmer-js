import WASI from "@wasmer/wasi";

import CommandOptions from "../command/command-options";
import Command from "../command/command";
import WASICommand from "../command/wasi-command";
import CallbackCommand from "../command/callback-command";

export default class Process {
  commandOptions: CommandOptions;
  dataCallback: Function;
  endCallback: Function;
  errorCallback: Function;
  sharedStdin?: Int32Array;
  startStdinReadCallback?: Function;

  command: Command;

  constructor(
    commandOptions: CommandOptions,
    dataCallback: Function,
    endCallback: Function,
    errorCallback: Function,
    sharedStdinBuffer?: SharedArrayBuffer,
    startStdinReadCallback?: Function
  ) {
    this.commandOptions = commandOptions;
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
      this.endCallback();
    });

    try {
      this.command.run();
    } catch (e) {
      if (e.code === 0) {
        // Command was successful, but ended early.
        this.endCallback();
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

      this.errorCallback(error);
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
      this.endCallback();
    } catch (e) {
      this.errorCallback("There was an error running the callback command");
    }
  }
}
