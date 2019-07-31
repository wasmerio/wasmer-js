// A very simple workaround for Big int. Works in conjunction with our custom
// Dataview workaround at ./dataview.ts

// Add Big int depending on the environment
let exportedBigInt = Number;
let globalThis: any = {
  BigInt: {}
};
/*ROLLUP_REPLACE_NODE
globalThis = global;
ROLLUP_REPLACE_NODE*/
/*ROLLUP_REPLACE_BROWSER
globalThis = self;
ROLLUP_REPLACE_BROWSER*/
if (globalThis.BigInt) {
  exportedBigInt = globalThis.BigInt;
}

export const BigIntPolyfill: any = exportedBigInt;
export type BigIntPolyfillType = any;
