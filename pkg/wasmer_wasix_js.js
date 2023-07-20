let wasm;

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.buffer !== wasm.memory.buffer) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.buffer !== wasm.memory.buffer) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().slice(ptr, ptr + len));
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.buffer !== wasm.memory.buffer) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
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

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
};

function passStringToWasm0(arg, malloc, realloc) {

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

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

const CLOSURE_DTORS = new FinalizationRegistry(state => {
    wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b)
});

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
                wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state)
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_66(arg0, arg1, arg2) {
    const ret = wasm.closure2_externref_shim(arg0, arg1, arg2);
    return ret;
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
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state)
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_69(arg0, arg1, arg2) {
    wasm.closure74_externref_shim(arg0, arg1, arg2);
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_4.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_4.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
function __wbg_adapter_178(arg0, arg1, arg2, arg3) {
    wasm.closure38_externref_shim(arg0, arg1, arg2, arg3);
}

/**
* @param {number} state_ptr
*/
export function worker_entry_point(state_ptr) {
    wasm.worker_entry_point(state_ptr);
}

/**
* @param {number} task_ptr
* @param {WebAssembly.Module} wasm_module
* @param {any} wasm_memory
* @param {any} wasm_cache
*/
export function wasm_entry_point(task_ptr, wasm_module, wasm_memory, wasm_cache) {
    wasm.wasm_entry_point(task_ptr, wasm_module, wasm_memory, wasm_cache);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

const IoSinkFinalization = new FinalizationRegistry(ptr => wasm.__wbg_iosink_free(ptr));
/**
*/
export class IoSink {

    static __wrap(ptr) {
        const obj = Object.create(IoSink.prototype);
        obj.ptr = ptr;
        IoSinkFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        IoSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_iosink_free(ptr);
    }
    /**
    * @param {Uint8Array} chunk
    * @param {WritableStreamDefaultController} controller
    */
    write(chunk, controller) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.iosink_write(retptr, this.ptr, chunk, controller);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {any} _controller
    */
    close(_controller) {
        const ptr = this.__destroy_into_raw();
        wasm.iosink_close(ptr, _controller);
    }
    /**
    */
    abort() {
        const ptr = this.__destroy_into_raw();
        wasm.iosink_abort(ptr);
    }
}

const IoSourceFinalization = new FinalizationRegistry(ptr => wasm.__wbg_iosource_free(ptr));
/**
*/
export class IoSource {

    static __wrap(ptr) {
        const obj = Object.create(IoSource.prototype);
        obj.ptr = ptr;
        IoSourceFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        IoSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_iosource_free(ptr);
    }
    /**
    * @param {ReadableStreamDefaultController} controller
    * @returns {Promise<void>}
    */
    pull(controller) {
        const ret = wasm.iosource_pull(this.ptr, controller);
        return ret;
    }
    /**
    */
    cancel() {
        wasm.iosource_cancel(this.ptr);
    }
}

const MemFSFinalization = new FinalizationRegistry(ptr => wasm.__wbg_memfs_free(ptr));
/**
*/
export class MemFS {

    static __wrap(ptr) {
        const obj = Object.create(MemFS.prototype);
        obj.ptr = ptr;
        MemFSFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        MemFSFinalization.unregister(this);
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
        return ret;
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
                throw takeFromExternrefTable0(r1);
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
            wasm.memfs_from_js(retptr, jso);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
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
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_readDir(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return takeFromExternrefTable0(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    */
    createDir(path) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_createDir(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
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
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_removeDir(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
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
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_removeFile(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
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
        const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.memfs_rename(this.ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
    * @param {string} path
    * @returns {object}
    */
    metadata(path) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_metadata(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return takeFromExternrefTable0(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    * @param {any} options
    * @returns {VirtualFile}
    */
    open(path, options) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.memfs_open(retptr, this.ptr, ptr0, len0, options);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return VirtualFile.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const TrapFinalization = new FinalizationRegistry(ptr => wasm.__wbg_trap_free(ptr));
/**
* A struct representing a Trap
*/
export class Trap {

    static __wrap(ptr) {
        const obj = Object.create(Trap.prototype);
        obj.ptr = ptr;
        TrapFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        TrapFinalization.unregister(this);
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
        return ret;
    }
}

const TtyFinalization = new FinalizationRegistry(ptr => wasm.__wbg_tty_free(ptr));
/**
*/
export class Tty {

    static __wrap(ptr) {
        const obj = Object.create(Tty.prototype);
        obj.ptr = ptr;
        TtyFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        TtyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tty_free(ptr);
    }
    /**
    * @returns {WritableStream}
    */
    get writable() {
        const ret = wasm.tty_writable(this.ptr);
        return ret;
    }
    /**
    * @returns {ReadableStream}
    */
    get readable() {
        const ret = wasm.tty_readable(this.ptr);
        return ret;
    }
}

const TtySinkFinalization = new FinalizationRegistry(ptr => wasm.__wbg_ttysink_free(ptr));
/**
*/
export class TtySink {

    static __wrap(ptr) {
        const obj = Object.create(TtySink.prototype);
        obj.ptr = ptr;
        TtySinkFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        TtySinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ttysink_free(ptr);
    }
    /**
    * @param {TtyState} chunk
    * @param {WritableStreamDefaultController} controller
    */
    write(chunk, controller) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(chunk, TtyState);
            var ptr0 = chunk.__destroy_into_raw();
            wasm.ttysink_write(retptr, this.ptr, ptr0, controller);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {any} _controller
    */
    close(_controller) {
        const ptr = this.__destroy_into_raw();
        wasm.ttysink_close(ptr, _controller);
    }
    /**
    */
    abort() {
        const ptr = this.__destroy_into_raw();
        wasm.ttysink_abort(ptr);
    }
}

const TtySourceFinalization = new FinalizationRegistry(ptr => wasm.__wbg_ttysource_free(ptr));
/**
*/
export class TtySource {

    static __wrap(ptr) {
        const obj = Object.create(TtySource.prototype);
        obj.ptr = ptr;
        TtySourceFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        TtySourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ttysource_free(ptr);
    }
    /**
    * @param {ReadableStreamDefaultController} controller
    * @returns {Promise<void>}
    */
    pull(controller) {
        const ret = wasm.ttysource_pull(this.ptr, controller);
        return ret;
    }
    /**
    */
    cancel() {
        wasm.iosource_cancel(this.ptr);
    }
}

const TtyStateFinalization = new FinalizationRegistry(ptr => wasm.__wbg_ttystate_free(ptr));
/**
* TTY state. `Object.assign(new JsTtyState(), { ... })`
*/
export class TtyState {

    static __wrap(ptr) {
        const obj = Object.create(TtyState.prototype);
        obj.ptr = ptr;
        TtyStateFinalization.register(obj, obj.ptr, obj);
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
        TtyStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ttystate_free(ptr);
    }
    /**
    * @returns {number}
    */
    get cols() {
        const ret = wasm.__wbg_get_ttystate_cols(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set cols(arg0) {
        wasm.__wbg_set_ttystate_cols(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get rows() {
        const ret = wasm.__wbg_get_ttystate_rows(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set rows(arg0) {
        wasm.__wbg_set_ttystate_rows(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get width() {
        const ret = wasm.__wbg_get_ttystate_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set width(arg0) {
        wasm.__wbg_set_ttystate_width(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get height() {
        const ret = wasm.__wbg_get_ttystate_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        wasm.__wbg_set_ttystate_height(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get stdin_tty() {
        const ret = wasm.__wbg_get_ttystate_stdin_tty(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set stdin_tty(arg0) {
        wasm.__wbg_set_ttystate_stdin_tty(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get stdout_tty() {
        const ret = wasm.__wbg_get_ttystate_stdout_tty(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set stdout_tty(arg0) {
        wasm.__wbg_set_ttystate_stdout_tty(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get stderr_tty() {
        const ret = wasm.__wbg_get_ttystate_stderr_tty(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set stderr_tty(arg0) {
        wasm.__wbg_set_ttystate_stderr_tty(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get echo() {
        const ret = wasm.__wbg_get_ttystate_echo(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set echo(arg0) {
        wasm.__wbg_set_ttystate_echo(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get line_buffered() {
        const ret = wasm.__wbg_get_ttystate_line_buffered(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set line_buffered(arg0) {
        wasm.__wbg_set_ttystate_line_buffered(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get line_feeds() {
        const ret = wasm.__wbg_get_ttystate_line_feeds(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set line_feeds(arg0) {
        wasm.__wbg_set_ttystate_line_feeds(this.ptr, arg0);
    }
    /**
    * @returns {Symbol}
    */
    static __wbgd_downcast_token() {
        const ret = wasm.ttystate___wbgd_downcast_token();
        return ret;
    }
    /**
    */
    constructor() {
        const ret = wasm.ttystate_new();
        return TtyState.__wrap(ret);
    }
}

const VirtualFileFinalization = new FinalizationRegistry(ptr => wasm.__wbg_virtualfile_free(ptr));
/**
*/
export class VirtualFile {

    static __wrap(ptr) {
        const obj = Object.create(VirtualFile.prototype);
        obj.ptr = ptr;
        VirtualFileFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        VirtualFileFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_virtualfile_free(ptr);
    }
    /**
    * @returns {bigint}
    */
    get lastAccessed() {
        const ret = wasm.virtualfile_lastAccessed(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @returns {bigint}
    */
    get lastModified() {
        const ret = wasm.virtualfile_lastModified(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @returns {bigint}
    */
    get createdTime() {
        const ret = wasm.virtualfile_createdTime(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @returns {bigint}
    */
    get size() {
        const ret = wasm.virtualfile_size(this.ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} new_size
    */
    setLength(new_size) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.virtualfile_setLength(retptr, this.ptr, new_size);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Promise<ArrayBuffer>}
    */
    arrayBuffer() {
        const ret = wasm.virtualfile_arrayBuffer(this.ptr);
        return ret;
    }
    /**
    * @returns {Promise<string>}
    */
    text() {
        const ret = wasm.virtualfile_text(this.ptr);
        return ret;
    }
    /**
    * @param {Uint8Array} buf
    * @returns {Promise<number>}
    */
    read(buf) {
        var ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.virtualfile_read(this.ptr, ptr0, len0, buf);
        return ret;
    }
    /**
    * @param {Uint8Array} buf
    * @returns {Promise<number>}
    */
    write(buf) {
        const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.virtualfile_write(this.ptr, ptr0, len0);
        return ret;
    }
    /**
    * @param {string} buf
    * @returns {Promise<number>}
    */
    writeString(buf) {
        const ptr0 = passStringToWasm0(buf, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.virtualfile_writeString(this.ptr, ptr0, len0);
        return ret;
    }
    /**
    * @returns {Promise<void>}
    */
    flush() {
        const ret = wasm.virtualfile_flush(this.ptr);
        return ret;
    }
    /**
    * @param {number} position
    * @returns {Promise<bigint>}
    */
    seek(position) {
        const ret = wasm.virtualfile_seek(this.ptr, position);
        return ret;
    }
}

const WASIFinalization = new FinalizationRegistry(ptr => wasm.__wbg_wasi_free(ptr));
/**
*/
export class WASI {

    static __wrap(ptr) {
        const obj = Object.create(WASI.prototype);
        obj.ptr = ptr;
        WASIFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        WASIFinalization.unregister(this);
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
            wasm.wasi_new(retptr, config);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
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
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasi_fs(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return MemFS.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Tty}
    */
    get tty() {
        const ret = wasm.wasi_tty(this.ptr);
        return Tty.__wrap(ret);
    }
    /**
    * @returns {WritableStream}
    */
    get stdin() {
        const ret = wasm.wasi_stdin(this.ptr);
        return ret;
    }
    /**
    * @returns {ReadableStream}
    */
    get stdout() {
        const ret = wasm.wasi_stdout(this.ptr);
        return ret;
    }
    /**
    * @returns {ReadableStream}
    */
    get stderr() {
        const ret = wasm.wasi_stderr(this.ptr);
        return ret;
    }
    /**
    * @param {WebAssembly.Module} module
    * @returns {any}
    */
    getImports(module) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasi_getImports(retptr, this.ptr, module);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return takeFromExternrefTable0(r0);
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
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasi_instantiate(retptr, this.ptr, module_or_instance, isLikeNone(imports) ? 0 : addToExternrefTable0(imports));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return takeFromExternrefTable0(r0);
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
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasi_start(retptr, this.ptr, isLikeNone(instance) ? 0 : addToExternrefTable0(instance));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const WebThreadPoolFinalization = new FinalizationRegistry(ptr => wasm.__wbg_webthreadpool_free(ptr));
/**
*/
export class WebThreadPool {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        WebThreadPoolFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_webthreadpool_free(ptr);
    }
}

const WebThreadPoolInnerFinalization = new FinalizationRegistry(ptr => wasm.__wbg_webthreadpoolinner_free(ptr));
/**
*/
export class WebThreadPoolInner {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        WebThreadPoolInnerFinalization.unregister(this);
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
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbg_new_f9876326328f45ed = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbg_constructor_0c9828c8a7cf1dc6 = function(arg0) {
        const ret = arg0.constructor;
        return ret;
    };
    imports.wbg.__wbg_new_b525de17f44a8943 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_push_49c286f04dd3bf59 = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbg_now_c644db5194be8437 = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_crypto_c48a774b022d20ac = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_process_298734cf255a885d = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_versions_e2e78e134e3e5d01 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbg_node_1cd7a5d853dbea79 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_8f08ceecec0f4fee = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_msCrypto_bcb970640f50a1e8 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_b56c882b57805732 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbg_buffer_cf65c07de34b9a08 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_9fb2f11355ecadf5 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_dc1e9a60c158336d = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_37fa2ca9e4e07fab = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_get_27fe3dac1c4d0224 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_call_95d1ea488d03e4e8 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_apply_aedce30790c00792 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.apply(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_9495de66fdbe016b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_9d3a9ce4282a18a8 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_178(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_then_ec5db6d509eb475f = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_new_537b7341ce90bb31 = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_set_17499e8aa4003ebd = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_length_27a2afe8ab42b09f = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_subarray_7526649b91a252a6 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_instanceof_Module_925a715095793138 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebAssembly.Module;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Table_27c4cc013dcdbf38 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebAssembly.Table;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_get_83118383573df91c = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.get(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Memory_25684ccf3e250ca1 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebAssembly.Memory;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_new_e6f2507f7bdea19b = function() { return handleError(function (arg0) {
        const ret = new WebAssembly.Memory(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbg_self_e7c1f827057f6584 = function() { return handleError(function () {
        const ret = self.self;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_window_a09ec664e14b1b81 = function() { return handleError(function () {
        const ret = window.window;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_globalThis_87cbb8506fecf3a9 = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_global_c85a9259e621f3db = function() { return handleError(function () {
        const ret = global.global;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_2b8b6bd7753c76ba = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_get_baf4855f9a986186 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getPrototypeOf_d643a5523614ccc5 = function() { return handleError(function (arg0) {
        const ret = Reflect.getPrototypeOf(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_6aa458a4ebdb65cb = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw arg0;
    };
    imports.wbg.__wbg_static_accessor_SYMBOL_45d4d15e3c4aeb33 = function() {
        const ret = Symbol;
        return ret;
    };
    imports.wbg.__wbindgen_is_symbol = function(arg0) {
        const ret = typeof(arg0) === 'symbol';
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_resolve_fd40f858d9db1a04 = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_waitAsync_bb098cfecda009b0 = function() {
        const ret = Atomics.waitAsync;
        return ret;
    };
    imports.wbg.__wbg_new_0b315875a88967fc = function(arg0) {
        const ret = new Int32Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_waitAsync_41d03d8117e10c28 = function(arg0, arg1, arg2) {
        const ret = Atomics.waitAsync(arg0, arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_async_5406ad9d7ea4f7c3 = function(arg0) {
        const ret = arg0.async;
        return ret;
    };
    imports.wbg.__wbg_value_1e1e7c35f498aff4 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_data_af909e5dfe73e68c = function(arg0) {
        const ret = arg0.data;
        return ret;
    };
    imports.wbg.__wbg_then_f753623316e2873a = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbindgen_link_046e3eff4cf0d899 = function(arg0) {
        const ret = "data:application/javascript," + encodeURIComponent(`onmessage = function (ev) {
            let [ia, index, value] = ev.data;
            ia = new Int32Array(ia.buffer);
            let result = Atomics.wait(ia, index, value);
            postMessage(result);
        };
        `);
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_new_9046c2caa253cdd4 = function() { return handleError(function (arg0, arg1) {
        const ret = new Worker(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setonmessage_79a50b841d4ac8fb = function(arg0, arg1) {
        arg0.onmessage = arg1;
    };
    imports.wbg.__wbg_of_4ef61df23fe9e795 = function(arg0, arg1, arg2) {
        const ret = Array.of(arg0, arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_trap_new = function(arg0) {
        const ret = Trap.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_byteLength_f4d9013afe43ad2f = function(arg0) {
        const ret = arg0.byteLength;
        return ret;
    };
    imports.wbg.__wbg_value_6895ae86e4f8bde9 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_setvalue_81582eead384d768 = function(arg0, arg1) {
        arg0.value = arg1;
    };
    imports.wbg.__wbg_imports_801913c621270d0f = function(arg0) {
        const ret = WebAssembly.Module.imports(arg0);
        return ret;
    };
    imports.wbg.__wbg_length_e498fbc24f9c1d4f = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbindgen_shr = function(arg0, arg1) {
        const ret = arg0 >> arg1;
        return ret;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbg_BigInt_a560cc1998a032e3 = typeof BigInt == 'function' ? BigInt : notDefined('BigInt');
    imports.wbg.__wbindgen_ge = function(arg0, arg1) {
        const ret = arg0 >= arg1;
        return ret;
    };
    imports.wbg.__wbg_toString_1359bab35813c57c = function(arg0, arg1, arg2) {
        const ret = arg1.toString(arg2);
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_function_table = function() {
        const ret = wasm.__wbindgen_export_3;
        return ret;
    };
    imports.wbg.__wbg_bind_d6a4be1f31ed64ec = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.bind(arg1, arg2, arg3);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_0da6f12fbc1ab6eb = function(arg0) {
        const ret = new Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_apply_5435e78b95a524a6 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.apply(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_bigint_from_u128 = function(arg0, arg1) {
        const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
        return ret;
    };
    imports.wbg.__wbg_exports_ff0a0a2b2c092053 = function(arg0) {
        const ret = arg0.exports;
        return ret;
    };
    imports.wbg.__wbg_exports_ebe6dd251e00d3b0 = function(arg0) {
        const ret = WebAssembly.Module.exports(arg0);
        return ret;
    };
    imports.wbg.__wbg_instanceof_Function_17551b1809ea1825 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Function;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Global_2714957600a3db57 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebAssembly.Global;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_new_3086807366ac3008 = function() { return handleError(function (arg0) {
        const ret = new WebAssembly.Module(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_64f7331ea86b0949 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebAssembly.Instance(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new0_25059e40b1c02766 = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbg_getTime_7c59072d1651a3cf = function(arg0) {
        const ret = arg0.getTime();
        return ret;
    };
    imports.wbg.__wbg_getTimezoneOffset_2a6b27fb18493a56 = function(arg0) {
        const ret = arg0.getTimezoneOffset();
        return ret;
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +arg0;
        return ret;
    };
    imports.wbg.__wbindgen_module = function() {
        const ret = init.__wbindgen_wasm_module;
        return ret;
    };
    imports.wbg.__wbg_newwithu8arraysequenceandoptions_cc4bd8625f739461 = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createObjectURL_adf40f2719ba3b9b = function() { return handleError(function (arg0, arg1) {
        const ret = URL.createObjectURL(arg1);
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    }, arguments) };
    imports.wbg.__wbg_revokeObjectURL_89c29d68dbf7162d = function() { return handleError(function (arg0, arg1) {
        URL.revokeObjectURL(getStringFromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_postMessage_47bfdf2b8441df36 = function() { return handleError(function (arg0, arg1) {
        arg0.postMessage(arg1);
    }, arguments) };
    imports.wbg.__wbg_name_70b9c700f6f310f2 = function(arg0, arg1) {
        const ret = arg1.name;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_close_9e3b66c40e98af47 = function(arg0) {
        arg0.close();
    };
    imports.wbg.__wbg_grow_77254a6de2492e1f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.grow(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_RangeError_320568d7080b33cc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof RangeError;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_grow_4a7548d61a74effa = function(arg0, arg1) {
        const ret = arg0.grow(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_setTimeout_41e2cd498bc3e87b = typeof setTimeout == 'function' ? setTimeout : notDefined('setTimeout');
    imports.wbg.__wbg_headers_ab5251d2727ac41e = function(arg0) {
        const ret = arg0.headers;
        return ret;
    };
    imports.wbg.__wbg_status_d483a4ac847f380a = function(arg0) {
        const ret = arg0.status;
        return ret;
    };
    imports.wbg.__wbg_redirected_9243efed72049e32 = function(arg0) {
        const ret = arg0.redirected;
        return ret;
    };
    imports.wbg.__wbg_headers_6093927dc359903e = function(arg0) {
        const ret = arg0.headers;
        return ret;
    };
    imports.wbg.__wbg_arrayBuffer_cb886e06a9e36e4d = function() { return handleError(function (arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_ArrayBuffer_a69f02ee4c4f5065 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_iterator_55f114446221aa5a = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_next_b7d530c04fd8b217 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_88560ec06a094dea = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_done_1ebec03bbd919843 = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_value_6ac8da5cc5b3efda = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WorkerGlobalScope_88015ad1ebb92b29 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WorkerGlobalScope;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_fetch_465e8cb61a0f43ea = function(arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    };
    imports.wbg.__wbg_fetch_661ffba2a4f2519c = function(arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    };
    imports.wbg.__wbg_instanceof_Object_f5a826c4da0d4a94 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_39d28997bf6b96b4 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_buffer_5f1fc856188c4b44 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_ttystate_new = function(arg0) {
        const ret = TtyState.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_set_17224bc548dd1d7b = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbindgen_copy_to_typed_array = function(arg0, arg1, arg2) {
        new Uint8Array(arg2.buffer, arg2.byteOffset, arg2.byteLength).set(getArrayU8FromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_close_2e2b5a3775b28792 = function(arg0) {
        const ret = arg0.close();
        return ret;
    };
    imports.wbg.__wbg_catch_44bf25c15946bac0 = function(arg0, arg1) {
        const ret = arg0.catch(arg1);
        return ret;
    };
    imports.wbg.__wbg_entries_4e1315b774245952 = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_ttysink_new = function(arg0) {
        const ret = TtySink.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_ttysource_new = function(arg0) {
        const ret = TtySource.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_iosink_new = function(arg0) {
        const ret = IoSink.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_navigator_b18e629f7f0b75fa = function(arg0) {
        const ret = arg0.navigator;
        return ret;
    };
    imports.wbg.__wbg_hardwareConcurrency_01cfcd3b93e52538 = function(arg0) {
        const ret = arg0.hardwareConcurrency;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Instance_f25d9939a09a738e = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebAssembly.Instance;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_error_61dcc2e168359765 = function(arg0, arg1) {
        arg0.error(arg1);
    };
    imports.wbg.__wbg_iosource_new = function(arg0) {
        const ret = IoSource.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_static_accessor_IMPORT_META_URL_bdf48e2cb671fe2b = function(arg0) {
        const ret = import.meta.url;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_newwithstrandinit_c45f0dc6da26fd03 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithunderlyingsource_df127c694028e01c = function() { return handleError(function (arg0) {
        const ret = new ReadableStream(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_a5d34c36a1a4ebd1 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_close_8242d0aa882f2ba0 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_enqueue_ff16e0ae028662b0 = function() { return handleError(function (arg0, arg1) {
        arg0.enqueue(arg1);
    }, arguments) };
    imports.wbg.__wbg_newwithunderlyingsink_12a8644e66329582 = function() { return handleError(function (arg0) {
        const ret = new WritableStream(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Response_fb3a4df648c1859b = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_newwithoptions_cfb8746343d11713 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Worker(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_postMessage_85b17b465d6aacd6 = function() { return handleError(function (arg0, arg1) {
        arg0.postMessage(arg1);
    }, arguments) };
    imports.wbg.__wbindgen_closure_wrapper167 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 3, __wbg_adapter_66);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper2367 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 3, __wbg_adapter_69);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper2377 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 3, __wbg_adapter_69);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_4;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function initMemory(imports, maybe_memory) {
    imports.wbg.memory = maybe_memory || new WebAssembly.Memory({initial:24,maximum:16384,shared:true});
}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module, maybe_memory) {
    const imports = getImports();

    initMemory(imports, maybe_memory);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input, maybe_memory) {
    if (typeof input === 'undefined') {
        input = new URL('wasmer_wasix_js_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports, maybe_memory);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
