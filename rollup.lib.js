// Rollup config for the WASI Lib

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import json from "rollup-plugin-json";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import pkg from "./package.json";

const sourcemapOption = process.env.PROD ? undefined : "inline";

let typescriptPluginOptions = {
  tsconfig: "./tsconfig.json"
};

const plugins = [
  typescript(typescriptPluginOptions),
  resolve(),
  commonjs(),
  json(),
  compiler(),
  bundleSize()
];

const libBundles = [
  {
    input: "lib/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: sourcemapOption
      },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: sourcemapOption
      },
      {
        file: pkg.browser,
        format: "iife",
        sourcemap: sourcemapOption,
        name: "Wasi"
      }
    ],
    watch: {
      clearScreen: false
    },
    plugins: plugins
  }
];

export default libBundles;
