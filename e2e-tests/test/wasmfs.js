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
