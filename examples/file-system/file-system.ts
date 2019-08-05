// An alternative fs for the browser and testing

import { createFsFromVolume, IFs } from "memfs";
import { Volume } from "memfs/lib/volume";

import * as WASI_CONSTANTS from "../../lib/constants";

const assert = (cond: boolean, message: string) => {
  if (!cond) {
    throw new Error(message);
  }
};

export default class WasiCLIFileSystem {
  volume: Volume;
  fs: IFs;

  constructor() {
    this.volume = Volume.fromJSON({
      "/dev/stdin": "",
      "/dev/stdout": "",
      "/dev/stderr": ""
    });
    this.volume.releasedFds = [0, 1, 2];

    const fd_err = this.volume.openSync("/dev/stderr", "w");
    const fd_out = this.volume.openSync("/dev/stdout", "w");
    const fd_in = this.volume.openSync("/dev/stdin", "r");
    assert(fd_err === 2, `invalid handle for stderr: ${fd_err}`);
    assert(fd_out === 1, `invalid handle for stdout: ${fd_out}`);
    assert(fd_in === 0, `invalid handle for stdin: ${fd_in}`);

    this.fs = createFsFromVolume(this.volume);
  }

  async getStdOut() {
    let promise = new Promise((resolve, reject) => {
      const rs_out = this.fs.createReadStream("/dev/stdout", "utf8");
      rs_out.on("data", (data: Buffer) => {
        resolve(data.toString("utf8"));
      });
    });
    return await promise;
  }
}
