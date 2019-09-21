// Rollup Config for the Wasm File System Example

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

const fs = require("fs");
const mkdirp = require("mkdirp");

let typescriptPluginOptions = {
  tsconfig: "../../tsconfig.json",
  exclude: ["./test/**/*"],
  clean: process.env.PROD ? true : false
};

let plugins = [
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  process.env.PROD ? compiler() : undefined,
  process.env.PROD ? bundleSize() : undefined
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
        name: "WASIWapmShellDemo"
      }
    ],
    watch: {
      clearScreen: false
    },
    plugins: plugins
  }
];

export default fileSystemBundles;
