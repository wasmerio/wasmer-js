// Rollup Config for the Wasm File System Example

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import replace from "rollup-plugin-replace";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import url from "rollup-plugin-url";
import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

const fs = require("fs");
const mkdirp = require("mkdirp");

let typescriptPluginOptions = {
  tsconfig: "./tsconfig.json",
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
};

const replaceBrowserOptions = {
  delimiters: ["", ""],
  values: {
    "/*ROLLUP_REPLACE_BROWSER": "",
    "ROLLUP_REPLACE_BROWSER*/": "",
    // Replace a weird global import object that conflicts with rollup-plugin-node-globals
    "module = import.meta.url.replace": "// Replace by rollup"
  }
};

let plugins = [
  postcss({
    extensions: [".css"],
    plugins: [postcssImport()]
  }),
  url({
    limit: 1 * 1024,
    include: ["**/*.wasm"],
    emitFiles: true
  }),
  replace(replaceBrowserOptions),
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  process.env.PROD ? compiler() : undefined,
  bundleSize()
];

const fileSystemBundles = [
  {
    input: "lib/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: sourcemapOption
      },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: sourcemapOption
      },
      {
        file: pkg.browser,
        format: "iife",
        sourcemap: sourcemapOption,
        name: "WasiWapmShellDemo"
      }
    ],
    watch: {
      clearScreen: false
    },
    plugins: plugins
  }
];

export default fileSystemBundles;
