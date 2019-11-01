import CommandOptions from "./command-options";

export default class Command {
  args: string[];
  env: { [key: string]: string };

  constructor({ args, env }: CommandOptions) {
    this.args = args;
    this.env = env;
  }
  async run(pipedStdinData?: Uint8Array, stdoutCallback?: Function) {
    throw new Error("run not implemented by the Command subclass");
  }
}
