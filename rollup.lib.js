// Rollup config for the WASI Lib

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import json from "rollup-plugin-json";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";

// Utility functions
const envExtension = process.env.PROD ? "" : ".dev";
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
        file: `dist/index.cjs${envExtension}.js`,
        format: "cjs",
        sourcemap: sourcemapOption
      },
      {
        file: `dist/index.esm${envExtension}.js`,
        format: "esm",
        sourcemap: sourcemapOption
      },
      {
        file: `dist/index.iife${envExtension}.js`,
        format: "iife",
        sourcemap: sourcemapOption,
        name: "Wasi"
      }
    ],
    plugins: plugins
  }
];

export default libBundles;
