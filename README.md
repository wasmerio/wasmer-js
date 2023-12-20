# The Wasmer JavaScript SDK

[![npm (scoped)](https://img.shields.io/npm/v/%40wasmer/sdk)](https://npmjs.org/package/@wasmer/sdk)
[![NPM Downloads](https://img.shields.io/npm/dm/%40wasmer%2Fsdk)](https://npmjs.org/package/@wasmer/sdk)
[![License](https://img.shields.io/npm/l/%40wasmer%2Fsdk)](./LICENSE)
[![Wasmer Discord Channel](https://img.shields.io/discord/1110300506942881873)](https://discord.gg/qBTfsNP7N8)
[![API Docs](https://img.shields.io/badge/API%20Docs-open-blue?link=wasmerio.github.io%2Fwasmer-js%2F)](https://wasmerio.github.io/wasmer-js/)

Javascript library for running Wasmer packages at ease, including WASI and WASIX modules.

## Getting Started

### Install from NPM

For instaling `@wasmer/sdk`, run this command in your shell:

```bash
npm install --save @wasmer/sdk
```

You can now run WASI packages from the Wasmer registry:

```js
import { init, Wasmer } from "@wasmer/sdk";

await init();

const pkg = await Wasmer.fromRegistry("python/python");
const instance = await pkg.entrypoint.run({
    args: ["-c", "print('Hello, World!')"],
});

const { code, stdout } = await instance.wait();
console.log(`Python exited with ${code}: ${stdout}`);
```
### Use with a `<script>` tag (without bundler)

It is possible to avoid needing to use a bundler by importing `@wasmer/sdk` as
a UMD module.

By adding the following `<script>` tag to your `index.html` file, the library
will be available as the `WasmerSDK` global variable.

```html
<script src="https://unpkg.com/@wasmer/sdk@latest"></script>
<script>
    const { init, Wasmer } = WasmerSDK;

      async function runPython() {
          await init();

          const packageName = "python/python";
          const pkg = await Wasmer.fromRegistry(packageName);
          const instance = await pkg.entrypoint.run({
              args: ["-c", "print('Hello, World!')"],
          });

          const { code, stdout } = await instance.wait();

          console.log(`Python exited with ${code}: ${stdout}`);
      }

      runPython();
</script>
```

Alternatively, the package can be imported directly from the CDN by turning the
script into a module.

```html
<script defer type="module">
    import { init, Wasmer } from "https://unpkg.com/@wasmer/sdk@latest?module";

    async function runPython() {
        await init();

        ...
    }

    runPython();
</script>
```


### Using a custom Wasm file

By default, `WasmerSDK.init` will load the Wasmer SDK WebAssembly file from unpkg.com.
If you want to customize this behavior you can pass a custom url to the init, so the the wasm file
of the Wasmer SDK can ve served by your HTTP server instead:

```js
import { init, Wasmer } from "@wasmer/sdk";
import wasmUrl from "@wasmer/sdk/dist/wasmer_js_bg.wasm?url";

await init(wasmUrl); // This inits the SDK with a custom URL
```


### Using a JS with the Wasm bundled

You can also load Wasmer-JS with a js file with the Wasmer SDK WebAssembly file bundled into it (using bas64 encoding),
so no extra requests are required. If that's your use case, you can simply import `@wasmer/sdk/dist/WasmerSDKBundled.js` instead:

```js
import { init, Wasmer } from "@wasmer/sdk/dist/WasmerSDKBundled.js";

await init(); // This inits the SDK in the bundled version
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

# Features

The Wasmer SDK Javascript Package supports:

* [X] WASI support
  * [X] Environment variables
  * [X] FileSystem access
  * [X] Command-line arguments
  * [X] Stdio
* [X] WASIX support
  * [X] Multi-threading
  * [X] Spawning sub-processes
  * [ ] Networking (on the works)
* [X] Mounting directories inside the WASIX instance
* [X] Running packages from the [Wasmer Registry](https://wasmer.io)
* Platforms
  * [X] Browser
  * [ ] NodeJS
  * [ ] Deno

# License

The entire project is under the MIT License. Please read [the
`LICENSE` file][license].

[coi-docs]: https://docs.wasmer.io/javascript-sdk/explainers/troubleshooting#sharedarraybuffer-and-cross-origin-isolation
[license]: https://github.com/wasmerio/wasmer/blob/master/LICENSE
