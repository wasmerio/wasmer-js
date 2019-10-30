import { IBufferLine } from "xterm";

import {
  ActiveCharPrompt,
  ActivePrompt,
  closestLeftBoundary,
  closestRightBoundary,
  collectAutocompleteCandidates,
  getLastToken,
  hasTrailingWhitespace,
  isIncompleteInput
} from "./shell-utils";
import ShellHistory from "./shell-history";

import WasmTerminalConfig from "../wasm-terminal-config";

import WasmTty from "../wasm-tty/wasm-tty";

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
export default class WasmShell {
  wasmTerminalConfig: WasmTerminalConfig;
  wasmTty: WasmTty;
  history: ShellHistory;
  commandRunner?: CommandRunner;

  maxAutocompleteEntries: number;
  _autocompleteHandlers: AutoCompleteHandler[];
  _active: boolean;
  _activePrompt?: ActivePrompt;
  _activeCharPrompt?: ActiveCharPrompt;

  constructor(
    wasmTerminalConfig: WasmTerminalConfig,
    wasmTty: WasmTty,
    options: { historySize: number; maxAutocompleteEntries: number } = {
      historySize: 10,
      maxAutocompleteEntries: 100
    }
  ) {
    this.wasmTerminalConfig = wasmTerminalConfig;
    this.wasmTty = wasmTty;
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
    // If we are already prompting, do nothing...
    if (this._activePrompt) {
      return;
    }

    try {
      this._activePrompt = this.wasmTty.read("$ ");
      this._active = true;
      let line = await this._activePrompt.promise;
      if (this.commandRunner) {
        this.commandRunner.kill();
      }

      if (line === "") {
        // Simply prompt again
        this.prompt();
        return;
      }

      if (line === "!!") {
        // This means run the previous command
        if (this.history && this.history.entries.length > 0) {
          line = this.history.entries[this.history.entries.length - 1];
        } else {
          throw new Error("No Previous command in History");
        }
      } else if (this.history) {
        this.history.push(this.wasmTty.getInput());
      }

      this.commandRunner = this.getCommandRunner(line);
      await this.commandRunner.runCommand();
    } catch (e) {
      this.wasmTty.println(`${e.toString()}`);
      // tslint:disable-next-line
      this.prompt();
    }
  }

  isPrompting() {
    return this._active;
  }

  /**
   * This function returns a command runner for the specified line
   */
  getCommandRunner(line: string) {
    return new CommandRunner(
      this.wasmTerminalConfig,
      line,
      // Command Read Callback
      async () => {
        this._activePrompt = this.wasmTty.read("");
        this._active = true;
        return this._activePrompt.promise;
      },
      // Command End Callback
      () => {
        // Doing a set timeout to allow whatever killed the process to do it's thing first
        setTimeout(() => {
          // tslint:disable-next-line
          this.prompt();
        });
      },
      // TTY
      this.wasmTty
    );
  }

  /**
   * This function completes the current input, calls the given callback
   * and then re-displays the prompt.
   */
  printAndRestartPrompt(callback: () => Promise<any> | undefined) {
    const cursor = this.wasmTty.getCursor();

    // Complete input
    this.wasmTty.setCursor(this.wasmTty.getInput().length);
    this.wasmTty.print("\r\n");

    // Prepare a function that will resume prompt
    const resume = () => {
      this.wasmTty.setCursor(this.wasmTty.getCursor());
      this.wasmTty.setInput(this.wasmTty.getInput());
    };

    // Call the given callback to echo something, and if there is a promise
    // returned, wait for the resolution before resuming prompt.
    const ret = callback();
    if (ret) {
      // tslint:disable-next-line
      ret.then(resume);
    } else {
      resume();
    }
  }

  /**
   * Resolve a pending read operation
   * (Will resolve an empty string)
   */
  resolveActiveRead() {
    // Abort the read if we were reading
    if (this._activePrompt && this._activePrompt.resolve) {
      this._activePrompt.resolve("");
      this._activePrompt = undefined;
    }
    if (this._activeCharPrompt && this._activeCharPrompt.resolve) {
      this._activeCharPrompt.resolve("");
      this._activeCharPrompt = undefined;
    }
    this._active = false;
  }

