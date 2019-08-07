import { Duplex, PassThrough } from "stream";

import { WASIExitError, WASIKillError } from "../../../../lib/bindings/browser";

import { CommandOptions } from "../../services/command-runner/command";

import WASICommand from "./wasi-command";

const merge = (...streams: Duplex[]) => {
  let pass = new PassThrough();
  let waiting = streams.length;
  for (let stream of streams) {
    pass = stream.pipe(
      pass,
      { end: false }
    );
    stream.once("end", () => --waiting === 0 && pass.emit("end"));
  }
  return pass;
};

export default class Process {
  commandOptions: CommandOptions;
  dataCallback: Function;
  endCallback: Function;
  errorCallback: Function;
  sharedStdin?: Int32Array;
  stdinReadCallback?: Function;

  wasiCommand: WASICommand;

  constructor(
    commandOptions: CommandOptions,
    dataCallback: Function,
    endCallback: Function,
    errorCallback: Function,
    sharedStdinBuffer?: SharedArrayBuffer,
    stdinReadCallback?: Function
  ) {
    this.commandOptions = commandOptions;
    this.dataCallback = dataCallback;
    this.endCallback = endCallback;
    this.errorCallback = errorCallback;

    let sharedStdin: Int32Array | undefined = undefined;
    if (sharedStdinBuffer) {
      sharedStdin = new Int32Array(sharedStdinBuffer);
    }

    this.wasiCommand = new WASICommand(
      commandOptions,
      sharedStdin,
      stdinReadCallback
    );
  }

  async start(pipedStdinData?: Uint8Array) {
    const commandStream = await this.wasiCommand.instantiate(
      this.dataCallback,
      pipedStdinData
    );

    commandStream.on("end", () => {
      this.endCallback();
    });

    try {
      this.wasiCommand.run();
    } catch (e) {
      console.log("ERROR", e);
      let error = "Uknown Error";

      if (e instanceof WASIExitError) {
        error = `exited with code: ${e.code}`;
      } else if (e instanceof WASIKillError) {
        error = `killed with signal: ${e.signal}`;
      }

      this.errorCallback(error);
    }
  }
}
