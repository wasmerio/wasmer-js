export * from "../pkg/wasmer_js";
// @ts-ignore
import load, {
  InitInput,
  InitOutput,
  // @ts-ignore
  ThreadPoolWorker,
  setWorkerUrl,
} from "../pkg/wasmer_js";

export type WasmerInitInput = {
  module?: InitInput | Promise<InitInput>;
  memory?: WebAssembly.Memory;
  registryUrl?: string;
  token?: string;
};

/**
 * Initialize the underlying WebAssembly module.
 */
export const init = async (initValue: WasmerInitInput | undefined): Promise<InitOutput> => {

  if (!initValue) {
	initValue = {};
  }

  if (!initValue.module) {
    // This will be replaced by the rollup bundler at the SDK build time
    // to point to a valid http location of the SDK using unpkg.com.
    // Note: we only do this in browsers, not in Node/Bun/Deno
    let wasmUrl = (globalThis as any)["wasmUrl"];
    if (wasmUrl && typeof window !== 'undefined') {
      initValue.module = new URL(wasmUrl);
    }
  }

  (globalThis as any)["__WASMER_REGISTRY__"] = {
    registryUrl: initValue.registryUrl,
    token: initValue.token,
  };

  return load(initValue.module, initValue.memory);
};

/**
 * Set a deafult working Worker Url. Which in this case will be
 * an unpkg url that is set up at the SDK build time.
 */
export const setDefaultWorkerUrl = () => {
  let workerUrl = (globalThis as any)["workerUrl"];
  if (workerUrl) {
    setWorkerUrl(workerUrl);
  }
};

// HACK: We save these to the global scope because it's the most reliable way to
// make sure worker.js gets access to them. Normal exports are removed when
// using a bundler.
(globalThis as any)["__WASMER_INTERNALS__"] = { ThreadPoolWorker, init };
(globalThis as any)["__WASMER_INIT__"] = true;

// HACK: some bundlers such as webpack uses this on dev mode.
// We add this functions to allow dev mode work in those bundlers.
(globalThis as any).$RefreshReg$ =
  (globalThis as any).$RefreshReg$ ||
  function () {
    /**/
  };
(globalThis as any).$RefreshSig$ =
  (globalThis as any).$RefreshSig$ ||
  function () {
    return function () {};
  };
