// A very simple workaround for Big int. Works in conjunction with our custom
// Dataview workaround at ./dataview.ts

let exportedBigInt = global.Number;
if (global && (global as any).BigInt) {
  // Node
  exportedBigInt = (global as any).BigInt;
} else if (window && (window as any).BigInt) {
  // Browsers
  exportedBigInt = (window as any).BigInt;
} else if (self && !(self as any).BigInt) {
  // Worker
  exportedBigInt = (self as any).BigInt;
}

export const BigIntPolyfill: any = exportedBigInt;
export type BigIntPolyfillType = any;
