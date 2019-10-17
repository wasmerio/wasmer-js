// A very simple workaround for Big int. Works in conjunction with our custom
// Dataview workaround at ./dataview.ts

// Add Big int depending on the environment
// @ts-ignore
let exportedBigInt: BigInt = Number;
/*ROLLUP_REPLACE_NODE
globalThis = global;
ROLLUP_REPLACE_NODE*/
/*ROLLUP_REPLACE_BROWSER
globalThis = self;
ROLLUP_REPLACE_BROWSER*/
if (globalThis.BigInt) {
  // @ts-ignore
  exportedBigInt = globalThis.BigInt;
}
// @ts-ignore
export const BigIntPolyfill: typeof BigInt = exportedBigInt;
export type BigIntPolyfillType = bigint;
