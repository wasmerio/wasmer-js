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
import { ShellHistory } from "./shell-history";

import CommandRunner from "../command-runner/command-runner";

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
  wapmTty: WapmTty;
  history: ShellHistory;
  commandRunner?: CommandRunner;

  maxAutocompleteEntries: number;
  _autocompleteHandlers: AutoCompleteHandler[];
  _active: boolean;
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
    this.wapmTty = wapmTty;
    this.history = new HistoryController(options.historySize);
    this.commandRunner = undefined;

    this.maxAutocompleteEntries = options.maxAutocompleteEntries;
    this._autocompleteHandlers = [];
    this._active = false;
    this._activePrompt = null;
    this._activeCharPrompt = null;
  }

  async prompt() {
    try {
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
    const promptPrefix = this._activePrompt
      ? this._activePrompt.promptPrefix
      : "";
    const continuationPrompt = this._activePrompt
      ? this._activePrompt.continuationPrompt
      : "";

    return promptPrefix + input.replace(/\n/g, "\n" + continuationPrompt);
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
    const cursor = this.wapmTty.getCursor();

    // Complete input
    this.setCursor(this.wapmTty.getInput().length);
    this.wasmTty.print("\r\n");

    // Prepare a function that will resume prompt
    const resume = () => {
      this.wapmTty.setCursor(cursor);
      this.setInput(this.wapmTty.getInput());
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
   * Move cursor at given direction
   */
  handleCursorMove = (dir: number) => {
    if (dir > 0) {
      const num = Math.min(
        dir,
        this.wapmTty.getInput().length - this.wapmTty.getCursor()
      );
      this.setCursor(this.wapmTty.getCursor() + num);
    } else if (dir < 0) {
      const num = Math.max(dir, -this.wapmTty.getCursor());
      this.setCursor(this.wapmTty.getCursor() + num);
    }
  };

  /**
   * Erase a character at cursor location
   */
  handleCursorErase = (backspace: boolean) => {
    if (backspace) {
      if (this.wapmTty.getCursor() <= 0) return;
      const newInput =
        this.wapmTty.getInput().substr(0, this.wapmTty.getCursor() - 1) +
        this.wapmTty.getInput().substr(this.wapmTty.getCursor());
      this.clearInput();
      this.wapmTty.setCursor(this.wapmTty.getCursor() - 1);
      this.setInput(newInput, false);
    } else {
      const newInput =
        this.wapmTty.getInput().substr(0, this.wapmTty.getCursor()) +
        this.wapmTty.getInput().substr(this.wapmTty.getCursor() + 1);
      this.setInput(newInput);
    }
  };

  /**
   * Insert character at cursor location
   */
  handleCursorInsert = (data: string) => {
    const { _cursor, _input } = this;
    const newInput =
      this.wapmTty.getInput().substr(0, this.wapmTty.getCursor()) +
      data +
      this.wapmTty.getInput().substr(this.wapmTty.getCursor());
    this.wapmTty.setCursor(this.wapmTty.getCursor() + data.length);
    this.setInput(newInput);
  };

  /**
   * Handle input completion
   */
  handleReadComplete = () => {
    if (this.history) {
      this.history.push(this.wapmTty.getInput());
    }
    if (this._activePrompt) {
      this._activePrompt.resolve(this.wapmTty.getInput());
      this._activePrompt = null;
    }
    this.wasmTty.print("\r\n");
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
          this.setCursor(this.wapmTty.getInput().length);
          break;

        case "[H": // Home
          this.setCursor(0);
          break;

        case "b": // ALT + LEFT
          ofs = closestLeftBoundary(
            this.wapmTty.getInput(),
            this.wapmTty.getCursor()
          );
          if (ofs != null) this.setCursor(ofs);
          break;

        case "f": // ALT + RIGHT
          ofs = closestRightBoundary(
            this.wapmTty.getInput(),
            this.wapmTty.getCursor()
          );
          if (ofs != null) this.setCursor(ofs);
          break;

        case "\x7F": // CTRL + BACKSPACE
          ofs = closestLeftBoundary(
            this.wapmTty.getInput(),
            this.wapmTty.getCursor()
          );
          if (ofs != null) {
            this.setInput(
              this.wapmTty.getInput().substr(0, ofs) +
                this.wapmTty.getInput().substr(this.wapmTty.getCursor())
            );
            this.setCursor(ofs);
          }
          break;
      }

      // Handle special characters
    } else if (ord < 32 || ord === 0x7f) {
      switch (data) {
        case "\r": // ENTER
          if (isIncompleteInput(this.wapmTty.getInput())) {
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
            const inputFragment = this.wapmTty
              .getInput()
              .substr(0, this.wapmTty.getCursor());
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
          this.setCursor(this.wapmTty.getInput().length);
          this.wasmTty.print(
            "^C\r\n" + (this._activePrompt ? this._activePrompt.prompt : "")
          );
          this.wapmTty.setInput("");
          this.wapmTty.setCursor(0);
          if (this.history) this.history.rewind();

          if (this.commandRunner) {
            this.commandRunner.kill();
            this.commandRunner = undefined;
          }

          break;
      }

      // Handle visible characters
    } else {
      this.handleCursorInsert(data);
    }
  };
}
