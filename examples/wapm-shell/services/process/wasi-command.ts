// The class for Wasi Commands

//@ts-ignore
import { WASI } from "../../../../dist/index.esm";

import WasmerFileSystem from "../../../file-system/file-system";

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

// This function removes the ansi escape characters
// (normally used for printing colors and so)
// Inspired by: https://github.com/chalk/ansi-regex/blob/master/index.js
const cleanStdout = (stdout: string) => {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
  ].join("|");

  const regexPattern = new RegExp(pattern, "g");
  return stdout.replace(regexPattern, "");
};

export default class WASICommand extends Command {
  wasi: WASI;
  promisedInstance: Promise<WebAssembly.Instance>;
  instance: WebAssembly.Instance | undefined;
  wasmerFileSystem: WasmerFileSystem;

  sharedStdin?: Int32Array;
  startStdinReadCallback?: Function;
  isReadingStdin: boolean;
  pipedStdin: string;

  stdoutLog: string;
  stdoutCallback?: Function;

  constructor(
    options: CommandOptions,
    sharedStdin?: Int32Array,
    startStdinReadCallback?: Function
  ) {
    super(options);

    this.wasmerFileSystem = new WasmerFileSystem();

    // Bind our stdinRead / stdoutWrite
    this.wasmerFileSystem.volume.fds[0].read = this.stdinRead.bind(this);
    this.wasmerFileSystem.volume.fds[1].write = this.stdoutWrite.bind(this);
    this.wasmerFileSystem.volume.fds[2].write = this.stdoutWrite.bind(this);

    this.sharedStdin = sharedStdin;
    this.startStdinReadCallback = startStdinReadCallback;
    this.isReadingStdin = false;
    this.pipedStdin = "";

    this.stdoutLog = "";

    this.wasi = new WASI({
      preopenDirectories: {},
      env: options.env,
      args: options.args,
      bindings: {
        ...WASI.defaultBindings,
        fs: this.wasmerFileSystem.fs
      }
    });

    this.promisedInstance = WebAssembly.instantiate(options.module, {
      wasi_unstable: this.wasi.exports
    });
  }

  async instantiate(
    stdoutCallback?: Function,
    pipedStdinData?: Uint8Array
  ): Promise<Duplex> {
    let instance = await this.promisedInstance;
    this.instance = instance;
    this.wasi.setMemory((instance as any).exports.memory);
    let stdoutRead = this.wasmerFileSystem.fs.createReadStream("/dev/stdout");
    let stderrRead = this.wasmerFileSystem.fs.createReadStream("/dev/stderr");

    this.stdoutCallback = stdoutCallback;

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

  stdoutWrite(
    stdoutBuffer: Buffer | Uint8Array,
    offset: number = 0,
    length: number = stdoutBuffer.byteLength,
    position?: number
  ) {
    if (this.stdoutCallback) {
      this.stdoutCallback(stdoutBuffer);
    }

    // Record all of our stdout to show in the prompt
    let dataString = new TextDecoder("utf-8").decode(stdoutBuffer);
    this.stdoutLog += dataString;

    return stdoutBuffer.length;
  }

  // Handle read of stdin, similar to C read
  // https://linux.die.net/man/2/read
  // This is the bottom of the "layers stack". This is the outer binding.
  // This is the the thing that returns -1 because it is the actual file system,
  // but it is up to WASI lib  (wasi.ts) to find out why this error'd
  stdinRead(
    stdinBuffer: Buffer | Uint8Array,
    offset: number = 0,
    length: number = stdinBuffer.byteLength,
    position?: number
  ) {
    if (this.isReadingStdin) {
      this.isReadingStdin = false;
      return 0;
    }
    this.isReadingStdin = true;

    let responseStdin: string | null = null;
    if (this.pipedStdin) {
      responseStdin = this.pipedStdin;
      this.pipedStdin = "";
    } else if (this.sharedStdin && this.startStdinReadCallback) {
      this.startStdinReadCallback();
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
      responseStdin = prompt(
        this.stdoutLog.length > 0
          ? cleanStdout(this.stdoutLog)
          : "Please enter text for stdin:"
      );
      if (responseStdin) {
        responseStdin += "\n";
      }
    }

    // First check for errors
    if (!responseStdin) {
      return 0;
    }

    const buffer = new TextEncoder().encode(responseStdin);
    for (let x = 0; x < buffer.length; ++x) {
      stdinBuffer[x] = buffer[x];
    }

    // Return the current stdin
    return buffer.length;
  }
}
