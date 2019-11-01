// The class for WASI Commands
import { WASI } from "@wasmer/wasi";
import { WasmFs } from "@wasmer/wasmfs";

import Command from "./command";
import CommandOptions from "./command-options";

export default class WASICommand extends Command {
  constructor(options: CommandOptions) {
    super(options);

    if (!options.module) {
      throw new Error("Did not find a WebAssembly.Module for the WASI Command");
    }
  }

  async run(wasmFs: WasmFs) {
    const wasi = new WASI({
      preopenDirectories: {
        "/": "/"
      },
      env: this.options.env,
      args: this.options.args,
      bindings: {
        ...WASI.defaultBindings,
        fs: wasmFs.fs
      }
    });

    let instance = await WebAssembly.instantiate(this.options.module, {
      wasi_unstable: wasi.wasiImport
    });
    wasi.start(instance);
  }
}
