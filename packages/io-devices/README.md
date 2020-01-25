# `@wasmer/io-devices`

Isomorphic library to implement the experimental Wasmer I/O devices for the Wasmer-JS stack 🖼️🎮

Documentation for Wasmer-JS Stack can be found on the [Wasmer Docs](https://docs.wasmer.io/wasmer-js/wasmer-js).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Features

This package provides the following features:

- Scaffolds files used by the [Wasmer Runtime I/O Devices](https://docs.wasmer.io/runtime/runtime), to allow WASI moduels that depend on these interfaces to run in the browser and Node! 📁
- Allows reading the current RGBA FrameBuffer. 🖼️
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

// Let's say we want to read the frame buffer,
// every time the buffer index display file is written to:
let callbackCalled = false;
const callback = () => {
  // Read the framebuffer
  console.log(ioDevices.getFrameBuffer); // Outputs a Uint8Array of the frame buffer

  callbackCalled = true;
};

// Set the callback, and write to the file to call it
ioDevices.setBufferIndexDisplayCallback(callback);
wasmFs.fs.writeFileSync("/_wasmer/dev/fb0/draw", "0");

callbackCalled === true; // This should be true, our callback is called!
```

`@wasmer/io-devices` is isomorphic, meaning this quick start should also work in Node with the appropriate Node syntax!

## Contributing

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
