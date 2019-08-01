import * as Comlink from "comlink";

import { Duplex, PassThrough } from "stream";

import { CommandOptions } from "../../services/command/command";

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

const constructStdinRead = () => {
  let readCounter = 0;
  return (
    buf: Buffer | Uint8Array,
    offset: number = 0,
    length: number = buf.byteLength,
    position?: number
  ) => {
    if (readCounter !== 0) {
      readCounter = ++readCounter % 3;
      return 0;
    }
    let input = prompt("Input: ");
    if (input === null || input === "") {
      readCounter++;
      return 0;
    }
    let buffer = Buffer.from(input, "utf-8");
    for (let x = 0; x < buffer.length; ++x) {
      buf[x] = buffer[x];
    }
    readCounter++;
    return buffer.length + 1;
  };
};

class Process {
  wasiCommand: WASICommand;
  commandStreamPromise: Promise<Duplex>;
  dataCallback: Function;

  constructor(
    commandOptions: CommandOptions,
    dataCallback: Function,
    stdin?: string
  ) {
    this.wasiCommand = new WASICommand(commandOptions);
    this.dataCallback = dataCallback;
    this.commandStreamPromise = this.wasiCommand.instantiate(stdin);

    console.log("We in da worker!");
    console.log("wasi command", this.wasiCommand);
    console.log("command options", commandOptions);
  }

  async start() {
    const commandStream = await this.commandStreamPromise;

    this.dataCallback("yooo");

    console.log("started");
  }
}

Comlink.expose(Process);
