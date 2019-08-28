import { h, render, Component } from "preact";

import WapmShell from "./components/wapm-shell/wapm-shell";

import "./index.css";

class App extends Component {
  render() {
    return (
      <div>
        <WapmShell />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  render(<App />, rootElement);
}
