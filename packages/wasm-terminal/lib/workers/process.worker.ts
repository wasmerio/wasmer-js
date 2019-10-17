// Expoprt process as a worker
import * as Comlink from "comlink";
import Process from "../process/process";

Comlink.expose(Process);
