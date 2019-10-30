// A very simple workaround for Big int. Works in conjunction with our custom
// Dataview workaround at ./dataview.ts

const globalObj =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : {};

// @ts-ignore
export const BigIntPolyfill: typeof BigInt = globalObj.BigInt || Number;
export type BigIntPolyfillType = bigint;
