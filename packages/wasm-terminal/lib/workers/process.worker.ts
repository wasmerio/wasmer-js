// Expoprt process as a worker
// Including comlink from source:
// https://github.com/GoogleChromeLabs/comlink/issues/366
import * as Comlink from "comlink/src/comlink";
import Process from "../process/process";

Comlink.expose(Process);
