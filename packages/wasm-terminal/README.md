# `@wasmer/wasm-terminal`

A terminal-like component for the browser, that fetches and runs Wasm modules in the context of a shell. 🐚

![Wasm Terminal Demo Gif](./assets/wasm-terminal-demo.gif)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Unoptimized](#unoptimized)
  - [Optimized](#optimized)
- [Wasm Terminal Reference API](#wasm-terminal-reference-api)
  - [WasmTerminal](#wasmterminal)
  - [fetchCommandFromWAPM](#fetchcommandfromwapm)
- [Browser Compatibility](#browser-compatibility)
- [Contributing](#contributing)

## Features

This project is built using [Xterm.js](https://github.com/xtermjs/xterm.js/), and [Comlink](https://github.com/GoogleChromeLabs/comlink) 🙏

- Runs WASI Wasm modules using [@wasmer/wasi](https://github.com/wasmerio/wasmer-js/tree/master/packages/wasi) and [@wasmer/wasmfs](https://github.com/wasmerio/wasmer-js/tree/master/packages/wasmfs). 🏃

- Provides a terminal-like experience, with stuff like autocomplete, hotkeys, pipes, and more! 👩‍💻

- Allows passing in your own custom Wasm binaries, or callback commands to provide commands in the shell! ⚙️

- Runs processes in seperate web workers using [Comlink](https://github.com/GoogleChromeLabs/comlink)! 🔗

- Exports a command fetcher for fetching packages from [WAPM](https://wapm.io/)! 📦

## Installation

For installing `@wasmer/wasm-terminal`, just run this command in your shell:

```bash
npm install --save @wasmer/wasm-terminal
```

## Quick Start

First, We must also include the `[xterm](https://github.com/xtermjs/xterm.js/).css`. For example:

```html
<!-- This includes the external stylesheet. NOTE: The path should point to wherever you are hosting the wasm-terminal output. -->
<link
  rel="stylesheet"
  type="text/css"
  href="./node_modules/@wasmer/wasm-terminal/dist/xterm/xterm.css"
/>
```

Then, we can choose to use the unoptimized (default) or optimizied JavaScript bundles.

### Unoptimized

The default import of `@wasmer/wasm-terminal` and `@wasmer/wasm-transformer` points to the unoptimized bundle. This bundle does things such as inlining assets. This is done for convenience and developer experience. However, there are use cases where we you might don't want to use the inlined Wasm (for example, when working with [PWAs](https://developers.google.com/web/progressive-web-apps)) For that case, you should be using the `@wasmer/wasm-terminal/dist/optimized/...` and `@wasmer/wasm-transformer/dist/optimized/...` version.

```javascript
import WasmTerminal, { fetchCommandFromWAPM } from "@wasmer/wasm-terminal";
import { lowerI64Imports } from "@wasmer/wasm-transformer";

// Let's write handler for the fetchCommand property of the WasmTerminal Config.
const fetchCommandHandler = async commandName => {
  // Let's return a "CallbackCommand" if our command matches a special name
  if (commandName === "callback-command") {
    const callbackCommand = async (args, stdin) => {
      return `Callback Command Working! Args: ${args}, stdin: ${stdin}`;
    };
    return callbackCommand;
  }

  // Let's fetch a wasm Binary from WAPM for the command name.
  const wasmBinary = await fetchCommandFromWAPM(commandName);

  // lower i64 imports from Wasi Modules, so that most Wasi modules
  // Can run in a Javascript context.
  return await lowerI64Imports(wasmBinary);
};

// Let's create our Wasm Terminal
const wasmTerminal = new WasmTerminal({
  // Function that is run whenever a command is fetched
  fetchCommand: fetchCommandHandler
});

// Let's print out our initial message
wasmTerminal.print("Hello World!");

// Let's bind our Wasm terminal to it's container
const containerElement = document.querySelector("#root");
wasmTerminal.open(containerElement);
wasmTerminal.fit();
wasmTerminal.focus();

// Later, when we are done with the terminal, let's destroy it
// wasmTerminal.destroy();
```

**NOTE:** Remember to include the CSS file mentioned at the beginning of the "Quick Start" section.

### Optimized

Optimized bundles, for both `@wasmer/wasm-terminal` and `@wasmer/wasm-transfoormer`, prioritize performance. For examples, assets required by the library must be passed in manually.

```javascript
import WasmTerminal, {
  fetchCommandFromWAPM
} from "@wasmer/wasm-terminal/dist/optimized/wasm-terminal.esm";
import wasmInit, {
  lowerI64Imports
} from "@wasmer/wasm-transformer/dist/optimizied/wasm-transformer.esm";

// URL for where the wasm-transformer wasm file is located. This is probably different depending on your bundler.
const wasmTransformerWasmUrl =
  "./node_modules/@wasmer/wasm-transformer/wasm-transformer.wasm";

// Let's write handler for the fetchCommand property of the WasmTerminal Config.
const fetchCommandHandler = async commandName => {
  // Let's return a "CallbackCommand" if our command matches a special name
  if (commandName === "callback-command") {
    const callbackCommand = async (args, stdin) => {
      return `Callback Command Working! Args: ${args}, stdin: ${stdin}`;
    };
    return callbackCommand;
  }

  // Let's fetch a wasm Binary from WAPM for the command name.
  const wasmBinary = await fetchCommandFromWAPM(commandName);

  // Initialize the Wasm Transformer, and use it to lower
  // i64 imports from Wasi Modules, so that most Wasi modules
  // Can run in a Javascript context.
  await wasmInit(wasmTransformerWasmUrl);
  return lowerI64Imports(wasmBinary);
};

// Let's create our Wasm Terminal
const wasmTerminal = new WasmTerminal({
  // Function that is run whenever a command is fetched
  fetchCommand: fetchCommandHandler,
  // IMPORTANT: This is wherever your process.worker.js file URL is hosted
  processWorkerUrl: "./node_modules/wasm-terminal/workers/process.worker.js"
});

// Let's print out our initial message
wasmTerminal.print("Hello World!");

// Let's bind our Wasm terminal to it's container
const containerElement = document.querySelector("#root");
wasmTerminal.open(containerElement);
wasmTerminal.fit();
wasmTerminal.focus();

// Later, when we are done with the terminal, let's destroy it
// wasmTerminal.destroy();
```

**NOTE:** Remember to include the CSS file mentioned at the beginning of the "Quick Start" section.

## Wasm Terminal Reference API

### WasmTerminal

`new WasmTerminal(WasmTerminalConfig)`

Constructor for the WasmTerminal, that returns an instance of the WasmTerminal.

The [WasmTerminalConfig](./lib/wasm-terminal-config.ts) can be described as the following:

```typescript
{
  // Function that is called whenever a command is entered and returns a Promise,
  // It takes in the name of the command being run, and expects a Uint8Array of a Wasm Binary, or a
  // CallbackCommand (see the api below) to be returned.
  fetchCommand: (
    commandName: string,
    commandArgs?: Array<string>,
    envEntries?: any[][]
  ) => Promise<Uint8Array | CallbackCommand>
  // Only for Optimized Bundles: URL to the /node_modules/wasm-terminal/workers/process.worker.js . This is used by the shell to
  // to spawn web workers in Comlink, for features such as piping, /dev/stdin reading, and general performance enhancements.
  processWorkerUrl?: string;
}
```

CallbackCommands are functions that can be returned in the `fetchCommand` config property. They are simply Javascript callback that take in the command name, command arguments, enviroment variables, and returns a Promise that resolves stdout. Since these callback commands handle `stdin` and `stdout`, that can be used as normal commands that can be piped!

```typescript
export type CallbackCommand = (
  args: string[],
  stdin: string
) => Promise<string | undefined>;
```

---

`wasmTerminal.open(containerElement: Element)`

Function to set the container of the `wasmTerminal`. `containerElement` can be any [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element).

---

`wasmTerminal.fit()`

Function to resize the terminal to fit the size of its container.

---

`wasmTerminal.focus()`

Function to [focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on the `wasmTerminal` element, and allow input into the shell.

---

`wasmTerminal.print(message: string)`

Function to print text to the wasmTerminal. Useful for printing a welcome message before the wasmTerminal is opened.

---

`wasmTerminal.scrollToCursor()`

Function to scroll the terminal cursor into view.

---

`wasmTerminal.runCommand(commandString: string)`

Function to run the passed string as if it was entered as a command, from the wasm terminal.

### fetchCommandFromWAPM

```typescript
fetchCommandFromWAPM(
  commandName: string,
  commandArgs?: Array<string>,
  envEntries?: any[][]
) => Promise<Uint8Array>
```

Function meant to be returned in the `fetchCommand` config property of the WasmTerminal Class. This takes in the name of command, the command arguments, and the envioronment variables, and returns a Promise that resolves a Uint8Array of the Wasm binary from WAPM.

## Browser Compatibility

For more simple Wasm modules, E.g [cowsay](https://wapm.io/package/cowsay), the Wasm terminal will work on the latest version of all major browsers. However, more complex Wasm modules may only work on browsers that support [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Which was previously implemented in all major browsers, but was removed due to the [Meltdown and Spectre attacks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#Browser_compatibility). Though, some major browsers have already started to re-enable this feature. The following cases that may be problemsome are:

- Wasm modules that infinitely loop like [wasm-matrix](https://github.com/torch2424/wasm-matrix). They will block the main thread and freeze the browser.

- Wasm modules that take in input from `/dev/stdin` such as [lolcat](https://wapm.io/package/lolcat). They will not take input from the shell. but instead, use [`window.prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) to get input. Since `window.prompt` can pause the execution of javascript on the main thread for synchronous reads.

## Contributing

The project is split up around the relationship between a [terminal, tty, and shell](https://unix.stackexchange.com/questions/4126/what-is-the-exact-difference-between-a-terminal-a-shell-a-tty-and-a-con).

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
