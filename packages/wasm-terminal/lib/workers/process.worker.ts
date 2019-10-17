// Expoprt process as a worker

// Including comlink from source:
// https://github.com/GoogleChromeLabs/comlink/issues/366
import * as Comlink from "comlink";
import WASI from "@wasmer/wasi";
import BrowserWASIBindings from "@wasmer/wasi/bindings/browser";

import Process from "../process/process";

WASI.defaultBindings = BrowserWASIBindings;
Comlink.expose(Process);
