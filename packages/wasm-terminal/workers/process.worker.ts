// Expoprt process as a worker

import * as Comlink from "comlink";
import Process from "../services/process/process";
Comlink.expose(Process);
