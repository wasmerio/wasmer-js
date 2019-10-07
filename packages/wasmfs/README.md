# `@wasmer/wasmfs`

Isomorphic library to provide a sandboxed [node `fs`](https://nodejs.org/api/fs.html) implementation for Node and Browsers. 📂

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Reference API](#reference-api)
- [Contributing](#contributing)

## Features

This project forks [memfs](https://github.com/streamich/memfs) with custom fixes to work properly with the WebAssembly/WASI ecosystem.

This package provides the following features:

- In-memory file-system with Node's fs API using [memfs](https://github.com/streamich/memfs). 🗄️
- Scaffolds common files used by the [Wasmer Runtime](https://github.com/wasmerio/wasmer) (e.g I/O Device files like `/dev/stdout`), to provide a similar experience to the Wasmer Runtime. 🔌
- Provides convienence functions for grabbing Input / Output. ↔️
- Allows overriding read/write of individual files to allow for custom implementations. 🛠️

## Installation

For installing `@wasmer/wasmfs`, just run this command in your shell:

```bash
npm install --save @wasmer/wasmfs
```

## Quick Start

```js
import { WasmFs } from '@wasmer/wasmfs';

const wasmFs = new WasmFs();

wasmFs.fs.writeFileSync('/dev/stdout', 'Quick Start!');

wasmFs.getStdOut().then(response => {
  console.log(response); // Would log: 'Quick Start!'
});
```

For a larger end-to-end example, please see the [`@wasmer/wasm-terminal` package](https://github.com/wasmerio/wasmer-js/tree/master/packages/wasm-terminal).

## Reference API

`wasmFs.fs`

[memfs](https://github.com/streamich/memfs)' [node fs](https://nodejs.org/api/fs.html) implementation object. See the [node fs documentation](https://nodejs.org/api/fs.html) for API usage.

**NOTE:** The functions on this `fs` implementation can easily be overriden to provide custom functionality when your wasm module (running with [`@wasmer/wasi`](https://github.com/wasmerio/wasmer-js/tree/master/packages/wasi)) tries to do file system operations. For example:

```js
const wasmFs = new WasmFs();

const originalWriteFileSync = wasmFs.fs.writeFileSync;
wasmFs.fs.writeFileSync = (path, text) => {
  console.log('File written:', path);
  originalWriteFileSync(path, text);
};

wasmFs.fs.writeFileSync('/dev/stdout', 'Quick Start!');

// Would log: "File written: /dev/stdout"
```

---

`wasmFs.getStdOut()`

Function that returns a promise that resolves a string. With the file contents of `/dev/stdout`.

## Contributing

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
