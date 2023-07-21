import _init, { InitInput } from "./pkg/wasmer_wasix_js";
export * from "./pkg/wasmer_wasix_js";
export * from "./common";

let inited: Promise<any> | null = null;
export default async function init(module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory, force?: boolean) {
	if (typeof crossOriginIsolated === "boolean" && !crossOriginIsolated) {
		// better error message for web when not in a cross-origin-isolated context
		console.error('@wasmer/wasix uses features that may only be available in a cross-origin-isolated context, read more here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy#certain_features_depend_on_cross-origin_isolation');
	}
	if (inited === null || force === true) {
		// if we are in node and no module or path is passed, we polyfill and use node:fs to load the wasm
		if (typeof globalThis.process?.versions?.node !== 'undefined' && !module_or_path) {
			// node polyfills
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
			await import('node:fs').then((fs) => {
				inited = _init(fs.readFileSync(new URL('wasmer_wasix_js_bg.wasm', import.meta.url)), maybe_memory);
			});
		} else {
			inited = _init(module_or_path, maybe_memory);
		}
	}
	await inited;
}
