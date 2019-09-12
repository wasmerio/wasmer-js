// Rollup Config for Web Workers

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
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
  exclude: ["./test/**/*"],
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
};

const plugins = [
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  process.env.PROD ? terser() : undefined,
  process.env.PROD ? bundleSize() : undefined
];

const workerBundles = [
  {
    input: "./workers/process.worker.ts",
    output: [
      {
        file: "dist/workers/process.worker.js",
        format: "iife",
        sourcemap: sourcemapOption,
        name: "Process"
      }
    ],
    watch: {
      clearScreen: false
    },
    plugins: plugins
  }
];

export default workerBundles;
