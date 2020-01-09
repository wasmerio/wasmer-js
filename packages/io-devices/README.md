# `@wasmer/io-devices`

Isomorphic library to implement the experimental Wasmer I/O devices for the Wasmer-JS stack 🖼️🎮

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Features

This package provides the following features:

- Scaffolds files used by the [Wasmer Runtime I/O Devices](https://docs.wasmer.io/runtime/runtime), to allow WASI moduels that depend on these interfaces to run in the browser and Node! 📁
- Allows readiing the current RGBA FrameBuffer. 🖼️
- Can send input events to the I/O Devices interface. ⌨️

## Installation

For installing `@wasmer/io-devices`, just run this command in your shell:

```bash
npm install --save @wasmer/io-devices
```

## Quick Start

```js
import { WasmFs } from "@wasmer/wasmfs";
import { IoDevices } from "@wasmer/io-devices";

const wasmFs = new WasmFs();
const ioDevices = new IoDevices(wasmFs);

// TODO:
```

## Documentation

For documentation for this package, please see the [Wasmer-JS Docs](https://docs.wasmer.io/wasmer-js/wasmer-js).

## Contributing

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
