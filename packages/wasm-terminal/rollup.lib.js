// Rollup Config for the Wapm Shell Example

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import replace from "rollup-plugin-replace";
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
// Not using the closure compiler here, because it seems to have an issue
// With ComLinks Async/Await when outputing the js module
// import compiler from "@ampproject/rollup-plugin-closure-compiler";
import { terser } from "rollup-plugin-terser";
import bundleSize from "rollup-plugin-bundle-size";
import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

let typescriptPluginOptions = {
  tsconfig: "../../tsconfig.json",
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
};

// Need to replace this line for commonjs, as the import.meta object doesn't exist in node
const replaceWasiJsTransformerOptions = {
  delimiters: ["", ""],
  values: {
    "module = import.meta.url.replace": "// Replace by rollup"
  }
};

let plugins = [
  replace(replaceWasiJsTransformerOptions),
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  // process.env.PROD ? compiler() : undefined,
  process.env.PROD ? terser() : undefined,
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
