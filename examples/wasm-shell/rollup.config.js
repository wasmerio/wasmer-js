// Rollup Config for the WAPM Shell Example
// NOTE: URLs are relative to the project root for this rollup config

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import hash from "rollup-plugin-hash";
import url from "rollup-plugin-url";
import serve from "rollup-plugin-serve";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";

const sourcemapOption = process.env.PROD ? undefined : "inline";

const fs = require("fs");
const mkdirp = require("mkdirp");

const writeIndexHtml = bundleName => {
  let indexHtml = fs.readFileSync("examples/wasm-shell/index.html", "utf8");
  indexHtml = indexHtml.replace(
    "<%BUNDLE%>",
    bundleName.replace("dist/examples/wasm-shell/", "")
  );
  mkdirp.sync("dist/examples/wasm-shell/", { recursive: true });
  fs.writeFileSync("dist/examples/wasm-shell/index.html", indexHtml, "utf8");
};

let typescriptPluginOptions = {
  tsconfig: "./tsconfig.json",
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
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
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  json(),
  process.env.PROD ? compiler() : undefined,
  bundleSize()
];

let workerPlugins = [
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  builtins(),
  globals(),
  json()
];

if (process.env.PROD) {
  plugins = [
    ...plugins,
    hash({
      dest: "dist/examples/wasm-shell/bundle.[hash].js",
      callback: bundleName => {
        writeIndexHtml(bundleName);
      }
    })
  ];
} else {
  plugins = [
    ...plugins,
    serve({
      contentBase: ["dist/"],
      port: 8000
    })
  ];
  writeIndexHtml("index.iife.js");
}

const wasmShellBundles = [
  {
    input: "examples/wasm-shell/index.tsx",
    output: [
      {
        file: "dist/examples/wasm-shell/index.iife.js",
        format: "iife",
        sourcemap: sourcemapOption,
        name: "WASIWAPMShellDemo"
      }
    ],
    watch: {
      clearScreen: false
    },
    plugins: plugins
  },
  {
    input: "packages/wasm-terminal/workers/process.worker.ts",
    output: [
      {
        file: "dist/examples/wasm-shell/process.worker.js",
        format: "iife",
        sourcemap: sourcemapOption,
        name: "Process"
      }
    ],
    watch: {
      clearScreen: false
    },
    plugins: workerPlugins
  }
];

export default wasmShellBundles;
