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
    const options = {
      preopens: {
        ".": ".",
        "/": "/",
        ...(this.options.preopens || {})
      },
      env: this.options.env,
      args: this.options.args,
      bindings: {
        ...WASI.defaultBindings,
        fs: wasmFs.fs
      }
    };
    const wasi = new WASI(options);
    let wasmModule = this.options.module as WebAssembly.Module;
    let instance = await WebAssembly.instantiate(wasmModule, {
      ...wasi.getImports(wasmModule)
    });
    wasi.start(instance);
  }
}
