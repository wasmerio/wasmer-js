// A very simple workaround for Big int. Works in conjunction with our custom
// Dataview workaround at ./dataview.ts

const globalObj: any =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : {};

export const BigIntPolyfill: typeof BigInt =
  typeof BigInt !== "undefined" ? BigInt : globalObj.BigInt || Number;
export type BigIntPolyfillType = bigint;
