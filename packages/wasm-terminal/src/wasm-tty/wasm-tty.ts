import { Terminal, IBuffer } from "xterm";
import { countLines, offsetToColRow } from "./tty-utils";
import { ActiveCharPrompt, ActivePrompt } from "../wasm-shell/shell-utils";

/**
 * A tty is a particular device file, that sits between the shell and the terminal.
 * It acts an an interface for the shell and terminal to read/write from,
 * and communicate with one another
 */
type AutoCompleteHandler = (index: number, tokens: string[]) => string[];

export default class WasmTTY {
  xterm: Terminal;

  _termSize: {
    cols: number;
    rows: number;
  };
  _firstInit: boolean = true;
  _promptPrefix: string;
  _continuationPromptPrefix: string;
  _cursor: number;
  _input: string;

  constructor(xterm: Terminal) {
    this.xterm = xterm;

    this._termSize = {
      cols: this.xterm.cols,
      rows: this.xterm.rows
    };
    this._promptPrefix = "";
    this._continuationPromptPrefix = "";
    this._input = "";
    this._cursor = 0;
  }

  /**
   * Function to return a deconstructed readPromise
   */
  _getAsyncRead() {
    let readResolve;
    let readReject;
    const readPromise = new Promise((resolve, reject) => {
      readResolve = (response: string) => {
        this._promptPrefix = "";
        this._continuationPromptPrefix = "";
        resolve(response);
      };
      readReject = reject;
    });

    return {
      promise: readPromise,
      resolve: readResolve,
      reject: readReject
    };
  }

  /**
   * Return a promise that will resolve when the user has completed
   * typing a single line
   */
  read(
    promptPrefix: string,
    continuationPromptPrefix: string = "> "
  ): ActivePrompt {
    if (promptPrefix.length > 0) {
      this.print(promptPrefix);
    }

    this._firstInit = true;
    this._promptPrefix = promptPrefix;
    this._continuationPromptPrefix = continuationPromptPrefix;
    this._input = "";
    this._cursor = 0;

    return {
      promptPrefix,
      continuationPromptPrefix,
      ...this._getAsyncRead()
    };
  }

  /**
   * Return a promise that will be resolved when the user types a single
   * character.
   *
   * This can be active in addition to `.read()` and will be resolved in
   * priority before it.
   */
  readChar(promptPrefix: string): ActiveCharPrompt {
    if (promptPrefix.length > 0) {
      this.print(promptPrefix);
    }

    return {
      promptPrefix,
      ...this._getAsyncRead()
    };
  }

  /**
   * Prints a message and changes line
   */
  println(message: string) {
    this.print(message + "\n");
  }

  /**
   * Prints a message and properly handles new-lines
   */
  print(message: string, sync?: boolean) {
    const normInput = message.replace(/[\r\n]+/g, "\n").replace(/\n/g, "\r\n");
    if (sync) {
      // We write it synchronously via hacking a bit on xterm

      //@ts-ignore
      this.xterm._core.writeSync(normInput);
      //@ts-ignore
      this.xterm._core._renderService._renderer._runOperation(renderer =>
        renderer.onGridChanged(0, this.xterm.rows - 1)
      );
    } else {
      //@ts-ignore
      this.xterm.write(normInput);
    }
  }

  /**
   * Prints a list of items using a wide-format
   */
  printWide(items: Array<string>, padding = 2) {
    if (items.length === 0) return this.println("");

    // Compute item sizes and matrix row/cols
    const itemWidth =
      items.reduce((width, item) => Math.max(width, item.length), 0) + padding;
    const wideCols = Math.floor(this._termSize.cols / itemWidth);
    const wideRows = Math.ceil(items.length / wideCols);

    // Print matrix
    let i = 0;
    for (let row = 0; row < wideRows; ++row) {
      let rowStr = "";

      // Prepare columns
      for (let col = 0; col < wideCols; ++col) {
        if (i < items.length) {
          let item = items[i++];
          item += " ".repeat(itemWidth - item.length);
          rowStr += item;
        }
      }
      this.println(rowStr);
    }
  }

  /**
   * Prints a status message on the current line. Meant to be used with clearStatus()
   */
  printStatus(message: string) {
    // Save the cursor position
    this.print("\u001b[s");
    this.print(message);
  }

  /**
   * Clears the current status on the line, meant to be run after printStatus
   */
  clearStatus() {
    // Restore the cursor position
    this.print("\u001b[u");
    // Clear from cursor to end of screen
    this.print("\u001b[1000D");
    this.print("\u001b[0J");
  }

  /**
   * Apply prompts to the given input
   */
  applyPrompts(input: string): string {
    return (
      this._promptPrefix +
      input.replace(/\n/g, "\n" + this._continuationPromptPrefix)
    );
  }

  /**
   * Advances the `offset` as required in order to accompany the prompt
   * additions to the input.
   */
  applyPromptOffset(input: string, offset: number): number {
    const newInput = this.applyPrompts(input.substr(0, offset));
    return newInput.length;
  }

