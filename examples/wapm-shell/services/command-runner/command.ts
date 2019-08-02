// The Base Command class

import { Duplex } from "stream";

export type CommandOptions = {
  args: string[];
  env: { [key: string]: string };
  module: WebAssembly.Module;
};

export class Command {
  args: string[];
  env: { [key: string]: string };

  constructor({ args, env }: CommandOptions) {
    this.args = args;
    this.env = env;
  }
  run() {
    throw new Error("Not implemented");
  }
  instantiate(stdin?: string): Promise<Duplex> | Duplex {
    throw new Error("Not implemented");
  }
  getStdout(): string {
    throw new Error("Not implemented");
  }
  async kill() {}
}
