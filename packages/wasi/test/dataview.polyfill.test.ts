import {
  BigIntPolyfill as BigInt,
  BigIntPolyfillType
} from "../src/polyfills/bigint";

describe("dataview Polyfill", () => {
  DataView.prototype.setBigUint64 = undefined;
  DataView.prototype.getBigUint64 = undefined;
  let {
    DataViewPolyfill,
    DataViewPolyfillType
  } = require("../src/polyfills/dataview");

  it("Should store and return same bigint value little-endian", async () => {
    let buffer = new DataViewPolyfill(new ArrayBuffer(16));
    const val = BigInt(2 ** 32 + 999666);
    buffer.setBigUint64(0, val, true);
    expect(buffer.getBigUint64(0, true).toString()).toEqual(val.toString());
  });
  it("Should store and return same bigint value big-endian", async () => {
    let buffer = new DataViewPolyfill(new ArrayBuffer(16));
    const val = BigInt(2 ** 32 + 999666);
    buffer.setBigUint64(0, val, false);
    expect(buffer.getBigUint64(0, false).toString()).toEqual(val.toString());
  });
});
