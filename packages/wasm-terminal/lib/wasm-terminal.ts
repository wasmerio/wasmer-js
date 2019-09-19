// The Wasm Terminal

import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
// tslint:disable-next-line
import * as fit from "xterm/lib/addons/fit/fit";
// tslint:disable-next-line
Terminal.applyAddon(fit);

import WasmTerminalConfig from "./wasm-terminal-config";
import WasmTerminalPlugin from "./wasm-terminal-plugin";
import WasmTty from "./wasm-tty/wasm-tty";
import WasmShell from "./wasm-shell/wasm-shell";

export default class WasmTerminal {
  xterm: Terminal;

  wasmTerminalConfig: WasmTerminalConfig;
  wasmTerminalPlugins: WasmTerminalPlugin[];
  wasmTty: WasmTty;
  wasmShell: WasmShell;

  pasteEvent: any;
  resizeEvent: any;
  dataEvent: any;

  constructor(config: any) {
    // Create our xterm element
    this.xterm = new Terminal();
    // tslint:disable-next-line
    this.pasteEvent = this.xterm.on("paste", this.onPaste);
    // tslint:disable-next-line
    this.resizeEvent = this.xterm.on("resize", this.handleTermResize);

    this.wasmTerminalConfig = new WasmTerminalConfig(config);
    this.wasmTerminalPlugins = [];

    // Create our Shell and tty
    this.wasmTty = new WasmTty(this.xterm);
    this.wasmShell = new WasmShell(
      this.wasmTerminalConfig,
      this.wasmTerminalPlugins,
      this.wasmTty
    );
    // tslint:disable-next-line
    this.dataEvent = this.xterm.on("data", this.wasmShell.handleTermData);
  }

  addPlugin(wasmTerminalPlugin: WasmTerminalPlugin): () => void {
    this.wasmTerminalPlugins.push(wasmTerminalPlugin);

    return () => {
      this.wasmTerminalPlugins.splice(
        this.wasmTerminalPlugins.indexOf(wasmTerminalPlugin),
        1
      );
    };
  }

  open(container: HTMLElement) {
    this.xterm.open(container);
    setTimeout(() => {
      // Call the plugins
      this.wasmTerminalPlugins.forEach(wasmTerminalPlugin => {
        wasmTerminalPlugin.apply("afterOpen");
      });

      // tslint:disable-next-line
      this.wasmShell.prompt();
    });
  }

  fit() {
    (this.xterm as any).fit();
  }

  focus() {
    this.xterm.focus();
  }

  destroy() {
    // tslint:disable-next-line
    this.xterm.off("paste", this.onPaste);
    // tslint:disable-next-line
    this.xterm.off("resize", this.handleTermResize);
    // tslint:disable-next-line
    this.xterm.off("data", this.wasmShell.handleTermData);
    this.xterm.destroy();
    delete this.xterm;

    // Call the plugins
    this.wasmTerminalPlugins.forEach(wasmTerminalPlugin => {
      wasmTerminalPlugin.apply("afterDestroy");
    });
  }

  onPaste(data: string) {
    this.wasmTty.print(data);
  }

  /**
   * Handle terminal resize
   *
   * This function clears the prompt using the previous configuration,
   * updates the cached terminal size information and then re-renders the
   * input. This leads (most of the times) into a better formatted input.
   */
  handleTermResize = (data: { rows: number; cols: number }) => {
    const { rows, cols } = data;
    this.wasmTty.clearInput();
    this.wasmTty.setTermSize(cols, rows);
    this.wasmTty.setInput(this.wasmTty.getInput(), true);
  };
}
