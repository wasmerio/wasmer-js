import { h, render, Component } from "preact";

import WapmTerminal from "./components/wapm-terminal/wapm-terminal.component";
import "./index.css";

class App extends Component {
  render() {
    return (
      <div>
        <WapmTerminal />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  render(<App />, rootElement);
}
