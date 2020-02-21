const assert = require("assert");
const fs = require("fs");
const requireFromString = require("require-from-string");
const puppeteer = require("puppeteer");

const { rebundleOutput } = require("./util");

const {
  IO_DEVICES_CONSTANTS
} = require("../../packages/io-devices/lib/index.cjs");

const testNodeBundle = async (wasmFsBundleString, ioDevicesBundleString) => {
  const WasmFs = requireFromString(wasmFsBundleString);
  const IoDevices = requireFromString(ioDevicesBundleString);

  const wasmFs = new WasmFs();
  const ioDevices = new IoDevices(wasmFs);

  // Add the buffer index display callback, and ensure it is called
  let callbackCalled = false;
  const callback = () => {
    callbackCalled = true;
  };

  ioDevices.setBufferIndexDisplayCallback(callback);
  wasmFs.fs.writeFileSync(
    IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.DRAW,
    "0"
  );

  assert.equal(callbackCalled, true);
};

const testBrowserBundle = async (wasmFsBundleString, ioDevicesBundleString) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const response = await page.evaluate(`
      ${wasmFsBundleString}
      ${ioDevicesBundleString}

      let WasmFSConstructor = WasmFs.default ? WasmFs.default : WasmFs;
      let IoDevicesConstructor = IoDevices.default ? IoDevices.default : IoDevices;

      let wasmFs = new WasmFSConstructor();
      let ioDevices = new IoDevicesConstructor(wasmFs);

      // Add the buffer index display callback, and ensure it is called
      let callbackCalled = false;
      const callback = () => {
        callbackCalled = true;
      }

      ioDevices.setBufferIndexDisplayCallback(callback);
      wasmFs.fs.writeFileSync('${IO_DEVICES_CONSTANTS.FILE_PATH.DEVICE_FRAMEBUFFER_ZERO.DRAW}', "0");

      callbackCalled === true;
    `);

  assert.equal(response, true);
};

describe("@wasmer/io-devices", function() {
  // it("should handle cjs bundle", async () => {
  //   const wasmFsBundlePath = "../packages/wasmfs/lib/index.js";
  //   const ioDevicesBundlePath = "../packages/io-devices/lib/index.cjs.js";
  //   const wasmFsBundle = fs.readFileSync(wasmFsBundlePath, "utf8");
  //   const ioDevicesBundle = fs.readFileSync(ioDevicesBundlePath, "utf8");

  //   const newWasmFsBundle = await rebundleOutput(wasmFsBundle, "cjs", "WasmFs");
  //   const newIoDevicesBundle = await rebundleOutput(
  //     ioDevicesBundle,
  //     "cjs",
  //     "IoDevices"
  //   );

  //   await testNodeBundle(newWasmFsBundle, newIoDevicesBundle);
  // });

  it("should handle esm bundle", async () => {
    const wasmFsBundlePath = "../packages/wasmfs/lib/index.esm.js";
    const ioDevicesBundlePath = "../packages/io-devices/lib/index.esm.js";
    const wasmFsBundle = fs.readFileSync(wasmFsBundlePath, "utf8");
    const ioDevicesBundle = fs.readFileSync(ioDevicesBundlePath, "utf8");

    const newWasmFsBundle = await rebundleOutput(
      wasmFsBundle,
      "iife",
      "WasmFs"
    );
    const newIoDevicesBundle = await rebundleOutput(
      ioDevicesBundle,
      "iife",
      "IoDevices"
    );

    await testBrowserBundle(newWasmFsBundle, newIoDevicesBundle);
  });

  it("should handle iife bundle", async () => {
    const wasmFsBundlePath = "../packages/wasmfs/lib/index.iife.js";
    const ioDevicesBundlePath = "../packages/io-devices/lib/index.iife.js";
    const wasmFsBundle = fs.readFileSync(wasmFsBundlePath, "utf8");
    const ioDevicesBundle = fs.readFileSync(ioDevicesBundlePath, "utf8");

    await testBrowserBundle(wasmFsBundle, ioDevicesBundle);
  });
});
