/* tslint:disable */
/* eslint-disable */

/** Options used when configuring a new WASI instance.  */
export interface WasiConfig {
    /** The command-line arguments passed to the WASI executable. */
    readonly args?: string[];
    /** Additional environment variables made available to the WASI executable. */
    readonly env?: Record<string, string>;
    /** Preopened directories. */
    readonly preopens?: Record<string, string>;
    /** The in-memory filesystem that should be used. */
    readonly fs?: MemFS;
    /** The TTY handler that should be used */
    readonly tty?: JSTty;
    /** The readable used as stdin */
    readonly stdin?: ReadableStreamDefaultReader<Uint8Array>;
    /** The writable used as stdout */
    readonly stdout?: WritableStreamDefaultWriter<Uint8Array>;
    /** The writable used as stderr */
    readonly stderr?: WritableStreamDefaultWriter<Uint8Array>;
    /** Maximum concurrency to use (minimum of 1) */
    readonly concurrency?: number;
}



/** WASIX JavaScript TTY handler. */
export interface JSTty {
    /** Reset TTY state. */
    ttyReset(): void;
    /** Get TTY state. */
    ttyGet(): JSTtyState;
    /** Set TTY state. */
    ttySet(state: JSTtyState): void;
}


/**
* TTY state. `Object.assign(new JSTtyState(), { ... })`
*/
export class JSTtyState {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @returns {Symbol}
*/
  static __wbgd_downcast_token(): Symbol;
/**
*/
  constructor();
/**
*/
  cols: number;
/**
*/
  echo: boolean;
/**
*/
  height: number;
/**
*/
  line_buffered: boolean;
/**
*/
  line_feeds: boolean;
/**
*/
  rows: number;
/**
*/
  stderr_tty: boolean;
/**
*/
  stdin_tty: boolean;
/**
*/
  stdout_tty: boolean;
/**
*/
  width: number;
}
/**
*/
export class JSVirtualFile {
  free(): void;
/**
* @returns {bigint}
*/
  lastAccessed(): bigint;
/**
* @returns {bigint}
*/
  lastModified(): bigint;
/**
* @returns {bigint}
*/
  createdTime(): bigint;
/**
* @returns {bigint}
*/
  size(): bigint;
/**
* @param {bigint} new_size
*/
  setLength(new_size: bigint): void;
/**
* @returns {Promise<Uint8Array>}
*/
  read(): Promise<Uint8Array>;
/**
* @returns {Promise<string>}
*/
  readString(): Promise<string>;
/**
* @param {Uint8Array} buf
* @returns {Promise<number>}
*/
  write(buf: Uint8Array): Promise<number>;
/**
* @param {string} buf
* @returns {Promise<number>}
*/
  writeString(buf: string): Promise<number>;
/**
* @returns {Promise<void>}
*/
  flush(): Promise<void>;
/**
* @param {number} position
* @returns {Promise<number>}
*/
  seek(position: number): Promise<number>;
}
/**
*/
export class MemFS {
  free(): void;
/**
* @returns {Symbol}
*/
  static __wbgd_downcast_token(): Symbol;
/**
*/
  constructor();
/**
* @param {any} jso
* @returns {MemFS}
*/
  static from_js(jso: any): MemFS;
/**
* @param {string} path
* @returns {Array<any>}
*/
  readDir(path: string): Array<any>;
/**
* @param {string} path
*/
  createDir(path: string): void;
/**
* @param {string} path
*/
  removeDir(path: string): void;
/**
* @param {string} path
*/
  removeFile(path: string): void;
/**
* @param {string} path
* @param {string} to
* @returns {Promise<void>}
*/
  rename(path: string, to: string): Promise<void>;
/**
* @param {string} path
* @returns {object}
*/
  metadata(path: string): object;
/**
* @param {string} path
* @param {any} options
* @returns {JSVirtualFile}
*/
  open(path: string, options: any): JSVirtualFile;
}
/**
* A struct representing a Trap
*/
export class Trap {
  free(): void;
/**
* @returns {Symbol}
*/
  static __wbgd_downcast_token(): Symbol;
}
/**
*/
export class WASI {
  free(): void;
/**
* @param {WasiConfig} config
*/
  constructor(config: WasiConfig);
/**
* @param {WebAssembly.Module} module
* @returns {any}
*/
  getImports(module: WebAssembly.Module): any;
/**
* @param {any} module_or_instance
* @param {object | undefined} imports
* @returns {WebAssembly.Instance}
*/
  instantiate(module_or_instance: any, imports?: object): WebAssembly.Instance;
/**
* Start the WASI Instance, it returns the status code when calling the start
* function
* @param {WebAssembly.Instance | undefined} instance
* @returns {number}
*/
  start(instance?: WebAssembly.Instance): number;
/**
*/
  readonly fs: MemFS;
}
/**
*/
export class WebThreadPool {
  free(): void;
}
/**
*/
export class WebThreadPoolInner {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasi_free: (a: number) => void;
  readonly wasi_new: (a: number, b: number) => void;
  readonly wasi_fs: (a: number, b: number) => void;
  readonly wasi_getImports: (a: number, b: number, c: number) => void;
  readonly wasi_instantiate: (a: number, b: number, c: number, d: number) => void;
  readonly wasi_start: (a: number, b: number, c: number) => void;
  readonly __wbg_webthreadpoolinner_free: (a: number) => void;
  readonly __wbg_webthreadpool_free: (a: number) => void;
  readonly worker_entry_point: (a: number) => void;
  readonly wasm_entry_point: (a: number, b: number, c: number) => void;
  readonly __wbg_jsttystate_free: (a: number) => void;
  readonly __wbg_get_jsttystate_cols: (a: number) => number;
  readonly __wbg_set_jsttystate_cols: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_rows: (a: number) => number;
  readonly __wbg_set_jsttystate_rows: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_width: (a: number) => number;
  readonly __wbg_set_jsttystate_width: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_height: (a: number) => number;
  readonly __wbg_set_jsttystate_height: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_stdin_tty: (a: number) => number;
  readonly __wbg_set_jsttystate_stdin_tty: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_stdout_tty: (a: number) => number;
  readonly __wbg_set_jsttystate_stdout_tty: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_stderr_tty: (a: number) => number;
  readonly __wbg_set_jsttystate_stderr_tty: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_echo: (a: number) => number;
  readonly __wbg_set_jsttystate_echo: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_line_buffered: (a: number) => number;
  readonly __wbg_set_jsttystate_line_buffered: (a: number, b: number) => void;
  readonly __wbg_get_jsttystate_line_feeds: (a: number) => number;
  readonly __wbg_set_jsttystate_line_feeds: (a: number, b: number) => void;
  readonly jsttystate___wbgd_downcast_token: () => number;
  readonly jsttystate_new: () => number;
  readonly __wbg_memfs_free: (a: number) => void;
  readonly memfs___wbgd_downcast_token: () => number;
  readonly memfs_new: (a: number) => void;
  readonly memfs_from_js: (a: number, b: number) => void;
  readonly memfs_readDir: (a: number, b: number, c: number, d: number) => void;
  readonly memfs_createDir: (a: number, b: number, c: number, d: number) => void;
  readonly memfs_removeDir: (a: number, b: number, c: number, d: number) => void;
  readonly memfs_removeFile: (a: number, b: number, c: number, d: number) => void;
  readonly memfs_rename: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly memfs_metadata: (a: number, b: number, c: number, d: number) => void;
  readonly memfs_open: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_jsvirtualfile_free: (a: number) => void;
  readonly jsvirtualfile_lastAccessed: (a: number) => number;
  readonly jsvirtualfile_lastModified: (a: number) => number;
  readonly jsvirtualfile_createdTime: (a: number) => number;
  readonly jsvirtualfile_size: (a: number) => number;
  readonly jsvirtualfile_setLength: (a: number, b: number, c: number) => void;
  readonly jsvirtualfile_read: (a: number) => number;
  readonly jsvirtualfile_readString: (a: number) => number;
  readonly jsvirtualfile_write: (a: number, b: number, c: number, d: number) => number;
  readonly jsvirtualfile_writeString: (a: number, b: number, c: number) => number;
  readonly jsvirtualfile_flush: (a: number) => number;
  readonly jsvirtualfile_seek: (a: number, b: number) => number;
  readonly canonical_abi_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly canonical_abi_free: (a: number, b: number, c: number) => void;
  readonly __wbg_trap_free: (a: number) => void;
  readonly trap___wbgd_downcast_token: () => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h2792d391d1328d42: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__he002472b71abbe77: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__hf8e8064efbca9e81: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
