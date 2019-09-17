# @wasmer/wasm-terminal

A terminal-like component for the browser, that fetches and runs Wasm modules in the context of a shell. 🐚

![Wasm Terminal Demo Gif](./assets/wasm-terminal-demo.gif)

## Table of Contents

- [Features](#features)
- [Browser Compatibility](#browser-compatibility)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Reference API](#reference-api)
- [Contributing](#contributing)

## Features

This project is built using [Xterm.js](https://github.com/xtermjs/xterm.js/), and [Comlink](https://github.com/GoogleChromeLabs/comlink) 🙏

- Runs [Wasi](https://wasi.dev/) Wasm modules using [@wasmer/wasi](../wasi) and [@wasmer/wasmfs](../wasmfs). 🏃

- Uses [wasm_transformer](../../crates/wasm_transformer) to transform wasm binaries on the fly to run in the browser! ♻️

- Provides a terminal-like experience, with stuff like autocomplete, hotkeys, pipes, and more! 👩‍💻

- Uses [Wapm](https://wapm.io/) to fetch packages, if they are not already downloaded! 📦

- Allows passing in your own custom wasm binaries, or callback commands to provide commands in the shell! ⚙️

- Runs processes in seperate web workers using [Comlink](https://github.com/GoogleChromeLabs/comlink)! 🔗

## Browser Compatibility

For more simple wasm modules, E.g [cowsay](https://wapm.io/package/cowsay), the wasm terminal will should work on the latest version of all major browsers. However, more complex wasm modules may only work on browsers that support [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Which was previously implemented in all major browsers, but was removed due to the [Meltdown and Spectre attacks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#Browser_compatibility). Though, some major browsers have already started to re-enable this feature. The following cases that may be problemsome are:

- Wasm modules that infinitely loop like [wasm-matrix](https://github.com/torch2424/wasm-matrix). They will block the main thread and freeze the browser.

- Wasm modules that take in input from /dev/stdin such as [lolcat](https://wapm.io/package/lolcat). They will not take input from the shell. but instead, use [`window.prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) to get input. Since `window.prompt` can pause the execution of javascript on the main thread for synchronous reads.

## Installation

For instaling `@wasmer/wasm-terminal`, just run this command in your shell:

```bash
npm install --save @wasmer/wasm-terminal
```

## Quick Start

```javascript
import WasmTerminal from "@wasmer/wasm-terminal";

// Let's create our Wasm Terminal
const wasmTerminal = new WasmTerminal({
  // IMPORTANT: This is wherever your wasm_transformer_bg.wasm file URL is hosted
  wasmTransformerWasmUrl:
    "/node_modules/wasm-terminal/wasm_transformer/wasm_transformer_bg.wasm",
  // IMPORTANT: This is wherever your process.worker.js file URL is hosted
  processWorkerUrl: "/node_modules/wasm-terminal/workers/process.worker.js",
  additionalWasmCommands: {
    // Pass a custom command, run with `mycommand`, to fetch/run the Wasm module at the URL Provided
    mycommand: "http://localhost:8000/mycommand.wasm"
  },
  callbackCommands: {
    // Pass a command run with `hello`, that outputs the following to /dev/stdout
    hello: (args, stdin) => {
      return Promise.resolve(`Hello! Args: ${args}, stdin: ${stdin}`);
    }
  }
});

// Let's bind our wasm terminal to it's container
const containerElement = document.querySelector("#root");
wasmTerminal.open(containerElement);
wasmTerminal.fit();
wasmTerminal.focus();

// Later, when we are done with the terminal, let's destroy it
wasmTerminal.destroy();
```

## Reference API

`new WasmTerminal(WasmTerminalConfig)`

Constructor for the WasmTerminal, that returns an instance of the WasmTerminal.

The Wasm[TerminalConfig](./lib/terminal-config.ts) can be described as the following:

```typescript
{
  // REQUIRED: Url to the /node_modules/wasm-terminal/wasm_transformer/wasm_transformer_bg.wasm.
  // This is used to run the wasm_transformer on wasm binaries so that they can be used in JS Runtimes
  wasmTransformerWasmUrl: string;
  // URL to the /node_modules/wasm-terminal/workers/process.worker.js . This is used by the shell to
  // to spawn web workers in Comlink, for features such as piping, /dev/stdin reading, and general performance enhancements.
  processWorkerUrl?: string;
  // JavaScript Object for command that are run as callback functions.
  // The key of the Javascript object property represents the name of the command, and the value is a Function
  // That returns a promise. The Promise should be a string, that is then output to the shell through /dev/stdout.
  callbackCommands?: CallbackCommandJsonMap;
  // JavaScript Object for additional/custom wasm files that should be availble to be run as commands.
  // The key of the Javascript object property represents the name of the command, and the value is a URL
  // of the Wasm file to be fetched, and ran.
  additionalWasmCommands?: WasmCommandJsonMap;
}
```

---

`wasmTerminal.open(containerElement)`

Function to set the container of the `wasmTerminal`. `containerElement` can be any [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element).

---

`wasmTerminal.fit()`

Function to resize the terminal to fit the size of its container.

---

`wasmTerminal.focus()`

Function to [focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on the `wasmTerminal` element, and allow input into the shell.

## Contributing

The project is split up around the relationship between a [terminal, tty, and shell](https://unix.stackexchange.com/questions/4126/what-is-the-exact-difference-between-a-terminal-a-shell-a-tty-and-a-con).

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
