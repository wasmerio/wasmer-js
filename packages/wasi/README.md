# `@wasmer/wasi`

Isomorphic Javascript library for interacting with WASI Modules in Node.js and the Browser. 📚

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Reference API](#reference-api)
- [Contributing](#contributing)

## Features

This project is forked from [node-wasi](https://github.com/devsnek/node-wasi), a Node implementation made by Gus Caplan. 🙏😄
It uses the same API than the [future WASI integration in Node](https://github.com/nodejs/wasi), to help transition to it once it becomes available in Node.

However, `@wasmer/wasi` is focused on:

- Bringing [WASI](https://github.com/webassembly/wasi) to an Isomorphic context (Node.js and the Browser) 🖥️
- Make it easy to plug in different filesystems (via [wasmfs](https://github.com/wasmerio/wasmer-js/tree/master/packages/wasmfs)) 📂
- Make it type-safe using [Typescript](http://www.typescriptlang.org/) 👷
- Pure JavaScript implementation (no Native bindings needed) 🚀
- ~ 15KB minified + gzipped 📦

## Installation

For instaling `@wasmer/wasi`, just run this command in your shell:

```bash
npm install --save @wasmer/wasi
```

## Quick Start

```js
import WASI from "@wasmer/wasi";

// Instantiate a new WASI Instance
let wasi = new WASI({ args: [], env: {} });

// Instantiating the WebAssembly file
const wasm_bytes = new Uint8Array(fs.readFileSync(file)).buffer;
let { instance } = await WebAssembly.instantiate(bytes, {
  wasi_unstable: wasi.wasiImport
});

// Start the WebAssembly WASI instance!
wasi.start(instance);
```

For a larger end-to-end example, please see the [wasm-terminal package](https://github.com/wasmerio/wasmer-js/tree/master/packages/wasm-terminal).

## Reference API

`new WASI(wasiConfigObject)`

Constructs a new WASI instance.

The Config object is is as follows:

```js
let myWASIInstance = new WASI({
  // OPTIONAL: The pre-opened dirctories
  preopenDirectories: {},

  // OPTIONAL: The environment vars
  env: {},

  // OPTIONAL: The arguments provided
  args: [],

  // OPTIONAL: The environment bindings (fs, path),
  // useful for using WASI in diferent environments
  // such as Node.js, Browsers, ...
  bindings: {
    // hrtime: WASI.defaultConfig.bindings.hrtime,
    // exit: WASI.defaultConfig.bindings.exit,
    // kill: WASI.defaultConfig.bindings.kill,
    // randomFillSync: WASI.defaultConfig.bindings.randomFillSync,
    // isTTY: WASI.defaultConfig.bindings.isTTY,
    // fs: WASI.defaultConfig.bindings.fs,
    // path: WASI.defaultConfig.bindings.path,
    ...WASI.defaultConfig.bindings
  }
});
```

And returns a WASI Instance:

```js
console.log(myWASIInstance);
/*

Would Output:

{
  memory: WebAssembly.Memory;
  view: DataView;
  FD_MAP: Map<number, File>;
  exports: Exports; // WASI API to be imported in the importObject on instantiation.
  bindings: WASIBindings;
  start: (wasmInstance: WebAssembly.Instance) => void; // Function that takes in a WASI WebAssembly Instance and starts it.
}
*/
```

---

`WASI.defaultBindings`

The [default bindings](./lib/bindings) for the environment that are set on the `bindings` property of the constructor config object. This is useful for use cases like, you want to plugin in your own file system. For example:

```js
const myFs = require("fs");

let wasi = new WASI({
  preopenDirectories: {},
  env: {},
  args: [],
  bindings: {
    fs: myFs,
    ...WASI.defaultBindings
  }
});
```

## Contributing

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
