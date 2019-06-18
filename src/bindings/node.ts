const crypto = require('crypto')
const fs = require('fs')
const { isatty: isTTY } = require('tty')
const path = require('path')

import { WASIBindings } from "../wasi";

const bindings: WASIBindings = {
    hrtime: process.hrtime.bigint,
    exit: process.exit,
    kill: (signal: string) => {
        process.kill(process.pid, signal)
    },
    randomFillSync: crypto.randomFillSync,
    isTTY: isTTY,
    fs: fs,
    path: path,
}

export default bindings;
