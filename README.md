# <img height="48" src="https://raw.githubusercontent.com/wasmerio/wasmer/master/assets/logo.png" alt="Wasmer logo" valign="middle"> Wasmer JS [![Wasmer Slack Channel](https://img.shields.io/static/v1?label=chat&message=on%20Slack&color=green)](https://slack.wasmer.io)

This repository consists of multiple packages:
* [Wasmer WASI](#wasmer-wasi)

# Wasmer WASI

Isomorphic Javascript library for interacting with WASI Modules in Node.js, the Browser and [Deno](https://deno.land/x/wasm).
The Javascript Package supports:
* [X] WASI (with command args, envs and stdio)
* [X] In-Memory filesystem (MemFS)

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

## API Docs

Please check the full API documents here:
https://docs.wasmer.io/integrations/js/reference-api

### Typescript API

```typescript
export class WASI {
  free(): void;
/**
* @param {any} config
*/
  constructor(config: any);
/**
* @param {any} module
* @param {object} imports
*/
  instantiate(module: any, imports: object): void;
/**
* Start the WASI Instance, it returns the status code when calling the start
* function
* @returns {number}
*/
  start(): number;
/**
* Get the stdout buffer
* Note: this method flushes the stdout
* @returns {Uint8Array}
*/
  getStdoutBuffer(): Uint8Array;
/**
* Get the stdout data as a string
* Note: this method flushes the stdout
* @returns {string}
*/
  getStdoutString(): string;
/**
* Get the stderr buffer
* Note: this method flushes the stderr
* @returns {Uint8Array}
*/
  getStderrBuffer(): Uint8Array;
/**
* Get the stderr data as a string
* Note: this method flushes the stderr
* @returns {string}
*/
  getStderrString(): string;
/**
* Set the stdin buffer
* @param {Uint8Array} buf
*/
  setStdinBuffer(buf: Uint8Array): void;
/**
* Set the stdin data as a string
* @param {string} input
*/
  setStdinString(input: string): void;
/**
* @returns {MemFS}
*/
  readonly fs: MemFS;
}

/**
*/
export class MemFS {
  free(): void;
/**
*/
  constructor();
/**
* @param {string} path
* @returns {Array<any>}
*/
  readDir(path: string): Array<any>;
/**
* @param {string} path
*/
  createDir(path: string): void;
/**
* @param {string} path
*/
  removeDir(path: string): void;
/**
* @param {string} path
*/
  removeFile(path: string): void;
/**
* @param {string} path
* @param {string} to
*/
  rename(path: string, to: string): void;
/**
* @param {string} path
* @returns {object}
*/
  metadata(path: string): object;
/**
* @param {string} path
* @param {any} options
* @returns {JSVirtualFile}
*/
  open(path: string, options: any): JSVirtualFile;
}


export class JSVirtualFile {
  free(): void;
/**
* @returns {BigInt}
*/
  lastAccessed(): BigInt;
/**
* @returns {BigInt}
*/
  lastModified(): BigInt;
/**
* @returns {BigInt}
*/
  createdTime(): BigInt;
/**
* @returns {BigInt}
*/
  size(): BigInt;
/**
* @param {BigInt} new_size
*/
  setLength(new_size: BigInt): void;
/**
* @returns {Uint8Array}
*/
  read(): Uint8Array;
/**
* @returns {string}
*/
  readString(): string;
/**
* @param {Uint8Array} buf
* @returns {number}
*/
  write(buf: Uint8Array): number;
/**
* @param {string} buf
* @returns {number}
*/
  writeString(buf: string): number;
/**
*/
  flush(): void;
/**
* @param {number} position
* @returns {number}
*/
  seek(position: number): number;
}

/**
* A struct representing an aborted instruction execution, with a message
* indicating the cause.
*/
export class WasmerRuntimeError {
  free(): void;
}
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
