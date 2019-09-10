# @wasmer/wasi

JavaScript WASI is a library for interacting with WASI Modules from JavaScript easily. It's focused on compatibility with Node.js and browsers.

## Install

For instaling WASI, just run this command in your shell

```bash
npm install --save @wasmer/wasi
```

## Examples

```js
import { WASI } from "@wasmer/wasi";

// Bindings are options
// The bindings (fs, path), useful for using WASI in diferent environments
// such as Node.js, Browsers, ...
const bindings = undefined;
if (optionalAlternativeBindings) {
  bindings = optionalAlternativeBindings;
}

// Instantiate a new WASI Instance
let wasi = new WASI({
  // The pre-opened dirctories
  preopenDirectories: {},
  // The environment vars
  env: {},
  // The arguments provided
  args: [],
  bindings: bindings
});

// Instantiating the WebAssembly file
const wasm_bytes = new Uint8Array(fs.readFileSync(file)).buffer;
let { instance } = await WebAssembly.instantiate(bytes, {
  wasi_unstable: wasi.exports
});

// Plug the Instance into WASI
wasi.setMemory(instance.exports.memory);

// Start the WebAssembly WASI instance!
instance.exports._start();
```

## Credits

This project is based from the Node implementation made by Gus Caplan: https://github.com/devsnek/node-wasi

However, `@wasmer/wasi` is focused on:

- Bringing WASI to the Browsers (so it can be used in the [WAPM](https://wapm.io/) shell)
- Make easy to plug different filesystems (via [memfs](https://github.com/streamich/memfs))
- Make it type-safe using [Typescript](http://www.typescriptlang.org/)

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.
Contributions of any kind are welcome!
