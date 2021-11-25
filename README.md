# <img height="48" src="https://raw.githubusercontent.com/wasmerio/wasmer/master/assets/logo.png" alt="Wasmer logo" valign="middle"> Wasmer JS [![Wasmer Slack Channel](https://img.shields.io/static/v1?label=chat&message=on%20Slack&color=green)](https://slack.wasmer.io)

This repository consists of multiple packages:
* [Wasmer WASI](#wasmer-wasi)

# Wasmer WASI

Isomorphic Javascript library for interacting with WASI Modules in Node.js, the Browser and [Deno](https://deno.land/x/wasm) 

### NPM

For instaling `@wasmer/wasi` run this command in your shell:

```bash
npm install --save @wasmer/wasi
```

And then import it in your server or client-side code with:

```js
import { init, WASI } from '@wasmer/wasi';
```

### Deno

This package is published in Deno in the `wasm` package, you can import it direclty with:

```ts
import { init, WASI } from 'https://deno.land/x/wasm/wasi.ts';
```

## Usage

```js
// This is needed to load the WASI library first (since is a Wasm module)
await init();

let wasi = new WASI({
  env: {
      // 'ENVVAR1': '1',
      // 'ENVVAR2': '2'
  },
  args: [
      // 'command', 'arg1', 'arg2'
  ],
});

const moduleBytes = fetch("https://deno.land/x/wasm/tests/demo.wasm");
const module = await WebAssembly.compileStreaming(moduleBytes);
// Instantiate the WASI module
await wasi.instantiate(module, {});

// Run the start function
let exitCode = wasi.start();
let stdout = wasi.getStdoutString();

 // This should print "hello world (exit code: 0)"
console.log(`${stdout}(exit code: ${exitCode})`);
```

## Building

To build this library you will need to have installed in your system:

* Node.JS
* [Rust][Rust]
* [wasm-pack][wasm-pack]
* [wabt][wabt] (for `wasm-opt`)
* [binaryen][binaryen] (for `wasm-strip`)

```sh
npm i
npm run build
```

## Testing

Build the pkg and run the tests:

```sh
npm run build
npm run test
```

## Pending things to implement

Currently, the Wasmer WASI implementation is only able to execute WASI packages and read the stdout.

* [ ] API to interact with the in-memory filesystem


# What is WebAssembly?

Quoting [the WebAssembly site](https://webassembly.org/):

> WebAssembly (abbreviated Wasm) is a binary instruction format for a
> stack-based virtual machine. Wasm is designed as a portable target
> for compilation of high-level languages like C/C++/Rust, enabling
> deployment on the web for client and server applications.

About speed:

> WebAssembly aims to execute at native speed by taking advantage of
> [common hardware
> capabilities](https://webassembly.org/docs/portability/#assumptions-for-efficient-execution)
> available on a wide range of platforms.

About safety:

> WebAssembly describes a memory-safe, sandboxed [execution
> environment](https://webassembly.org/docs/semantics/#linear-memory) […].

# License

The entire project is under the MIT License. Please read [the
`LICENSE` file][license].

[license]: https://github.com/wasmerio/wasmer/blob/master/LICENSE
[Rust]: https://www.rust-lang.org/
[wasm-pack]: https://rustwasm.github.io/wasm-pack/
[wabt]: https://github.com/WebAssembly/wabt
[binaryen]: https://github.com/WebAssembly/binaryen
