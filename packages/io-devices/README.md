# `@wasmer/wasmfs-io-devices`

Isomorphic library to implement the experimental Wasmer I/O devices for wasmfs instances 🖼️🎮

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

For installing `@wasmer/wasmfs-io-devices`, just run this command in your shell:

```bash
npm install --save @wasmer/wasmfs-io-devices
```

## Quick Start

```js
import { WasmFs } from "@wasmer/wasmfs";
import { WasmFsIoDevices } from "@wasmer/wasmfs-io-devices";

const wasmFs = new WasmFs();
const wasmFsIoDevices = new WasmFsIoDevices(wasmFs);

// Fill the framebuffer, for example, here

// Get the current framebuffer
const rgbaFramebuffer = wasmFsIoDevices.getFrameBuffer();

// Handle input events
document.addEventListener("keydown", wasmFsIoDevices.eventListenerKeydown);
document.addEventListener("keyup", wasmFsIoDevices.eventListenerKeyup);
document.addEventListener("mousemove", wasmFsIoDevices.eventListenerMousemove);
document.addEventListener("click", wasmFsIoDevices.eventListenerClick);
```

## Documentation

For documentation for this package, please see the [Wasmer-JS Docs](https://docs.wasmer.io/wasmer-js/wasmer-js).

## Contributing

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
