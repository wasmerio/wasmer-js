// The Wapm Terminal

import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);

import CommandRunner from "../services/command-runner/command-runner";
import WapmTty from "./wapm-tty/wapm-tty";
import WapmShell from "./wapm-shell/wapm-shell";

export default class WapmTerminal {
  xterm: Terminal;

  constructor() {
    // Create our xterm element
    this.xterm = new Terminal();
    this.xterm.on("paste", this.onPaste.bind(this));
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
    this.clearInput();
    this._termSize = { cols, rows };
    this.setInput(this._input, false);
  };

  /**
   * Set the new cursor position, as an offset on the input string
   *
   * This function:
   * - Calculates the previous and current
   */
  setCursor(newCursor: number) {
    if (newCursor < 0) newCursor = 0;
    if (newCursor > this._input.length) newCursor = this._input.length;

    // Apply prompt formatting to get the visual status of the display
    const inputWithPrompt = this.applyPrompts(this._input);
    const inputLines = countLines(inputWithPrompt, this._termSize.cols);

    // Estimate previous cursor position
    const prevPromptOffset = this.applyPromptOffset(this._input, this._cursor);
    const { col: prevCol, row: prevRow } = offsetToColRow(
      inputWithPrompt,
      prevPromptOffset,
      this._termSize.cols
    );

    // Estimate next cursor position
    const newPromptOffset = this.applyPromptOffset(this._input, newCursor);
    const { col: newCol, row: newRow } = offsetToColRow(
      inputWithPrompt,
      newPromptOffset,
      this._termSize.cols
    );

    // Adjust vertically
    if (newRow > prevRow) {
      for (let i = prevRow; i < newRow; ++i) this.term.write("\x1B[B");
    } else {
      for (let i = newRow; i < prevRow; ++i) this.term.write("\x1B[A");
    }

    // Adjust horizontally
    if (newCol > prevCol) {
      for (let i = prevCol; i < newCol; ++i) this.term.write("\x1B[C");
    } else {
      for (let i = newCol; i < prevCol; ++i) this.term.write("\x1B[D");
    }

    // Set new offset
    this._cursor = newCursor;
  }
}
