import { h, Component } from "preact";
import WapmTerminal from "./wapm-terminal";

/**
 * A simple preact wrapper around the Wapm Temrinal
 */
export default class WapmTerminalComponent extends Component {
  container: HTMLElement | null;
  wapmTerminal: WapmTerminal;

  constructor() {
    super();
    this.wapmTerminal = new WapmTerminal();
    this.container = null;
  }

  componentDidMount() {
    if (!this.container) {
      return;
    }
    this.wapmTerminal.open(this.container);
    this.wapmTerminal.fit();
    this.wapmTerminal.focus();
  }

  componentWillUnmount() {
    this.wapmTerminal.destroy();
  }

  render() {
    return <div ref={ref => (this.container = ref)} />;
  }
}
