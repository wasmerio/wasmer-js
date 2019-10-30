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

let typescriptPluginOptions = {
  tsconfig: "../../tsconfig.json",
  exclude: ["./test/**/*"],
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
};

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

// Need to replace this line for commonjs, as the import.meta object doesn't exist in node
const replaceWASIJsTransformerOptions = {
  delimiters: ["", ""],
  values: {
    "module = import.meta.url.replace": "// Replace by rollup"
  }
};

const inlineUrlPlugin = url({
  limit: 1000000000000 * 1024, // Always inline
  include: ["**/*.wasm"],
  emitFiles: true
});

const plugins = [
  replace(replaceWASIJsTransformerOptions),
  resolve({ preferBuiltins: true }),
  typescript(typescriptPluginOptions),
  commonjs(),
  globals(),
  builtins(),
  json(),
  // process.env.PROD ? compiler() : undefined,
  process.env.PROD ? bundleSize() : undefined
];

const unoptimizedBrowserPlugins = [
  replace(replaceBrowserOptions),
  inlineUrlPlugin,
  ...plugins
];

const optimizedBrowserPlugins = [replace(replaceBrowserOptions), ...plugins];

const unoptimizedBundles = [
  {
    input: "./src/unoptimized.ts",
    output: {
      file: "lib/unoptimized/wasm-transformer.esm.js",
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: unoptimizedBrowserPlugins
  },
  {
    input: "./src/unoptimized.ts",
    output: {
      file: "lib/unoptimized/wasm-transformer.iife.js",
      format: "iife",
      name: "WasmTransformer",
      exports: "named",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: unoptimizedBrowserPlugins
  }
];

const optimizedBundles = [
  {
    input: "./src/optimized.ts",
    output: {
      file: "lib/optimized/wasm-transformer.esm.js",
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: optimizedBrowserPlugins
  },
  {
    input: "./src/optimized.ts",
    output: {
      file: "lib/optimized/wasm-transformer.iife.js",
      format: "iife",
      name: "WasmTransformer",
      exports: "named",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: optimizedBrowserPlugins
  }
];

const libBundles = [...unoptimizedBundles, ...optimizedBundles];

export default libBundles;
