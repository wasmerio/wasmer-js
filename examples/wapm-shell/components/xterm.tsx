// Xterm Preact component

import { h, Component } from "preact";
import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);

import CommandRunner from "../services/command-runner/command-runner";

import parse_ from "shell-parse";
const parse = parse_;

const xtermMoveCursorX = (
  xterm: Terminal,
  line: string,
  isPrompting: boolean,
  movementX: number
) => {
  // https://github.com/xtermjs/xterm.js/issues/2290
  // https://github.com/jerch/xterm.js/blob/master/src/InputHandler.ts#L602
  // https://github.com/xtermjs/xterm.js/issues/1409

  const minX = 0;
  const maxX = line.length;
  let cursorX = xterm.buffer.cursorX;
  if (isPrompting) {
    cursorX -= 2;
  }
  let newCursorX = cursorX + movementX;

  // minX takes precedence over maxX
  if (newCursorX > maxX) {
    newCursorX = maxX;
  }
  if (newCursorX < minX) {
    newCursorX = minX;
  }

  // Amount to move
  const amountToMoveCursorX = newCursorX - cursorX;

  // http://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html#cursor-navigation
  // https://github.com/sindresorhus/ansi-escapes/blob/master/index.js
  if (amountToMoveCursorX > 0) {
    xterm.write(`\u001b[${amountToMoveCursorX}C`);
  } else if (amountToMoveCursorX < 0) {
    xterm.write(`\u001b[${Math.abs(amountToMoveCursorX)}D`);
  }
};

const xtermRemoveCharacterOnLine = (
  xterm: Terminal,
  line: string,
  isPrompting: boolean,
  promptCallback: Function,
  charactersX: number
) => {
  // http://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html#deletion

  let cursorX = xterm.buffer.cursorX;
  if (isPrompting) {
    cursorX -= 2;
  }

  if (charactersX === 0) {
    return;
  } else if (charactersX < 0 && cursorX <= 0) {
    return;
  } else if (charactersX > 0 && line.length === 0) {
    return;
  }

  // Create our new line with the change
  let newLine = "";
  if (charactersX > 0) {
    newLine = line.slice(0, cursorX) + line.slice(cursorX + charactersX);
  } else if (charactersX < 0) {
    newLine = line.slice(0, cursorX + charactersX) + line.slice(cursorX);
  }

  // Clear the line
  xterm.write("\u001b[1000D");
  xterm.write("\u001b[0K");

  // Write the new line
  if (isPrompting) {
    promptCallback();
    cursorX += 2;
  }
  if (charactersX < 0) {
    cursorX -= 1;
  }
  xterm.write(newLine);

  // Move the cursor back to the correct position
  xterm.write("\u001b[1000D");
  if (cursorX > 0) {
    xterm.write(`\u001b[${cursorX}C`);
  }
};

export default class XTerm extends Component {
  xterm: Terminal;
  container: HTMLElement | null;
  isPrompting: boolean;

  commandHistory: Array<string>;
  commandHistoryIndex: number;

  wapmHistory: Array<string>;

  commandRunner?: CommandRunner;

  constructor() {
    super();
    this.container = null;
    this.xterm = new Terminal();
    this.isPrompting = false;
    this.commandHistory = [];
    this.commandHistoryIndex = -1;
    this.wapmHistory = [];
  }

  componentDidMount() {
    if (!this.container) {
      return;
    }

    this.xterm.open(this.container);
    this.prompt();
    this.xterm.on("key", this.onKey.bind(this));
    this.xterm.on("paste", this.onPaste.bind(this));
    this.xterm.focus();
    (this.xterm as any).fit();
  }

  componentWillUnmount() {
    this.xterm.destroy();
    delete this.xterm;
  }

  prompt() {
    this.xterm.write(`$ `);
    this.isPrompting = true;
  }

  onPaste(data: string) {
    this.xterm.write(data);
  }

