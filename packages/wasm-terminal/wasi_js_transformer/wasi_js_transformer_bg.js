const path = require("path").join(__dirname, "wasi_js_transformer_bg.wasm");
const bytes = require("fs").readFileSync(path);
let imports = {};
imports["./wasi_js_transformer.js"] = require("./wasi_js_transformer.js");

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
module.exports = wasmInstance.exports;
