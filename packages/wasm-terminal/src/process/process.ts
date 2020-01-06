import { WasmFs } from "@wasmer/wasmfs";
import { IoDevices } from "@wasmer/io-devices";
import { WASIExitError } from "@wasmer/wasi";

import CommandOptions from "../command/command-options";
import Command from "../command/command";
import WASICommand from "../command/wasi-command";
import CallbackCommand from "../command/callback-command";
import IoDeviceWindow from "../io-device-window/io-device-window";

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

export default class Process {
  commandOptions: CommandOptions;
  wasmFs: WasmFs;
  ioDevices: IoDevices;
  originalWasmFsJson: any;
  dataCallback: Function;
  endCallback: Function;
  errorCallback: Function;
  ioDeviceWindow: IoDeviceWindow;
  sharedIoDeviceInput?: Int32Array;
  sharedStdin?: Int32Array;
  startStdinReadCallback?: Function;

  pipedStdin: string;
  stdinPrompt: string = "";

  readStdinCounter: number;

  command: Command;

  constructor(
    commandOptions: CommandOptions,
    wasmFsJson: any,
    dataCallback: Function,
    endCallback: Function,
    errorCallback: Function,
    ioDeviceWindow: IoDeviceWindow,
    sharedIoDeviceInputBuffer?: SharedArrayBuffer,
    sharedStdinBuffer?: SharedArrayBuffer,
    startStdinReadCallback?: Function
  ) {
    this.commandOptions = commandOptions;

    this.wasmFs = new WasmFs();
    this.wasmFs.fromJSON(wasmFsJson);
    this.originalWasmFsJson = wasmFsJson;

    this.ioDevices = new IoDevices(this.wasmFs);
    this.ioDeviceWindow = ioDeviceWindow;

    // Set up our callbacks for our Io Devices Window
    this.ioDevices.setWindowSizeCallback(() => {
      const windowSize = this.ioDevices.getWindowSize();
      this.ioDeviceWindow.resize(windowSize[0], windowSize[1]);
    });
    this.ioDevices.setBufferIndexDisplayCallback(() => {
      const rgbaArray = this.ioDevices.getFrameBuffer();
      this.ioDeviceWindow.drawRgbaArrayToFrameBuffer(rgbaArray);
    });
    this.ioDevices.setInputCallback(() => {
      if (this.sharedIoDeviceInput) {
        this.ioDeviceWindow.getInputBuffer();
        Atomics.wait(this.sharedIoDeviceInput, 0, -1);

        // We are done waiting, get the number of elements
        // Set back the number of elements
        const numberOfInputBytes = this.sharedIoDeviceInput[0];
        this.sharedIoDeviceInput[0] = -1;
        if (numberOfInputBytes > 0) {
          // Get the bytes and return them
          let inputBuffer = new Uint8Array(numberOfInputBytes);
          for (let i = 0; i < numberOfInputBytes; i++) {
            inputBuffer[i] = this.sharedIoDeviceInput[i + 1];
          }

          return inputBuffer;
        }

        // Default to an empty array
        return new Uint8Array();
      } else {
        return this.ioDeviceWindow.getInputBuffer();
      }
    });

    this.dataCallback = dataCallback;
    this.endCallback = endCallback;
    this.errorCallback = errorCallback;

    let sharedIoDeviceInput: Int32Array | undefined = undefined;
    if (sharedIoDeviceInputBuffer) {
      sharedIoDeviceInput = new Int32Array(sharedIoDeviceInputBuffer);
    }
    this.sharedIoDeviceInput = sharedIoDeviceInput;

    let sharedStdin: Int32Array | undefined = undefined;
    if (sharedStdinBuffer) {
      sharedStdin = new Int32Array(sharedStdinBuffer);
    }

    if (commandOptions.module) {
      this.command = new WASICommand(commandOptions);
    } else {
      this.command = new CallbackCommand(commandOptions);
    }

    this.wasmFs.volume.fds[0].node.read = this.stdinRead.bind(this);
    this.wasmFs.volume.fds[1].node.write = this.stdoutWrite.bind(this);
    this.wasmFs.volume.fds[2].node.write = this.stdoutWrite.bind(this);
    const ttyFd = this.wasmFs.volume.openSync("/dev/tty", "w+");
    this.wasmFs.volume.fds[ttyFd].node.read = this.stdinRead.bind(this);
    this.wasmFs.volume.fds[ttyFd].node.write = this.stdoutWrite.bind(this);

    this.sharedStdin = sharedStdin;
    this.startStdinReadCallback = startStdinReadCallback;
    this.readStdinCounter = 0;
    this.pipedStdin = "";
  }

  async start(pipedStdinData?: Uint8Array) {
    const end = () => {
      // Close the window
      this.ioDeviceWindow.resize(0, 0);
      setTimeout(() => {
        this.endCallback(this.wasmFs.toJSON());
      }, 50);
    };

    try {
      if (pipedStdinData) {
        this.pipedStdin = new TextDecoder("utf-8").decode(pipedStdinData);
      }
      await this.command.run(this.wasmFs);
      end();
    } catch (e) {
      if (e instanceof WASIExitError) {
        const exitCode = e.code;
        end();
        // Set timeout to allow any lingering data callback to be launched out
        return;
      }

      let error = "Unknown Error";
      let isUserError = e.user !== undefined;

      if (e.code !== undefined) {
        error = `exited with code: ${e.code}`;
      } else if (e.signal !== undefined) {
        error = `killed with signal: ${e.signal}`;
      } else if (e.user !== undefined) {
        // Don't Error, just end the process
        end();
        return;
      }

      console.error(e);
      this.errorCallback(error, this.wasmFs.toJSON(), e.user !== undefined);
    }
  }

  stdoutWrite(
    stdoutBuffer: Buffer | Uint8Array,
    offset: number = 0,
    length: number = stdoutBuffer.byteLength,
    position?: number
  ) {
    if (this.dataCallback) {
      this.dataCallback(stdoutBuffer);
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
    if (this.readStdinCounter % 2 !== 0) {
      this.readStdinCounter++;
      return 0;
    }

    let responseStdin: string | null = null;
    if (this.pipedStdin) {
      responseStdin = this.pipedStdin;
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
        if (this.dataCallback) {
          this.dataCallback(new TextEncoder().encode("\n"));
        }
        const userError = new Error("Process killed by user");
        (userError as any).user = true;
        throw userError;
        return -1;
      }
      responseStdin += "\n";
      if (this.dataCallback) {
        this.dataCallback(new TextEncoder().encode(responseStdin));
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
