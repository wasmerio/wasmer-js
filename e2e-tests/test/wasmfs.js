const assert = require("assert");
const fs = require("fs");
const requireFromString = require("require-from-string");
const puppeteer = require("puppeteer");

const { rebundleOutput } = require("./util");

const testNodeBundle = async bundleString => {
  const WasmFs = requireFromString(bundleString);

  const wasmFs = new WasmFs();

  const message = "Quick Start!";

  wasmFs.fs.writeFileSync("/dev/stdout", message);

  const BASE64_IMG =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const expectedBinary = new Uint8Array(new Buffer(BASE64_IMG, "base64"));
  wasmFs.volume.writeFileSync("/img.png", expectedBinary);

  // Serialize to JSON
  const jsonData = wasmFs.toJSON();

  // Create a new FS from the serialized JSON
  const newFs = new WasmFs();
  newFs.fromJSON(jsonData);

  // Assert both files are equal
  let buf = wasmFs.volume.readFileSync("/img.png");
  let buf2 = newFs.volume.readFileSync("/img.png");

  // console.log(buf, buf2, buf == buf2);
  if (JSON.stringify(buf) != JSON.stringify(buf2)) {
    throw new Error("Buffers differ");
  }
  const stdout = await wasmFs.getStdOut();

  assert.equal(stdout, message);
};

const testBrowserBundle = async bundleString => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const response = await page.evaluate(`
      ${bundleString}

      let WasmFSConstructor = WasmFs.default?WasmFs.default:WasmFs;

      let wasmFs = new WasmFSConstructor();

      const message = "Quick Start!";

      wasmFs.fs.writeFileSync("/dev/stdout", message);

      const TINY_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      const contents = Uint8Array.from(atob(TINY_PNG), c => c.charCodeAt(0));
      wasmFs.volume.writeFileSync("/img.png", contents);

      // Serialize to JSON
      const jsonData = wasmFs.toJSON();

      // Create a new FS from the serialized JSON
      const newFs = new WasmFSConstructor();
      newFs.fromJSON(jsonData);

      // Assert both files are equal
      let buf = wasmFs.volume.readFileSync("/img.png");
      let buf2 = newFs.volume.readFileSync("/img.png");

      if (JSON.stringify(buf) != JSON.stringify(buf2)) {
        throw new Error("Buffers differ");
      }
      wasmFs !== undefined;
    `);

  assert.equal(response, true);
};

describe("@wasmer/wasmfs", function() {
  // it("should handle cjs bundle", async () => {
  //   const bundlePath = "../packages/wasmfs/lib/index.js";
  //   const bundle = fs.readFileSync(bundlePath, "utf8");

  //   const newBundle = await rebundleOutput(bundle, "cjs", "WasmFs");

  //   await testNodeBundle(newBundle);
  // });

  it("should handle esm bundle", async () => {
    const bundlePath = "../packages/wasmfs/lib/index.esm.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    const newBundle = await rebundleOutput(bundle, "iife", "WasmFs");

    await testBrowserBundle(newBundle);
  });

  it("should handle iife bundle", async () => {
    const bundlePath = "../packages/wasmfs/lib/index.iife.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    await testBrowserBundle(bundle);
  });
});
