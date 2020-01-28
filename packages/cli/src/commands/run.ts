import { Command } from "../command";
import { WASI } from "@wasmer/wasi";
import nodeBindings from "@wasmer/wasi/lib/bindings/node";
import { lowerI64Imports } from "@wasmer/wasm-transformer";
import * as fs from "fs";

const runWasiModule = (args, flags) => {
  const preopens: { [key: string]: string } = {};
  if (flags.dir) {
    flags.dir.forEach(dir => {
      preopens[dir] = dir;
    });
  }
  if (flags.mapdir) {
    flags.mapdir.forEach(dir => {
      const [wasm, host] = dir.split(":");
      if (!wasm || !host) {
        this.error(
          "Options to --mapdir= need to be in the format wasmDir:hostDir"
        );
      }
      preopens[wasm] = host;
    });
  }
  let wasiArgs = this.argv.filter((arg: string) => {
    if (arg.startsWith("--dir")) {
      return false;
    }
    return true;
  });
  // wasiArgs = [`wasmer-js run ${wasiArgs[0]}`, ...wasiArgs.splice(1)];

  // If we find a `--`, we try to get only the arguments after
  const indexLimit = wasiArgs.indexOf("--");
  if (indexLimit > 0) {
    wasiArgs = [wasiArgs[0], ...wasiArgs.splice(indexLimit + 1)];
  }

  const wasi = new WASI({
    args: wasiArgs,
    bindings: {
      ...nodeBindings,
      fs
    },
    env: {},
    preopens
  });

  const wasmBytes = fs.readFileSync(args.file);
  const transformedBytes = await lowerI64Imports(wasmBytes);
  const { instance } = await WebAssembly.instantiate(transformedBytes, {
    wasi_unstable: wasi.wasiImport
  });
  wasi.start(instance);
};

const runCommand = new Command({
  name: "run",
  description: "Run a WebAssembly file with Wasmer-JS",
  run: runWasiModule,
  getHelpBody: () => {}
});
