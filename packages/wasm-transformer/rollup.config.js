// Rollup config for the wasm-transformer

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
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
  commonjs(),
  globals(),
  builtins(),
  json(),
  // Closure Compiler does not like the wasm-pack output
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
    input: "./lib/unoptimized.js",
    output: {
      file: "dist/unoptimized/wasm-transformer.esm.js",
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: unoptimizedBrowserPlugins
  },
  {
    input: "./lib/unoptimized.js",
    output: {
      file: "dist/unoptimized/wasm-transformer.iife.js",
      format: "iife",
      name: "WasmTransformer",
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
    input: "./lib/optimized.js",
    output: {
      file: "dist/optimized/wasm-transformer.esm.js",
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: optimizedBrowserPlugins
  },
  {
    input: "./lib/optimized.js",
    output: {
      file: "dist/optimized/wasm-transformer.iife.js",
      format: "iife",
      name: "WasmTransformer",
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
