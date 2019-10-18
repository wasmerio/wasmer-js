import { h, render, Component } from "preact";

import WasmTerminal from "./components/wasm-terminal";

class App extends Component {
  render() {
    return <WasmTerminal />;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  render(<App />, rootElement);
}
