# The Wasmer JavaScript SDK

[![npm (scoped)](https://img.shields.io/npm/v/%40wasmer/sdk)](https://npmjs.org/package/@wasmer/sdk)
[![NPM Downloads](https://img.shields.io/npm/dm/%40wasmer%2Fsdk)](https://npmjs.org/package/@wasmer/sdk)
[![License](https://img.shields.io/npm/l/%40wasmer%2Fsdk)](./LICENSE)
[![Wasmer Discord Channel](https://img.shields.io/discord/1110300506942881873)](https://discord.gg/qBTfsNP7N8)
[![API Docs](https://img.shields.io/badge/API%20Docs-open-blue?link=wasmerio.github.io%2Fwasmer-js%2F)](https://wasmerio.github.io/wasmer-js/)

Isomorphic Javascript library for running WASI programs.

The Javascript Package supports:

* [X] WASI support
  * [X] Environment variables
  * [X] FileSystem access
  * [X] Command-line arguments
  * [X] Stdio
* [X] WASIX support
  * [X] Multi-threading
  * [X] Spawning sub-processes
  * [ ] Networking
* [X] Mounting directories inside the WASIX instance
* [X] Running packages from the [Wasmer Registry](https://wasmer.io)
* Platforms
  * [X] Browser
  * [ ] NodeJS
  * [ ] Deno

## Getting Started

For instaling `@wasmer/sdk`, run this command in your shell:

```bash
npm install --save @wasmer/sdk
```

You can now run WASI packages from the Wasmer registry:

```js
import { init, Wasmer } from "@wasmer/sdk";

await init();

const pkg = await Wasmer.fromRegistry("python/python@3.12");
const instance = await pkg.entrypoint.run({
    args: ["-c", "print('Hello, World!')"],
});

const { code, stdoutUtf8 } = await instance.wait();
console.log(`Python exited with ${code}: ${stdoutUtf8}`);
```

### Cross-Origin Isolation

Browsers have implemented security measures to mitigate the Spectre and Meltdown
vulnerabilities.

These measures restrict the sharing of `SharedArrayBuffer`` objects with Web
Workers unless the execution context is deemed secure.

The `@wasmer/sdk` package uses a threadpool built on Web Workers and requires
sharing the same `SharedArrayBuffer` across multiple workers to enable WASIX
threads to access the same address space. This requirement is crucial even for
running single-threaded WASIX programs because the SDK internals rely on
`SharedArrayBuffer` for communication with Web Workers.

To avoid Cross-Origin Isolation issues, make sure any web pages using
`@wasmer/sdk` are served over HTTPS and have the following headers set:

```yaml
"Cross-Origin-Opener-Policy": "same-origin"
"Cross-Origin-Embedder-Policy": "require-corp"
```

See the [`SharedArrayBuffer` and Cross-Origin Isolation][coi-docs] section under
the *Troubleshooting Common Problems* docs for more.

# License

The entire project is under the MIT License. Please read [the
`LICENSE` file][license].

[license]: https://github.com/wasmerio/wasmer/blob/master/LICENSE
[page]: https://docs.wasmer.io/javascript-sdk/explainers/troubleshooting#sharedarraybuffer-and-cross-origin-isolation
