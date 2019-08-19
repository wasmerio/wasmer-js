let wasm;

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let stack_pointer = 32;

function addBorrowedObject(obj) {
  if (stack_pointer == 1) throw new Error("out of js stack");
  heap[--stack_pointer] = obj;
  return stack_pointer;
}

function getObject(idx) {
  return heap[idx];
}

let heap_next = heap.length;

function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
/**
 * @param {any} passed_wasm_binary
 * @returns {any}
 */
export function lower_i64_imports(passed_wasm_binary) {
  try {
    const ret = wasm.lower_i64_imports(addBorrowedObject(passed_wasm_binary));
    return takeObject(ret);
  } finally {
    heap[stack_pointer++] = undefined;
  }
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

let cachedTextDecoder = new TextDecoder("utf-8");

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

function getStringFromWasm(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

function init(module) {
  if (typeof module === "undefined") {
    module = import.meta.url.replace(/\.js$/, "_bg.wasm");
  }
  let result;
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbg_buffer_aa8ebea80955a01a = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_newwithbyteoffsetandlength_3e607c21646a8aef = function(
    arg0,
    arg1,
    arg2
  ) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_length_e9352df84d100be9 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
  };
  imports.wbg.__wbg_new_53cc250b997ac2e3 = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_set_94d3324b75849a73 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm(arg0, arg1));
  };
  imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
  };

  if (
    module instanceof URL ||
    typeof module === "string" ||
    module instanceof Request
  ) {
    const response = fetch(module);
    if (typeof WebAssembly.instantiateStreaming === "function") {
      result = WebAssembly.instantiateStreaming(response, imports).catch(e => {
        console.warn(
          "`WebAssembly.instantiateStreaming` failed. Assuming this is because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
          e
        );
        return response
          .then(r => r.arrayBuffer())
          .then(bytes => WebAssembly.instantiate(bytes, imports));
      });
    } else {
      result = response
        .then(r => r.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes, imports));
    }
  } else {
    result = WebAssembly.instantiate(module, imports).then(result => {
      if (result instanceof WebAssembly.Instance) {
        return { instance: result, module };
      } else {
        return result;
      }
    });
  }
  return result.then(({ instance, module }) => {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
  });
}

export default init;
