const assert = require("assert");
const fs = require("fs");
const mkdirp = require("mkdirp");
const requireFromString = require("require-from-string");
const puppeteer = require("puppeteer");
const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

const rebundleOutput = async (originalBundle, bundleFormat, bundleName) => {
  // Create a simple bundle that imports our bundle
  mkdirp.sync("./tmp-output");
  fs.writeFileSync("./tmp-output/bundle.js", originalBundle);
  fs.writeFileSync(
    "./tmp-output/index.js",
    `
    import defaultExport from './bundle.js';
    console.log('Temp Bundle!');
    export default defaultExport;
  `
  );

  // Make sure rollup and it's basic plugins can digest the bundle
  const bundle = await rollup.rollup({
    input: "./tmp-output/index.js",
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs()
    ]
  });

  const { output } = await bundle.generate({
    format: bundleFormat,
    name: bundleName
  });

  return output[0].code;
};

describe("@wasmer/wasi", function() {
  const testWasiNodeBundle = async bundleString => {
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

  const testWasiBrowserBundle = async bundleString => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const response = await page.evaluate(`
      ${bundleString}

      const wasi = new WASI({
        args: [],
        env: {},
        bindings: {
          ...WASI.defaultBindings
        }
      });

      console.log(wasi);

      wasi !== undefined;
    `);

    assert.equal(response, true);
  };

  it("should handle cjs bundle", async () => {
    const bundlePath = "../packages/wasi/dist/index.cjs.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    const newBundle = await rebundleOutput(bundle, "cjs", "WASI");

    await testWasiNodeBundle(newBundle);
  });

  it("should handle esm bundle", async () => {
    const bundlePath = "../packages/wasi/dist/index.esm.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    const newBundle = await rebundleOutput(bundle, "iife", "WASI");

    await testWasiBrowserBundle(newBundle);
  });

  it("should handle iife bundle", async () => {
    const bundlePath = "../packages/wasi/dist/index.iife.js";
    const bundle = fs.readFileSync(bundlePath, "utf8");

    await testWasiBrowserBundle(bundle);
  });
});
