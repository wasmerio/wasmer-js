import { ShellHistory } from "./shell-history";
import {
  closestLeftBoundary,
  closestRightBoundary,
  collectAutocompleteCandidates,
  countLines,
  getLastToken,
  hasTailingWhitespace,
  isIncompleteInput,
  offsetToColRow
} from "./shell-utils";

/**
 * A shell is the primary interface that is used to start other programs.
 * It's purpose to handle:
 * - Job control (control of child processes),
 * - Control Sequences (CTRL+C to kill the foreground process)
 * - Line editing and history
 * - Output text to the tty -> terminal
 * - Interpret text within the tty to launch processes and interpret programs
 */
type AutoCompleteHandler = (index: number, tokens: string[]) => string[];

export default class WapmShell {
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
    wapmTty: WapmTty,
    options: { historySize: number; maxAutocompleteEntries: number } = {
      historySize: 10,
      maxAutocompleteEntries: 100
    }
  ) {
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

  async prompt() {
    try {
      this.xterm.write("$ ");
      let line = await this.WapmTty.read("$ ");
      if (this.commandRunner) {
        this.commandRunner.kill();
      }

      this.commandRunner = new CommandRunner(
        this.xterm,
        line,
        // Command End Callback
        () => {
          this.prompt();
        },
        // Wasm Module Cache Callback
        (wapmModuleName: string) => {
          if (this.wapmHistory.includes(wapmModuleName)) {
            return;
          }
          this.wapmHistory.push(wapmModuleName);
        }
      );
      // this.commandHistory.unshift(bufferLineAsString);
      // this.commandHistoryIndex = -1;
      await this.commandRunner.runCommand();
    } catch (e) {
      this.xterm.writeln(`Error: ${e.toString()}`);
      this.prompt();
    }
  }

  /**
   * Apply prompts to the given input
   */
  applyPrompts(input: string): string {
    const prompt = this._activePrompt ? this._activePrompt.prompt : "";
    const continuationPrompt = this._activePrompt
      ? this._activePrompt.continuationPrompt
      : "";

    return prompt + input.replace(/\n/g, "\n" + continuationPrompt);
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
   * This function completes the current input, calls the given callback
   * and then re-displays the prompt.
   */
  printAndRestartPrompt(callback: () => Promise<any> | null) {
    const cursor = this._cursor;

    // Complete input
    this.setCursor(this._input.length);
    this.term.write("\r\n");

    // Prepare a function that will resume prompt
    const resume = () => {
      this._cursor = cursor;
      this.setInput(this._input);
    };

    // Call the given callback to echo something, and if there is a promise
    // returned, wait for the resolution before resuming prompt.
    const ret = callback();
    if (ret == null) {
      resume();
    } else {
      ret.then(resume);
    }
  }

  /**
   * Move cursor at given direction
   */
  handleCursorMove = (dir: number) => {
    if (dir > 0) {
      const num = Math.min(dir, this._input.length - this._cursor);
      this.setCursor(this._cursor + num);
    } else if (dir < 0) {
      const num = Math.max(dir, -this._cursor);
      this.setCursor(this._cursor + num);
    }
  };

  /**
   * Erase a character at cursor location
   */
  handleCursorErase = (backspace: boolean) => {
    const { _cursor, _input } = this;
    if (backspace) {
      if (_cursor <= 0) return;
      const newInput = _input.substr(0, _cursor - 1) + _input.substr(_cursor);
      this.clearInput();
      this._cursor -= 1;
      this.setInput(newInput, false);
    } else {
      const newInput = _input.substr(0, _cursor) + _input.substr(_cursor + 1);
      this.setInput(newInput);
    }
  };

  /**
   * Insert character at cursor location
   */
  handleCursorInsert = (data: string) => {
    const { _cursor, _input } = this;
    const newInput = _input.substr(0, _cursor) + data + _input.substr(_cursor);
    this._cursor += data.length;
    this.setInput(newInput);
  };

  /**
   * Handle input completion
   */
  handleReadComplete = () => {
    if (this.history) {
      this.history.push(this._input);
    }
    if (this._activePrompt) {
      this._activePrompt.resolve(this._input);
      this._activePrompt = null;
    }
    this.term.write("\r\n");
    this._active = false;
  };

  /**
   * Handle a single piece of information from the terminal -> tty.
   */
  handleData = (data: string) => {
    if (!this._active) return;
    const ord = data.charCodeAt(0);
    let ofs;

    // Handle ANSI escape sequences
    if (ord == 0x1b) {
      switch (data.substr(1)) {
        case "[A": // Up arrow
          if (this.history) {
            let value = this.history.getPrevious();
            if (value) {
              this.setInput(value);
              this.setCursor(value.length);
            }
          }
          break;

        case "[B": // Down arrow
          if (this.history) {
            let value = this.history.getNext();
            if (!value) value = "";
            this.setInput(value);
            this.setCursor(value.length);
          }
          break;

        case "[D": // Left Arrow
          this.handleCursorMove(-1);
          break;

        case "[C": // Right Arrow
          this.handleCursorMove(1);
          break;

        case "[3~": // Delete
          this.handleCursorErase(false);
          break;

        case "[F": // End
          this.setCursor(this._input.length);
          break;

        case "[H": // Home
          this.setCursor(0);
          break;

        case "b": // ALT + LEFT
          ofs = closestLeftBoundary(this._input, this._cursor);
          if (ofs != null) this.setCursor(ofs);
          break;

        case "f": // ALT + RIGHT
          ofs = closestRightBoundary(this._input, this._cursor);
          if (ofs != null) this.setCursor(ofs);
          break;

        case "\x7F": // CTRL + BACKSPACE
          ofs = closestLeftBoundary(this._input, this._cursor);
          if (ofs != null) {
            this.setInput(
              this._input.substr(0, ofs) + this._input.substr(this._cursor)
            );
            this.setCursor(ofs);
          }
          break;
      }

      // Handle special characters
    } else if (ord < 32 || ord === 0x7f) {
      switch (data) {
        case "\r": // ENTER
          if (isIncompleteInput(this._input)) {
            this.handleCursorInsert("\n");
          } else {
            this.handleReadComplete();
          }
          break;

        case "\x7F": // BACKSPACE
          this.handleCursorErase(true);
          break;

        case "\t": // TAB
          if (this._autocompleteHandlers.length > 0) {
            const inputFragment = this._input.substr(0, this._cursor);
            const hasTailingSpace = hasTailingWhitespace(inputFragment);
            const candidates = collectAutocompleteCandidates(
              this._autocompleteHandlers,
              inputFragment
            );

            // Sort candidates
            candidates.sort();

            // Depending on the number of candidates, we are handing them in
            // a different way.
            if (candidates.length === 0) {
              // No candidates? Just add a space if there is none already
              if (!hasTailingSpace) {
                this.handleCursorInsert(" ");
              }
            } else if (candidates.length === 1) {
              // Just a single candidate? Complete
              const lastToken = getLastToken(inputFragment);
              this.handleCursorInsert(
                candidates[0].substr(lastToken.length) + " "
              );
            } else if (candidates.length <= this.maxAutocompleteEntries) {
              // If we are less than maximum auto-complete candidates, print
              // them to the user and re-start prompt
              this.printAndRestartPrompt(() => {
                this.printWide(candidates);
                return null;
              });
            } else {
              // If we have more than maximum auto-complete candidates, print
              // them only if the user acknowledges a warning
              this.printAndRestartPrompt(() =>
                this.readChar(
                  `Display all ${candidates.length} possibilities? (y or n)`
                ).then(yn => {
                  if (yn == "y" || yn == "Y") {
                    this.printWide(candidates);
                  }
                })
              );
            }
          } else {
            this.handleCursorInsert("    ");
          }
          break;

        case "\x03": // CTRL+C
          this.setCursor(this._input.length);
          this.term.write(
            "^C\r\n" + (this._activePrompt ? this._activePrompt.prompt : "")
          );
          this._input = "";
          this._cursor = 0;
          if (this.history) this.history.rewind();
          break;
      }

      // Handle visible characters
    } else {
      this.handleCursorInsert(data);
    }
  };
}
