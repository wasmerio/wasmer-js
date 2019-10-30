// Rollup Config for Web Workers

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import alias from "rollup-plugin-alias";

const sourcemapOption = process.env.PROD ? undefined : "inline";

let typescriptPluginOptions = {
  tsconfig: "../../tsconfig.json",
  exclude: ["./test/**/*"],
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
};

const plugins = [
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
  process.env.PROD ? compiler() : undefined,
  process.env.PROD ? bundleSize() : undefined
];

const workerBundles = [
  {
    input: "./src/workers/process.worker.ts",
    output: [
      {
        file: "lib/workers/process.worker.js",
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
