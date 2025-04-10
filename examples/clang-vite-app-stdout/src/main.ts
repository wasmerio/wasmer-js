import "./style.css";
import { init, runWasix } from "@wasmer/sdk";
import helloUrl from "./hello.wasm?url";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <div class="card">
      <button id="message-button" type="button">Click</button>
      <div id="message" type="text"/>
    </div>
  </div>
`;

async function initialize() {
  await init();
  return WebAssembly.compileStreaming(fetch(helloUrl));
}

async function runWasm(module: WebAssembly.Module) {
  const instance = await runWasix(module, {});

  const result = await instance.wait();
  return result.ok ? result.stdout : null;
}

async function main() {
  const module = await initialize();

  document
    .getElementById("message-button")
    .addEventListener("click", async () => {
      const stdout = await runWasm(module);
      console.log(stdout);
      document.getElementById("message").innerText = stdout;
    });
}

main();
