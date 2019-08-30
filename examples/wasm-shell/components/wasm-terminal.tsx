import { h, Component } from "preact";
import WasmTerminal from "../../services/wasm-terminal/wasm-terminal";

/**
 * A simple preact wrapper around the Wasm Temrinal
 */
export default class WasmTerminalComponent extends Component {
  container: HTMLElement | null;
  wasmTerminal: WasmTerminal;

  constructor() {
    super();
    this.wasmTerminal = new WasmTerminal();
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
