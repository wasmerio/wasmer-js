const crypto = require("crypto");
const fs = require("fs");
const { isatty: isTTY } = require("tty");
const path = require("path");

import { WASIBindings } from "../wasi";
import hrtime from "../polyfill/hrtime.bigint";

const bindings: WASIBindings = {
  hrtime: hrtime,
  exit: process.exit,
  kill: (signal: string) => {
    process.kill(process.pid, signal);
  },
  randomFillSync: crypto.randomFillSync,
  isTTY: isTTY,
  fs: fs,
  path: path
};

export default bindings;
