// The Wasm Terminal

import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import WasmTty from "./wasm-tty/wasm-tty";
import WasmShell from "./wasm-shell/wasm-shell";

export default class WasmTerminal {
  xterm: Terminal;

  wasmTty: WasmTty;
  wasmShell: WasmShell;

  pasteEvent: any;
  resizeEvent: any;
  dataEvent: any;

  constructor() {
    // Create our xterm element
    this.xterm = new Terminal();
    this.xterm.loadAddon(new FitAddon());
    this.pasteEvent = this.xterm.onEvent("paste", this.onPaste);
    this.resizeEvent = this.xterm.onEvent("resize", this.handleTermResize);

    // Create our Shell and tty
    this.wasmTty = new WasmTty(this.xterm);
    this.wasmShell = new WasmShell(this.wasmTty);
    this.dataEvent = this.xterm.onEvent("data", this.wasmShell.handleTermData);
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
    this.pasteEvent.dispose();
    this.resizeEvent.dispose();
    this.dataEvent.dispose();
    this.xterm.dispose();
    delete this.xterm;
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
