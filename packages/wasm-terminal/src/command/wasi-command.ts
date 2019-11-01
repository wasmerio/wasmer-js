// The class for WASI Commands
import { WASI } from "@wasmer/wasi";
import { WasmFs } from "@wasmer/wasmfs";

import Command from "./command";
import CommandOptions from "./command-options";

export default class WASICommand extends Command {
  wasi: WASI;
  wasmFs: WasmFs;
  module: WebAssembly.Module;

  constructor(options: CommandOptions, wasmFs: WasmFs) {
    super(options);

    // Bind our stdinRead / stdoutWrite
    this.wasmFs = wasmFs;

    if (!options.module) {
      throw new Error("Did not find a WebAssembly.Module for the WASI Command");
    }
    this.module = options.module;
  }

  async run() {
    const wasi = new WASI({
      preopenDirectories: {
        "/": "/"
      },
      env: this.options.env,
      args: this.options.args,
      bindings: {
        ...WASI.defaultBindings,
        fs: this.wasmFs.fs
      }
    });

    let instance = await WebAssembly.instantiate(this.module, {
      wasi_unstable: wasi.wasiImport
    });
    wasi.start(instance);
  }
}
