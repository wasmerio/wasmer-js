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

const replaceInlineOptions = {
  delimiters: ["", ""],
  values: {
    "/*ROLLUP_REPLACE_INLINE": "",
    "ROLLUP_REPLACE_INLINE*/": ""
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

const inlinedBrowserPlugins = [
  replace(replaceInlineOptions),
  replace(replaceBrowserOptions),
  inlineUrlPlugin,
  ...plugins
];

const prodBrowserPlugins = [replace(replaceBrowserOptions), ...plugins];

const inlinedBundles = [
  {
    input: "./lib/browser.js",
    output: {
      file: "dist/wasm-transformer.inlined.esm.js",
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: inlinedBrowserPlugins
  },
  {
    input: "./lib/browser.js",
    output: {
      file: "dist/wasm-transformer.inlined.iife.js",
      format: "iife",
      name: "WasmTransformer",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: inlinedBrowserPlugins
  }
];

const prodBundles = [
  {
    input: "./lib/browser.js",
    output: {
      file: "dist/wasm-transformer.prod.esm.js",
      format: "esm",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: prodBrowserPlugins
  },
  {
    input: "./lib/browser.js",
    output: {
      file: "dist/wasm-transformer.prod.iife.js",
      format: "iife",
      name: "WasmTransformer",
      sourcemap: sourcemapOption
    },
    watch: {
      clearScreen: false
    },
    plugins: prodBrowserPlugins
  }
];

const libBundles = [...inlinedBundles, ...prodBundles];

export default libBundles;
