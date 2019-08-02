// The class for Wasi Commands

//@ts-ignore
import { WASI } from "../../../../dist/index.esm";

import WasiCLIFileSystem from "../../../file-system/file-system";

import { Command, CommandOptions } from "../../services/command-runner/command";

import { Duplex, PassThrough } from "stream";

const merge = (...streams: Duplex[]) => {
  let pass = new PassThrough();
  let waiting = streams.length;
  for (let stream of streams) {
    pass = stream.pipe(
      pass,
      { end: false }
    );
    stream.once("end", () => --waiting === 0 && pass.emit("end"));
  }
  return pass;
};

export default class WASICommand extends Command {
  wasi: WASI;
  promisedInstance: Promise<WebAssembly.Instance>;
  instance: WebAssembly.Instance | undefined;
  wasiCliFileSystem: WasiCLIFileSystem;

  constructor(options: CommandOptions) {
    super(options);

    this.wasiCliFileSystem = new WasiCLIFileSystem();

    this.wasi = new WASI({
      preopenDirectories: {},
      env: options.env,
      args: options.args,
      bindings: {
        ...WASI.defaultBindings,
        fs: this.wasiCliFileSystem.fs
      }
    });

    this.promisedInstance = WebAssembly.instantiate(options.module, {
      wasi_unstable: this.wasi.exports
    });
  }

  async instantiate(stdin?: string): Promise<Duplex> {
    let instance = await Promise.resolve(this.promisedInstance);
    this.instance = instance;
    this.wasi.setMemory((instance as any).exports.memory);
    let stdoutRead = this.wasiCliFileSystem.fs.createReadStream("/dev/stdout");
    let stderrRead = this.wasiCliFileSystem.fs.createReadStream("/dev/stderr");

    if (stdin) {
      const stdinAsUint8Array = new TextEncoder().encode(stdin);
      this.wasiCliFileSystem.sendStdinChunk(stdinAsUint8Array);
    }

    // We join the stdout and stderr together
    let stream = merge(
      (stdoutRead as unknown) as Duplex,
      (stderrRead as unknown) as Duplex
    );
    return stream;
  }

  run() {
    if (!this.instance) {
      throw new Error("You need to call instantiate first.");
    }
    this.instance.exports._start();
  }
}
