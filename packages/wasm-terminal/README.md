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

- Runs WASI Wasm modules using [@wasmer/wasi](../wasi) and [@wasmer/wasmfs](../wasmfs). 🏃

- Uses [wasm_transformer](../../crates/wasm_transformer) to transform Wasm binaries _on the fly_ to run in the browser! ♻️

- Provides a terminal-like experience, with stuff like autocomplete, hotkeys, pipes, and more! 👩‍💻

- Uses [Wapm](https://wapm.io/) to fetch packages, if they are not already downloaded! 📦

- Allows passing in your own custom Wasm binaries, or callback commands to provide commands in the shell! ⚙️

- Runs processes in seperate web workers using [Comlink](https://github.com/GoogleChromeLabs/comlink)! 🔗

- Allows for creating Plugins to add additional functionality! (E.g commands, welcome messages, and more!) 🔌

## Browser Compatibility

For more simple Wasm modules, E.g [cowsay](https://wapm.io/package/cowsay), the Wasm terminal will should work on the latest version of all major browsers. However, more complex Wasm modules may only work on browsers that support [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Which was previously implemented in all major browsers, but was removed due to the [Meltdown and Spectre attacks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#Browser_compatibility). Though, some major browsers have already started to re-enable this feature. The following cases that may be problemsome are:

- Wasm modules that infinitely loop like [wasm-matrix](https://github.com/torch2424/wasm-matrix). They will block the main thread and freeze the browser.

- Wasm modules that take in input from /dev/stdin such as [lolcat](https://wapm.io/package/lolcat). They will not take input from the shell. but instead, use [`window.prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) to get input. Since `window.prompt` can pause the execution of javascript on the main thread for synchronous reads.

## Installation

For installing `@wasmer/wasm-terminal`, just run this command in your shell:

```bash
npm install --save @wasmer/wasm-terminal
```

## Quick Start

**Javascript**

```javascript
import WasmTerminal, {WasmTerminalPlugin} from "@wasmer/wasm-terminal";

// Let's create our Wasm Terminal
const wasmTerminal = new WasmTerminal({
  // IMPORTANT: This is wherever your wasm_transformer_bg.wasm file URL is hosted
  wasmTransformerWasmUrl:
    "/node_modules/wasm-terminal/wasm_transformer/wasm_transformer_bg.wasm",
  // IMPORTANT: This is wherever your process.worker.js file URL is hosted
  processWorkerUrl: "/node_modules/wasm-terminal/workers/process.worker.js",
});

// Let's create/add a quick plugin
cont myPlugin = new WasmTerminalPlugin({
  afterOpen: () => "Welcome to the wasm-terminal!",  // Return a string to show text after opening.
  beforeFetchCommand: (commandName) => {
    // If the command name is some custom command we want to handle
    // Return a promise that resolves a url to a Wasm module that should represent that command.
    if(commandName === 'custom-command') {
      Promise.resolve("https://link-to-wasm.com/wasm-binary.wasm")
    }
  }
});
wasmTerminal.addPlugin(myPlugin);

// Let's bind our Wasm terminal to it's container
const containerElement = document.querySelector("#root");
wasmTerminal.open(containerElement);
wasmTerminal.fit();
wasmTerminal.focus();

// Later, when we are done with the terminal, let's destroy it
wasmTerminal.destroy();
```

**Css**

We must also include the `[xterm](https://github.com/xtermjs/xterm.js/).css`. For example:

```html
<!-- This includes the external stylesheet. NOTE: The path should point to wherever you are hosting the wasm-terminal output. -->
<link
  rel="stylesheet"
  type="text/css"
  href="node_modules/wasm-terminal/xterm/xterm.css"
/>
```

## Wasm Terminal Reference API

`new WasmTerminal(WasmTerminalConfig)`

Constructor for the WasmTerminal, that returns an instance of the WasmTerminal.

The [WasmTerminalConfig](./lib/wasm-terminal-config.ts) can be described as the following:

```typescript
{
  // REQUIRED: Url to the /node_modules/wasm-terminal/wasm_transformer/wasm_transformer_bg.wasm.
  // This is used to run the wasm_transformer on Wasm binaries so that they can be used in JS Runtimes
  wasmTransformerWasmUrl: string;
  // URL to the /node_modules/wasm-terminal/workers/process.worker.js . This is used by the shell to
  // to spawn web workers in Comlink, for features such as piping, /dev/stdin reading, and general performance enhancements.
  processWorkerUrl?: string;
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

---

`wasmTerminal.addPlugin() => Function`

Add a [`WasmTerminalPlugin`](./lib/wasm-terminal-plugin.ts) to add additional functionality to the Wasm terminal. Returns a function to remove the plugin.

To learn more about plugins, see the "Plugins section"

## Wasm Terminal Plugin API

Wasm Terminal can have additional functionality added by adding plugins. Plugins are created by using the exported `WasmTerminalPlugin` class, and added with `wasmTerminal.addPlugin()`.

---

`new WasmTerminalPlugin(WasmTerminalPluginConfig)`

Constructor for WasmTerminalPlugin, that returns an instance of a WasmTerminalPlugin.

The config for the [WasmTerminalPlugin](./lib/wasm-terminal-plugin.ts) can be described as the following:

```typescript
{
  // Function that runs after the terminal is opened, but before it prompts.
  // Great for showing welcome messages.
  afterOpen?: () => string | undefined;

  // Function that runs before a command is feteched by the commandFether.
  // Depending on what you return here, it will do different functionality,
  // But essentially, what is returned will become the command functionality
  beforeFetchCommand?: (
      commandName: string
      ) =>
    | Promise<string> // This should be a URL string, that points to a Wasm file. It will be fetched, transformed, and compiled
    | Promise<Uint8Array> // This should be a Wasm binary. It will be transformed and compiled.
    | Promise<CallbackCommand> // This should be a CallbackCommand. See the CallbackCommand section for more
    | Promise<undefined> // This will do nothing
    | undefined; // This will do nothing
}
```

---

```typescript
export type CallbackCommand = (
  args: string[],
  stdin: string
) => Promise<string | undefined>;
```

CallbackCommands are functions that can be returned by WasmTerminalPlugins. They are simply Javascript callback that take in the command arguments and command stdin, and returns a Promise that resolves stdout. Since these callback commands handle `stdin` and `stdout`, that can be used as normal commands that can be piped!

## Contributing

The project is split up around the relationship between a [terminal, tty, and shell](https://unix.stackexchange.com/questions/4126/what-is-the-exact-difference-between-a-terminal-a-shell-a-tty-and-a-con).

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

Contributions of any kind are welcome! 👍
