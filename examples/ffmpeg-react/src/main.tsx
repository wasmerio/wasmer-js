import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WasmerSdk } from "./hooks.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WasmerSdk log="info,wasmer_wasix=debug,wasmer_js=debug">
      <App />
    </WasmerSdk>
  </React.StrictMode>,
);