  onKey(key: string, ev: KeyboardEvent) {
    const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

    let line = this.xterm.buffer.baseY + this.xterm.buffer.cursorY;
    let bufferLine = this.xterm.buffer.getLine(line);
    let bufferLineAsStringWithoutTrim = "";
    if (bufferLine) {
      bufferLineAsStringWithoutTrim = bufferLine.translateToString();
      if (this.isPrompting) {
        bufferLineAsStringWithoutTrim = bufferLineAsStringWithoutTrim.substr(2);
      }
    }
    const bufferLineAsString = bufferLineAsStringWithoutTrim.trim();

    if (ev.code === "Enter") {
      if (
        this.commandRunner &&
        this.commandRunner.isRunning &&
        this.commandRunner.supportsSharedArrayBuffer
      ) {
        // Pass stdin
        this.commandRunner.sendStdinLine(bufferLineAsString);
        this.xterm.write("\r\n");
        return;
      }

      this.xterm.write("\r\n");

      if (bufferLineAsString.length === 0) {
        this.prompt();
        return;
      }

      this.isPrompting = false;

      if (this.commandRunner) {
        this.commandRunner.kill();
      }

      this.commandRunner = new CommandRunner(
        this.xterm,
        bufferLineAsString,
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
      this.commandHistory.unshift(bufferLineAsString);
      this.commandHistoryIndex = -1;
      this.commandRunner.runCommand();
    } else if (ev.code === "Backspace") {
      // Backspace (Delete on Mac)
      // Do not delete the prompt
      xtermRemoveCharacterOnLine(
        this.xterm,
        bufferLineAsString,
        this.isPrompting,
        () => {
          this.prompt();
        },
        -1
      );
    } else if (ev.code === "Delete") {
      // Delete
      xtermRemoveCharacterOnLine(
        this.xterm,
        bufferLineAsString,
        this.isPrompting,
        () => {
          this.prompt();
        },
        1
      );
    } else if (ev.code === "ArrowUp") {
      if (!this.isPrompting) {
        return;
      }

      this.commandHistoryIndex++;
      if (this.commandHistoryIndex > this.commandHistory.length - 1) {
        this.commandHistoryIndex = this.commandHistory.length - 1;
      }

      // We are doing a stack, thus we grab from the top
      const command = this.commandHistory[this.commandHistoryIndex];

      // Clear the line
      this.xterm.write("\u001b[1000D");
      this.xterm.write("\u001b[0K");

      // Write the command
      this.prompt();
      this.xterm.write(command);
    } else if (ev.code === "ArrowDown") {
      if (!this.isPrompting) {
        return;
      }

      this.commandHistoryIndex--;
      if (this.commandHistoryIndex < -1) {
        this.commandHistoryIndex = -1;
      }

      let command = "";
      if (this.commandHistoryIndex >= 0) {
        command = this.commandHistory[this.commandHistoryIndex];
      }

      // Clear the line
      this.xterm.write("\u001b[1000D");
      this.xterm.write("\u001b[0K");

      // Write the command
      this.prompt();
      this.xterm.write(command);
    } else if (ev.code === "ArrowLeft") {
      xtermMoveCursorX(this.xterm, bufferLineAsString, this.isPrompting, -1);
    } else if (ev.code === "ArrowRight") {
      xtermMoveCursorX(this.xterm, bufferLineAsString, this.isPrompting, 1);
    } else if (ev.code === "Tab") {
      let cursorX = this.xterm.buffer.cursorX;
      if (this.isPrompting) {
        cursorX -= 2;
      }

      // Split the current line by pipe
      const pipeSplit = bufferLineAsString.split(" | ");

      // Find which command we are trying to autocomplete
      let commandToMatchIndex =
        cursorX > bufferLineAsString.length - 1 ? pipeSplit.length - 1 : 0;
      for (let i = 0; i < pipeSplit.length - 1; i++) {
        if (
          cursorX >= pipeSplit[i].length &&
          cursorX < pipeSplit[i + 1].length
        ) {
          commandToMatchIndex = i;
        }
      }
      const commandToMatch = pipeSplit[commandToMatchIndex].split(" ")[0];

      const matchedCommands: Array<string> = [];
      this.wapmHistory.forEach(commandName => {
        if (commandName.startsWith(commandToMatch)) {
          matchedCommands.push(commandName);
        }
      });

      if (matchedCommands.length === 0) {
        return;
      }

      if (matchedCommands.length > 1) {
        this.xterm.write("\r\n");
        this.xterm.write(matchedCommands.join(" "));
        this.xterm.write("\r\n");
        this.prompt();
        this.xterm.write(bufferLineAsString);

        // Restore cursor position
        if (this.isPrompting) {
          cursorX += 2;
        }
        this.xterm.write("\u001b[1000D");
        this.xterm.write(`\u001b[${cursorX}C`);

        return;
      }

      // Auto fill the command
      let newCommand = matchedCommands[0];
      let newCommandArgs = pipeSplit[commandToMatchIndex].split(" ");
      newCommandArgs.shift();
      newCommand += " " + newCommandArgs.join(" ");
      pipeSplit[commandToMatchIndex] = newCommand;
      const movementX = newCommand.length - commandToMatch.length;

      // Clear the line
      this.xterm.write("\u001b[1000D");
      this.xterm.write("\u001b[0K");

      // Write the new line
      if (this.isPrompting) {
        this.prompt();
        cursorX += 2;
      }
      this.xterm.write(pipeSplit.join(" | "));

      // Move the cursor back to the correct position
      // +movementX because we added new characters
      cursorX += movementX;
      this.xterm.write("\u001b[1000D");
      this.xterm.write(`\u001b[${cursorX}C`);
    } else if (printable && !ev.key.startsWith("Arrow")) {
      // Typing characters

      let cursorX = this.xterm.buffer.cursorX;
      if (this.isPrompting) {
        cursorX -= 2;
      }

      // Create our new line with the change
      let newLine =
        bufferLineAsStringWithoutTrim.slice(0, cursorX) +
        key +
        bufferLineAsStringWithoutTrim.slice(cursorX);
      newLine = newLine.trim();

      // Clear the line
      this.xterm.write("\u001b[1000D");
      this.xterm.write("\u001b[0K");

      // Write the new line
      if (this.isPrompting) {
        this.prompt();
        cursorX += 2;
      }
      this.xterm.write(newLine);

      // Move the cursor back to the correct position
      // +1 because we added a character
      cursorX += 1;
      this.xterm.write("\u001b[1000D");
      this.xterm.write(`\u001b[${cursorX}C`);
    }
  }

  render() {
    return <div ref={ref => (this.container = ref)} />;
  }
}
