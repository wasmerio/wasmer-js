import { WasmFs } from "../../wasmfs/src/index";

// Define our file paths
const FRAME_BUFFER = "/dev/wasmerfb0";
const WINDOW_SIZE = "/sys/class/graphics/wasmerfb0/virtual_size";
const BUFFER_INDEX_DISPLAY =
  "/sys/class/graphics/wasmerfb0/buffer_index_display";
const INPUT = "/dev/input";

export default class IoDevicesDefault {
  wasmFs: WasmFs;
  fdFrameBuffer: number;
  fdWindowSize: number;
  fdBufferIndexDisplay: number;
  fdInput: number;
  windowSizeCallback: Function;
  bufferIndexDisplayCallback: Function;

  constructor(wasmFs: WasmFs) {
    this.wasmFs = wasmFs;

    // Add our files to the wasmFs
    const wasmFsJSON = this.wasmFs.toJSON();
    wasmFsJSON[FRAME_BUFFER] = "";
    wasmFsJSON[WINDOW_SIZE] = "";
    wasmFsJSON[BUFFER_INDEX_DISPLAY] = "";
    wasmFsJSON[INPUT] = "";
    this.wasmFs.fromJSON(wasmFsJSON);

    this.windowSizeCallback = () => {};
    this.bufferIndexDisplayCallback = () => {};

    // Open our directories and get their file descriptors
    this.fdFrameBuffer = this.wasmFs.fs.openSync(FRAME_BUFFER, "r");
    this.fdWindowSize = this.wasmFs.fs.openSync(FRAME_BUFFER, "r");
    this.fdBufferIndexDisplay = this.wasmFs.fs.openSync(FRAME_BUFFER, "r");
    this.fdInput = this.wasmFs.fs.openSync(FRAME_BUFFER, "w");

    // Set up our read / write handlers
    this.wasmFs.volume.fds[this.fdInput].node.read = this._clearInput.bind(
      this
    );
    this.wasmFs.volume.fds[
      this.fdWindowSize
    ].node.write = this.windowSizeCallback;
    this.wasmFs.volume.fds[
      this.fdBufferIndexDisplay
    ].node.write = this.bufferIndexDisplayCallback;
  }

  getFrameBuffer(): Uint8Array {
    const buffer = this.wasmFs.readFileSync(FRAME_BUFFER);
    console.log(buffer);
    return new Uint8Array(buffer);
  }

  getWindowSize(): Array<number> {
    const windowSize = this.wasmFs.readFileSync(WINDOW_SIZE, "utf8");
    const splitWindowSize = windowSize.split("x");
    return [splitWindowSize[0], splitWindowSize[1]];
  }

  setWindowSizeCallback(windowSizeCallback: Function): void {
    this.windowSizeCallback = windowSizeCallback;
  }

  setBufferIndexDisplayCallback(bufferIndexDisplayCallback: Function): void {
    this.bufferIndexDisplayCallback = bufferIndexDisplayCallback;
  }

  setInput(): void {}

  _clearInput(): void {}
}

export const IoDevices = IoDevicesDefault;
export type IoDevices = IoDevicesDefault;
