// Rollup Config for the Wapm Shell Example

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import replace from "rollup-plugin-replace";
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import copy from "rollup-plugin-copy";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

let typescriptPluginOptions = {
  tsconfig: "../../tsconfig.json",
  exclude: ["./test/**/*"],
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

const replaceBrowserOptions = {
  delimiters: ["", ""],
  values: {
    "/*ROLLUP_REPLACE_BROWSER": "",
    "ROLLUP_REPLACE_BROWSER*/": ""
  }
};

let plugins = [
  replace(replaceBrowserOptions),
  replace(replaceWasiJsTransformerOptions),
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  // Copy over the wasi-js-transformer package to the dist folder for publishing
  // This is needed since we will want the user to pass in the transformer wasm file
  copy({
    targets: [
      { src: "../wasm_transformer/**/*", dest: "dist/wasm_transformer/" },
      { src: "./node_modules/xterm/dist/xterm.css", dest: "dist/xterm/" }
    ]
  }),
  process.env.PROD ? compiler() : undefined,
  process.env.PROD ? bundleSize() : undefined
];

const libBundles = [
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
      name: "WasmTerminal",
      exports: "named"
    },
    watch: {
      clearScreen: false
    },
    plugins: plugins
  }
];

export default libBundles;
