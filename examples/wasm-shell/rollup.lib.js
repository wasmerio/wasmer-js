// Rollup Config for the Wapm Shell Example

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import replace from "rollup-plugin-replace";
import copy from "rollup-plugin-copy";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import bundleSize from "rollup-plugin-bundle-size";
import hash from "rollup-plugin-hash";
import url from "rollup-plugin-url";
import serve from "rollup-plugin-serve";

const sourcemapOption = process.env.PROD ? undefined : "inline";

const fs = require("fs");
const mkdirp = require("mkdirp");

const writeIndexHtml = bundleName => {
  let indexHtml = fs.readFileSync("examples/wapm-shell/index.html", "utf8");
  indexHtml = indexHtml.replace(
    "<%BUNDLE%>",
    bundleName.replace("dist/examples/wapm-shell/", "")
  );
  mkdirp.sync("dist/examples/wapm-shell/", { recursive: true });
  fs.writeFileSync("dist/examples/wapm-shell/index.html", indexHtml, "utf8");
};

let typescriptPluginOptions = {
  tsconfig: "./tsconfig.json",
  clean: process.env.PROD ? true : false,
  objectHashIgnoreUnknownHack: true
};

const replaceBrowserOptions = {
  delimiters: ["", ""],
  values: {
    "/*ROLLUP_REPLACE_BROWSER": "",
    "ROLLUP_REPLACE_BROWSER*/": "",
    // Replace a weird global import object that conflicts with rollup-plugin-node-globals
    "module = import.meta.url.replace": "// Replace by rollup"
  }
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
  replace(replaceBrowserOptions),
  typescript(typescriptPluginOptions),
  resolve({
    preferBuiltins: true
  }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  copy({
    targets: [
      {
        src: "examples/wapm-shell/assets/binaryen-88.0.0.js",
        dest: "dist/examples/wapm-shell/assets/"
      }
    ]
  }),
  process.env.PROD ? compiler() : undefined,
  bundleSize()
];

if (process.env.PROD) {
  plugins = [
    ...plugins,
    hash({
      dest: "dist/examples/wapm-shell/bundle.[hash].js",
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

const wapmShellBundles = [
  {
    input: "examples/wapm-shell/index.tsx",
    output: [
      {
        file: "dist/examples/wapm-shell/index.iife.js",
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

export default wapmShellBundles;
