import { Command } from "../command";
import { WASI } from "@wasmer/wasi";
import nodeBindings from "@wasmer/wasi/lib/bindings/node";
import { lowerI64Imports } from "@wasmer/wasm-transformer";
import { hash, createHash } from "blake3";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

const runWasiModule = async (flags: any) => {
  const args = flags._;
  if (args.length === 0 || args[0] === "help") {
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

  let envFlag = [];
  if (flags.env) {
    if (typeof flags.env === "string") {
      envFlag.push(flags.env);
    } else {
      envFlag = flags.env;
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
        "Error: Options to --mapdir= need to be in the format WASM_DIR:HOST_DIR"
      );
      process.exit(1);
    }
    preopens[wasm] = host;
  });

  const envVars: { [key: string]: string } = {};
  envFlag.forEach((env: string) => {
    const [key, value]: string[] = env.split(":");
    if (!key || !value) {
      console.error(
        "Error: Options to ---env= need to be in the format KEY=VALUE"
      );
      process.exit(1);
    }
    envVars[key] = value;
  });

  // Pass non-recognized / remaining args to the wasi module
  const recognizedArgs = ["--dir", "--mapdir", "--env", wasmModuleFileToRun];
  const wasiArgs = process.argv.slice(3).filter((arg: string) => {
    return !recognizedArgs.some(
      recognizedArg => arg.startsWith(recognizedArg) || arg === "--"
    );
  });
  // Add the wasm module to the front of the args.
  wasiArgs.unshift(wasmModuleFileToRun);

  const wasi = new WASI({
    args: wasiArgs,
    bindings: {
      ...nodeBindings,
      fs
    },
    env: envVars,
    preopens
  });
  let wasmBytes;
  try {
    wasmBytes = fs.readFileSync(wasmModuleFileToRun);
  } catch (e) {
    console.error(`Error: File ${wasmModuleFileToRun} not found.`);
    process.exit(1);
  }

  const tmpDir = os.tmpdir();
  const wasmerLoweredCacheDir = path.join(tmpDir, "wasmerjs-lowered-wasm");

  if (!fs.existsSync(wasmerLoweredCacheDir)) {
    fs.mkdirSync(wasmerLoweredCacheDir);
  }

  const hash = createHash();
  hash.update(wasmBytes);
  const digest = hash.digest().toString("hex");
  const loweredCachePath = path.join(wasmerLoweredCacheDir, digest);
  let transformedBytes;
  if (!fs.existsSync(loweredCachePath)) {
    transformedBytes = await lowerI64Imports(wasmBytes);
    // Save transformed bytes
    fs.writeFileSync(loweredCachePath, transformedBytes);
  } else {
    transformedBytes = fs.readFileSync(loweredCachePath);
  }
  const wasmModule = await WebAssembly.compile(transformedBytes);
  const instance = await WebAssembly.instantiate(wasmModule, {
    ...wasi.getImports(wasmModule)
  });

  // const module = await WebAssembly.compile(transformedBytes);
  // const { instance } = await WebAssembly.instantiate(transformedBytes, {
  //   ...wasi.importsForModule(module)
  // });
  wasi.start(instance);
};

export const runCommand = new Command({
  runCallback: runWasiModule,
  minimistConfig: {
    boolean: ["help", "version"],
    string: ["env", "dir", "mapdir"],
    "--": true,
    alias: {
      help: ["h"],
      version: ["V"]
    }
  },
  description: "Run a WebAssembly file. Formats accepted: wasm, wat",
  getHelpBody: () => {
    return `USAGE:
    wasmer-js run [FLAGS] [OPTIONS] <path> [--] [--]...

FLAGS:
    -h, --help                              Prints help information
    -V, --version                           Prints version information

OPTIONS:
        --env <env-vars>...                  Pass custom environment variables
        --mapdir <mapped-dirs>...            Map a host directory to a different location for the wasm module
        --dir <pre-opened-directories>...    WASI pre-opened directory

ARGS:
    <path>     Input file
    <-->...    Application arguments`;
  }
});
