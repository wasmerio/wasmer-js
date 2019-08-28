// Xterm Preact component

import { h, Component } from "preact";
import { Terminal, ITerminalOptions, IBufferLine } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);

import CommandRunner from "../services/command-runner/command-runner";
import LocalEchoController from "../services/local-echo/LocalEchoController";

export default class XTerm extends Component {
  xterm: Terminal;
  container: HTMLElement | null;
  localEcho: LocalEchoController;
  wapmHistory: Array<string>;

  commandRunner?: CommandRunner;

  constructor() {
    super();
    this.container = null;
    this.xterm = new Terminal();
    this.wapmHistory = [];
    this.localEcho = new LocalEchoController(this.xterm);
    this.localEcho.addAutocompleteHandler((index, tokens) => {
      return this.wapmHistory;
    });
  }

  componentDidMount() {
    if (!this.container) {
      return;
    }
    this.xterm.open(this.container);
    this.prompt();
    this.xterm.on("paste", this.onPaste.bind(this));
    this.xterm.focus();
    (this.xterm as any).fit();
  }

  componentWillUnmount() {
    this.xterm.destroy();
    delete this.xterm;
  }

  async prompt() {
    try {
      let line = await this.localEcho.read("$ ");
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

  onPaste(data: string) {
    this.xterm.write(data);
  }

  render() {
    return <div ref={ref => (this.container = ref)} />;
  }
}
