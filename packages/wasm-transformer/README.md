# wasm-transformer

Library to run transformations on WebAssembly binaries. 🦀♻️

**This README covers the instructions for installing, using, and contributing to the `wasm-transformer` Javascript package. [The `wasm_transformer` Rust crate is available here](../../packages/wasm-transformer).**

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Node](#node)
  - [Unoptimized Browser](#unoptimized-browser)
  - [Optimized Browser](#optimized-browser)
- [Reference API](#reference-api)
  - [Node](#node-1)
  - [Unoptimized Browser](#unoptimized-browser-1)
  - [Optimized Browser](#optimized-browser-1)
- [Contributing](#contributing)
  - [Guidelines](#guidelines)
  - [Building the project](#building-the-project)

## Features

This project depends on [wasmparser](https://github.com/yurydelendik/wasmparser.rs), and the [wasm-pack](https://github.com/rustwasm/wasm-pack) workflow. Huge shoutout to them! 🙏

- Runs transformations on Wasm binaries to modify the actual code that gets run, and introduces new features (such as introducing trampoline functions for i64 WASI imports). ✨

- Installable on both crates.io, and npm! 📦

- The project builds with [wasm-pack](https://github.com/rustwasm/wasm-pack). Thus, you can use this library in a Javascript library, to modify WebAssembly Binaries, with WebAssembly. 🤯

- Super fast! Can run the `lower_i64_imports` transformations on my 2018 MackBook Pro, with the Chrome Devtools 6x CPU slowdown in ~ 1 second. ⚡

## Installation

```
npm install --save @wasmer/wasm-transformer
```

## Quick Start

For a larger example, see the [wasm-terminal](../../packages/wasm-terminal) package.

### Node

```js
const wasmTransformer = require("@wasmer/wasm-transformer");

// Read in the input Wasm file
const wasmBuffer = fs.readFileSync("./my-wasm-file.wasm");

// Transform the binary
const wasmBinary = new Uint8Array(wasmBuffer);
const loweredBinary = wasmTransformer.lowerI64Imports(wasmBinary);

// Do something with loweredBinary
```

### Unoptimized Browser

The default import of `@wasmer/wasm-transformer` points to the unoptimized bundle. This bundle **has the wasm file from the `wasm_transformer` crate as a Base64 encoded URL in the bundle.** This is done for convenience and developer experience. However, there are use cases where we you might don't want to use the inlined Wasm (for example, when working with [PWAs](https://developers.google.com/web/progressive-web-apps)) For that case, you should be using the `@wasmer/wasm-transformer/lib/optimized` version.

```js
import { lowerI64Imports } from "@wasmer/wasm-transformer";

const fetchAndTransformWasmBinary = async () => {
  // Get the original Wasm binary
  const fetchedOriginalWasmBinary = await fetch("/original-wasm-module.wasm");
  const originalWasmBinaryBuffer = await fetchedOriginalWasmBinary.arrayBuffer();
  const originalWasmBinary = new Uint8Array(originalWasmBinaryBuffer);

  // Transform the binary, by running the lower_i64_imports from the wasm-transformer
  const transformedBinary = await lowerI64Imports(originalWasmBinary);

  // Compile the transformed binary
  const transformedWasmModule = await WebAssembly.compile(transformedBinary);
  return transformedWasmModule;
};
```

### Optimized Browser

Optimized bundles do not have the `wasm_transformer` rust crate `.wasm` inlined. Thus, it must be manually passed in.

```js
import {
  wasmTransformerInit
  lowerI64Imports
} from "@wasmer/wasm-transformer/optimized/wasm-transformer.esm.js";

const fetchAndTransformWasmBinary = async () => {
  // Get the original Wasm binary
  const fetchedOriginalWasmBinary = await fetch("/original-wasm-module.wasm");
  const originalWasmBinaryBuffer = await fetchedOriginalWasmBinary.arrayBuffer();
  const originalWasmBinary = new Uint8Array(originalWasmBinaryBuffer);

  // Initialize our wasm-transformer
  await wasmTransformerInit(
    "node_modules/@wasmer/wasm-transformer/wasm-transformer.wasm"
  ); // IMPORTANT: This URL points to wherever the wasm-transformer.wasm is hosted

  // Transform the binary, by running the lower_i64_imports from the wasm-transformer
  const transformedBinary = lowerI64Imports(originalWasmBinary);

  // Compile the transformed binary
  const transformedWasmModule = await WebAssembly.compile(transformedBinary);
  return transformedWasmModule;
};
```

## Documentation

For documentation on `@wasmer/wasm-terminal`, such as additional examples and a Reference API. Please take a look at the [Wasmer Docs](https://docs.wasmer.io/wasmer-js/wasmer-js).

## Contributing

### Guidelines

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍

### Building the project

To get started using the project:

- Set up the [`wasm_transformer` rust crate](../../crates/wasm_transformer)

- Install the latest LTS version of Node.js (which includes `npm` and `npx`). An easy way to do so is with nvm. (Mac and Linux: [here](https://github.com/creationix/nvm), Windows: [here](https://github.com/coreybutler/nvm-windows)).

- `npm run build`.
