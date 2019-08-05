import * as Comlink from "comlink";

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

class Process {
  commandOptions: CommandOptions;
  wasiCommand: WASICommand;
  dataCallback: Function;
  endCallback: Function;
  errorCallback: Function;
  initialStdin: string;

  constructor(
    commandOptions: CommandOptions,
    dataCallback: Function,
    endCallback: Function,
    errorCallback: Function,
    stdin?: Uint8Array
  ) {
    this.commandOptions = commandOptions;
    this.wasiCommand = new WASICommand(commandOptions);
    this.dataCallback = dataCallback;
    this.endCallback = endCallback;
    this.errorCallback = errorCallback;
    this.initialStdin = "";
    if (stdin) {
      this.initialStdin = new TextDecoder("utf-8").decode(stdin);
    }
  }

  async start() {
    // const commandStream = await this.wasiCommand.instantiate(this.initialStdin);
    const commandStream = await this.wasiCommand.instantiate();

    commandStream.on("data", (data: any) => {
      this.dataCallback(data);
    });

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

  receiveStdinChunk(data: any) {
    let dataString = new TextDecoder("utf-8").decode(data);
    this.initialStdin += dataString;
  }
}

Comlink.expose(Process);
