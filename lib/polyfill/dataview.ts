// A very simple workaround for Big int. Works in conjunction with our custom
// BigInt workaround at ./bigint.ts

import { BigIntPolyfillType } from "./bigint";

let exportedDataView: any = DataView;

if (!exportedDataView.prototype.setBigUint64) {
  // Taken from https://gist.github.com/graup/815c9ac65c2bac8a56391f0ca23636fc
  exportedDataView.prototype.setBigUint64 = function(
    byteOffset: number,
    value: BigIntPolyfillType,
    littleEndian: boolean | undefined
  ) {
    let lowWord = value;
    let highWord = 0;
    this.setUint32(littleEndian ? 0 : 4, lowWord, littleEndian);
    this.setUint32(littleEndian ? 4 : 0, highWord, littleEndian);
  };
}

export const DataViewPolyfill: any = exportedDataView;
export type DataViewPolyfillType = any;
