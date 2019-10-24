// The class for WASI Commands

import WASI from "@wasmer/wasi";
import { WasmFs } from "@wasmer/wasmfs";

import Command from "./command";
import CommandOptions from "./command-options";

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

/**

 This function removes the ansi escape characters
 (normally used for printing colors and so)
 Inspired by: https://github.com/chalk/ansi-regex/blob/master/index.js

MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
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
  instantiateReponsePromise: Promise<WebAssembly.Instance>;
  instance: WebAssembly.Instance | undefined;
  wasmFs: WasmFs;

  sharedStdin?: Int32Array;
  startStdinReadCallback?: Function;
  pipedStdin: string;
  stdinPrompt: string = "";

  readStdinCounter: number;

  stdoutCallback?: Function;

  constructor(
    options: CommandOptions,
    wasmFs: WasmFs,
    sharedStdin?: Int32Array,
    startStdinReadCallback?: Function
  ) {
    super(options);

    this.wasmFs = new WasmFs();

    // Bind our stdinRead / stdoutWrite
    this.wasmFs = wasmFs;
    this.wasmFs.volume.fds[0].read = this.stdinRead.bind(this);
    this.wasmFs.volume.fds[1].write = this.stdoutWrite.bind(this);
    this.wasmFs.volume.fds[2].write = this.stdoutWrite.bind(this);

    this.sharedStdin = sharedStdin;
    this.startStdinReadCallback = startStdinReadCallback;
    this.readStdinCounter = 0;
    this.pipedStdin = "";

    this.wasi = new WASI({
      preopenDirectories: {
        "/": "/"
      },
      env: options.env,
      args: options.args,
      bindings: {
        ...WASI.defaultBindings,
        fs: this.wasmFs.fs
      }
    });

    if (!options.module) {
      throw new Error("Did not find a WebAssembly.Module for the WASI Command");
    }

    this.instantiateReponsePromise = WebAssembly.instantiate(options.module, {
      wasi_unstable: this.wasi.wasiImport
    });
  }

  async instantiate(
    stdoutCallback?: Function,
    pipedStdinData?: Uint8Array
  ): Promise<Duplex> {
    this.instance = await this.instantiateReponsePromise;
    let stdoutRead = this.wasmFs.fs.createReadStream("/dev/stdout");
    let stderrRead = this.wasmFs.fs.createReadStream("/dev/stderr");

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
    this.wasi.start(this.instance);
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
    let dataLines = new TextDecoder("utf-8").decode(stdoutBuffer).split("\n");
    if (dataLines.length > 0) {
      this.stdinPrompt = cleanStdout(dataLines[dataLines.length - 1]);
    } else {
      this.stdinPrompt = "";
    }
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
    if (this.readStdinCounter > 0) {
      this.readStdinCounter--;
      return 0;
    }
    this.readStdinCounter = 1;

    let responseStdin: string | null = null;
    if (this.pipedStdin) {
      responseStdin = this.pipedStdin + "\n";
      this.pipedStdin = "";
      this.readStdinCounter++;
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
        `Please enter text for stdin:\n${this.stdinPrompt}`
      );
      if (responseStdin === null) {
        if (this.stdoutCallback) {
          this.stdoutCallback(new TextEncoder().encode("\n"));
        }
        const userError = new Error("Process killed by user");
        (userError as any).user = true;
        throw userError;
        return -1;
      }
      responseStdin += "\n";
      if (this.stdoutCallback) {
        this.stdoutCallback(new TextEncoder().encode(responseStdin));
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
