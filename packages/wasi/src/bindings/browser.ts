// @ts-ignore
import * as randomfill from "randomfill";
import hrtime from "../polyfills/browser-hrtime";
// @ts-ignore
import path from "path-browserify";

import { WASIBindings, WASIExitError, WASIKillError } from "../index";
import getBigIntHrtime from "../polyfills/hrtime.bigint";

const bindings: WASIBindings = {
  hrtime: getBigIntHrtime(hrtime),
  exit: (code: number | null) => {
    throw new WASIExitError(code);
  },
  kill: (signal: string) => {
    throw new WASIKillError(signal);
  },
  // @ts-ignore
  randomFillSync: randomfill.randomFillSync,
  isTTY: () => true,
  path: path,

  // Let the user attach the fs at runtime
  fs: null
};

export default bindings;
