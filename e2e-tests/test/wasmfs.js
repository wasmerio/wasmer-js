const assert = require("assert");
const fs = require("fs");
const { TextDecoder } = require("util");
const atob = require("atob");
const btoa = require("btoa");
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
  // const expectedBinary = new Uint8Array(new Buffer(BASE64_IMG, "base64"));
  const expectedBinary = Uint8Array.from(atob(BASE64_IMG), c =>
    c.charCodeAt(0)
  );
  console.log(BASE64_IMG.length, expectedBinary.length);
  wasmFs.fs.mkdirSync("/tmp/", { recursive: true });
  console.log("expected binary", expectedBinary);
  console.log("Stringified expected binary", JSON.stringify(expectedBinary));
  const expectedArray = Array.from(expectedBinary);
  console.log("expected array", expectedArray);
  wasmFs.volume.writeFileSync("/tmp/test.png", expectedArray);

  const savedString = wasmFs.toJSON()["/tmp/test.png"];
  const savedArray = JSON.parse(`[${savedString}]`);
  const savedBinary = Uint8Array.from(savedArray);

  // Stuff breaks here
  const decoder = new TextDecoder("utf8");
  const decoded = decoder.decode(savedBinary);
  const b64encoded = btoa(decoded);

  console.log("savedString", savedString);
  console.log("savedBinary", savedBinary);
  console.log("decoded", decoded);
  console.log("restored", b64encoded);
  console.log("original", BASE64_IMG);

  // Do the check
  if (decoded !== BASE64_IMG) {
    throw new Error("Serialization doesn't work");
  }

  const stdout = await wasmFs.getStdOut();

  assert.equal(stdout, message);
};

const testBrowserBundle = async bundleString => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const response = await page.evaluate(`
      ${bundleString}

      let wasmFs;
      if (WasmFs.default) {
        wasmFs = new WasmFs.default();
      } else {
        wasmFs = new WasmFs();
      }

      const message = "Quick Start!";

      wasmFs.fs.writeFileSync("/dev/stdout", message);

      const BASE64_IMG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const expectedBinary = Uint8Array.from(atob(BASE64_IMG), c => c.charCodeAt(0));
      wasmFs.fs.mkdirSync("/tmp/", { recursive: true });
      wasmFs.volume.writeFileSync("/tmp/test.png", expectedBinary);
      
      if (wasmFs.toJSON()["/tmp/test.png"] !== BASE64_IMG) {
        throw new Error("Serialization doesn't work");
      }
      wasmFs !== undefined;
    `);

  assert.equal(response, true);
};

describe("@wasmer/wasmfs", function() {
  it("should handle cjs bundle", async () => {
    const bundlePath = "../packages/wasmfs/lib/index.cjs.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    const newBundle = await rebundleOutput(bundle, "cjs", "WasmFs");

    await testNodeBundle(newBundle);
  });

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
