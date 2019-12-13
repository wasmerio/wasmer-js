import { WasmFs } from "../../wasmfs/src/index";

// Define our file paths
const FRAME_BUFFER = "dev/wasmerfb0";
const WINDOW_SIZE = "sys/class/graphics/wasmerfb0/virtual_size";
const BUFFER_INDEX_DISPLAY =
  "sys/class/graphics/wasmerfb0/buffer_index_display";
const INPUT = "/dev/input";

export default class WasmFsIoDevicesDefault {
  wasmFs: WasmFs;

  constructor(wasmFs: WasmFs) {
    this.wasmFs = wasmFs;

    // Add our files to the wasmFs
    const wasmFsJSON = this.wasmFs.toJSON();
    wasmFsJSON[FRAME_BUFFER] = "";
    wasmFsJSON[WINDOW_SIZE] = "";
    wasmFsJSON[BUFFER_INDEX_DISPLAY] = "";
    wasmFsJSON[INPUT] = "";
    this.wasmFs.fromJSON(wasmFsJSON);
  }

  getFrameBuffer(): void {
    // Uint8Array.from(this.wasmFs.fs.readFileSync("/dev/stdout"));
    console.log(this.wasmFs.fs.readFileSync("/dev/stdout"));
  }

  eventListenerKeydown(event: KeyboardEvent): void {}

  eventListenerKeyup(event: KeyboardEvent): void {}

  eventListenerMousemove(event: MouseEvent): void {}

  eventListenerClick(event: MouseEvent): void {}
}

export const WasmFsIoDevices = WasmFsIoDevicesDefault;
export type WasmFsIoDevices = WasmFsIoDevicesDefault;
