export * from "./pkg/wasmer_js";
// @ts-ignore
import load, { ThreadPoolWorker } from "./pkg/wasmer_js";
// import wasm_bytes from "./pkg/wasmer_js_bg.wasm";

// interface MimeBuffer extends Buffer {
//     type: string;
//     typeFull: string;
//     charset: string;
// }

// /**
//  * Returns a `Buffer` instance from the given data URI `uri`.
//  *
//  * @param {String} uri Data URI to turn into a Buffer instance
//  * @returns {Buffer} Buffer instance from Data URI
//  * @api public
//  */
// function dataUriToBuffer(uri: string): MimeBuffer {
//     if (!/^data:/i.test(uri)) {
//         throw new TypeError(
//             '`uri` does not appear to be a Data URI (must begin with "data:")',
//         );
//     }

//     // strip newlines
//     uri = uri.replace(/\r?\n/g, "");

//     // split the URI up into the "metadata" and the "data" portions
//     const firstComma = uri.indexOf(",");
//     if (firstComma === -1 || firstComma <= 4) {
//         throw new TypeError("malformed data: URI");
//     }

//     // remove the "data:" scheme and parse the metadata
//     const meta = uri.substring(5, firstComma).split(";");

//     let charset = "";
//     let base64 = false;
//     const type = meta[0] || "text/plain";
//     let typeFull = type;
//     for (let i = 1; i < meta.length; i++) {
//         if (meta[i] === "base64") {
//             base64 = true;
//         } else {
//             typeFull += `;${meta[i]}`;
//             if (meta[i].indexOf("charset=") === 0) {
//                 charset = meta[i].substring(8);
//             }
//         }
//     }
//     // defaults to US-ASCII only if type is not provided
//     if (!meta[0] && !charset.length) {
//         typeFull += ";charset=US-ASCII";
//         charset = "US-ASCII";
//     }

//     // get the encoded data portion and decode URI-encoded chars
//     const encoding = base64 ? "base64" : "ascii";
//     const data = unescape(uri.substring(firstComma + 1));
//     const buffer = Buffer.from(data, encoding) as MimeBuffer;

//     // set `.type` and `.typeFull` properties to MIME type
//     buffer.type = type;
//     buffer.typeFull = typeFull;

//     // set the `.charset` property
//     buffer.charset = charset;

//     return buffer;
// }

export type InitInput =
    | RequestInfo
    | URL
    | Response
    | BufferSource
    | WebAssembly.Module;

let inited: Promise<any> | null = null;

/**
 * Initialize the underlying WebAssembly module.
 */
export const init = load;

// HACK: We save these to the global scope because it's the most reliable way to
// make sure worker.js gets access to them. Normal exports are removed when
// using a bundler.
(globalThis as any)["__WASMER_INTERNALS__"] = { ThreadPoolWorker, init };

// HACK: some bundlers such as webpack uses this on dev mode.
// We add this functions to allow dev mode work in those bundlers.
(globalThis as any).$RefreshReg$ = (globalThis as any).$RefreshReg$ || function () {/**/ };
(globalThis as any).$RefreshSig$ = (globalThis as any).$RefreshSig$ || function () { return function () { } };
