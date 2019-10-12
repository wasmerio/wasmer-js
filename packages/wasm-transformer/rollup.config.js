// Rollup config for the wasm-transformer

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import replace from "rollup-plugin-replace";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import url from "rollup-plugin-url";
import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

const replaceNodeOptions = {
  delimiters: ["", ""],
  values: {
    "/*ROLLUP_REPLACE_NODE": "",
    "ROLLUP_REPLACE_NODE*/": ""
  }
};

const replaceBrowserOptions = {
  delimiters: ["", ""],
  values: {
    "/*ROLLUP_REPLACE_BROWSER": "",
    "ROLLUP_REPLACE_BROWSER*/": ""
  }
};

const replaceInlineOptions = {
  delimiters: ["", ""],
  values: {
    "/*ROLLUP_REPLACE_INLINE": "",
    "ROLLUP_REPLACE_INLINE*/": ""
  }
};

const inlineUrlPlugin = url({
  limit: 1000000000000 * 1024, // Always inline
  include: ["**/*.wasm"],
  emitFiles: true
});

const plugins = [
  resolve({ preferBuiltins: true }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  process.env.PROD ? compiler() : undefined,
  process.env.PROD ? bundleSize() : undefined
];

const libBundles = [
  {
    input: "./lib/browser.js",
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: [replace(replaceBrowserOptions), ...plugins]
  }
];

export default libBundles;
