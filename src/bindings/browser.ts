const randomfill = require('randomfill')
const hrtime = require('browser-process-hrtime')
const path = require('path-browserify')

import { WASIBindings } from "../wasi";

const bindings: WASIBindings = {
    hrtime: hrtime,
    exit: (code: number | null) => {
        return;
    },
    kill: (signal: string) => {
        return;
    },
    randomFillSync: randomfill.randomFillSync,
    isTTY: () => true,
    path: path,

    // Let the user attach the fs at runtime
    fs: null,
}

export default bindings;
