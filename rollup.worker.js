// Rollup Config for Web Workers

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

let typescriptPluginOptions = {
  tsconfig: "./tsconfig.json",
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
};

const plugins = [
  typescript(typescriptPluginOptions),
  resolve(),
  commonjs(),
  json(),
  process.env.PROD ? compiler() : undefined,
  bundleSize()
];

const workerBundles = [
  {
    input: "examples/wapm-shell/workers/process.worker.ts",
    output: [
      {
        file: "dist/examples/wapm-shell/workers/process.worker.js",
        format: "iife",
        sourcemap: sourcemapOption,
        name: "WasiWapmShellDemo"
      }
    ],
    watch: {
      clearScreen: false
    },
    plugins: plugins
  }
];

export default workerBundles;
