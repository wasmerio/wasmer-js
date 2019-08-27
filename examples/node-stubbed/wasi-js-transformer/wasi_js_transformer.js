let wasm;
const { TextDecoder } = require(String.raw`util`);

let cachegetUint8Memory = null;
function getUint8Memory() {
  if (
    cachegetUint8Memory === null ||
    cachegetUint8Memory.buffer !== wasm.memory.buffer
  ) {
    cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm(arg) {
  const ptr = wasm.__wbindgen_malloc(arg.length * 1);
  getUint8Memory().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

let cachegetInt32Memory = null;
function getInt32Memory() {
  if (
    cachegetInt32Memory === null ||
    cachegetInt32Memory.buffer !== wasm.memory.buffer
  ) {
    cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory;
}

function getArrayU8FromWasm(ptr, len) {
  return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * i64 lowering that can be done by the browser
 * @param {Uint8Array} wasm_binary
 * @returns {Uint8Array}
 */
module.exports.lower_i64_imports = function(wasm_binary) {
  const retptr = 8;
  const ret = wasm.lower_i64_imports(
    retptr,
    passArray8ToWasm(wasm_binary),
    WASM_VECTOR_LEN
  );
  const memi32 = getInt32Memory();
  const v0 = getArrayU8FromWasm(
    memi32[retptr / 4 + 0],
    memi32[retptr / 4 + 1]
  ).slice();
  wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
  return v0;
};

let cachedTextDecoder = new TextDecoder("utf-8");

function getStringFromWasm(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

module.exports.__wbindgen_throw = function(arg0, arg1) {
  throw new Error(getStringFromWasm(arg0, arg1));
};
wasm = require("./wasi_js_transformer_bg");
