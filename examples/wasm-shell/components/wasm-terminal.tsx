import { h, Component } from "preact";

// @ts-ignore
import WasmTerminal from "../../../packages/wasm-terminal/dist/index.esm";

// Require wasm terminal URLs
// @ts-ignore
import wasiJsTransformerWasmUrl from "../../../packages/wasm-terminal/dist/wasi_js_transformer/wasi_js_transformer_bg.wasm";
// @ts-ignore
import processWorkerUrl from "../../../packages/wasm-terminal/dist/workers/process.worker.js";

// Additional Command URLs
// @ts-ignore
import stdinWasmUrl from "../../../crates/wasi_js_transformer/wasm_module_examples/stdin.wasm";
// @ts-ignore
import clockTimeGetUrl from "../../../crates/wasi_js_transformer/wasm_module_examples/clock_time_get.wasm";
// @ts-ignore
import pathOpenGetUrl from "../../../crates/wasi_js_transformer/wasm_module_examples/path_open.wasm";
// @ts-ignore
import twoImportsUrl from "../../../crates/wasi_js_transformer/wasm_module_examples/two-imports.wasm";
// @ts-ignore
import quickJsUrl from "../../../crates/wasi_js_transformer/wasm_module_examples/qjs.wasm";
// @ts-ignore
import dukTapeUrl from "../../../crates/wasi_js_transformer/wasm_module_examples/duk.wasm";
// @ts-ignore
import argtestUrl from "../../../crates/wasi_js_transformer/wasm_module_examples/argtest.wasm";
// @ts-ignore
import gettimeofdayUrl from "../../../crates/wasi_js_transformer/wasm_module_examples/gettimeofday/gettimeofday.wasm";

/**
 * A simple preact wrapper around the Wasm Terminal
 */
export default class WasmTerminalComponent extends Component {
  container: HTMLElement | null;
  wasmTerminal: WasmTerminal;

  constructor() {
    super();
    this.wasmTerminal = new WasmTerminal({
      wasiJsTransformerWasmUrl,
      processWorkerUrl,
      additionalWasmCommands: {
        a: stdinWasmUrl,
        c: clockTimeGetUrl,
        p: pathOpenGetUrl,
        g: gettimeofdayUrl,
        qjs: quickJsUrl,
        duk: dukTapeUrl,
        two: twoImportsUrl,
        arg: argtestUrl,
        rsign:
          "https://registry-cdn.wapm.io/contents/jedisct1/rsign2/0.5.4/rsign.wasm"
      },
      callbackCommands: {
        callback: (args: string[], stdin: string) => {
          return Promise.resolve(
            `Callback Command Working! Args: ${args}, stdin: ${stdin}`
          );
        }
      }
    });
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
