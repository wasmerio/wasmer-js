import { IBuffer, IBufferLine } from "xterm";

import {
  ActiveCharPrompt,
  ActivePrompt,
  closestLeftBoundary,
  closestRightBoundary,
  collectAutocompleteCandidates,
  getLastToken,
  hasTailingWhitespace,
  isIncompleteInput
} from "./shell-utils";
import { ShellHistory } from "./shell-history";

import WapmTty from "../wapm-tty/wapm-tty";

import CommandRunner from "../../command-runner/command-runner";

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
  _activePrompt?: ActivePrompt;
  _activeCharPrompt?: ActiveCharPrompt;

  constructor(
    wapmTty: WapmTty,
    options: { historySize: number; maxAutocompleteEntries: number } = {
      historySize: 10,
      maxAutocompleteEntries: 100
    }
  ) {
    this.wapmTty = wapmTty;
    this.history = new ShellHistory(options.historySize);
    this.commandRunner = undefined;

    this.maxAutocompleteEntries = options.maxAutocompleteEntries;
    this._autocompleteHandlers = [
      (index, tokens) => {
        return this.history.entries;
      }
    ];
    this._active = false;
  }

  async prompt() {
    try {
      this._activePrompt = this.wapmTty.read("$ ");
      this._active = true;
      let line = await this._activePrompt.promise;
      if (this.commandRunner) {
        this.commandRunner.kill();
      }

      this.commandRunner = new CommandRunner(
        this.wapmTty,
        line,
        // Command Read Callback
        async () => {
          this._activePrompt = this.wapmTty.read("");
          this._active = true;
          return await this._activePrompt.promise;
        },
        // Command End Callback
        () => {
          this.prompt();
        },
        // Wasm Module Cache Callback
        (wapmModuleName: string) => {
          if (this.history.includes(wapmModuleName)) {
            return;
          }
          this.history.push(wapmModuleName);
        }
      );
      await this.commandRunner.runCommand();
    } catch (e) {
      this.wapmTty.println(`Error: ${e.toString()}`);
      this.prompt();
    }
  }

  /**
   * This function completes the current input, calls the given callback
   * and then re-displays the prompt.
   */
  printAndRestartPrompt(callback: () => Promise<any> | null) {
    const cursor = this.wapmTty.getCursor();

    // Complete input
    this.wapmTty.setCursor(this.wapmTty.getInput().length);
    this.wapmTty.print("\r\n");

    // Prepare a function that will resume prompt
    const resume = () => {
      this.wapmTty.setCursor(this.wapmTty.getCursor());
      this.wapmTty.setInput(this.wapmTty.getInput());
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
   * Abort a pending read operation
   */
  abortRead(reason = "aborted") {
    if (this._activePrompt || this._activeCharPrompt) {
      this.wapmTty.print("\r\n");
    }
    if (this._activePrompt && this._activePrompt.reject) {
      this._activePrompt.reject(new Error(reason));
      this._activePrompt = undefined;
    }
    if (this._activeCharPrompt && this._activeCharPrompt.reject) {
      this._activeCharPrompt.reject(new Error(reason));
      this._activeCharPrompt = undefined;
    }
    this._active = false;
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
      this.wapmTty.setCursorDirectly(this.wapmTty.getCursor() + num);
    } else if (dir < 0) {
      const num = Math.max(dir, -this.wapmTty.getCursor());
      this.wapmTty.setCursorDirectly(this.wapmTty.getCursor() + num);
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
      this.wapmTty.clearInput();
      this.wapmTty.setCursorDirectly(this.wapmTty.getCursor() - 1);
      this.wapmTty.setInput(newInput, true);
    } else {
      const newInput =
        this.wapmTty.getInput().substr(0, this.wapmTty.getCursor()) +
        this.wapmTty.getInput().substr(this.wapmTty.getCursor() + 1);
      this.wapmTty.setInput(newInput);
    }
  };

  /**
   * Insert character at cursor location
   */
  handleCursorInsert = (data: string) => {
    const newInput =
      this.wapmTty.getInput().substr(0, this.wapmTty.getCursor()) +
      data +
      this.wapmTty.getInput().substr(this.wapmTty.getCursor());
    this.wapmTty.setCursorDirectly(this.wapmTty.getCursor() + data.length);
    this.wapmTty.setInput(newInput);
  };

  /**
   * Handle input completion
   */
  handleReadComplete = () => {
    if (this.history) {
      this.history.push(this.wapmTty.getInput());
    }
    if (this._activePrompt && this._activePrompt.resolve) {
      this._activePrompt.resolve(this.wapmTty.getInput());
      this._activePrompt = undefined;
    }
    this.wapmTty.print("\r\n");
    this._active = false;
  };

  /**
   * Handle terminal -> tty input
   */
  handleTermData = (data: string) => {
    if (!this._active) return;
    if (this.wapmTty.getFirstInit() && this._activePrompt) {
      let line = this.wapmTty
        .getBuffer()
        .getLine(
          this.wapmTty.getBuffer().cursorY + this.wapmTty.getBuffer().baseY
        );
      let promptRead = (line as IBufferLine).translateToString(
        false,
        0,
        this.wapmTty.getBuffer().cursorX
      );
      this._activePrompt.promptPrefix = promptRead;
      this.wapmTty.setPromptPrefix(promptRead);
      this.wapmTty.setFirstInit(false);
    }

    // If we have an active character prompt, satisfy it in priority
    if (this._activeCharPrompt && this._activeCharPrompt.resolve) {
      this._activeCharPrompt.resolve(data);
      this._activeCharPrompt = undefined;
      this.wapmTty.print("\r\n");
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
              this.wapmTty.setInput(value);
              this.wapmTty.setCursor(value.length);
            }
          }
          break;

        case "[B": // Down arrow
          if (this.history) {
            let value = this.history.getNext();
            if (!value) value = "";
            this.wapmTty.setInput(value);
            this.wapmTty.setCursor(value.length);
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
          this.wapmTty.setCursor(this.wapmTty.getInput().length);
          break;

        case "[H": // Home
          this.wapmTty.setCursor(0);
          break;

        case "b": // ALT + LEFT
          ofs = closestLeftBoundary(
            this.wapmTty.getInput(),
            this.wapmTty.getCursor()
          );
          if (ofs != null) this.wapmTty.setCursor(ofs);
          break;

        case "f": // ALT + RIGHT
          ofs = closestRightBoundary(
            this.wapmTty.getInput(),
            this.wapmTty.getCursor()
          );
          if (ofs != null) this.wapmTty.setCursor(ofs);
          break;

        case "\x7F": // CTRL + BACKSPACE
          ofs = closestLeftBoundary(
            this.wapmTty.getInput(),
            this.wapmTty.getCursor()
          );
          if (ofs != null) {
            this.wapmTty.setInput(
              this.wapmTty.getInput().substr(0, ofs) +
                this.wapmTty.getInput().substr(this.wapmTty.getCursor())
            );
            this.wapmTty.setCursor(ofs);
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
                this.wapmTty.printWide(candidates);
                return null;
              });
            } else {
              // If we have more than maximum auto-complete candidates, print
              // them only if the user acknowledges a warning
              this.printAndRestartPrompt(() =>
                this.wapmTty
                  .readChar(
                    `Display all ${candidates.length} possibilities? (y or n)`
                  )
                  .promise.then((yn: string) => {
                    if (yn == "y" || yn == "Y") {
                      this.wapmTty.printWide(candidates);
                    }
                  })
              );
            }
          } else {
            this.handleCursorInsert("    ");
          }
          break;

        case "\x03": // CTRL+C
          this.wapmTty.setCursor(this.wapmTty.getInput().length);
          this.wapmTty.print(
            "^C\r\n" +
              (this._activePrompt ? this._activePrompt.promptPrefix : "")
          );
          this.wapmTty.setInput("");
          this.wapmTty.setCursorDirectly(0);
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
