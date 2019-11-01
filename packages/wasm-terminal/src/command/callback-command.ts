import Command from "./command";
import CommandOptions from "./command-options";
import { WasmFs } from "@wasmer/wasmfs";

// The class for WASI Commands
export default class CallbackCommand extends Command {
  callback: Function;
  stdoutCallback?: Function;

  constructor(options: CommandOptions) {
    super(options);

    if (!options.callback) {
      throw new Error(
        "The Command Options provided are not for a Callback Command"
      );
    }

    this.callback = options.callback;
  }

  async run(wasmFs: WasmFs) {
    // let myArr = new Uint8Array(1024);
    // let pipedStdinData = this.wasmFs.fs.readSync(0, myArr, 0, 1024, 0);
    let str = await Promise.resolve(this.callback(this.options, wasmFs));
    if (typeof str == "string") {
      wasmFs.fs.writeFileSync(
        "/dev/stdout",
        new TextEncoder().encode(str + "\n")
      );
    }
  }
}
