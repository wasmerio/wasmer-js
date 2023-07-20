# <img height="48" src="https://raw.githubusercontent.com/wasmerio/wasmer/master/assets/logo.png" alt="Wasmer logo" valign="middle"> Wasmer JS [![Wasmer Slack Channel](https://img.shields.io/static/v1?label=chat&message=on%20Slack&color=green)](https://slack.wasmer.io)

This repository consists of the following packages:

* [Wasmer WASIX](#wasmer-wasix)

# Wasmer WASIX

~~Isomorphic~~ Javascript library for interacting with WASI(X) Modules in Node.js, the Browser and [Deno](https://deno.land/x/wasm).
The Javascript Package supports:

* [X] WASI(X) (with command args, envs, stdio, network, and tty)
* [X] In-Memory filesystem (MemFS)

### NPM

For installing `@wasmer/wasix` run this command in your shell:

```bash
npm install --save @wasmer/wasix
```

And then import it in your server or client-side code with:

```js
import init, { WASI } from '@wasmer/wasix';
```

> Check the Node usage examples in <https://github.com/wasmerio/wasmer-js/tree/main/examples/node>

### Deno

This package is published in Deno in the `wasm` package, you can import it directly with:

```ts
import init, { WASI } from 'https://deno.land/x/wasm/wasix.ts';
```

> Check the Deno usage Examples in <https://github.com/wasmerio/wasmer-js/tree/main/examples/deno>

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

// pipe wasi.stdout to `stdout` string
let stdout = "";
const DecodeStream = () => new TextDecoderStream("utf-8", { ignoreBOM: false, fatal: true });
const StdoutWritable = () => new WritableStream({
  write(chunk, _controller) { stdout += chunk; }
});
// and keep track of open handles (Promises)
const handles = [wasi.stdout.pipeThrough(DecodeStream()).pipeTo(StdoutWritable())];

const moduleBytes = fetch("https://deno.land/x/wasm/tests/demo.wasm");
const module = await WebAssembly.compileStreaming(moduleBytes);
// Instantiate the WASI module
await wasi.instantiate(module, {});

// Run the start function
let exitCode = wasi.start();

// WASI must be freed before handles are closed, either manually, "wasi.free()", or by garbage collection
wasi.free();
// Wait for handles to finish before proceeding
Promise.all(handles).then(() => {
  // This should print:
  // hello world
  // (exit code: 0)
  console.log(`${stdout}(exit code: ${exitCode})`);
});
```

## API Docs

<!-- Please check the full API documents here:
https://docs.wasmer.io/integrations/js/reference-api -->

### Typescript API

```typescript
export class WASI {
  constructor(config: WasiConfig);
  readonly fs: MemFS;
  readonly tty: Tty;
  readonly stdin: WritableStream;
  readonly stdout: ReadableStream;
  readonly stderr: ReadableStream;


  // Instantiate the WebAssembly.Module or WebAssembly.Instance.
  // If passing a WebAssembly.Instance, you must call WASI.getImports(module) beforehand.
  instantiate(module: any, imports: object): WebAssembly.Instance;
  // Start the WASI Instance, it returns the status code when calling the start
  // function
  start(instance: WebAssembly.Instance): number;
}

export interface WasiConfig {
  readonly args?: string[];
  readonly env?: Record<string, string>;
  readonly preopens?: Record<string, string>;
  readonly fs?: MemFS;
  readonly concurrency?: number;
  readonly tty?: TtyState;
}

export class MemFS {
  constructor();
  readDir(path: string): Array<any>;
  createDir(path: string): void;
  removeDir(path: string): void;
  removeFile(path: string): void;
  rename(path: string, to: string): Promise<void>;
  metadata(path: string): object;
  open(path: string, options: any): VirtualFile;
}

export class VirtualFile {
  readonly lastAccessed: BigInt;
  readonly lastModified: BigInt;
  readonly createdTime: BigInt;
  readonly size: BigInt;
  setLength(new_size: BigInt): void;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  read(buf: Uint8Array): Promise<number>;
  write(buf: Uint8Array): Promise<number>;
  writeString(buf: string): Promise<number>;
  flush(): Promise<void>;
  seek(position: number): Promise<number>;
}

export class Tty {
  readonly readable: ReadableStream;
  readonly writable: WritableStream;
}

export class TtyState {
  constructor();
  cols: number;
  echo: boolean;
  height: number;
  line_buffered: boolean;
  line_feeds: boolean;
  rows: number;
  stderr_tty: boolean;
  stdin_tty: boolean;
  stdout_tty: boolean;
  width: number;
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
