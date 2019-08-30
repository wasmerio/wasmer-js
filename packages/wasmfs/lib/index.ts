// An alternative fs for the browser and testing

import { createFsFromVolume, IFs } from "memfs";
import { Volume } from "memfs/lib/volume";

const assert = (cond: boolean, message: string) => {
  if (!cond) {
    throw new Error(message);
  }
};

export default class WasmFs {
  volume: Volume;
  fs: IFs;

  constructor() {
    this.volume = Volume.fromJSON({
      "/dev/stdin": "",
      "/dev/stdout": "",
      "/dev/stderr": ""
    });
    this.volume.releasedFds = [0, 1, 2];

    const fdErr = this.volume.openSync("/dev/stderr", "w");
    const fdOut = this.volume.openSync("/dev/stdout", "w");
    const fdIn = this.volume.openSync("/dev/stdin", "r");
    assert(fdErr === 2, `invalid handle for stderr: ${fdErr}`);
    assert(fdOut === 1, `invalid handle for stdout: ${fdOut}`);
    assert(fdIn === 0, `invalid handle for stdin: ${fdIn}`);

    this.fs = createFsFromVolume(this.volume);
  }

  async getStdOut() {
    let promise = new Promise((resolve, reject) => {
      const rsOut = this.fs.createReadStream("/dev/stdout", "utf8");
      rsOut.on("data", (data: Buffer) => {
        resolve(data.toString("utf8"));
      });
    });
    return promise;
  }
}
