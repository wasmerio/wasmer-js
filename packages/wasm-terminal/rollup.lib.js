// Rollup Config for the WAPM Shell Example

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import replace from "rollup-plugin-replace";
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import copy from "rollup-plugin-copy";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import url from "rollup-plugin-url";
import bundleSize from "rollup-plugin-bundle-size";
import alias from "rollup-plugin-alias";
import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

let typescriptPluginOptions = {
  tsconfig: "../../tsconfig.json",
  exclude: ["./test/**/*"],
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
};

// Need to replace this line for commonjs, as the import.meta object doesn't exist in node
const replaceWASIJsTransformerOptions = {
  delimiters: ["", ""],
  values: {
    "module = import.meta.url.replace": "// Replace by rollup"
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
  include: ["**/*.worker.js"],
  emitFiles: true
});

let plugins = [
  replace(replaceWASIJsTransformerOptions),
  // Including comlink from source:
  // https://github.com/GoogleChromeLabs/comlink/issues/366
  alias({
    resolve: [".js", ".ts"],
    entries: [
      {
        find: "comlink",
        replacement: `${__dirname}/node_modules/comlink/src/comlink`
      }
    ]
  }),
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  // Copy over some assets for running the wasm terminal
  copy({
    targets: [
      { src: "./node_modules/xterm/css/xterm.css", dest: "dist/xterm/" }
    ]
  }),
  process.env.PROD ? compiler() : undefined,
  process.env.PROD ? bundleSize() : undefined
];

const unoptimizedPlugins = [
  replace(replaceInlineOptions),
  inlineUrlPlugin,
  ...plugins
];

const unoptimizedBundles = [
  {
    input: "./lib/index.ts",
    output: {
      file: "dist/unoptimized/wasm-terminal.esm.js",
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: unoptimizedPlugins
  },
  {
    input: "./lib/index.ts",
    output: {
      file: "dist/unoptimized/wasm-terminal.iife.js",
      format: "iife",
      sourcemap: sourcemapOption,
      name: "WasmTerminal",
      exports: "named"
    },
    watch: {
      clearScreen: false
    },
    plugins: unoptimizedPlugins
  }
];

const optimizedBundles = [
  {
    input: "./lib/index.ts",
    output: {
      file: "dist/optimized/wasm-terminal.esm.js",
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
      file: "dist/optimized/wasm-terminal.iife.js",
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

const libBundles = [...unoptimizedBundles, ...optimizedBundles];

export default libBundles;
