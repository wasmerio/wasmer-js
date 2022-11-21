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

> Check the Node usage examples in https://github.com/wasmerio/wasmer-js/tree/main/examples/node

### Deno

This package is published in Deno in the `wasm` package, you can import it directly with:

```ts
import { init, WASI } from 'https://deno.land/x/wasm/wasi.ts';
```

> Check the Deno usage Examples in https://github.com/wasmerio/wasmer-js/tree/main/examples/deno

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

<!-- Please check the full API documents here:
https://docs.wasmer.io/integrations/js/reference-api -->

### Typescript API

```typescript
export class WASI {
  constructor(config: any);
  readonly fs: MemFS;

  instantiate(module: any, imports: object): WebAssembly.Instance;
  // Start the WASI Instance, it returns the status code when calling the start
  // function
  start(instance: WebAssembly.Instance): number;
  // Get the stdout buffer
  // Note: this method flushes the stdout
  getStdoutBuffer(): Uint8Array;
  // Get the stdout data as a string
  // Note: this method flushes the stdout
  getStdoutString(): string;
  // Get the stderr buffer
  // Note: this method flushes the stderr
  getStderrBuffer(): Uint8Array;
  // Get the stderr data as a string
  // Note: this method flushes the stderr
  getStderrString(): string;
  // Set the stdin buffer
  setStdinBuffer(buf: Uint8Array): void;
  // Set the stdin data as a string
  setStdinString(input: string): void;
}

export class MemFS {
  constructor();
  readDir(path: string): Array<any>;
  createDir(path: string): void;
  removeDir(path: string): void;
  removeFile(path: string): void;
  rename(path: string, to: string): void;
  metadata(path: string): object;
  open(path: string, options: any): JSVirtualFile;
}

export class JSVirtualFile {
  lastAccessed(): BigInt;
  lastModified(): BigInt;
  createdTime(): BigInt;
  size(): BigInt;
  setLength(new_size: BigInt): void;
  read(): Uint8Array;
  readString(): string;
  write(buf: Uint8Array): number;
  writeString(buf: string): number;
  flush(): void;
  seek(position: number): number;
}
```

## Building

To build this library you will need to have installed in your system:

* Node.JS
* [Rust][Rust]
* [wasm-pack][wasm-pack]
* [wabt][wabt] (for `wasm-strip`)
* [binaryen][binaryen] (for `wasm-opt`)

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
