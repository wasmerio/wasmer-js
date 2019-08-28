import {
  closestLeftBoundary,
  closestRightBoundary,
  collectAutocompleteCandidates,
  countLines,
  getLastToken,
  hasTailingWhitespace,
  isIncompleteInput,
  offsetToColRow
} from "./utils";
import { Terminal, IBufferLine } from "xterm";

/**
 * A local terminal controller is responsible for displaying messages
 * and handling local echo for the terminal.
 *
 * Xterm Input supports most of bash-like input primitives. Namely:
 * - Arrow navigation on the input
 * - Alt-arrow for word-boundary navigation
 * - Alt-backspace for word-boundary deletion
 * - Multi-line input for incomplete commands
 * - Auto-complete hooks
 */
type AutoCompleteHandler = (index: number, tokens: string[]) => string[];

export default class XtermInputService {
  term: Terminal;
  history: HistoryController;
  maxAutocompleteEntries: number;
  _autocompleteHandlers: AutoCompleteHandler[];
  _active: boolean;
  _cursor: number;
  _input: string;
  _termSize: {
    cols: number;
    rows: number;
  };
  firstInit: boolean = true;
  _activePrompt: {
    prompt: string;
    continuationPrompt: string;
    resolve: (what: string) => any;
    reject: (error: Error) => any;
  } | null;
  _activeCharPrompt: {
    prompt: string;
    resolve: (what: string) => any;
    reject: (error: Error) => any;
  } | null;

  constructor(
    term: Terminal,
    options: { historySize: number; maxAutocompleteEntries: number } = {
      historySize: 10,
      maxAutocompleteEntries: 100
    }
  ) {
    this.term = term;

    this.history = new HistoryController(options.historySize);
    this.maxAutocompleteEntries = options.maxAutocompleteEntries;

    this._autocompleteHandlers = [];
    this._active = false;
    this._input = "";
    this._cursor = 0;
    this._activePrompt = null;
    this._activeCharPrompt = null;
    this._termSize = {
      cols: this.term.cols,
      rows: this.term.rows
    };

    this.attach();
  }

  /**
   *  Detach the controller from the terminal
   */
  detach() {
    this.term.off("data", this.handleTermData);
    this.term.off("resize", this.handleTermResize);
  }

  /**
   * Attach controller to the terminal, handling events
   */
  attach() {
    this.term.on("data", this.handleTermData);
    this.term.on("resize", this.handleTermResize);
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
      //   this.term.write(prompt);
      this._activePrompt = {
        prompt: prompt,
        continuationPrompt,
        resolve,
        reject
      };
      this.firstInit = true;
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
      this.term.write(prompt);
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
      this.term.write("\r\n");
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
    this.term.write(normInput.replace(/\n/g, "\r\n"));
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
}
