const assert = require("assert");
const fs = require("fs");
const requireFromString = require("require-from-string");
const puppeteer = require("puppeteer");

const { rebundleOutput } = require("./util");

const testNodeBundle = async bundleString => {
  const WASI = requireFromString(bundleString);

  const wasi = new WASI({
    args: [],
    env: {},
    bindings: {
      ...WASI.defaultBindings
    }
  });

  assert.equal(wasi !== undefined, true);
};

const testBrowserBundle = async bundleString => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const response = await page.evaluate(`
      ${bundleString}
      
      let WASIConstructor;
      if (WASI.default) {
        WASIConstructor = WASI.default;
      } else {
        WASIConstructor = WASI;
      }

      const wasi = new WASIConstructor({
        args: [],
        env: {},
        bindings: {
          ...WASIConstructor.defaultBindings
        }
      });

      console.log(wasi);

      wasi !== undefined;
    `);

  assert.equal(response, true);
};

describe("@wasmer/wasi", function() {
  it("should handle cjs bundle", async () => {
    const bundlePath = "../packages/wasi/lib/index.cjs.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    const newBundle = await rebundleOutput(bundle, "cjs", "WASI");

    await testNodeBundle(newBundle);
  });

  it("should handle esm bundle", async () => {
    const bundlePath = "../packages/wasi/lib/index.esm.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    const newBundle = await rebundleOutput(bundle, "iife", "WASI");

    await testBrowserBundle(newBundle);
  });

  it("should handle iife bundle", async () => {
    const bundlePath = "../packages/wasi/lib/index.iife.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    await testBrowserBundle(bundle);
  });
});
