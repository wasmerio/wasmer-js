import { WasmFs } from "../../wasmfs/src/index";

import { IO_DEVICES_CONSTANTS } from "./constants";
export { IO_DEVICES_CONSTANTS } from "./constants";

// Add isomorphic support for TextDecoder
let TextDecoder: any = undefined;
if (typeof window === "object") {
  TextDecoder = window.TextDecoder;
} else if (typeof self === "object") {
  TextDecoder = self.TextDecoder;
} else if (typeof require === "function") {
  TextDecoder = require("util").TextDecoder;
}

export default class IoDevicesDefault {
  wasmFs: WasmFs;
  fdFrameBuffer: number;
  fdWindowSize: number;
  fdBufferIndexDisplay: number;
  fdInput: number;

  windowSizeCallback: Function;
  bufferIndexDisplayCallback: Function;
  inputCallback: Function;

  constructor(wasmFs: WasmFs) {
    this.wasmFs = wasmFs;

    // Add our files to the wasmFs
    this.wasmFs.volume.mkdirSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.PATH,
      { recursive: true }
    );
    this.wasmFs.volume.writeFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.FRAME_BUFFER,
      ""
    );
    this.wasmFs.volume.writeFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.VIRTUAL_SIZE,
      ""
    );
    this.wasmFs.volume.writeFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.DRAW,
      ""
    );
    this.wasmFs.volume.writeFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.INPUT,
      ""
    );

    this.windowSizeCallback = () => {};
    this.bufferIndexDisplayCallback = () => {};
    this.inputCallback = () => new Uint8Array();

    // Open our directories and get their file descriptors
    this.fdFrameBuffer = this.wasmFs.volume.openSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.FRAME_BUFFER,
      "w+"
    );
    this.fdBufferIndexDisplay = this.wasmFs.volume.openSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.DRAW,
      "w+"
    );
    this.fdWindowSize = this.wasmFs.fs.openSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.VIRTUAL_SIZE,
      "w+"
    );
    this.fdInput = this.wasmFs.volume.openSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.INPUT,
      "w+"
    );

    // Set up our read / write handlers
    const context = this;
    const originalInputRead = this.wasmFs.volume.fds[this.fdInput].node.read;
    // @ts-ignore
    this.wasmFs.volume.fds[this.fdInput].node.read = function() {
      // Write the input buffer
      const inputBuffer = context.inputCallback();
      context.wasmFs.volume.writeFileSync(
        IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.INPUT,
        inputBuffer
      );

      // Read the input
      // @ts-ignore
      const args = Array.prototype.slice.call(arguments);
      const response = originalInputRead.apply(
        context.wasmFs.volume.fds[context.fdInput].node,
        args as any
      );

      // Return the response from the read
      return response;
    };
    const originalWindowSizeWrite = this.wasmFs.volume.fds[this.fdWindowSize]
      .node.write;
    // @ts-ignore
    this.wasmFs.volume.fds[this.fdWindowSize].node.write = function() {
      // @ts-ignore
      const args = Array.prototype.slice.call(arguments);
      const response = originalWindowSizeWrite.apply(
        context.wasmFs.volume.fds[context.fdWindowSize].node,
        args as any
      );
      context.windowSizeCallback();
      return response;
    };
    const originalBufferIndexDisplayWrite = this.wasmFs.volume.fds[
      this.fdBufferIndexDisplay
    ].node.write;
    // @ts-ignore
    this.wasmFs.volume.fds[this.fdBufferIndexDisplay].node.write = function() {
      // @ts-ignore
      const args = Array.prototype.slice.call(arguments);
      const response = originalBufferIndexDisplayWrite.apply(
        context.wasmFs.volume.fds[context.fdBufferIndexDisplay].node,
        args as any
      );
      context.bufferIndexDisplayCallback();
      return response;
    };
  }

  getFrameBuffer(): Uint8Array {
    const buffer: Uint8Array = this.wasmFs.fs.readFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.FRAME_BUFFER
    ) as Uint8Array;
    return buffer;
  }

  getWindowSize(): Array<number> {
    const windowSizeBuffer = this.wasmFs.fs.readFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.VIRTUAL_SIZE
    );
    if (windowSizeBuffer.length > 0) {
      const windowSize = new TextDecoder("utf-8").decode(
        windowSizeBuffer as any
      );
      const splitWindowSize = windowSize.split("x");
      return [
        parseInt(splitWindowSize[0], 10),
        parseInt(splitWindowSize[1], 10)
      ];
    } else {
      return [0, 0];
    }
  }

  setWindowSizeCallback(windowSizeCallback: Function): void {
    this.windowSizeCallback = windowSizeCallback;
  }

  setBufferIndexDisplayCallback(bufferIndexDisplayCallback: Function): void {
    this.bufferIndexDisplayCallback = bufferIndexDisplayCallback;
  }

  setInputCallback(inputCallback: Function): void {
    this.inputCallback = inputCallback;
  }
}

export const IoDevices = IoDevicesDefault;
export type IoDevices = IoDevicesDefault;
