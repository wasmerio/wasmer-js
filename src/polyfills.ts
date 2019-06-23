// @ts-ignore
if (global && !global.BigInt) {
  // @ts-ignore
  global.BigInt = Number
}

if (!DataView.prototype.setBigUint64) {
  // Taken from https://gist.github.com/graup/815c9ac65c2bac8a56391f0ca23636fc
  DataView.prototype.setBigUint64 = function(
    byteOffset: number,
    value: bigint,
    littleEndian: boolean | undefined
  ) {
    let lowWord = value,
      highWord = 0
    // if (value.length >= 2) {
    //     highWord = value[1];
    // }
    this.setUint32(littleEndian ? 0 : 4, lowWord, littleEndian)
    this.setUint32(littleEndian ? 4 : 0, highWord, littleEndian)
  }
}
