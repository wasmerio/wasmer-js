// An alternative fs for the browser and testing

import { createFsFromVolume, IFs } from "memfs";
import { Volume } from "memfs/lib/volume";

const assert = (cond: boolean, message: string) => {
  if (!cond) {
    throw new Error(message);
  }
};

export default class WasiCLIFileSystem {
  stdin: Uint8Array;
  fs: IFs;

  constructor() {
    const volume: Volume = Volume.fromJSON({
      "/dev/stdin": "",
      "/dev/stdout": "",
      "/dev/stderr": ""
    });
    volume.releasedFds = [0, 1, 2];

    const fd_err = volume.openSync("/dev/stderr", "w");
    const fd_out = volume.openSync("/dev/stdout", "w");
    const fd_in = volume.openSync("/dev/stdin", "r");
    assert(fd_err === 2, `invalid handle for stderr: ${fd_err}`);
    assert(fd_out === 1, `invalid handle for stdout: ${fd_out}`);
    assert(fd_in === 0, `invalid handle for stdin: ${fd_in}`);

    volume.fds[0].read = this.stdinRead;

    this.fs = createFsFromVolume(volume);
    this.stdin = new Uint8Array();
  }

  sendStdinChunk(chunk: Uint8Array) {
    const newStdin = new Uint8Array(chunk.length + this.stdin.length);
    newStdin.set(this.stdin);
    newStdin.set(chunk, this.stdin.length);
    this.stdin = newStdin;
  }

  stdinRead(
    buf: Buffer | Uint8Array,
    offset: number = 0,
    length: number = buf.byteLength,
    position?: number
  ) {
    // TODO: Simply throw an error here, that follows the correct WASI code for
    // the wrap function in the lib

    console.log("I am being read!");

    // This is the bottom of the "layers stack". This is the outer binding.
    // This is the the thing that returns -1 because it is the actual file system,
    // but it is up to WASI lib  (wasi.ts) to find out why this error'd

    // https://linux.die.net/man/2/read
    // Return -1, which means error,
    // But the error can be, hey try again in a little bit.
    return Math.random() > 0.5 ? -1 : 0;
  }

  async getStdOut() {
    // console.log(memfs.toJSON("/dev/stdout"))
    let promise = new Promise((resolve, reject) => {
      const rs_out = this.fs.createReadStream("/dev/stdout", "utf8");
      // let prevData = ''
      rs_out.on("data", (data: Buffer) => {
        // prevData = prevData + data.toString('utf8')
        resolve(data.toString("utf8"));
      });
    });
    return await promise;
  }
}
