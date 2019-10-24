import Command from "./command";
import CommandOptions from "./command-options";

// The class for WASI Commands
export default class CallbackCommand extends Command {
  callback: Function;

  constructor(options: CommandOptions) {
    super(options);

    if (!options.callback) {
      throw new Error(
        "The Command Options provided are not for a Callback Command"
      );
    }

    this.callback = options.callback;
  }

  run(stdin?: string) {
    return this.callback(this.args, stdin);
  }
}
