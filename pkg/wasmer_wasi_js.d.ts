/* tslint:disable */
/* eslint-disable */
/**
*/
export class WASI {
  free(): void;
/**
* @param {any} config
*/
  constructor(config: any);
/**
* @param {any} module
* @param {object} imports
*/
  instantiate(module: any, imports: object): void;
/**
* Start the WASI Instance, it returns the status code when calling the start
* function
* @returns {number}
*/
  start(): number;
/**
* @returns {Uint8Array}
*/
  getStdoutBuffer(): Uint8Array;
/**
* @returns {string}
*/
  getStdoutString(): string;
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
  readonly __wbg_wasi_free: (a: number) => void;
  readonly wasi_new: (a: number) => number;
  readonly wasi_instantiate: (a: number, b: number, c: number) => void;
  readonly wasi_start: (a: number) => number;
  readonly wasi_getStdoutBuffer: (a: number, b: number) => void;
  readonly wasi_getStdoutString: (a: number, b: number) => void;
  readonly __wbg_wasmerruntimeerror_free: (a: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
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
