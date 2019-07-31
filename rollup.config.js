import libBundles from "./rollup.lib";
import wapmShellBundles from "./rollup.wapm-shell";

let exports = [];

if (process.env.LIB) {
  exports = [...exports, ...libBundles];
}

if (process.env.WAPM_SHELL) {
  exports = [...exports, ...wapmShellBundles];
}

export default exports;
