// The Wapm Terminal

import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);

import WapmTty from "./wapm-tty/wapm-tty";
import WapmShell from "./wapm-shell/wapm-shell";

export default class WapmTerminal {
  xterm: Terminal;
  _termSize: {
    cols: number;
    rows: number;
  };

  wapmTty: WapmTty;
  wapmShell: WapmShell;

  constructor() {
    // Create our xterm element
    this.xterm = new Terminal();
    this.xterm.on("paste", this.onPaste.bind(this));
    this._termSize = {
      cols: this.term.cols,
      rows: this.term.rows
    };

    // Create our Shell and tty
    this.wapmTty = new WapmTty(this.xterm);
    this.wapmTty.attach();
    this.wapmShell = new WapmShell(this.wapmTty);
  }

  open(container: HTMLElement) {
    this.xterm.open(container);
  }

  fit() {
    (this.xterm as any).fit();
  }

  focus() {
    this.xterm.focus();
  }

  destroy() {
    this.wapmTty.detach();
    this.xterm.destroy();
    delete this.xterm;
  }

  onPaste(data: string) {
    this.wapmTty.print(data);
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
    this.wapmTty.clearInput();
    this._termSize = { cols, rows };
    this.setInput(this._input, false);
  };
}
