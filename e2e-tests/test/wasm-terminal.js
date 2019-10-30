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

      let WasmTerminalConstructor;
      if (WasmTerminal.default) {
        WasmTerminalConstructor = WasmTerminal.default;
      } else {
        WasmTerminalConstructor = WasmTerminal;
      }

      // Let's create our Wasm Terminal
      const wasmTerminal = new WasmTerminalConstructor({
        // Function that is run whenever a command is fetched
        fetchCommand: () => {}
      });

      wasmTerminal !== undefined;
    `);

  assert.equal(response, true);
};

describe("@wasmer/wasm-transformer", function() {
  it("should handle esm bundle", async () => {
    const bundlePath =
      "../packages/wasm-terminal/lib/unoptimized/wasm-terminal.esm.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    const newBundle = await rebundleOutput(bundle, "iife", "WasmTerminal");

    await testBrowserBundle(newBundle);
  });

  it("should handle iife bundle", async () => {
    const bundlePath =
      "../packages/wasm-terminal/lib/unoptimized/wasm-terminal.iife.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    await testBrowserBundle(bundle);
  });
});
