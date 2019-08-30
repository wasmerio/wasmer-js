// The Wapm Terminal

import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import WapmTty from "./wapm-tty/wapm-tty";
import WapmShell from "./wapm-shell/wapm-shell";

export default class WapmTerminal {
  xterm: Terminal;

  wapmTty: WapmTty;
  wapmShell: WapmShell;

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
    this.wapmTty = new WapmTty(this.xterm);
    this.wapmShell = new WapmShell(this.wapmTty);
    this.dataEvent = this.xterm.onEvent("data", this.wapmShell.handleTermData);
  }

  open(container: HTMLElement) {
    this.xterm.open(container);
    setTimeout(() => {
      // tslint:disable-next-line
      this.wapmShell.prompt();
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
    this.wapmTty.setInput(this.wapmTty.getInput(), true);
  };
}
