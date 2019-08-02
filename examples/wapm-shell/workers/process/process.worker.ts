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
  wasiCommand: WASICommand;
  commandStreamPromise: Promise<Duplex>;
  dataCallback: Function;
  endCallback: Function;
  errorCallback: Function;

  constructor(
    commandOptions: CommandOptions,
    dataCallback: Function,
    endCallback: Function,
    errorCallback: Function,
    stdin?: string
  ) {
    this.wasiCommand = new WASICommand(commandOptions);
    this.dataCallback = dataCallback;
    this.endCallback = endCallback;
    this.errorCallback = errorCallback;
    this.commandStreamPromise = this.wasiCommand.instantiate(stdin);
  }

  async start() {
    const commandStream = await this.commandStreamPromise;

    commandStream.on("data", (data: any) => {
      this.dataCallback(data);
    });

    commandStream.on("end", () => {
      this.endCallback();
    });

    try {
      this.wasiCommand.run();
    } catch (e) {
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

Comlink.expose(Process);
