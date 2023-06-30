import _init from "./pkg/wasmer_wasix_js";
export { JSVirtualFile, MemFS, WASI, type WasiConfig, type JSTty, JSTtyState } from "./pkg/wasmer_wasix_js";

// todo: use @rollup/wasm to import wasm

let inited: Promise<any> | null = null;
export const init = async (force?: boolean) => {
	if (inited === null || force === true) {
		// node polyfills
		if (typeof globalThis.process?.versions?.node !== 'undefined') {
			if (!globalThis.require && !globalThis.crypto) {
				await import('node:crypto').then(({ webcrypto }) => {
					// @ts-ignore `rand` crate requires this polyfill for node modules
					globalThis.crypto = webcrypto
				});
			}
			if (!globalThis.fetch) {
				await import('node-fetch').then(({ default: fetch }) => {
					// @ts-ignore
					globalThis.fetch = fetch;
				});
			}
			if (!globalThis.Worker) {
				// @ts-ignore
				await import('whatwg-worker').then(({ default: Worker }) => {
					globalThis.Worker = Worker;
				});
			}
		} else {
			inited = _init();
		}
	}
	await inited;
}

export default init;
