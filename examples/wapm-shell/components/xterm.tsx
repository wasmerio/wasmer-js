// Xterm Preact component

import { h, Component } from "preact";
import { Terminal, ITerminalOptions } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);

import CommandService from "../services/command/command.service";

import parse_ from "shell-parse";
const parse = parse_;

const xtermPrompt = (xterm: Terminal) => {
  xterm.write(`$ `);
};

const onXtermPaste = (xterm: Terminal, data: string) => {
  xterm.write(data);
};

const onXtermKey = (xterm: Terminal, key: string, ev: KeyboardEvent) => {
  const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
  if (ev.keyCode === 13) {
    // ENTER

    let line = xterm.buffer.baseY + xterm.buffer.cursorY;
    let bufferLine = xterm.buffer.getLine(line);
    if (!bufferLine) {
      return;
    }

    let bashCommand = bufferLine
      .translateToString()
      .substr(2)
      .trim();

    xterm.write("\r\n");

    if (bashCommand === "") {
      xtermPrompt(xterm);
      return;
    }

    CommandService.runCommand(xterm, bashCommand, () => {
      xtermPrompt(xterm);
    });
  } else if (ev.keyCode === 8) {
    // DELETE
    // Do not delete the prompt
    // @ts-ignore
    if (xterm._core.buffer.x > 2) {
      xterm.write("\b \b");
    }
  } else if (printable && !ev.key.startsWith("Arrow")) {
    xterm.write(key);
  }
};

export interface XTermProps {
  options?: ITerminalOptions;
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
    xtermPrompt(this.xterm);
    this.xterm.on("key", onXtermKey.bind(this, this.xterm));
    this.xterm.on("paste", onXtermPaste.bind(this, this.xterm));
    this.xterm.focus();
    (this.xterm as any).fit();
  }

  componentWillUnmount() {
    this.xterm.destroy();
    delete this.xterm;
  }

  render() {
    return <div ref={ref => (this.container = ref)} />;
  }
}
