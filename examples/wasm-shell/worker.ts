import processWorker from "@wasmer/wasm-terminal/workers/process.worker";
import { WASI } from "@wasmer/wasi";
import BrowserWASIBindings from "@wasmer/wasi/bindings/browser";

WASI.defaultBindings = BrowserWASIBindings;

export default processWorker;
