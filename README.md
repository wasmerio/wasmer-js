# JavaScript WASI

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/wasmerio/js-wasi.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/wasmerio/js-wasi.svg)](https://travis-ci.org/wasmerio/js-wasi)
[![Coveralls](https://img.shields.io/coveralls/wasmerio/js-wasi.svg)](https://coveralls.io/github/wasmerio/js-wasi)
[![Dev Dependencies](https://david-dm.org/wasmerio/js-wasi/dev-status.svg)](https://david-dm.org/wasmerio/js-wasi?type=dev)

## Install

You 
```bash
npm install --save @wasmer/wasi
```

## Examples

```js
import { WASI } from "@wasmer/wasi";

// Instantiate a new WASI Instance
let wasi = new WASI({
  // The pre-opened dirctories
  preopenDirectories: {},
  // The environment vars
  env: {
  },
  // The arguments provided
  args: [],
  // The bindings (fs, path), useful for using WASI in diferent environments
  // such as Node.js, Browsers, ...
  bindings: {
    ...WASI.defaultConfig.bindings
  }
})

// Instantiating the WebAssembly file
const wasm_bytes = new Uint8Array(fs.readFileSync(file)).buffer
let { instance } = await WebAssembly.instantiate(bytes, { wasi_unstable: wasi.exports });

// Plug the Instance into WASI
wasi.setMemory(instance.exports.memory)

// Start the WebAssembly WASI instance!
instance.exports._start()
```

### Develop

First, clone the project locally:

```bash
git clone https://github.com/wasmerio/js-wasi
cd js-wasi

npm install
```

### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Run `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run precompile`: Precompile all the source files (requires Rust nightly) to the WebAssembly WASI binaries
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Excluding peerDependencies

On library development, one might want to set some peer dependencies, and thus remove those from the final bundle. You can see in [Rollup docs](https://rollupjs.org/#peer-dependencies) how to do that.

Good news: the setup is here for you, you must only include the dependency name in `external` property within `rollup.config.js`. For example, if you want to exclude `lodash`, just write there `external: ['lodash']`.

## Credits

This project is based from the Node implementation made by Gus Caplan: https://github.com/devsnek/node-wasi

However, `@wasmer/wasi` is focused on:
* Bringing WASI to the Browsers (so it can be used in [WAPM](https://wapm.io/))
* Make easy to plug different filesystems (via [memfs](https://github.com/streamich/memfs))
* Make it type-safe using [Typescript](http://www.typescriptlang.org/)

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. 
Contributions of any kind are welcome!
