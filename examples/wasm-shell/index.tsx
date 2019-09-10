import { h, render, Component } from "preact";

import WasmTerminal from "./components/wasm-terminal";
import "./index.css";

class App extends Component {
  render() {
    return (
      <div>
        <WasmTerminal />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  render(<App />, rootElement);
}
