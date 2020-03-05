const crypto = require("crypto");
const fs = require("fs");
const { isatty: isTTY } = require("tty");
const path = require("path");

import { WASIBindings } from "../index";
import { BigIntPolyfillType } from "../polyfills/bigint";
import getBigIntHrtime from "../polyfills/hrtime.bigint";

let bigIntHrtime: (
  time?: [number, number]
) => BigIntPolyfillType = getBigIntHrtime(process.hrtime);
if (process.hrtime && process.hrtime.bigint) {
  bigIntHrtime = process.hrtime.bigint;
}

const bindings: WASIBindings = {
  hrtime: bigIntHrtime,
  exit: (code: number) => {
    process.exit(code);
  },
  kill: (signal: string) => {
    process.kill(process.pid, signal);
  },
  randomFillSync: crypto.randomFillSync,
  isTTY: isTTY,
  fs: fs,
  path: path
};

export default bindings;
