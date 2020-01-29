import { Command } from "../command";
import { WASI } from "@wasmer/wasi";
import nodeBindings from "@wasmer/wasi/lib/bindings/node";
import { lowerI64Imports } from "@wasmer/wasm-transformer";
import * as fs from "fs";

const runWasiModule = async (args: string[], flags: any) => {
  if (args.length === 0) {
    runCommand.help();
    return;
  }

  const wasmModuleFileToRun = args[0];

  let dirFlag = [];
  if (flags.dir) {
    if (typeof flags.dir === "string") {
      dirFlag.push(flags.dir);
    } else {
      dirFlag = flags.dir;
    }
  }

  let mapdirFlag = [];
  if (flags.mapdir) {
    if (typeof flags.mapdir === "string") {
      mapdirFlag.push(flags.mapdir);
    } else {
      mapdirFlag = flags.mapdir;
    }
  }

  const preopens: { [key: string]: string } = {};

  dirFlag.forEach((dir: string) => {
    preopens[dir] = dir;
  });

  mapdirFlag.forEach((dir: string) => {
    const [wasm, host] = dir.split(":");
    if (!wasm || !host) {
      console.error(
        "Options to --mapdir= need to be in the format wasmDir:hostDir"
      );
      process.exit(1);
    }
    preopens[wasm] = host;
  });

  // Pass non-recognized / remaining args to the wasi module
  const recognizedArgs = ["--dir", "--mapdir", wasmModuleFileToRun];
  const wasiArgs = process.argv.slice(3).filter((arg: string) => {
    return !recognizedArgs.some(recognizedArg => arg.startsWith(recognizedArg));
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

  const wasmBytes = fs.readFileSync(wasmModuleFileToRun);
  const transformedBytes = await lowerI64Imports(wasmBytes);
  const { instance } = await WebAssembly.instantiate(transformedBytes, {
    wasi_unstable: wasi.wasiImport
  });
  wasi.start(instance);
};

export const runCommand = new Command({
  name: "run",
  description: "Run a WebAssembly file with Wasmer-JS",
  runCallback: runWasiModule,
  getHelpBody: () => {
    return `
USAGE:
$ wasmer-js run [FILE]

ARGUMENTS:

[FILE] - The WASI compiled ".wasm" file we would like to run

FLAGS:

--dir=[some-directory] - WASI pre-opened directory. Can be passed multiple times for multiple directories.
--mapdir=[host-directory:guest-directory] - Map a host directory to a different location for the wasm module. Can be passed multiple times for multiple directories.
`;
  }
});
