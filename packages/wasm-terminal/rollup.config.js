import libBundles from "./rollup.lib";
import workerBundles from "./rollup.worker";

let exports = [];

if (process.env.WORKER) {
  exports = [...exports, ...workerBundles];
}

if (process.env.LIB) {
  exports = [...exports, ...libBundles];
}

export default exports;
