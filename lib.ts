import _init from "./pkg/wasmer_wasix_js";
export * from "./pkg/wasmer_wasix_js";
export * from "./common";


let inited: Promise<any> | null = null;
export default async function init(...args: any[]) {
	if (inited === null) {
		// if we are in node and no args are passed, we polyfill and use node:fs to load the wasm
		if (typeof globalThis.process?.versions?.node !== 'undefined' && args.length === 0) {
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
				inited = _init(fs.readFileSync(new URL('wasmer_wasix_js_bg.wasm', import.meta.url)));
			});
		} else {
			inited = _init(...args);
		}
	}
	await inited;
}
