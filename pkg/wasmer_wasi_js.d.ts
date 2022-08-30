/* tslint:disable */
/* eslint-disable */
/**
*/
export class JSVirtualFile {
  free(): void;
/**
* @returns {BigInt}
*/
  lastAccessed(): BigInt;
/**
* @returns {BigInt}
*/
  lastModified(): BigInt;
/**
* @returns {BigInt}
*/
  createdTime(): BigInt;
/**
* @returns {BigInt}
*/
  size(): BigInt;
/**
* @param {BigInt} new_size
*/
  setLength(new_size: BigInt): void;
/**
* @returns {Uint8Array}
*/
  read(): Uint8Array;
/**
* @returns {string}
*/
  readString(): string;
/**
* @param {Uint8Array} buf
* @returns {number}
*/
  write(buf: Uint8Array): number;
/**
* @param {string} buf
* @returns {number}
*/
  writeString(buf: string): number;
/**
*/
  flush(): void;
/**
* @param {number} position
* @returns {number}
*/
  seek(position: number): number;
}
/**
*/
export class MemFS {
  free(): void;
/**
*/
  constructor();
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
*/
  rename(path: string, to: string): void;
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
*/
export class WASI {
  free(): void;
/**
* @param {any} config
*/
  constructor(config: any);
/**
* @param {WebAssembly.Module} module
* @returns {object}
*/
  get_imports(module: WebAssembly.Module): object;
/**
* @param {any} module
* @param {object | undefined} imports
* @returns {WebAssembly.Instance}
*/
  instantiate(module: any, imports?: object): WebAssembly.Instance;
/**
* Start the WASI Instance, it returns the status code when calling the start
* function
* @param {WebAssembly.Instance} instance
* @returns {number}
*/
  start(instance: WebAssembly.Instance): number;
/**
* Get the stdout buffer
* Note: this method flushes the stdout
* @returns {Uint8Array}
*/
  getStdoutBuffer(): Uint8Array;
/**
* Get the stdout data as a string
* Note: this method flushes the stdout
* @returns {string}
*/
  getStdoutString(): string;
/**
* Get the stderr buffer
* Note: this method flushes the stderr
* @returns {Uint8Array}
*/
  getStderrBuffer(): Uint8Array;
/**
* Get the stderr data as a string
* Note: this method flushes the stderr
* @returns {string}
*/
  getStderrString(): string;
/**
* Set the stdin buffer
* @param {Uint8Array} buf
*/
  setStdinBuffer(buf: Uint8Array): void;
/**
* Set the stdin data as a string
* @param {string} input
*/
  setStdinString(input: string): void;
/**
* @returns {MemFS}
*/
  readonly fs: MemFS;
}
/**
* A struct representing an aborted instruction execution, with a message
* indicating the cause.
*/
export class WasmerRuntimeError {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmerruntimeerror_free: (a: number) => void;
  readonly __wbg_wasi_free: (a: number) => void;
  readonly wasi_new: (a: number) => number;
  readonly wasi_fs: (a: number) => number;
  readonly wasi_get_imports: (a: number, b: number) => number;
  readonly wasi_instantiate: (a: number, b: number, c: number) => number;
  readonly wasi_start: (a: number, b: number) => number;
  readonly wasi_getStdoutBuffer: (a: number, b: number) => void;
  readonly wasi_getStdoutString: (a: number, b: number) => void;
  readonly wasi_getStderrBuffer: (a: number, b: number) => void;
  readonly wasi_getStderrString: (a: number, b: number) => void;
  readonly wasi_setStdinBuffer: (a: number, b: number, c: number) => void;
  readonly wasi_setStdinString: (a: number, b: number, c: number) => void;
  readonly __wbg_memfs_free: (a: number) => void;
  readonly memfs_new: () => number;
  readonly memfs_readDir: (a: number, b: number, c: number) => number;
  readonly memfs_createDir: (a: number, b: number, c: number) => void;
  readonly memfs_removeDir: (a: number, b: number, c: number) => void;
  readonly memfs_removeFile: (a: number, b: number, c: number) => void;
  readonly memfs_rename: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly memfs_metadata: (a: number, b: number, c: number) => number;
  readonly memfs_open: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_jsvirtualfile_free: (a: number) => void;
  readonly jsvirtualfile_lastAccessed: (a: number, b: number) => void;
  readonly jsvirtualfile_lastModified: (a: number, b: number) => void;
  readonly jsvirtualfile_createdTime: (a: number, b: number) => void;
  readonly jsvirtualfile_size: (a: number, b: number) => void;
  readonly jsvirtualfile_setLength: (a: number, b: number, c: number) => void;
  readonly jsvirtualfile_read: (a: number, b: number) => void;
  readonly jsvirtualfile_readString: (a: number, b: number) => void;
  readonly jsvirtualfile_write: (a: number, b: number, c: number) => number;
  readonly jsvirtualfile_writeString: (a: number, b: number, c: number) => number;
  readonly jsvirtualfile_flush: (a: number) => void;
  readonly jsvirtualfile_seek: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
