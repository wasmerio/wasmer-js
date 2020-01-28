import { Command } from "../command";
import { WASI } from "@wasmer/wasi";
import nodeBindings from "@wasmer/wasi/lib/bindings/node";
import { lowerI64Imports } from "@wasmer/wasm-transformer";
import * as fs from "fs";

/*
const runWasiModule = async (args: string[], flags: Object) => {

  const preopens: { [key: string]: string } = {};
  if (flags.dir) {
    flags.dir.forEach((dir: string) => {
      preopens[dir] = dir;
    });
  }
  if (flags.mapdir) {
    flags.mapdir.forEach((dir: string) => {
      const [wasm, host] = dir.split(":");
      if (!wasm || !host) {
        throw new Error(
          "Options to --mapdir= need to be in the format wasmDir:hostDir"
        );
      }
      preopens[wasm] = host;
    });
  }
  let wasiArgs = Object.keys(flags).filter((arg: string) => {
    if (arg.startsWith("--dir")) {
      return false;
    }
    return true;
  });

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
}
 */

export const runCommand = new Command({
  name: "run",
  description: "Run a WebAssembly file with Wasmer-JS",
  runCallback: () => {},
  getHelpBody: () => {
    return "yo";
  }
});
