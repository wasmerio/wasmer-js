// Xterm Preact component

import { h, Component } from "preact";
import { Terminal, ITerminalOptions } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);

import { WASIExitError, WASIKillError } from "../../../lib/bindings/browser";

import {
  Command,
  WASICommand,
  CommandOptions,
  commandAstToCommandOptions
} from "../services/command";

import parse_ from "shell-parse";
const parse = parse_;

import { Duplex } from "stream";

export interface XTermProps {
  options?: ITerminalOptions;
  getCommand: (options: {
    args: string[];
    env: { [key: string]: string };
  }) => Command | Promise<Command>;
}

export default class XTerm extends Component<XTermProps> {
  xterm: Terminal;
  container: HTMLElement | null;

  constructor(props: XTermProps) {
    super(props);
    this.container = null;
    this.xterm = new Terminal(this.props.options);
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
  }

  getTerminal() {
    return this.xterm;
  }

  onPaste(data: string) {
    this.xterm.write(data);
  }

  onKey(key: string, ev: KeyboardEvent) {
    const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
    if (ev.keyCode === 13) {
      // ENTER
      // console.log(term.markers[term.markers.length-1].line);
      // let line = term.markers[term.markers.length-1].line;
      let line = this.xterm.buffer.baseY + this.xterm.buffer.cursorY;
      // console.log(term.buffer.getLine(line).translateToString());
      let bufferLine = this.xterm.buffer.getLine(line);
      if (!bufferLine) {
        return;
      }
      let bashCommand = bufferLine
        .translateToString()
        .substr(2)
        .trim();
      this.xterm.write("\r\n");
      if (bashCommand === "") {
        this.prompt();
        return;
      }
      try {
        const bashAst = parse(bashCommand);
        // console.log(bashCommand, bashAst)
        if (bashAst.length > 1) {
          throw new Error("Only one command permitted");
        }
        if (bashAst[0].type !== "command") {
          throw new Error("Only commands allowed");
        }
        let options = commandAstToCommandOptions(bashAst[0]);
        this.runCommand(options);
      } catch (c) {
        this.xterm.write(`wapm shell: parse error (${c.toString()})\r\n$ `);
      }
      // term.prompt();
    } else if (ev.keyCode === 8) {
      // DELETE
      // Do not delete the prompt
      // @ts-ignore
      if (this.xterm._core.buffer.x > 2) {
        this.xterm.write("\b \b");
      }
    } else if (printable && !ev.key.startsWith("Arrow")) {
      // console.log(key, ev.key.startsWith("Arrow"));
      this.xterm.write(key);
    }
  }

  async runSingleCommand(options: CommandOptions, stdin?: string) {
    let command: Command;
    let maybePromiseCommand = this.props.getCommand(options);
    command = await Promise.resolve(maybePromiseCommand);
    let commandPipe = await command.instantiate(stdin);
    return { command, pipe: commandPipe };
  }

  async runCommand(options: CommandOptions) {
    let command: Command;
    let redirects = 0;
    try {
      let xterm = this.xterm;
      let vars = await this.runSingleCommand(options);
      command = vars.command;
      let commandPipe = vars.pipe;
      let termPipe = new Duplex({
        read() {},
        write(data: any, _: any, done: Function) {
          let dataStr = data.toString("utf8");
          xterm.write(dataStr.replace(/\n/g, "\r\n"));
        }
      });
      termPipe.once("end", () => {
        let haveNewLine = xterm.buffer.cursorX == 0;
        if (!haveNewLine) {
          xterm.write("\u001b[1m\u001b[30;47m%\u001b[0m\r\n");
        }
        this.prompt();
      });

      if (!options.redirect) {
        commandPipe.once("end", () => {
          termPipe.emit("end");
          termPipe.end();
          return;
        });
        commandPipe.pipe(termPipe);
      }

      command.run();
      // Very hacky way of getting things working
      if (options.redirect) {
        let stdin = command.getStdout();
        redirects++;
        let { command: redirectCommand, pipe } = await this.runSingleCommand(
          options.redirect,
          stdin
        );
        pipe.once("end", () => {
          termPipe.emit("end");
          termPipe.end();
          return;
        });
        pipe.pipe(termPipe);
        redirectCommand.run();
      }
    } catch (e) {
      let commandName = options.args.join(" ");
      if (e instanceof WASIExitError) {
        console.log(`Program "${commandName}" exitted with code: ${e.code}`);
        return;
      } else if (e instanceof WASIKillError) {
        console.log(`Program "${commandName}" killed with signal: ${e.signal}`);
        return;
      }
      console.error(e);
      console.error(`Error while running "${commandName}"\n${e}`);
      this.xterm.writeln(`wapm shell error: ${e.toString()}`);
      this.prompt();
      return;
    }
  }

  render() {
    return <div ref={ref => (this.container = ref)} />;
  }
}
