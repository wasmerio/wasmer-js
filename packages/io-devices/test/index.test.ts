import { WasmFs } from "../../wasmfs/src/index";
import { IoDevices, IO_DEVICES_CONSTANTS } from "../src/index";

describe("io-devices", () => {
  let wasmfs: WasmFs;
  let ioDevices: IoDevices;

  beforeEach(async () => {
    wasmfs = new WasmFs();
    ioDevices = new IoDevices(wasmfs);
  });

  it("should add the neccessary files and listeners to a WasmFs Instance", async () => {
    const wasmFs = wasmfs.toJSON();

    expect(
      wasmFs[
        IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.FRAME_BUFFER
      ] !== undefined
    ).toBe(true);
    expect(
      wasmFs[
        IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.VIRTUAL_SIZE
      ] !== undefined
    ).toBe(true);
    expect(
      wasmFs[IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.DRAW] !==
        undefined
    ).toBe(true);
    expect(
      wasmFs[IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.INPUT] !==
        undefined
    ).toBe(true);
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

    wasmfs.fs.writeFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.VIRTUAL_SIZE,
      "10x10"
    );

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
    wasmfs.fs.writeFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.VIRTUAL_SIZE,
      "10x10"
    );

    expect(callbackCalled).toBe(true);
  });

  it("should call the bufferIndexDisplayCallback", async () => {
    let callbackCalled = false;
    const callback = () => {
      callbackCalled = true;
    };

    ioDevices.setBufferIndexDisplayCallback(callback);
    wasmfs.fs.writeFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.DRAW,
      "0"
    );

    expect(callbackCalled).toBe(true);
  });

  it("should call the windowSizeCallback", async () => {
    let callbackCalled = false;
    const callback = () => {
      callbackCalled = true;
    };

    ioDevices.setWindowSizeCallback(callback);
    wasmfs.fs.writeFileSync(
      IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.VIRTUAL_SIZE,
      "10x10"
    );

    expect(callbackCalled).toBe(true);
  });
});
