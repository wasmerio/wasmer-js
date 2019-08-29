// The Wapm Terminal

import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);

import WapmTty from "./wapm-tty/wapm-tty";
import WapmShell from "./wapm-shell/wapm-shell";

export default class WapmTerminal {
  xterm: Terminal;

  wapmTty: WapmTty;
  wapmShell: WapmShell;

  constructor() {
    // Create our xterm element
    this.xterm = new Terminal();
    this.xterm.on("paste", this.onPaste);
    this.xterm.on("resize", this.handleTermResize);

    // Create our Shell and tty
    this.wapmTty = new WapmTty(this.xterm);
    this.wapmShell = new WapmShell(this.wapmTty);
    this.xterm.on("data", this.wapmShell.handleTermData);
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
    this.xterm.off("paste", this.onPaste);
    this.xterm.off("resize", this.handleTermResize);
    this.xterm.off("data", this.wapmShell.handleTermData);
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
    this.wapmTty.setTermSize(cols, rows);
    this.wapmTty.setInput(this.wapmTty.getInput());
  };
}
