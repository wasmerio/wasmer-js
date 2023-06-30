import { wasix_worker } from './snippets/wasmer-wasix-js-d5dd60164e31a9cf/inline0.js';
import * as __wbg_star0 from 'env';

let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error('expected a string argument');

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function _assertBigInt(n) {
    if (typeof(n) !== 'bigint') throw new Error('expected a bigint argument');
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;

            }
        }
    };
    real.original = state;

    return real;
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}
function __wbg_adapter_64(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h2792d391d1328d42(arg0, arg1, addHeapObject(arg2));
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_67(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__he002472b71abbe77(arg0, arg1, addHeapObject(arg2));
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {number} state_ptr
*/
export function worker_entry_point(state_ptr) {
    _assertNum(state_ptr);
    wasm.worker_entry_point(state_ptr);
}

/**
* @param {number} task_ptr
* @param {WebAssembly.Module} wasm_module
* @param {any} wasm_memory
*/
export function wasm_entry_point(task_ptr, wasm_module, wasm_memory) {
    _assertNum(task_ptr);
    wasm.wasm_entry_point(task_ptr, addHeapObject(wasm_module), addHeapObject(wasm_memory));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function __wbg_adapter_289(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures__invoke2_mut__hf8e8064efbca9e81(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
* TTY state. `Object.assign(new JSTtyState(), { ... })`
*/
export class JSTtyState {

    static __wrap(ptr) {
        const obj = Object.create(JSTtyState.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
            cols: this.cols,
            rows: this.rows,
            width: this.width,
            height: this.height,
            stdin_tty: this.stdin_tty,
            stdout_tty: this.stdout_tty,
            stderr_tty: this.stderr_tty,
            echo: this.echo,
            line_buffered: this.line_buffered,
            line_feeds: this.line_feeds,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsttystate_free(ptr);
    }
    /**
    * @returns {number}
    */
    get cols() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_cols(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set cols(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(arg0);
        wasm.__wbg_set_jsttystate_cols(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get rows() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_rows(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set rows(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(arg0);
        wasm.__wbg_set_jsttystate_rows(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get width() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set width(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(arg0);
        wasm.__wbg_set_jsttystate_width(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get height() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(arg0);
        wasm.__wbg_set_jsttystate_height(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get stdin_tty() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_stdin_tty(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set stdin_tty(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertBoolean(arg0);
        wasm.__wbg_set_jsttystate_stdin_tty(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get stdout_tty() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_stdout_tty(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set stdout_tty(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertBoolean(arg0);
        wasm.__wbg_set_jsttystate_stdout_tty(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get stderr_tty() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_stderr_tty(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set stderr_tty(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertBoolean(arg0);
        wasm.__wbg_set_jsttystate_stderr_tty(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get echo() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_echo(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set echo(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertBoolean(arg0);
        wasm.__wbg_set_jsttystate_echo(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get line_buffered() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_line_buffered(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set line_buffered(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertBoolean(arg0);
        wasm.__wbg_set_jsttystate_line_buffered(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get line_feeds() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_jsttystate_line_feeds(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set line_feeds(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertBoolean(arg0);
        wasm.__wbg_set_jsttystate_line_feeds(this.ptr, arg0);
    }
    /**
    * @returns {Symbol}
    */
    static __wbgd_downcast_token() {
        const ret = wasm.jsttystate___wbgd_downcast_token();
        return takeObject(ret);
    }
    /**
    */
    constructor() {
        const ret = wasm.jsttystate_new();
        return JSTtyState.__wrap(ret);
    }
}
/**
*/
export class JSVirtualFile {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        const obj = Object.create(JSVirtualFile.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsvirtualfile_free(ptr);
    }
    /**
    * @returns {bigint}
    */
    lastAccessed() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.jsvirtualfile_lastAccessed(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @returns {bigint}
    */
    lastModified() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.jsvirtualfile_lastModified(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @returns {bigint}
    */
    createdTime() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.jsvirtualfile_createdTime(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @returns {bigint}
    */
    size() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.jsvirtualfile_size(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} new_size
    */
    setLength(new_size) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            _assertBigInt(new_size);
            wasm.jsvirtualfile_setLength(retptr, this.ptr, new_size);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Promise<Uint8Array>}
    */
    read() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.jsvirtualfile_read(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<string>}
    */
    readString() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.jsvirtualfile_readString(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} buf
    * @returns {Promise<number>}
    */
    write(buf) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsvirtualfile_write(this.ptr, ptr0, len0, addHeapObject(buf));
        return takeObject(ret);
    }
    /**
    * @param {string} buf
    * @returns {Promise<number>}
    */
    writeString(buf) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ptr0 = passStringToWasm0(buf, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsvirtualfile_writeString(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<void>}
    */
    flush() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.jsvirtualfile_flush(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {number} position
    * @returns {Promise<number>}
    */
    seek(position) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(position);
        const ret = wasm.jsvirtualfile_seek(this.ptr, position);
        return takeObject(ret);
    }
}
/**
*/
export class MemFS {

    static __wrap(ptr) {
        const obj = Object.create(MemFS.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_memfs_free(ptr);
    }
    /**
    * @returns {Symbol}
    */
    static __wbgd_downcast_token() {
        const ret = wasm.memfs___wbgd_downcast_token();
        return takeObject(ret);
    }
    /**
    */
    constructor() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.memfs_new(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MemFS.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {any} jso
    * @returns {MemFS}
    */
    static from_js(jso) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.memfs_from_js(retptr, addHeapObject(jso));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MemFS.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    * @returns {Array<any>}
    */
    readDir(path) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_readDir(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    */
    createDir(path) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_createDir(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    */
    removeDir(path) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_removeDir(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    */
    removeFile(path) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_removeFile(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    * @param {string} to
    * @returns {Promise<void>}
    */
    rename(path, to) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.memfs_rename(this.ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} path
    * @returns {object}
    */
    metadata(path) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_metadata(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    * @param {any} options
    * @returns {JSVirtualFile}
    */
    open(path, options) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_open(retptr, this.ptr, ptr0, len0, addHeapObject(options));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return JSVirtualFile.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* A struct representing a Trap
*/
export class Trap {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        const obj = Object.create(Trap.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_trap_free(ptr);
    }
    /**
    * @returns {Symbol}
    */
    static __wbgd_downcast_token() {
        const ret = wasm.trap___wbgd_downcast_token();
        return takeObject(ret);
    }
}
/**
*/
export class WASI {

    static __wrap(ptr) {
        const obj = Object.create(WASI.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasi_free(ptr);
    }
    /**
    * @param {WasiConfig} config
    */
    constructor(config) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasi_new(retptr, addHeapObject(config));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return WASI.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {MemFS}
    */
    get fs() {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            wasm.wasi_fs(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MemFS.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {WebAssembly.Module} module
    * @returns {any}
    */
    getImports(module) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            wasm.wasi_getImports(retptr, this.ptr, addHeapObject(module));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {any} module_or_instance
    * @param {object | undefined} imports
    * @returns {WebAssembly.Instance}
    */
    instantiate(module_or_instance, imports) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            wasm.wasi_instantiate(retptr, this.ptr, addHeapObject(module_or_instance), isLikeNone(imports) ? 0 : addHeapObject(imports));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Start the WASI Instance, it returns the status code when calling the start
    * function
    * @param {WebAssembly.Instance | undefined} instance
    * @returns {number}
    */
    start(instance) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            wasm.wasi_start(retptr, this.ptr, isLikeNone(instance) ? 0 : addHeapObject(instance));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class WebThreadPool {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_webthreadpool_free(ptr);
    }
}
/**
*/
export class WebThreadPoolInner {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_webthreadpoolinner_free(ptr);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +getObject(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = getObject(arg0) in getObject(arg1);
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        _assertNum(ret);
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_jsttystate_new = function() { return logError(function (arg0) {
        const ret = JSTtyState.__wrap(arg0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setTimeout_41e2cd498bc3e87b = function() { return logError(function (arg0, arg1) {
        const ret = setTimeout(getObject(arg0), arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_ecebfe4ff7e23f44 = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg1).value;
        var ptr0 = isLikeNone(ret) ? 0 : passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    }, arguments) };
    imports.wbg.__wbg_done_6f2ad402adc7fc58 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).done;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_value_961c0242cfbf77f4 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_URL_39fb9d5ceb77c65e = function() { return logError(function () {
        const ret = import.meta.url;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_wasixworker_656565a817a4d4d4 = function() { return logError(function (arg0) {
        const ret = wasix_worker(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_ttyReset_79951a7ef0cbde51 = function() { return logError(function (arg0) {
        getObject(arg0).ttyReset();
    }, arguments) };
    imports.wbg.__wbg_ttyGet_d7764b3520e062e9 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).ttyGet();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_ttySet_f0952efad26dd99b = function() { return logError(function (arg0, arg1) {
        getObject(arg0).ttySet(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_ttyReset_a16430f660c819e0 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).ttyReset;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_ttyGet_fb13558a711cb1ae = function() { return logError(function (arg0) {
        const ret = getObject(arg0).ttyGet;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_ttySet_973757f92982f4b0 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).ttySet;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_copy_to_typed_array = function(arg0, arg1, arg2) {
        new Uint8Array(getObject(arg2).buffer, getObject(arg2).byteOffset, getObject(arg2).byteLength).set(getArrayU8FromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function() { return logError(function (arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    }, arguments) };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() { return logError(function () {
        const ret = new Error();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    }, arguments) };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_navigator_b18e629f7f0b75fa = function() { return logError(function (arg0) {
        const ret = getObject(arg0).navigator;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_fetch_465e8cb61a0f43ea = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_WorkerGlobalScope_88015ad1ebb92b29 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WorkerGlobalScope;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_fetch_661ffba2a4f2519c = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_data_af909e5dfe73e68c = function() { return logError(function (arg0) {
        const ret = getObject(arg0).data;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_ReadableStreamDefaultReader_ce8342c1c5f9fd84 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof ReadableStreamDefaultReader;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_read_f856f4d9388d19d2 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).read();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setonmessage_79a50b841d4ac8fb = function() { return logError(function (arg0, arg1) {
        getObject(arg0).onmessage = getObject(arg1);
    }, arguments) };
    imports.wbg.__wbg_postMessage_85b17b465d6aacd6 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).postMessage(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_hardwareConcurrency_01cfcd3b93e52538 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).hardwareConcurrency;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Response_fb3a4df648c1859b = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Response;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_redirected_9243efed72049e32 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).redirected;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_status_d483a4ac847f380a = function() { return logError(function (arg0) {
        const ret = getObject(arg0).status;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_headers_6093927dc359903e = function() { return logError(function (arg0) {
        const ret = getObject(arg0).headers;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_arrayBuffer_cb886e06a9e36e4d = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_a5d34c36a1a4ebd1 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_instanceof_WritableStreamDefaultWriter_a3ad63358579c5f3 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WritableStreamDefaultWriter;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_desiredSize_b19ff007d7fd63a8 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg1).desiredSize;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    }, arguments) };
    imports.wbg.__wbg_ready_cd9e6875ea203d04 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).ready;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_close_bd61c52913af0a6d = function() { return logError(function (arg0) {
        const ret = getObject(arg0).close();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_write_d9c71d19dc02cc9b = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg0).write(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_headers_ab5251d2727ac41e = function() { return logError(function (arg0) {
        const ret = getObject(arg0).headers;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithstrandinit_c45f0dc6da26fd03 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_close_9e3b66c40e98af47 = function() { return logError(function (arg0) {
        getObject(arg0).close();
    }, arguments) };
    imports.wbg.__wbg_postMessage_47bfdf2b8441df36 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).postMessage(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbindgen_ge = function(arg0, arg1) {
        const ret = getObject(arg0) >= getObject(arg1);
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'bigint';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = getObject(arg0) === getObject(arg1);
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_shr = function(arg0, arg1) {
        const ret = getObject(arg0) >> getObject(arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u128 = function(arg0, arg1) {
        const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Global_2714957600a3db57 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WebAssembly.Global;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_6895ae86e4f8bde9 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setvalue_81582eead384d768 = function() { return logError(function (arg0, arg1) {
        getObject(arg0).value = getObject(arg1);
    }, arguments) };
    imports.wbg.__wbg_grow_77254a6de2492e1f = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).grow(arg1 >>> 0);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_trap_new = function() { return logError(function (arg0) {
        const ret = Trap.__wrap(arg0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_c48a774b022d20ac = function() { return logError(function (arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_msCrypto_bcb970640f50a1e8 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_37fa2ca9e4e07fab = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_dc1e9a60c158336d = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_require_8f08ceecec0f4fee = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_process_298734cf255a885d = function() { return logError(function (arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_versions_e2e78e134e3e5d01 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_node_1cd7a5d853dbea79 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg_static_accessor_SYMBOL_45d4d15e3c4aeb33 = function() { return logError(function () {
        const ret = Symbol;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_symbol = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'symbol';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg_new_b525de17f44a8943 = function() { return logError(function () {
        const ret = new Array();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithlength_0da6f12fbc1ab6eb = function() { return logError(function (arg0) {
        const ret = new Array(arg0 >>> 0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_get_27fe3dac1c4d0224 = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_17224bc548dd1d7b = function() { return logError(function (arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    }, arguments) };
    imports.wbg.__wbg_isArray_39d28997bf6b96b4 = function() { return logError(function (arg0) {
        const ret = Array.isArray(getObject(arg0));
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_e498fbc24f9c1d4f = function() { return logError(function (arg0) {
        const ret = getObject(arg0).length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_push_49c286f04dd3bf59 = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_ArrayBuffer_a69f02ee4c4f5065 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof ArrayBuffer;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_byteLength_f4d9013afe43ad2f = function() { return logError(function (arg0) {
        const ret = getObject(arg0).byteLength;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_BigInt_a560cc1998a032e3 = function() { return logError(function (arg0) {
        const ret = BigInt(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_toString_1359bab35813c57c = function() { return logError(function (arg0, arg1, arg2) {
        const ret = getObject(arg1).toString(arg2);
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Function_17551b1809ea1825 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Function;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newnoargs_2b8b6bd7753c76ba = function() { return logError(function (arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_apply_aedce30790c00792 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).apply(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_95d1ea488d03e4e8 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_9495de66fdbe016b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_bind_d6a4be1f31ed64ec = function() { return logError(function (arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).bind(getObject(arg1), getObject(arg2), getObject(arg3));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_next_88560ec06a094dea = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_next_b7d530c04fd8b217 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_done_1ebec03bbd919843 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).done;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_6ac8da5cc5b3efda = function() { return logError(function (arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getTime_7c59072d1651a3cf = function() { return logError(function (arg0) {
        const ret = getObject(arg0).getTime();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getTimezoneOffset_2a6b27fb18493a56 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).getTimezoneOffset();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new0_25059e40b1c02766 = function() { return logError(function () {
        const ret = new Date();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Object_f5a826c4da0d4a94 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Object;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_constructor_0c9828c8a7cf1dc6 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).constructor;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_entries_4e1315b774245952 = function() { return logError(function (arg0) {
        const ret = Object.entries(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_f9876326328f45ed = function() { return logError(function () {
        const ret = new Object();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_RangeError_320568d7080b33cc = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof RangeError;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_iterator_55f114446221aa5a = function() { return logError(function () {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_9d3a9ce4282a18a8 = function() { return logError(function (arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_289(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_resolve_fd40f858d9db1a04 = function() { return logError(function (arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_then_ec5db6d509eb475f = function() { return logError(function (arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_then_f753623316e2873a = function() { return logError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_87cbb8506fecf3a9 = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_self_e7c1f827057f6584 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_a09ec664e14b1b81 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_c85a9259e621f3db = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Uint8Array_01cebe79ca606cca = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Uint8Array;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_537b7341ce90bb31 = function() { return logError(function (arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithlength_b56c882b57805732 = function() { return logError(function (arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithbyteoffsetandlength_9fb2f11355ecadf5 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_subarray_7526649b91a252a6 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_length_27a2afe8ab42b09f = function() { return logError(function (arg0) {
        const ret = getObject(arg0).length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_17499e8aa4003ebd = function() { return logError(function (arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Instance_f25d9939a09a738e = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WebAssembly.Instance;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_64f7331ea86b0949 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebAssembly.Instance(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_exports_ff0a0a2b2c092053 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).exports;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Module_925a715095793138 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WebAssembly.Module;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_3086807366ac3008 = function() { return handleError(function (arg0) {
        const ret = new WebAssembly.Module(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_exports_ebe6dd251e00d3b0 = function() { return logError(function (arg0) {
        const ret = WebAssembly.Module.exports(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_imports_801913c621270d0f = function() { return logError(function (arg0) {
        const ret = WebAssembly.Module.imports(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Table_27c4cc013dcdbf38 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WebAssembly.Table;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_83118383573df91c = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).get(arg1 >>> 0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Memory_25684ccf3e250ca1 = function() { return logError(function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WebAssembly.Memory;
        } catch {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_e6f2507f7bdea19b = function() { return handleError(function (arg0) {
        const ret = new WebAssembly.Memory(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_cf65c07de34b9a08 = function() { return logError(function (arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_apply_5435e78b95a524a6 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.apply(getObject(arg0), getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_get_baf4855f9a986186 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getPrototypeOf_d643a5523614ccc5 = function() { return handleError(function (arg0) {
        const ret = Reflect.getPrototypeOf(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_6aa458a4ebdb65cb = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = getObject(arg1);
        const ret = typeof(v) === 'bigint' ? v : undefined;
        if (!isLikeNone(ret)) {
            _assertBigInt(ret);
        }
        getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw takeObject(arg0);
    };
    imports.wbg.__wbindgen_module = function() {
        const ret = init.__wbindgen_wasm_module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_function_table = function() {
        const ret = wasm.__wbindgen_export_2;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper489 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 388, __wbg_adapter_64);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper3912 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 437, __wbg_adapter_67);
        return addHeapObject(ret);
    }, arguments) };
    imports['env'] = __wbg_star0;

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('wasmer_wasix_js_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
