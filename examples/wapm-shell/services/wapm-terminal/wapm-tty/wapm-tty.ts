import { Terminal, IBufferLine } from "xterm";

/**
 * A tty is a particular device file, that sits between the shell and the terminal.
 * It acts an an interface for the shell and terminal to read/write from,
 * and communicate with one another
 */
type AutoCompleteHandler = (index: number, tokens: string[]) => string[];

export default class WapmTTY {
  xterm: Terminal;
  history: HistoryController;
  maxAutocompleteEntries: number;
  _cursor: number;
  _input: string;

  constructor(
    xterm: Terminal,
    options: { historySize: number; maxAutocompleteEntries: number } = {
      historySize: 10,
      maxAutocompleteEntries: 100
    }
  ) {
    this.xterm = xterm;

    this.history = new HistoryController(options.historySize);
    this.maxAutocompleteEntries = options.maxAutocompleteEntries;

    this._autocompleteHandlers = [];
    this._input = "";
    this._cursor = 0;
    this._termSize = {
      cols: this.xterm.cols,
      rows: this.xterm.rows
    };
  }

  /**
   *  Detach the controller from the terminal
   */
  detach() {
    this.xterm.off("data", this.handleTermData);
    this.xterm.off("resize", this.handleTermResize);
  }

  /**
   * Attach controller to the terminal, handling events
   */
  attach() {
    this.xterm.on("data", this.handleTermData);
    this.xterm.on("resize", this.handleTermResize);
  }

  /**
   * Register a handler that will be called to satisfy auto-completion
   */
  addAutocompleteHandler(fn: AutoCompleteHandler) {
    this._autocompleteHandlers.push(fn);
  }

  /**
   * Remove a previously registered auto-complete handler
   */
  removeAutocompleteHandler(fn: AutoCompleteHandler) {
    const idx = this._autocompleteHandlers.findIndex(e => e === fn);
    if (idx === -1) return;

    this._autocompleteHandlers.splice(idx, 1);
  }

  /**
   * Return a promise that will resolve when the user has completed
   * typing a single line
   */
  read(prompt: string, continuationPrompt: string = "> "): Promise<string> {
    return new Promise((resolve, reject) => {
      this._activePrompt = {
        prompt: prompt,
        continuationPrompt,
        resolve,
        reject
      };
      this._input = "";
      this._cursor = 0;
      this._active = true;
    });
  }

  /**
   * Return a promise that will be resolved when the user types a single
   * character.
   *
   * This can be active in addition to `.read()` and will be resolved in
   * priority before it.
   */
  readChar(prompt: string) {
    return new Promise((resolve, reject) => {
      this.xterm.write(prompt);
      this._activeCharPrompt = {
        prompt,
        resolve,
        reject
      };
    });
  }

  /**
   * Abort a pending read operation
   */
  abortRead(reason = "aborted") {
    if (this._activePrompt != null || this._activeCharPrompt != null) {
      this.xterm.write("\r\n");
    }
    if (this._activePrompt != null) {
      this._activePrompt.reject(new Error(reason));
      this._activePrompt = null;
    }
    if (this._activeCharPrompt != null) {
      this._activeCharPrompt.reject(new Error(reason));
      this._activeCharPrompt = null;
    }
    this._active = false;
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
  print(message: string) {
    const normInput = message.replace(/[\r\n]+/g, "\n");
    this.xterm.write(normInput.replace(/\n/g, "\r\n"));
  }

  /**
   * Prints a list of items using a wide-format
   */
  printWide(items: Array<string>, padding = 2) {
    if (items.length == 0) return this.println("");

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
    for (var i = 0; i < moveRows; ++i) this.xterm.write("\x1B[E");

    // Clear current input line(s)
    this.xterm.write("\r\x1B[K");
    for (var i = 1; i < allRows; ++i) this.xterm.write("\x1B[F\x1B[K");
  }

  /**
   * Replace input with the new input given
   *
   * This function clears all the lines that the current input occupies and
   * then replaces them with the new input.
   */
  setInput(newInput: string, clearInput: boolean = true) {
    // Clear current input
    if (clearInput) this.clearInput();

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
    for (var i = 0; i < moveUpRows; ++i) this.xterm.write("\x1B[F");
    for (var i = 0; i < col; ++i) this.xterm.write("\x1B[C");

    // Replace input
    this._input = newInput;
  }

  /**
   * Handle terminal input
   */
  handleTermData = (data: string) => {
    if (!this._active) return;
    if (this.firstInit && this._activePrompt) {
      let line = this.xterm.buffer.getLine(
        this.xterm.buffer.cursorY + this.xterm.buffer.baseY
      );
      let promptRead = (line as IBufferLine).translateToString(
        false,
        0,
        this.xterm.buffer.cursorX
      );
      this._activePrompt.prompt = promptRead;
      this.firstInit = false;
    }

    // If we have an active character prompt, satisfy it in priority
    if (this._activeCharPrompt != null) {
      this._activeCharPrompt.resolve(data);
      this._activeCharPrompt = null;
      this.xterm.write("\r\n");
      return;
    }

    // If this looks like a pasted input, expand it
    if (data.length > 3 && data.charCodeAt(0) !== 0x1b) {
      const normData = data.replace(/[\r\n]+/g, "\r");
      Array.from(normData).forEach(c => this.handleData(c));
    } else {
      this.handleData(data);
    }
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
}
