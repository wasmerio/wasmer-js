const assert = require("assert");
const fs = require("fs");
const requireFromString = require("require-from-string");
const puppeteer = require("puppeteer");

const { rebundleOutput } = require("./util");

const testBrowserBundle = async bundleString => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const response = await page.evaluate(`
      ${bundleString}

      let propertyToCheck;
      if (WasmTransformer) {
        propertyToCheck = WasmTransformer.lowerI64Imports;
      }

      propertyToCheck !== undefined;
    `);

  assert.equal(response, true);
};

describe("@wasmer/wasm-transformer", function() {
  it("should handle esm bundle", async () => {
    const bundlePath =
      "../packages/wasm-transformer/lib/unoptimized/wasm-transformer.esm.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    const newBundle = await rebundleOutput(
      bundle,
      "iife",
      "WasmTransformer",
      "import {lowerI64Imports as testImport} from './bundle.js';",
      "export const lowerI64Imports = testImport;"
    );

    await testBrowserBundle(newBundle);
  });

  it("should handle iife bundle", async () => {
    const bundlePath =
      "../packages/wasm-transformer/lib/unoptimized/wasm-transformer.iife.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    await testBrowserBundle(bundle);
  });
});
