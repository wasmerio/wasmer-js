import { h, render, Component } from "preact";

import XTerm from "./components/xterm";

import "./index.css";

class App extends Component {
  render() {
    return (
      <div>
        <XTerm />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  render(<App />, rootElement);
}
