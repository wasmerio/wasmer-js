import { WasmFs } from "../../wasmfs/src/index";
import { IoDevices } from "../src/index";

// The IO Devices files
const FRAME_BUFFER = "/dev/wasmerfb0";
const WINDOW_SIZE = "/sys/class/graphics/wasmerfb0/virtual_size";
const BUFFER_INDEX_DISPLAY =
  "/sys/class/graphics/wasmerfb0/buffer_index_display";
const INPUT = "/dev/input";

describe("io-devices", () => {
  let wasmfs: WasmFs;
  let ioDevices: IoDevices;

  beforeEach(async () => {
    wasmfs = new WasmFs();
    ioDevices = new IoDevices(wasmfs);
  });

  it("should add the neccessary files and listeners to a WasmFs Instance", async () => {
    const wasmFs = wasmfs.toJSON();

    expect(wasmFs[FRAME_BUFFER] !== undefined).toBe(true);
    expect(wasmFs[WINDOW_SIZE] !== undefined).toBe(true);
    expect(wasmFs[BUFFER_INDEX_DISPLAY] !== undefined).toBe(true);
    expect(wasmFs[INPUT] !== undefined).toBe(true);
  });

  it("should return the current framebuffer", async () => {
    const frameBuffer = ioDevices.getFrameBuffer();

    expect(frameBuffer.length !== undefined).toBe(true);
  });

  it("should return the current window size", async () => {
    const initialWindowSize = ioDevices.getWindowSize();
    expect(initialWindowSize !== undefined).toBe(true);
    expect(initialWindowSize[0]).toBe(0);
    expect(initialWindowSize[1]).toBe(0);

    wasmfs.fs.writeFileSync(WINDOW_SIZE, "10x10");

    const newWindowSize = ioDevices.getWindowSize();
    expect(newWindowSize !== undefined).toBe(true);
    expect(newWindowSize[0]).toBe(10);
    expect(newWindowSize[1]).toBe(10);
  });

  it("should call the windowSizeCallback", async () => {
    let callbackCalled = false;
    const callback = () => {
      callbackCalled = true;
    };

    ioDevices.setWindowSizeCallback(callback);
    wasmfs.fs.writeFileSync(WINDOW_SIZE, "10x10");

    expect(callbackCalled).toBe(true);
  });

  it("should call the bufferIndexDisplayCallback", async () => {
    let callbackCalled = false;
    const callback = () => {
      callbackCalled = true;
    };

    ioDevices.setBufferIndexDisplayCallback(callback);
    wasmfs.fs.writeFileSync(BUFFER_INDEX_DISPLAY, "0");

    expect(callbackCalled).toBe(true);
  });

  it("should call the windowSizeCallback", async () => {
    let callbackCalled = false;
    const callback = () => {
      callbackCalled = true;
    };

    ioDevices.setWindowSizeCallback(callback);
    wasmfs.fs.writeFileSync(WINDOW_SIZE, "10x10");

    expect(callbackCalled).toBe(true);
  });
});
