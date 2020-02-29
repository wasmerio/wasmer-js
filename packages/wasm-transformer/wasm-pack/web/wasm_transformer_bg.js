
const path = require('path').join(__dirname, 'wasm_transformer_bg.wasm');
const bytes = require('fs').readFileSync(path);
let imports = {};
imports['./wasm_transformer.js'] = require('./wasm_transformer.js');

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
module.exports = wasmInstance.exports;
