// Rollup Config for the Wapm Shell Example

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";

import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

let typescriptPluginOptions = {
  tsconfig: "../../tsconfig.json",
  clean: process.env.PROD ? true : false
};

let plugins = [
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  builtins(),
  json(),
  process.env.PROD ? compiler() : undefined,
  process.env.PROD ? bundleSize() : undefined
];

const libBundles = [
  {
    input: "./lib/index.ts",
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: plugins
  },
  {
    input: "./lib/index.ts",
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: plugins
  },
  {
    input: "./lib/index.ts",
    output: {
      file: pkg.browser,
      format: "iife",
      sourcemap: sourcemapOption,
      name: "WasmTerminal"
    },
    watch: {
      clearScreen: false
    },
    plugins: plugins
  }
];

export default libBundles;