  /**
   * Clears the current prompt
   *
   * This function will erase all the lines that display the current prompt
   * and move the cursor in the beginning of the first line of the prompt.
   */
  clearInput() {
    const currentPrompt = this.applyPrompts(this._input);

    // Get the overall number of lines to clear
    const allRows = countLines(currentPrompt, this._termSize.cols);

    // Get the line we are currently in
    const promptCursor = this.applyPromptOffset(this._input, this._cursor);
    const { col, row } = offsetToColRow(
      currentPrompt,
      promptCursor,
      this._termSize.cols
    );

    // First move on the last line
    const moveRows = allRows - row - 1;
    for (let i = 0; i < moveRows; ++i) this.xterm.write("\x1B[E");

    // Clear current input line(s)
    this.xterm.write("\r\x1B[K");
    for (let i = 1; i < allRows; ++i) this.xterm.write("\x1B[F\x1B[K");
  }

  /**
   * Clears the entire Tty
   *
   * This function will erase all the lines that display on the tty,
   * and move the cursor in the beginning of the first line of the prompt.
   */
  clearTty() {
    // Clear the screen
    this.xterm.write("\u001b[2J");
    // Set the cursor to 0, 0
    this.xterm.write("\u001b[0;0H");
    this._cursor = 0;
  }

  /**
   * Function to return if it is the initial read
   */
  getFirstInit(): boolean {
    return this._firstInit;
  }

  /**
   * Function to get the current Prompt prefix
   */
  getPromptPrefix(): string {
    return this._promptPrefix;
  }

  /**
   * Function to get the current Continuation Prompt prefix
   */
  getContinuationPromptPrefix(): string {
    return this._continuationPromptPrefix;
  }

  /**
   * Function to get the terminal size
   */
  getTermSize(): { rows: number; cols: number } {
    return this._termSize;
  }

  /**
   * Function to get the current input in the line
   */
  getInput(): string {
    return this._input;
  }

  /**
   * Function to get the current cursor
   */
  getCursor(): number {
    return this._cursor;
  }

  /**
   * Function to get the size (columns and rows)
   */
  getSize(): { cols: number; rows: number } {
    return this._termSize;
  }

  /**
   * Function to return the terminal buffer
   */
  getBuffer(): IBuffer {
    return this.xterm.buffer;
  }

  /**
   * Replace input with the new input given
   *
   * This function clears all the lines that the current input occupies and
   * then replaces them with the new input.
   */
  setInput(newInput: string, shouldNotClearInput: boolean = false) {
    // Doing the programming anitpattern here,
    // because defaulting to true is the opposite of what
    // not passing a param means in JS
    if (!shouldNotClearInput) {
      this.clearInput();
    }

    // Write the new input lines, including the current prompt
    const newPrompt = this.applyPrompts(newInput);
    this.print(newPrompt);

    // Trim cursor overflow
    if (this._cursor > newInput.length) {
      this._cursor = newInput.length;
    }

    // Move the cursor to the appropriate row/col
    const newCursor = this.applyPromptOffset(newInput, this._cursor);
    const newLines = countLines(newPrompt, this._termSize.cols);
    const { col, row } = offsetToColRow(
      newPrompt,
      newCursor,
      this._termSize.cols
    );
    const moveUpRows = newLines - row - 1;

    this.xterm.write("\r");
    for (let i = 0; i < moveUpRows; ++i) this.xterm.write("\x1B[F");
    for (let i = 0; i < col; ++i) this.xterm.write("\x1B[C");

    // Replace input
    this._input = newInput;
  }

  /**
   * Set the new cursor position, as an offset on the input string
   *
   * This function:
   * - Calculates the previous and current
   */
  setCursor(newCursor: number) {
    if (newCursor < 0) newCursor = 0;
    if (newCursor > this._input.length) newCursor = this._input.length;
    this._writeCursorPosition(newCursor);
  }

  /**
   * Sets the direct cursor value. Should only be used in keystroke contexts
   */
  setCursorDirectly(newCursor: number) {
    this._writeCursorPosition(newCursor);
  }

  _writeCursorPosition(newCursor: number) {
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
      for (let i = prevRow; i < newRow; ++i) this.xterm.write("\x1B[B");
    } else {
      for (let i = newRow; i < prevRow; ++i) this.xterm.write("\x1B[A");
    }

    // Adjust horizontally
    if (newCol > prevCol) {
      for (let i = prevCol; i < newCol; ++i) this.xterm.write("\x1B[C");
    } else {
      for (let i = newCol; i < prevCol; ++i) this.xterm.write("\x1B[D");
    }

    // Set new offset
    this._cursor = newCursor;
  }

  setTermSize(cols: number, rows: number) {
    this._termSize = { cols, rows };
  }

  setFirstInit(value: boolean) {
    this._firstInit = value;
  }

  setPromptPrefix(value: string) {
    this._promptPrefix = value;
  }

  setContinuationPromptPrefix(value: string) {
    this._continuationPromptPrefix = value;
  }
}
