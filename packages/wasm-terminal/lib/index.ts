// The Wasm Terminal

import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
// tslint:disable-next-line
import * as fit from "xterm/lib/addons/fit/fit";
// tslint:disable-next-line
Terminal.applyAddon(fit);

import TerminalConfig from "./terminal-config";
import WasmTty from "./wasm-tty/wasm-tty";
import WasmShell from "./wasm-shell/wasm-shell";

export default class WasmTerminal {
  xterm: Terminal;

  terminalConfig: TerminalConfig;
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

    // Create our terminal config
    this.terminalConfig = new TerminalConfig(config);

    // Create our Shell and tty
    this.wasmTty = new WasmTty(this.xterm);
    this.wasmShell = new WasmShell(this.terminalConfig, this.wasmTty);
    // tslint:disable-next-line
    this.dataEvent = this.xterm.on("data", this.wasmShell.handleTermData);
  }

  open(container: HTMLElement) {
    this.xterm.open(container);
    setTimeout(() => {
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
  }

  onPaste(data: string) {
    if (this.wasmTty) {
      this.wasmTty.print(data);
    }
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
