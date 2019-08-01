// The class for Wasi Commands

//@ts-ignore
import { WASI } from "../../../../dist/index.esm";

import * as WasiFileSystem from "../../../file-system/file-system";

import { Command, CommandOptions } from "../../services/command/command";

import { assert } from "../../services/util";

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
  wasiFs: WasiFileSystem.IFs;

  constructor(options: CommandOptions) {
    super(options);

    const wasiFs = WasiFileSystem.generateWasiFileSystem();

    const fd_err = wasiFs.openSync("/dev/stderr", "w");
    const fd_out = wasiFs.openSync("/dev/stdout", "w");
    const fd_in = wasiFs.openSync("/dev/stdin", "r");
    assert(fd_err === 2, `invalid handle for stderr: ${fd_err}`);
    assert(fd_out === 1, `invalid handle for stdout: ${fd_out}`);
    assert(fd_in === 0, `invalid handle for stdin: ${fd_in}`);

    this.wasi = new WASI({
      preopenDirectories: {},
      env: options.env,
      args: options.args,
      bindings: {
        ...WASI.defaultBindings,
        fs: wasiFs
      }
    });
    this.wasiFs = wasiFs;
    this.promisedInstance = WebAssembly.instantiate(options.module, {
      wasi_unstable: this.wasi.exports
    });
  }

  async instantiate(stdin?: string): Promise<Duplex> {
    let instance = await Promise.resolve(this.promisedInstance);
    this.instance = instance;
    this.wasi.setMemory((instance as any).exports.memory);
    let stdoutRead = this.wasiFs.createReadStream("/dev/stdout");
    let stderrRead = this.wasiFs.createReadStream("/dev/stderr");

    // We overwrite the read function of /dev/stdin if there is no provided stdin
    if (typeof stdin === "undefined") {
      // TODO: Handle stdin
      // this.volume.fds[0].read = constructStdinRead();
    } else {
      this.wasiFs.writeFileSync("/dev/stdin", stdin);
    }

    // We join the stdout and stderr together
    let stream = merge(
      (stdoutRead as unknown) as Duplex,
      (stderrRead as unknown) as Duplex
    );
    return stream;
  }

  getStdout(): string {
    return this.wasiFs.readFileSync("/dev/stdout").toString();
  }

  run() {
    if (!this.instance) {
      throw new Error("You need to call instantiate first.");
    }
    this.instance.exports._start();
  }
}
