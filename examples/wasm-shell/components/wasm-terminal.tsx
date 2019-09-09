import { h, Component } from "preact";
import WasmTerminal from "@wasmer/wasm-terminal";

// @ts-ignore
import wasiJsTransformerWasmUrl from "../../../packages/wasm-terminal/dist/wasi_js_transformer/wasi_js_transformer_bg.wasm";
// @ts-ignore
import processWorkerUrl from "../../../packages/wasm-terminal/dist/workers/process.worker.js";

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
      processWorkerUrl
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
