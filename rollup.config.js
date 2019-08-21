import libBundles from "./rollup.lib";
import workerBundles from "./rollup.worker";
import fileSystemBundles from "./rollup.file-system";
import wapmShellBundles from "./rollup.wapm-shell";

let exports = [];

if (process.env.LIB) {
  exports = [...exports, ...libBundles];
}

if (process.env.WORKER) {
  exports = [...exports, ...workerBundles];
}

if (process.env.FILE_SYSTEM) {
  exports = [...exports, ...fileSystemBundles];
}

if (process.env.WAPM_SHELL) {
  exports = [...exports, ...wapmShellBundles];
}

export default exports;
