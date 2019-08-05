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
  sharedStdin?: Int32Array;
  stdinReadCallback?: Function;
  stdinReadCounter: number;
  pipedStdin: string;

  constructor(
    options: CommandOptions,
    sharedStdin?: Int32Array,
    stdinReadCallback?: Function
  ) {
    super(options);

    this.wasiCliFileSystem = new WasiCLIFileSystem();

    // Bind our stdinRead
    this.wasiCliFileSystem.volume.fds[0].read = this.stdinRead.bind(this);

    if (sharedStdin) {
      this.sharedStdin = sharedStdin;
    }
    if (stdinReadCallback) {
      this.stdinReadCallback = stdinReadCallback;
    }
    this.stdinReadCounter = 0;
    this.pipedStdin = "";

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

  async instantiate(pipedStdinData?: Uint8Array): Promise<Duplex> {
    let instance = await Promise.resolve(this.promisedInstance);
    this.instance = instance;
    this.wasi.setMemory((instance as any).exports.memory);
    let stdoutRead = this.wasiCliFileSystem.fs.createReadStream("/dev/stdout");
    let stderrRead = this.wasiCliFileSystem.fs.createReadStream("/dev/stderr");

    if (pipedStdinData) {
      this.pipedStdin = new TextDecoder("utf-8").decode(pipedStdinData);
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

  // Handle read of stdin, similar to C read
  // https://linux.die.net/man/2/read
  // This is the bottom of the "layers stack". This is the outer binding.
  // This is the the thing that returns -1 because it is the actual file system,
  // but it is up to WASI lib  (wasi.ts) to find out why this error'd
  stdinRead(
    responseBuffer: Buffer | Uint8Array,
    offset: number = 0,
    length: number = responseBuffer.byteLength,
    position?: number
  ) {
    // For some reason, read is called 3 times per actual read
    // Thus we have a counter to handle this.
    if (this.stdinReadCounter !== 0) {
      if (this.stdinReadCounter < 3) {
        this.stdinReadCounter++;
      } else {
        this.stdinReadCounter = 0;
      }
      return 0;
    }

    // Since reading will keep requesting data, we need to give end of file
    this.stdinReadCounter++;

    let responseStdin: string | null = null;
    if (this.pipedStdin) {
      responseStdin = this.pipedStdin;
      this.pipedStdin = "";
    } else if (this.sharedStdin && this.stdinReadCallback) {
      this.stdinReadCallback();
      Atomics.wait(this.sharedStdin, 0, -1);

      // Grab the of elements
      const numberOfElements = this.sharedStdin[0];
      this.sharedStdin[0] = -1;
      const newStdinData = new Uint8Array(numberOfElements);
      for (let i = 0; i < numberOfElements; i++) {
        newStdinData[i] = this.sharedStdin[1 + i];
      }

      responseStdin = new TextDecoder("utf-8").decode(newStdinData);
    } else {
      responseStdin = prompt("Stdin");
    }

    // First check for errors
    if (!responseStdin) {
      return 0;
    }

    const buffer = new TextEncoder().encode(responseStdin);
    for (let x = 0; x < buffer.length; ++x) {
      responseBuffer[x] = buffer[x];
    }

    // Return the current stdin
    return buffer.length;
  }
}
