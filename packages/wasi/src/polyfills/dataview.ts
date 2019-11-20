// A very simple workaround for Big int. Works in conjunction with our custom
// BigInt workaround at ./bigint.ts

import { BigIntPolyfill as BigInt, BigIntPolyfillType } from "./bigint";

let exportedDataView: any = DataView;

if (!exportedDataView.prototype.setBigUint64) {
  // Taken from https://gist.github.com/graup/815c9ac65c2bac8a56391f0ca23636fc
  exportedDataView.prototype.setBigUint64 = function(
    byteOffset: number,
    value: BigIntPolyfillType,
    littleEndian: boolean | undefined
  ) {
    let lowWord;
    let highWord;

    if (value < 2 ** 32) {
      lowWord = value;
      highWord = 0;
    } else {
      var bigNumberAsBinaryStr = value.toString(2);
      // Convert the above binary str to 64 bit (actually 52 bit will work) by padding zeros in the left
      var bigNumberAsBinaryStr2 = "";
      for (var i = 0; i < 64 - bigNumberAsBinaryStr.length; i++) {
        bigNumberAsBinaryStr2 += "0";
      }
      bigNumberAsBinaryStr2 += bigNumberAsBinaryStr;
      highWord = parseInt(bigNumberAsBinaryStr2.substring(0, 32), 2);
      lowWord = parseInt(bigNumberAsBinaryStr2.substring(32), 2);
    }

    this.setUint32(byteOffset + (littleEndian ? 0 : 4), lowWord, littleEndian);
    this.setUint32(byteOffset + (littleEndian ? 4 : 0), highWord, littleEndian);
  };

  exportedDataView.prototype.getBigUint64 = function(
    byteOffset: number,
    littleEndian: boolean | undefined
  ): BigInt {
    let lowWord = this.getUint32(
      byteOffset + (littleEndian ? 0 : 4),
      littleEndian
    );
    let highWord = this.getUint32(
      byteOffset + (littleEndian ? 4 : 0),
      littleEndian
    );
    var lowWordAsBinaryStr = lowWord.toString(2);
    var highWordAsBinaryStr = highWord.toString(2);
    // Convert the above binary str to 64 bit (actually 52 bit will work) by padding zeros in the left
    var lowWordAsBinaryStrPadded = "";
    for (var i = 0; i < 32 - lowWordAsBinaryStr.length; i++) {
      lowWordAsBinaryStrPadded += "0";
    }
    lowWordAsBinaryStrPadded += lowWordAsBinaryStr;
    return BigInt("0b" + highWordAsBinaryStr + lowWordAsBinaryStrPadded);
  };
}

export const DataViewPolyfill: any = exportedDataView;
export type DataViewPolyfillType = any;