  /**
   * Abort a pending read operation
   */
  rejectActiveRead(reason = "aborted") {
    if (this._activePrompt || this._activeCharPrompt) {
      this.wasmTty.print("\r\n");
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
        this.wasmTty.getInput().length - this.wasmTty.getCursor()
      );
      this.wasmTty.setCursorDirectly(this.wasmTty.getCursor() + num);
    } else if (dir < 0) {
      const num = Math.max(dir, -this.wasmTty.getCursor());
      this.wasmTty.setCursorDirectly(this.wasmTty.getCursor() + num);
    }
  };

  /**
   * Erase a character at cursor location
   */
  handleCursorErase = (backspace: boolean) => {
    if (backspace) {
      if (this.wasmTty.getCursor() <= 0) return;
      const newInput =
        this.wasmTty.getInput().substr(0, this.wasmTty.getCursor() - 1) +
        this.wasmTty.getInput().substr(this.wasmTty.getCursor());
      this.wasmTty.clearInput();
      this.wasmTty.setCursorDirectly(this.wasmTty.getCursor() - 1);
      this.wasmTty.setInput(newInput, true);
    } else {
      const newInput =
        this.wasmTty.getInput().substr(0, this.wasmTty.getCursor()) +
        this.wasmTty.getInput().substr(this.wasmTty.getCursor() + 1);
      this.wasmTty.setInput(newInput);
    }
  };

  /**
   * Insert character at cursor location
   */
  handleCursorInsert = (data: string) => {
    const newInput =
      this.wasmTty.getInput().substr(0, this.wasmTty.getCursor()) +
      data +
      this.wasmTty.getInput().substr(this.wasmTty.getCursor());
    this.wasmTty.setCursorDirectly(this.wasmTty.getCursor() + data.length);
    this.wasmTty.setInput(newInput);
  };

  /**
   * Handle input completion
   */
  handleReadComplete = () => {
    if (this._activePrompt && this._activePrompt.resolve) {
      this._activePrompt.resolve(this.wasmTty.getInput());
      this._activePrompt = undefined;
    }
    this.wasmTty.print("\r\n");
    this._active = false;
  };

  /**
   * Handle terminal -> tty input
   */
  handleTermData = (data: string) => {
    // Only Allow CTRL+C Through
    if (!this._active && data !== "\x03") {
      return;
    }
    if (this.wasmTty.getFirstInit() && this._activePrompt) {
      let line = this.wasmTty
        .getBuffer()
        .getLine(
          this.wasmTty.getBuffer().cursorY + this.wasmTty.getBuffer().baseY
        );
      let promptRead = (line as IBufferLine).translateToString(
        false,
        0,
        this.wasmTty.getBuffer().cursorX
      );
      this._activePrompt.promptPrefix = promptRead;
      this.wasmTty.setPromptPrefix(promptRead);
      this.wasmTty.setFirstInit(false);
    }

    // If we have an active character prompt, satisfy it in priority
    if (this._activeCharPrompt && this._activeCharPrompt.resolve) {
      this._activeCharPrompt.resolve(data);
      this._activeCharPrompt = undefined;
      this.wasmTty.print("\r\n");
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
    // Only Allow CTRL+C Through
    if (!this._active && data !== "\x03") {
      return;
    }

    const ord = data.charCodeAt(0);
    let ofs;

    // Handle ANSI escape sequences
    if (ord === 0x1b) {
      switch (data.substr(1)) {
        case "[A": // Up arrow
          if (this.history) {
            let value = this.history.getPrevious();
            if (value) {
              this.wasmTty.setInput(value);
              this.wasmTty.setCursor(value.length);
            }
          }
          break;

        case "[B": // Down arrow
          if (this.history) {
            let value = this.history.getNext();
            if (!value) value = "";
            this.wasmTty.setInput(value);
            this.wasmTty.setCursor(value.length);
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
          this.wasmTty.setCursor(this.wasmTty.getInput().length);
          break;

        case "[H": // Home
          this.wasmTty.setCursor(0);
          break;

        // case "b": // ALT + a

        case "b": // ALT + LEFT
          ofs = closestLeftBoundary(
            this.wasmTty.getInput(),
            this.wasmTty.getCursor()
          );
          if (ofs) this.wasmTty.setCursor(ofs);
          break;

        case "f": // ALT + RIGHT
          ofs = closestRightBoundary(
            this.wasmTty.getInput(),
            this.wasmTty.getCursor()
          );
          if (ofs) this.wasmTty.setCursor(ofs);
          break;

        case "\x7F": // CTRL + BACKSPACE
          ofs = closestLeftBoundary(
            this.wasmTty.getInput(),
            this.wasmTty.getCursor()
          );
          if (ofs) {
            this.wasmTty.setInput(
              this.wasmTty.getInput().substr(0, ofs) +
                this.wasmTty.getInput().substr(this.wasmTty.getCursor())
            );
            this.wasmTty.setCursor(ofs);
          }
          break;
      }

      // Handle special characters
    } else if (ord < 32 || ord === 0x7f) {
      switch (data) {
        case "\r": // ENTER
        case "\x0a": // CTRL+J
        case "\x0d": // CTRL+M
          if (isIncompleteInput(this.wasmTty.getInput())) {
            this.handleCursorInsert("\n");
          } else {
            this.handleReadComplete();
          }
          break;

        case "\x7F": // BACKSPACE
        case "\x08": // CTRL+H
        case "\x04": // CTRL+D
          this.handleCursorErase(true);
          break;

        case "\t": // TAB
          if (this._autocompleteHandlers.length > 0) {
            const inputFragment = this.wasmTty
              .getInput()
              .substr(0, this.wasmTty.getCursor());
            const hasTrailingSpace = hasTrailingWhitespace(inputFragment);
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
              if (!hasTrailingSpace) {
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
                this.wasmTty.printWide(candidates);
                return undefined;
              });
            } else {
              // If we have more than maximum auto-complete candidates, print
              // them only if the user acknowledges a warning
              this.printAndRestartPrompt(() =>
                this.wasmTty
                  .readChar(
                    `Display all ${candidates.length} possibilities? (y or n)`
                  )
                  .promise.then((yn: string) => {
                    if (yn === "y" || yn === "Y") {
                      this.wasmTty.printWide(candidates);
                    }
                  })
              );
            }
          } else {
            this.handleCursorInsert("    ");
          }
          break;

        case "\x01": // CTRL+A
          this.wasmTty.setCursor(0);
          break;

        case "\x02": // CTRL+B
          this.handleCursorMove(-1);
          break;

        case "\x03": // CTRL+C
        case "\x1a": // CTRL+Z
          const currentInput = this.wasmTty.getInput();
          this.wasmTty.setCursor(currentInput.length);
          this.wasmTty.setInput("");
          this.wasmTty.setCursorDirectly(0);
          this.wasmTty.print(currentInput + "^C\r\n");
          if (this.history) this.history.rewind();

          // Kill the command
          if (this.commandRunner) {
            this.commandRunner.kill();
            this.commandRunner = undefined;
          }

          // If we are prompting, then we want to cancel the current read
          this.resolveActiveRead();

          break;

        case "\x05": // CTRL+E
          this.wasmTty.setCursor(this.wasmTty.getInput().length);
          break;

        case "\x06": // CTRL+F
          this.handleCursorMove(1);
          break;

        case "\x07": // CTRL+G
          if (this.history) this.history.rewind();
          this.wasmTty.setInput("");
          break;

        case "\x0b": // CTRL+K
          this.wasmTty.setInput(
            this.wasmTty.getInput().substring(0, this.wasmTty.getCursor())
          );
          this.wasmTty.setCursor(this.wasmTty.getInput().length);
          break;

        case "\x0c": // CTRL+L
          this.wasmTty.clearTty();
          this.wasmTty.print(`$ ${this.wasmTty.getInput()}`);
          break;

        case "\x0e": // CTRL+N
          if (this.history) {
            let value = this.history.getNext();
            if (!value) value = "";
            this.wasmTty.setInput(value);
            this.wasmTty.setCursor(value.length);
          }
          break;

        case "\x10": // CTRL+P
          if (this.history) {
            let value = this.history.getPrevious();
            if (value) {
              this.wasmTty.setInput(value);
              this.wasmTty.setCursor(value.length);
            }
          }
          break;

        case "\x15": // CTRL+U
          this.wasmTty.setInput(
            this.wasmTty.getInput().substring(this.wasmTty.getCursor())
          );
          this.wasmTty.setCursor(0);
          break;
      }

      // Handle visible characters
    } else {
      this.handleCursorInsert(data);
    }
  };
}
