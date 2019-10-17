// A very simple workaround for Big int. Works in conjunction with our custom
// Dataview workaround at ./dataview.ts

var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : {};

// @ts-ignore
export const BigIntPolyfill: typeof BigInt = commonjsGlobal.BigInt || Number;
export type BigIntPolyfillType = bigint;
