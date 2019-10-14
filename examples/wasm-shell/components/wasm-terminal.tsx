import { h, Component } from "preact";

// @ts-ignore
import WasmTerminal, {
  // @ts-ignore
  fetchCommandFromWAPM
  // @ts-ignore
} from "../../../packages/wasm-terminal/dist/index.esm";

// @ts-ignore
import wasmInit, {
  // @ts-ignore
  lowerI64Imports
  // @ts-ignore
} from "../../../packages/wasm-transformer/dist/wasm-transformer.prod.esm.js";
// @ts-ignore
import wasmTransformerWasmUrl from "../../../packages/wasm-transformer/dist/wasm-transformer.wasm";

// Require Wasm terminal URLs
// @ts-ignore
import processWorkerUrl from "../../../packages/wasm-terminal/dist/workers/process.worker.js";

// Additional Command URLs
// @ts-ignore
import stdinWasmUrl from "../../../crates/wasm_transformer/wasm_module_examples/stdin.wasm";
// @ts-ignore
import clockTimeGetUrl from "../../../crates/wasm_transformer/wasm_module_examples/clock_time_get.wasm";
// @ts-ignore
import pathOpenGetUrl from "../../../crates/wasm_transformer/wasm_module_examples/path_open.wasm";
// @ts-ignore
import twoImportsUrl from "../../../crates/wasm_transformer/wasm_module_examples/two-imports.wasm";
// @ts-ignore
import quickJsUrl from "../../../crates/wasm_transformer/wasm_module_examples/qjs.wasm";
// @ts-ignore
import dukTapeUrl from "../../../crates/wasm_transformer/wasm_module_examples/duk.wasm";
// @ts-ignore
import argtestUrl from "../../../crates/wasm_transformer/wasm_module_examples/argtest.wasm";
// @ts-ignore
import clangUrl from "../../../crates/wasm_transformer/wasm_module_examples/clang.wasm";
// @ts-ignore
import sqliteUrl from "../../../crates/wasm_transformer/wasm_module_examples/sqlite.wasm";
// @ts-ignore
import gettimeofdayUrl from "../../../crates/wasm_transformer/wasm_module_examples/gettimeofday/gettimeofday.wasm";

import welcomeMessage from "./welcome-message";

const commands = {
  a: stdinWasmUrl,
  c: clockTimeGetUrl,
  p: pathOpenGetUrl,
  g: gettimeofdayUrl,
  qjs: quickJsUrl,
  duk: dukTapeUrl,
  two: twoImportsUrl,
  arg: argtestUrl,
  clang: clangUrl,
  sqlite: sqliteUrl,
  rsign:
    "https://registry-cdn.wapm.io/contents/jedisct1/rsign2/0.5.4/rsign.wasm",
  callback: (args: string[], stdin: string) => {
    return Promise.resolve(
      `Callback Command Working! Args: ${args}, stdin: ${stdin}`
    );
  }
};

let didInitWasmTransformer = false;
const fetchCommandHandler = async (commandName: string) => {
  const customCommand = (commands as any)[commandName];
  let wasmBinary = undefined;

  if (customCommand) {
    if (typeof customCommand === "string") {
      const fetched = await fetch(customCommand);
      const buffer = await fetched.arrayBuffer();
      wasmBinary = new Uint8Array(buffer);
    } else {
      return customCommand;
    }
  } else {
    wasmBinary = await fetchCommandFromWAPM(commandName);
  }

  if (!didInitWasmTransformer) {
    await wasmInit(wasmTransformerWasmUrl);
    didInitWasmTransformer = true;
  }

  return lowerI64Imports(wasmBinary);
};

/**
 * A simple preact wrapper around the Wasm Terminal
 */
export default class WasmTerminalComponent extends Component {
  container: HTMLElement | null;
  wasmTerminal: WasmTerminal;

  constructor() {
    super();
    this.wasmTerminal = new WasmTerminal({
      fetchCommand: fetchCommandHandler,
      processWorkerUrl
    });

    this.container = null;
  }

  componentDidMount() {
    if (!this.container) {
      return;
    }
    this.wasmTerminal.print(welcomeMessage);

    this.wasmTerminal.open(this.container);
    this.wasmTerminal.fit();
    this.wasmTerminal.focus();
  }

  componentWillUnmount() {
    this.wasmTerminal.destroy();
  }

  printHello() {
    this.wasmTerminal.print("hello");
  }

  runCowsayHello() {
    this.wasmTerminal.runCommand("cowsay hello");
  }

  render() {
    return (
      <div id="terminal-component">
        <div>
          <button onClick={() => this.printHello()}>Print "hello"</button>
          <button onClick={() => this.runCowsayHello()}>
            Run Cowsay Hello
          </button>
          <br />
          <br />
        </div>
        <div id="terminal-container" ref={ref => (this.container = ref)} />
      </div>
    );
  }
}
