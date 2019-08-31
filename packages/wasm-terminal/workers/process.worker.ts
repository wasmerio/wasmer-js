// Expoprt process as a worker

import * as Comlink from "comlink";
import Process from "../lib/process/process";
Comlink.expose(Process);
