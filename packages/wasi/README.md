# @wasmer/wasi

Isomorphic library for interacting with WASI Modules within Javascript easily. 📚

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Reference API](#reference-api)
- [Contributing](#contributing)

## Features

This project is forked from [node-wasi](https://github.com/devsnek/node-wasi), a Node implementation made by Gus Caplan. 🙏😄

However, `@wasmer/wasi` is focused on:

- Bringing [WASI](https://wasi.dev/) to an Isomorphic context (Node.js and the Browser) 🖥️
- Make it easy to plug in different filesystems (via [wasmfs](../wasmfs)) 📂
- Make it type-safe using [Typescript](http://www.typescriptlang.org/) 👷
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
let wasi = new WASI();

// Instantiating the WebAssembly file
const wasm_bytes = new Uint8Array(fs.readFileSync(file)).buffer;
let { instance } = await WebAssembly.instantiate(bytes, {
  wasi_unstable: wasi.exports
});

// Plug the Instance into WASI
wasi.bind(instance);

// Start the WebAssembly WASI instance!
instance.exports._start();
```

For a larger end-to-end example, please see the [wasm-terminal package]('../wasm-terminal').

## Reference API

`new WASI(wasiConfigObject)`

Constructs a new WASI instance.

The Config object is is as follows:

```js
let myWasiInstance = new WASI({
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

And returns a Wasi Instance:

```
console.log(myWasiInstance);
/*

Would Output:

{
  memory: WebAssembly.Memory;
  view: DataView;
  FD_MAP: Map<number, File>;
  exports: Exports; // Wasi API to be imported in the importObject on instantiation.
  bindings: WASIBindings;
}
*/

```

---

`WASI.defaultBindings`

The [default bindings](./lib/bindings) for the environment that are set on the `bindings` property of the constructor config object. This is useful for use cases like, you want to plugin in your own file system. For example:

```
const myFs = require('fs');

let wasi = new WASI({
  preopenDirectories: {},
  env: {
  },
  args: [],
  bindings: {
  fs: myFs,
  ...WASI.defaultConfig.bindings
  }
});
```

## Contributing

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
