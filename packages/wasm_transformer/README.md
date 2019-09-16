# wasm_transformer

Library to run transformations on WebAssembly binaries. 🦀♻️

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Rust](#rust)
  - [Javascript](#javascript)
- [Quick Start](#quick-start)
  - [Rust](#rust-1)
  - [Javascript](#javascript-1)
- [Reference API](#reference-api)
  - [Rust](#rust-2)
  - [Javascript](#javascript-2)
- [Contributing](#contributing)
  - [Guidelines](#guidelines)
  - [Building the project](#building-the-project)

## Features

This project depends on [wasmparser](https://github.com/yurydelendik/wasmparser.rs), and the [wasm-pack](https://github.com/rustwasm/wasm-pack) workflow. Huge shoutout to them! 🙏

- Runs transformations on wasm binaries to modify the actual code that gets run, and introduces new features (such as introducing trampoline functions for i64 WASI imports). ✨

- Installable on both crates.io, and npm! 📦

- The project builds with [wasm-pack](https://github.com/rustwasm/wasm-pack). Thus, you can use this library in a Javascript library, to modify WebAssembly Binaries, with WebAssembly. 🤯

- Super fast! Can run the `lower_i64_imports` transformations on my 2018 MackBook Pro, with the Chrome Devtools 6x CPU slowdown in ~ 1 second. ⚡

## Installation

### Rust

```
# Cargo.toml
[dependencies]
wasm_transformer = "LATEST_VERSION_HERE"
```

### Javascript

```
npm install --save @wasmer/wasm_transformer
```

## Quick Start

### Rust

### Javascript

```js
```

## Reference API

### Rust

### Javascript

## Contributing

### Guidelines

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍

### Building the project

To get started using the project:

- Install [Rust](https://www.rust-lang.org/tools/install).

- Install [wasm-pack](https://github.com/rustwasm/wasm-pack).

- [OPTIONAL]: For updating the `wasm_transformer` npm package, please also install the latest LTS version of Node.js (which includes `npm` and `npx`). An easy way to do so is with nvm. (Mac and Linux: [here](https://github.com/creationix/nvm), Windows: [here](https://github.com/coreybutler/nvm-windows)).

To test and build the project, run the `wasm_transformer_build.sh` script. Or, feel free to [look through the script](./wasm_transformer_build.sh) to see the documented commands for performing their respective actions individually.
