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
  stdin: Uint8Array;
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
    this.stdin = new Uint8Array(0);
  }

  sendStdinChunk(chunk: Uint8Array) {
    const newStdin = new Uint8Array(chunk.length + this.stdin.length);
    newStdin.set(this.stdin);
    newStdin.set(chunk, this.stdin.length);
    this.stdin = newStdin;
  }

  // Handle read of stdin, similar to C read
  // https://linux.die.net/man/2/read
  // This is the bottom of the "layers stack". This is the outer binding.
  // This is the the thing that returns -1 because it is the actual file system,
  // but it is up to WASI lib  (wasi.ts) to find out why this error'd
  stdinRead(
    buf: Buffer | Uint8Array,
    offset: number = 0,
    length: number = buf.byteLength,
    position?: number
  ) {
    // First check for errors
    if (this.stdin.length === 0) {
      // We don't have stdin
      // Need handle the error to keep waiting / reading

      const isNonBlocking =
        (this.volume.fds[0].flags & WASI_CONSTANTS.WASI_FDFLAG_NONBLOCK) > 0;
      if (isNonBlocking) {
        // We are in non-blocking mode

        // We need to read still, throw EAGAIN
        throw {
          errno: true,
          code: "EAGAIN"
        };
        return 0;
      } else {
        // We are in blocking mode
        // We can't spinloop here because we are in the browser, and Shared array buffers
        // are disabled because of meltdown and spectre.
        // Thus, can not currently be implemented without a ton of work.
        // Thus, we will treat the read as it if was non blocking

        throw {
          errno: true,
          code: "EAGAIN"
        };
        return 0;
      }
    }

    // Return the current stdin
    // TODO:
    return 0;
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
