import { h, Component } from "preact";

// @ts-ignore
import WasmTerminal, {
  // @ts-ignore
  WasmTerminalPlugin
  // @ts-ignore
} from "../../../packages/wasm-terminal/dist/index.esm";

// Require Wasm terminal URLs
// @ts-ignore
import wasmTransformerWasmUrl from "../../../packages/wasm-terminal/dist/wasm_transformer/wasm_transformer_bg.wasm";
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

const examplePlugin = new WasmTerminalPlugin({
  afterOpen: () => {
    console.log("afterOpen Called!");
    return "afterOpen Called! Welcome to the wasm-shell example!";
  },
  beforeFetchCommand: async (commandName: string) => {
    console.log("beforeFetchCommand Called!", commandName);

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

    if ((commands as any)[commandName]) {
      return (commands as any)[commandName];
    }
  }
});

/**
 * A simple preact wrapper around the Wasm Terminal
 */
export default class WasmTerminalComponent extends Component {
  container: HTMLElement | null;
  wasmTerminal: WasmTerminal;

  constructor() {
    super();
    this.wasmTerminal = new WasmTerminal({
      wasmTransformerWasmUrl,
      processWorkerUrl
    });

    this.wasmTerminal.addPlugin(examplePlugin);

    this.container = null;
  }

  componentDidMount() {
    if (!this.container) {
      return;
    }
    this.wasmTerminal.open(this.container);
    this.wasmTerminal.fit();
    this.wasmTerminal.focus();
  }

  componentWillUnmount() {
    this.wasmTerminal.destroy();
  }

  render() {
    return <div ref={ref => (this.container = ref)} />;
  }
}
