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
  wasiCommand: WASICommand;
  dataCallback: Function;
  endCallback: Function;
  errorCallback: Function;
  receivedStdinData: Uint8Array;

  constructor(
    commandOptions: CommandOptions,
    dataCallback: Function,
    endCallback: Function,
    errorCallback: Function
  ) {
    this.commandOptions = commandOptions;
    this.wasiCommand = new WASICommand(commandOptions);
    this.dataCallback = dataCallback;
    this.endCallback = endCallback;
    this.errorCallback = errorCallback;
    this.receivedStdinData = new Uint8Array(0);

    this.wasiCommand = new WASICommand(commandOptions);
  }

  async start(pipedStdinData?: Uint8Array) {
    const commandStream = await this.wasiCommand.instantiate(pipedStdinData);

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

  receiveStdinChunk(data: Uint8Array) {
    const newReceivedStdinData = new Uint8Array(
      data.length + this.receivedStdinData.length
    );
    newReceivedStdinData.set(this.receivedStdinData);
    newReceivedStdinData.set(data, this.receivedStdinData.length);
    this.receivedStdinData = newReceivedStdinData;
  }
}
