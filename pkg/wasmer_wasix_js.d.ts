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
    /** Maximum concurrency to use (minimum of 1) */
    readonly concurrency?: number;
    /** The initial tty state */
    readonly tty?: TtyState;
}


/**
*/
export class IoSink {
  free(): void;
/**
* @param {Uint8Array} chunk
* @param {WritableStreamDefaultController} controller
*/
  write(chunk: Uint8Array, controller: WritableStreamDefaultController): void;
/**
* @param {any} _controller
*/
  close(_controller: any): void;
/**
*/
  abort(): void;
}
/**
*/
export class IoSource {
  free(): void;
/**
* @param {ReadableStreamDefaultController} controller
* @returns {Promise<void>}
*/
  pull(controller: ReadableStreamDefaultController): Promise<void>;
/**
*/
  cancel(): void;
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
* @returns {VirtualFile}
*/
  open(path: string, options: any): VirtualFile;
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
export class Tty {
  free(): void;
/**
*/
  readonly readable: ReadableStream;
/**
*/
  readonly writable: WritableStream;
}
/**
*/
export class TtySink {
  free(): void;
/**
* @param {TtyState} chunk
* @param {WritableStreamDefaultController} controller
*/
  write(chunk: TtyState, controller: WritableStreamDefaultController): void;
/**
* @param {any} _controller
*/
  close(_controller: any): void;
/**
*/
  abort(): void;
}
/**
*/
export class TtySource {
  free(): void;
/**
* @param {ReadableStreamDefaultController} controller
* @returns {Promise<void>}
*/
  pull(controller: ReadableStreamDefaultController): Promise<void>;
/**
*/
  cancel(): void;
}
/**
* TTY state. `Object.assign(new JsTtyState(), { ... })`
*/
export class TtyState {
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
export class VirtualFile {
  free(): void;
/**
* @param {bigint} new_size
*/
  setLength(new_size: bigint): void;
/**
* @returns {Promise<ArrayBuffer>}
*/
  arrayBuffer(): Promise<ArrayBuffer>;
/**
* @returns {Promise<string>}
*/
  text(): Promise<string>;
/**
* @param {Uint8Array} buf
* @returns {Promise<number>}
*/
  read(buf: Uint8Array): Promise<number>;
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
* @returns {Promise<bigint>}
*/
  seek(position: number): Promise<bigint>;
/**
*/
  readonly createdTime: bigint;
/**
*/
  readonly lastAccessed: bigint;
/**
*/
  readonly lastModified: bigint;
/**
*/
  readonly size: bigint;
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
/**
*/
  readonly stderr: ReadableStream;
/**
*/
  readonly stdin: WritableStream;
/**
*/
  readonly stdout: ReadableStream;
/**
*/
  readonly tty: Tty;
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
  readonly __wbg_virtualfile_free: (a: number) => void;
  readonly virtualfile_lastAccessed: (a: number) => number;
  readonly virtualfile_lastModified: (a: number) => number;
  readonly virtualfile_createdTime: (a: number) => number;
  readonly virtualfile_size: (a: number) => number;
  readonly virtualfile_setLength: (a: number, b: number, c: number) => void;
  readonly virtualfile_arrayBuffer: (a: number) => number;
  readonly virtualfile_text: (a: number) => number;
  readonly virtualfile_read: (a: number, b: number, c: number, d: number) => number;
  readonly virtualfile_write: (a: number, b: number, c: number) => number;
  readonly virtualfile_writeString: (a: number, b: number, c: number) => number;
  readonly virtualfile_flush: (a: number) => number;
  readonly virtualfile_seek: (a: number, b: number) => number;
  readonly canonical_abi_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly canonical_abi_free: (a: number, b: number, c: number) => void;
  readonly __wbg_trap_free: (a: number) => void;
  readonly trap___wbgd_downcast_token: () => number;
  readonly __wbg_webthreadpoolinner_free: (a: number) => void;
  readonly __wbg_webthreadpool_free: (a: number) => void;
  readonly worker_entry_point: (a: number) => void;
  readonly wasm_entry_point: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_wasi_free: (a: number) => void;
  readonly wasi_new: (a: number, b: number) => void;
  readonly wasi_fs: (a: number, b: number) => void;
  readonly wasi_tty: (a: number) => number;
  readonly wasi_stdin: (a: number) => number;
  readonly wasi_stdout: (a: number) => number;
  readonly wasi_stderr: (a: number) => number;
  readonly wasi_getImports: (a: number, b: number, c: number) => void;
  readonly wasi_instantiate: (a: number, b: number, c: number, d: number) => void;
  readonly wasi_start: (a: number, b: number, c: number) => void;
  readonly __wbg_ttystate_free: (a: number) => void;
  readonly __wbg_get_ttystate_cols: (a: number) => number;
  readonly __wbg_set_ttystate_cols: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_rows: (a: number) => number;
  readonly __wbg_set_ttystate_rows: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_width: (a: number) => number;
  readonly __wbg_set_ttystate_width: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_height: (a: number) => number;
  readonly __wbg_set_ttystate_height: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_stdin_tty: (a: number) => number;
  readonly __wbg_set_ttystate_stdin_tty: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_stdout_tty: (a: number) => number;
  readonly __wbg_set_ttystate_stdout_tty: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_stderr_tty: (a: number) => number;
  readonly __wbg_set_ttystate_stderr_tty: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_echo: (a: number) => number;
  readonly __wbg_set_ttystate_echo: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_line_buffered: (a: number) => number;
  readonly __wbg_set_ttystate_line_buffered: (a: number, b: number) => void;
  readonly __wbg_get_ttystate_line_feeds: (a: number) => number;
  readonly __wbg_set_ttystate_line_feeds: (a: number, b: number) => void;
  readonly ttystate___wbgd_downcast_token: () => number;
  readonly ttystate_new: () => number;
  readonly __wbg_ttysink_free: (a: number) => void;
  readonly ttysink_write: (a: number, b: number, c: number, d: number) => void;
  readonly ttysink_close: (a: number, b: number) => void;
  readonly ttysink_abort: (a: number) => void;
  readonly __wbg_ttysource_free: (a: number) => void;
  readonly ttysource_pull: (a: number, b: number) => number;
  readonly __wbg_tty_free: (a: number) => void;
  readonly tty_writable: (a: number) => number;
  readonly tty_readable: (a: number) => number;
  readonly __wbg_iosink_free: (a: number) => void;
  readonly iosink_write: (a: number, b: number, c: number, d: number) => void;
  readonly iosink_close: (a: number, b: number) => void;
  readonly iosink_abort: (a: number) => void;
  readonly __wbg_iosource_free: (a: number) => void;
  readonly iosource_pull: (a: number, b: number) => number;
  readonly iosource_cancel: (a: number) => void;
  readonly ttysource_cancel: (a: number) => void;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly closure2_externref_shim: (a: number, b: number, c: number) => number;
  readonly closure74_externref_shim: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly closure38_externref_shim: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_thread_destroy: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
