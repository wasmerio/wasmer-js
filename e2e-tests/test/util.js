const fs = require("fs");
const mkdirp = require("mkdirp");
const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

const rebundleOutput = async (
  originalBundle,
  bundleFormat,
  bundleName,
  optionalImportString,
  optionalExportString
) => {
  if (!optionalImportString) {
    optionalImportString = "import defaultExport from './bundle.js';";
  }
  if (!optionalExportString) {
    optionalExportString = "export default defaultExport";
  }

  // Create a simple bundle that imports our bundle
  mkdirp.sync("./tmp-output");
  fs.writeFileSync("./tmp-output/bundle.js", originalBundle);
  fs.writeFileSync(
    "./tmp-output/index.js",
    `

    ${optionalImportString}
    ${optionalExportString};
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

module.exports = {
  rebundleOutput
};
