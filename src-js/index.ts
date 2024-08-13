export * from "../pkg/wasmer_js";
// @ts-ignore
import load, {
  InitInput,
  InitOutput,
  // @ts-ignore
  ThreadPoolWorker,
  initializeLogger,
  setWorkerUrl,
} from "../pkg/wasmer_js";

export type WasmerRegistryConfig = {
  registryUrl?: string;
  token?: string;
};

export type WasmerInitInput = {
  module?: InitInput | Promise<InitInput>;
  memory?: WebAssembly.Memory;
  workerUrl?: string | URL;
  log?: string;
} & WasmerRegistryConfig;

/**
 * Initialize the underlying WebAssembly module.
 */
export const init = async (
  initValue?: WasmerInitInput,
  memory?: WebAssembly.Memory,
): Promise<InitOutput> => {
  if (!initValue) {
    initValue = {};
  } else if (
    initValue instanceof WebAssembly.Module ||
    initValue instanceof URL ||
    initValue instanceof WebAssembly.Module
  ) {
    if (memory) {
      console.info(
        "Passing the module and memory as first arguments to the init function is deprecated, please use: `init({module: WASM_MODULE, memory: WASM_MEMORY})`",
      );
      initValue = {
        module: initValue,
        memory: memory,
      };
    } else {
      console.info(
        "Passing the module as first argument to the init function is deprecated, please use: `init({module: WASM_MODULE})`",
      );
      initValue = {
        module: initValue,
      };
    }
  }

  setRegistry(initValue);

  let output = await load(initValue.module, initValue.memory);
  if (initValue.log) {
    initializeLogger(initValue.log);
  }
  if (initValue.workerUrl) {
    setWorkerUrl(initValue.workerUrl.toString());
  }
  return output;
};

export const setRegistry = (initValue: WasmerRegistryConfig) => {
  (globalThis as any)["__WASMER_REGISTRY__"] = {
    registryUrl: initValue.registryUrl,
    token: initValue.token,
  };
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
