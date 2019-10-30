import { Duplex } from "stream";
import CommandOptions from "./command-options";

export default class Command {
  args: string[];
  env: { [key: string]: string };

  constructor({ args, env }: CommandOptions) {
    this.args = args;
    this.env = env;
  }
  run(stdin?: string) {
    throw new Error("Not implemented by the Command subclass");
  }
  instantiate(
    stdoutCallback?: Function,
    pipedStdinData?: Uint8Array
  ): Promise<Duplex> {
    throw new Error("Not implemented by the Command subclass");
  }
  async kill() {}
}
