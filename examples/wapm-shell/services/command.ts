import { h, Component } from "preact";

import { Duplex, PassThrough } from "stream";

//@ts-ignore
import { WASI } from "../../../dist/index.esm";

import * as WasiFileSystem from "../../file-system/file-system";

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

export const commandAstToCommandOptions = (ast: any): CommandOptions => {
  let command = ast.command.value;
  let commandArgs = ast.args.map((arg: any) => arg.value);
  let args = [command, ...commandArgs];

  let env = Object.fromEntries(
    Object.entries(ast.env).map(([key, value]: [string, any]) => [
      key,
      value.value
    ])
  );
  let redirect;
  if (ast.redirects) {
    let astRedirect = ast.redirects[0];
    if (astRedirect && astRedirect.type === "pipe") {
      redirect = commandAstToCommandOptions(astRedirect.command);
    }
  }
  return {
    args,
    env,
    redirect
  };
};

export type CommandOptions = {
  args: string[];
  env: { [key: string]: string };
  redirect?: CommandOptions;
};

export class Command {
  args: string[];
  env: { [key: string]: string };

  constructor({ args, env }: CommandOptions) {
    this.args = args;
    this.env = env;
  }
  run() {
    throw new Error("Not implemented");
  }
  instantiate(stdin?: string): Promise<Duplex> | Duplex {
    throw new Error("Not implemented");
  }
  getStdout(): string {
    throw new Error("Not implemented");
  }
  async kill() {}
}

export type WASMCommandOptions = CommandOptions & {
  module: WebAssembly.Module;
};

const assert = (cond: boolean, message: string) => {
  if (!cond) {
    throw new Error(message);
  }
};

const constructStdinRead = () => {
  let readCounter = 0;
  return (
    buf: Buffer | Uint8Array,
    offset: number = 0,
    length: number = buf.byteLength,
    position?: number
  ) => {
    if (readCounter !== 0) {
      readCounter = ++readCounter % 3;
      return 0;
    }
    let input = prompt("Input: ");
    if (input === null || input === "") {
      readCounter++;
      return 0;
    }
    let buffer = Buffer.from(input, "utf-8");
    for (let x = 0; x < buffer.length; ++x) {
      buf[x] = buffer[x];
    }
    readCounter++;
    return buffer.length + 1;
  };
};

export class WASICommand extends Command {
  wasi: WASI;
  promisedInstance: Promise<WebAssembly.Instance>;
  instance: WebAssembly.Instance | undefined;
  wasiFs: WasiFileSystem.IFs;

  constructor(options: WASMCommandOptions) {
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

export class EmscriptenCommand extends Command {}
