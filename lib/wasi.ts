/* eslint-disable no-unused-vars */

import {
  BigIntPolyfill as BigInt,
  BigIntPolyfillType
} from "./polyfills/bigint";
import {
  DataViewPolyfill as DataView,
  DataViewPolyfillType
} from "./polyfills/dataview";

// Import our default bindings depending on the environment
let defaultBindings: WASIBindings;
/*ROLLUP_REPLACE_NODE
import nodeBindings from "./bindings/node";
defaultBindings = nodeBindings;
ROLLUP_REPLACE_NODE*/
/*ROLLUP_REPLACE_BROWSER
import browserBindings from "./bindings/browser";
defaultBindings = browserBindings;
ROLLUP_REPLACE_BROWSER*/

/*

This project is based from the Node implementation made by Gus Caplan
https://github.com/devsnek/node-wasi
However, JavaScript WASI is focused on:
 * Bringing WASI to the Browsers
 * Make easy to plug different filesystems
 * Provide a type-safe api using Typescript


Copyright 2019 Gus Caplan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.

 */

import {
  WASI_ESUCCESS,
  WASI_EBADF,
  WASI_EINVAL,
  WASI_ENOSYS,
  WASI_EPERM,
  WASI_ENOTCAPABLE,
  WASI_FILETYPE_UNKNOWN,
  WASI_FILETYPE_BLOCK_DEVICE,
  WASI_FILETYPE_CHARACTER_DEVICE,
  WASI_FILETYPE_DIRECTORY,
  WASI_FILETYPE_REGULAR_FILE,
  WASI_FILETYPE_SOCKET_STREAM,
  WASI_FILETYPE_SYMBOLIC_LINK,
  WASI_FDFLAG_APPEND,
  WASI_FDFLAG_DSYNC,
  WASI_FDFLAG_NONBLOCK,
  WASI_FDFLAG_RSYNC,
  WASI_FDFLAG_SYNC,
  WASI_RIGHT_FD_DATASYNC,
  WASI_RIGHT_FD_READ,
  WASI_RIGHT_FD_SEEK,
  WASI_RIGHT_FD_FDSTAT_SET_FLAGS,
  WASI_RIGHT_FD_SYNC,
  WASI_RIGHT_FD_TELL,
  WASI_RIGHT_FD_WRITE,
  WASI_RIGHT_FD_ADVISE,
  WASI_RIGHT_FD_ALLOCATE,
  WASI_RIGHT_PATH_CREATE_DIRECTORY,
  WASI_RIGHT_PATH_CREATE_FILE,
  WASI_RIGHT_PATH_LINK_SOURCE,
  WASI_RIGHT_PATH_LINK_TARGET,
  WASI_RIGHT_PATH_OPEN,
  WASI_RIGHT_FD_READDIR,
  WASI_RIGHT_PATH_READLINK,
  WASI_RIGHT_PATH_RENAME_SOURCE,
  WASI_RIGHT_PATH_RENAME_TARGET,
  WASI_RIGHT_PATH_FILESTAT_GET,
  WASI_RIGHT_PATH_FILESTAT_SET_SIZE,
  WASI_RIGHT_PATH_FILESTAT_SET_TIMES,
  WASI_RIGHT_FD_FILESTAT_GET,
  WASI_RIGHT_FD_FILESTAT_SET_SIZE,
  WASI_RIGHT_FD_FILESTAT_SET_TIMES,
  WASI_RIGHT_PATH_SYMLINK,
  WASI_RIGHT_PATH_REMOVE_DIRECTORY,
  WASI_RIGHT_PATH_UNLINK_FILE,
  RIGHTS_BLOCK_DEVICE_BASE,
  RIGHTS_BLOCK_DEVICE_INHERITING,
  RIGHTS_CHARACTER_DEVICE_BASE,
  RIGHTS_CHARACTER_DEVICE_INHERITING,
  RIGHTS_REGULAR_FILE_BASE,
  RIGHTS_REGULAR_FILE_INHERITING,
  RIGHTS_DIRECTORY_BASE,
  RIGHTS_DIRECTORY_INHERITING,
  RIGHTS_SOCKET_BASE,
  RIGHTS_SOCKET_INHERITING,
  RIGHTS_TTY_BASE,
  RIGHTS_TTY_INHERITING,
  WASI_CLOCK_MONOTONIC,
  WASI_CLOCK_PROCESS_CPUTIME_ID,
  WASI_CLOCK_REALTIME,
  WASI_CLOCK_THREAD_CPUTIME_ID,
  WASI_EVENTTYPE_CLOCK,
  WASI_EVENTTYPE_FD_READ,
  WASI_EVENTTYPE_FD_WRITE,
  WASI_FILESTAT_SET_ATIM_NOW,
  WASI_FILESTAT_SET_MTIM_NOW,
  WASI_O_CREAT,
  WASI_O_DIRECTORY,
  WASI_O_EXCL,
  WASI_O_TRUNC,
  WASI_PREOPENTYPE_DIR,
  WASI_STDIN_FILENO,
  WASI_STDOUT_FILENO,
  WASI_STDERR_FILENO,
  ERROR_MAP,
  SIGNAL_MAP
} from "./constants";

const msToNs = (ms: number) => {
  const msInt = Math.trunc(ms);
  const decimal = BigInt(Math.round((ms - msInt) * 1000));
  const ns = BigInt(msInt) * BigInt(1000);
  return ns + decimal;
};

const wrap = <T extends Function>(f: T) => (...args: any[]) => {
  try {
    return f(...args);
  } catch (e) {
    if (typeof e === "number") {
      return e;
    }
    if (e.errno) {
      return ERROR_MAP[e.code] || WASI_EINVAL;
    }
    throw e;
  }
};

const stat = (wasi: WASI, fd: number): File => {
  const entry = wasi.FD_MAP.get(fd);
  if (!entry) {
    throw WASI_EBADF;
  }
  if (entry.filetype === undefined) {
    const stats = wasi.bindings.fs.fstatSync(entry.real);
    const { filetype, rightsBase, rightsInheriting } = translateFileAttributes(
      wasi,
      fd,
      stats
    );
    entry.filetype = filetype;
    if (entry.rights === undefined) {
      entry.rights = {
        base: rightsBase,
        inheriting: rightsInheriting
      };
    }
  }
  return entry;
};

const translateFileAttributes = (
  wasi: WASI,
  fd: number | undefined,
  stats: any
) => {
  switch (true) {
    case stats.isBlockDevice():
      return {
        filetype: WASI_FILETYPE_BLOCK_DEVICE,
        rightsBase: RIGHTS_BLOCK_DEVICE_BASE,
        rightsInheriting: RIGHTS_BLOCK_DEVICE_INHERITING
      };
    case stats.isCharacterDevice(): {
      const filetype = WASI_FILETYPE_CHARACTER_DEVICE;
      if (fd !== undefined && wasi.bindings.isTTY(fd)) {
        return {
          filetype,
          rightsBase: RIGHTS_TTY_BASE,
          rightsInheriting: RIGHTS_TTY_INHERITING
        };
      }
      return {
        filetype,
        rightsBase: RIGHTS_CHARACTER_DEVICE_BASE,
        rightsInheriting: RIGHTS_CHARACTER_DEVICE_INHERITING
      };
    }
    case stats.isDirectory():
      return {
        filetype: WASI_FILETYPE_DIRECTORY,
        rightsBase: RIGHTS_DIRECTORY_BASE,
        rightsInheriting: RIGHTS_DIRECTORY_INHERITING
      };
    case stats.isFIFO():
      return {
        filetype: WASI_FILETYPE_SOCKET_STREAM,
        rightsBase: RIGHTS_SOCKET_BASE,
        rightsInheriting: RIGHTS_SOCKET_INHERITING
      };
    case stats.isFile():
      return {
        filetype: WASI_FILETYPE_REGULAR_FILE,
        rightsBase: RIGHTS_REGULAR_FILE_BASE,
        rightsInheriting: RIGHTS_REGULAR_FILE_INHERITING
      };
    case stats.isSocket():
      return {
        filetype: WASI_FILETYPE_SOCKET_STREAM,
        rightsBase: RIGHTS_SOCKET_BASE,
        rightsInheriting: RIGHTS_SOCKET_INHERITING
      };
    case stats.isSymbolicLink():
      return {
        filetype: WASI_FILETYPE_SYMBOLIC_LINK,
        rightsBase: BigInt(0),
        rightsInheriting: BigInt(0)
      };
    default:
      return {
        filetype: WASI_FILETYPE_UNKNOWN,
        rightsBase: BigInt(0),
        rightsInheriting: BigInt(0)
      };
  }
};

interface Rights {
  base: BigIntPolyfillType;
  inheriting: BigIntPolyfillType;
}

interface File {
  real: number;
  filetype?: any;
  rights: Rights;
  path?: any;
  fakePath?: any;
}

type Exports = {
  [key: string]: any;
};

type TypedArray = ArrayLike<any> & {
  BYTES_PER_ELEMENT: number;
  set(array: ArrayLike<number>, offset?: number): void;
  slice(start?: number, end?: number): TypedArray;
};

export type WASIBindings = {
  // Current high-resolution real time in a bigint
  hrtime: () => bigint;
  // Process functions
  exit: (rval: number) => void;
  kill: (signal: string) => void;
  // Crypto functions
  randomFillSync: <T>(buffer: T, offset: number, size: number) => T;
  // isTTY
  isTTY: (fd: number) => boolean;

  // Filesystem
  fs: any;

  // Path
  path: any;
};

export type WASIArgs = string[];
export type WASIEnv = { [key: string]: string | undefined };
export type WASIPreopenedDirs = { [key: string]: string };
export type WASIConfig = {
  preopenDirectories: WASIPreopenedDirs;
  env: WASIEnv;
  args: WASIArgs;
  bindings: WASIBindings;
};

class WASI {
  memory: WebAssembly.Memory;
  view: DataViewPolyfillType;
  FD_MAP: Map<number, File>;
  exports: Exports;
  bindings: WASIBindings;
  static defaultBindings: WASIBindings = defaultBindings;

  constructor({
    preopenDirectories = {},
    env = {},
    args = [],
    bindings = defaultBindings
  }: WASIConfig) {
    // @ts-ignore
    this.memory = undefined;
    // @ts-ignore
    this.view = undefined;
    this.bindings = bindings;

    this.FD_MAP = new Map([
      [
        WASI_STDIN_FILENO,
        {
          real: 0,
          filetype: undefined,
          rights: {
            base: RIGHTS_REGULAR_FILE_BASE,
            inheriting: BigInt(0)
          },
          path: undefined
        }
      ],
      [
        WASI_STDOUT_FILENO,
        {
          real: 1,
          filetype: undefined,
          rights: {
            base: RIGHTS_REGULAR_FILE_BASE,
            inheriting: BigInt(0)
          },
          path: undefined
        }
      ],
      [
        WASI_STDERR_FILENO,
        {
          real: 2,
          filetype: undefined,
          rights: {
            base: RIGHTS_REGULAR_FILE_BASE,
            inheriting: BigInt(0)
          },
          path: undefined
        }
      ]
    ]);

    let fs = this.bindings.fs;
    let path = this.bindings.path;

    for (const [k, v] of Object.entries(preopenDirectories)) {
      const real = fs.openSync(v, fs.constants.O_RDONLY);
      const newfd = [...this.FD_MAP.keys()].reverse()[0] + 1;
      this.FD_MAP.set(newfd, {
        real,
        filetype: WASI_FILETYPE_DIRECTORY,
        rights: {
          base: RIGHTS_DIRECTORY_BASE,
          inheriting: RIGHTS_DIRECTORY_INHERITING
        },
        fakePath: k,
        path: v
      });
    }

    const getiovs = (iovs: number, iovsLen: number) => {
      // iovs* -> [iov, iov, ...]
      // __wasi_ciovec_t {
      //   void* buf,
      //   size_t buf_len,
      // }

      this.refreshMemory();

      const buffers = Array.from({ length: iovsLen }, (_, i) => {
        const ptr = iovs + i * 8;
        const buf = this.view.getUint32(ptr, true);
        const bufLen = this.view.getUint32(ptr + 4, true);
        return new Uint8Array(this.memory.buffer, buf, bufLen);
      });

      return buffers;
    };

    const CHECK_FD = (fd: number, rights: BigIntPolyfillType) => {
      const stats = stat(this, fd);
      if (rights !== BigInt(0) && (stats.rights.base & rights) === BigInt(0)) {
        throw WASI_EPERM;
      }
      return stats;
    };
    const CPUTIME_START = bindings.hrtime();

    const now = (clockId: number) => {
      switch (clockId) {
        case WASI_CLOCK_MONOTONIC:
        case WASI_CLOCK_REALTIME:
          return bindings.hrtime();
        case WASI_CLOCK_PROCESS_CPUTIME_ID:
        case WASI_CLOCK_THREAD_CPUTIME_ID:
          // return bindings.hrtime(CPUTIME_START)
          return bindings.hrtime() - CPUTIME_START;
        default:
          return null;
      }
    };

    this.exports = {
      args_get: (argv: number, argvBuf: number) => {
        this.refreshMemory();
        let coffset = argv;
        let offset = argvBuf;
        args.forEach(a => {
          this.view.setUint32(coffset, offset, true);
          coffset += 4;
          offset += Buffer.from(this.memory.buffer).write(`${a}\0`, offset);
        });
        return WASI_ESUCCESS;
      },
      args_sizes_get: (argc: number, argvBufSize: number) => {
        this.refreshMemory();
        this.view.setUint32(argc, args.length, true);
        const size = args.reduce((acc, a) => acc + Buffer.byteLength(a) + 1, 0);
        this.view.setUint32(argvBufSize, size, true);
        return WASI_ESUCCESS;
      },
      environ_get: (environ: number, environBuf: number) => {
        this.refreshMemory();
        let coffset = environ;
        let offset = environBuf;
        Object.entries(env).forEach(([key, value]) => {
          this.view.setUint32(coffset, offset, true);
          coffset += 4;
          offset += Buffer.from(this.memory.buffer).write(
            `${key}=${value}\0`,
            offset
          );
        });
        return WASI_ESUCCESS;
      },
      environ_sizes_get: (environCount: number, environBufSize: number) => {
        this.refreshMemory();
        const envProcessed = Object.entries(env).map(
          ([key, value]) => `${key}=${value}\0`
        );
        const size = envProcessed.reduce(
          (acc, e) => acc + Buffer.byteLength(e),
          0
        );
        this.view.setUint32(environCount, envProcessed.length, true);
        this.view.setUint32(environBufSize, size, true);
        return WASI_ESUCCESS;
      },
      clock_res_get: (clockId: number, resolution: number) => {
        this.view.setBigUint64(resolution, BigInt(0));
        return WASI_ESUCCESS;
      },
      clock_time_get: (clockId: number, precision: number, time: number) => {
        const n = now(clockId);
        if (n === null) {
          return WASI_EINVAL;
        }
        this.view.setBigUint64(time, BigInt(n), true);
        return WASI_ESUCCESS;
      },
      fd_advise: wrap(
        (fd: number, offset: number, len: number, advice: number) => {
          CHECK_FD(fd, WASI_RIGHT_FD_ADVISE);
          return WASI_ENOSYS;
        }
      ),
      fd_allocate: wrap((fd: number, offset: number, len: number) => {
        CHECK_FD(fd, WASI_RIGHT_FD_ALLOCATE);
        return WASI_ENOSYS;
      }),
      fd_close: wrap((fd: number) => {
        const stats = CHECK_FD(fd, BigInt(0));
        fs.closeSync(stats.real);
        this.FD_MAP.delete(fd);
        return WASI_ESUCCESS;
      }),
      fd_datasync: (fd: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_DATASYNC);
        fs.fdatasyncSync(stats.real);
        return WASI_ESUCCESS;
      },
      fd_fdstat_get: wrap((fd: number, bufPtr: number) => {
        const stats = CHECK_FD(fd, BigInt(0));
        this.refreshMemory();
        this.view.setUint8(bufPtr, stats.filetype); // FILETYPE u8
        this.view.setUint16(bufPtr + 2, 0, true); // FDFLAG u16
        this.view.setUint16(bufPtr + 4, 0, true); // FDFLAG u16
        this.view.setBigUint64(bufPtr + 8, stats.rights.base, true); // u64
        this.view.setBigUint64(bufPtr + 8 + 8, stats.rights.inheriting, true); // u64
        return WASI_ESUCCESS;
      }),
      fd_fdstat_set_flags: wrap((fd: number, flags: number) => {
        CHECK_FD(fd, WASI_RIGHT_FD_FDSTAT_SET_FLAGS);
        return WASI_ENOSYS;
      }),
      fd_fdstat_set_rights: wrap(
        (
          fd: number,
          fsRightsBase: BigIntPolyfillType,
          fsRightsInheriting: BigIntPolyfillType
        ) => {
          const stats = CHECK_FD(fd, BigInt(0));
          const nrb = stats.rights.base | fsRightsBase;
          if (nrb > stats.rights.base) {
            return WASI_EPERM;
          }
          const nri = stats.rights.inheriting | fsRightsInheriting;
          if (nri > stats.rights.inheriting) {
            return WASI_EPERM;
          }
          stats.rights.base = nrb;
          stats.rights.inheriting = nri;
          return WASI_ESUCCESS;
        }
      ),
      fd_filestat_get: wrap((fd: number, bufPtr: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_FILESTAT_GET);
        const rstats = fs.fstatSync(stats.real);
        this.refreshMemory();
        this.view.setBigUint64(bufPtr, BigInt(rstats.dev), true);
        bufPtr += 8;
        this.view.setBigUint64(bufPtr, BigInt(rstats.ino), true);
        bufPtr += 8;
        this.view.setUint8(bufPtr, stats.filetype);
        bufPtr += 4;
        this.view.setUint32(bufPtr, Number(rstats.nlink), true);
        bufPtr += 4;
        this.view.setBigUint64(bufPtr, BigInt(rstats.size), true);
        bufPtr += 8;
        this.view.setBigUint64(bufPtr, msToNs(rstats.atimeMs), true);
        bufPtr += 8;
        this.view.setBigUint64(bufPtr, msToNs(rstats.mtimeMs), true);
        bufPtr += 8;
        this.view.setBigUint64(bufPtr, msToNs(rstats.ctimeMs), true);
        bufPtr += 8;
        return WASI_ESUCCESS;
      }),
      fd_filestat_set_size: wrap((fd: number, stSize: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_FILESTAT_SET_SIZE);
        fs.ftruncate(stats.real, Number(stSize));
        return WASI_ESUCCESS;
      }),
      fd_filestat_set_times: wrap(
        (fd: number, stAtim: number, stMtim: number, fstflags: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_FILESTAT_SET_TIMES);
          const n = now(WASI_CLOCK_REALTIME);
          const atimNow =
            (fstflags & WASI_FILESTAT_SET_ATIM_NOW) ===
            WASI_FILESTAT_SET_ATIM_NOW;
          const mtimNow =
            (fstflags & WASI_FILESTAT_SET_MTIM_NOW) ===
            WASI_FILESTAT_SET_MTIM_NOW;
          fs.futimesSync(
            stats.real,
            atimNow ? n : stAtim,
            mtimNow ? n : stMtim
          );
          return WASI_ESUCCESS;
        }
      ),
      fd_prestat_get: wrap((fd: number, bufPtr: number) => {
        const stats = CHECK_FD(fd, BigInt(0));
        if (!stats.path) {
          return WASI_EINVAL;
        }
        this.refreshMemory();
        this.view.setUint8(bufPtr, WASI_PREOPENTYPE_DIR);
        this.view.setUint32(
          bufPtr + 4,
          Buffer.byteLength(stats.fakePath),
          true
        );
        return WASI_ESUCCESS;
      }),
      fd_prestat_dir_name: wrap(
        (fd: number, pathPtr: number, pathLen: number) => {
          const stats = CHECK_FD(fd, BigInt(0));
          if (!stats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          Buffer.from(this.memory.buffer).write(
            stats.fakePath,
            pathPtr,
            pathLen,
            "utf8"
          );
          return WASI_ESUCCESS;
        }
      ),
      fd_pwrite: wrap(
        (
          fd: number,
          iovs: number,
          iovsLen: number,
          offset: number,
          nwritten: number
        ) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_WRITE | WASI_RIGHT_FD_SEEK);
          let written = 0;
          getiovs(iovs, iovsLen).forEach(iov => {
            let w = 0;
            while (w < iov.byteLength) {
              w += fs.writeSync(
                stats.real,
                iov,
                w,
                iov.byteLength - w,
                offset + written + w
              );
            }
            written += w;
          });
          this.view.setUint32(nwritten, written, true);
          return WASI_ESUCCESS;
        }
      ),
      fd_write: wrap(
        (fd: number, iovs: number, iovsLen: number, nwritten: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_WRITE);
          let written = 0;
          getiovs(iovs, iovsLen).forEach(iov => {
            let w = 0;
            while (w < iov.byteLength) {
              // console.log("FD WRITE", stats.real, iov, w, iov.byteLength - w, 0);
              w += fs.writeSync(stats.real, iov, w, iov.byteLength - w);
            }
            written += w;
          });
          this.view.setUint32(nwritten, written, true);
          return WASI_ESUCCESS;
        }
      ),
      fd_pread: wrap(
        (
          fd: number,
          iovs: number,
          iovsLen: number,
          offset: number,
          nread: number
        ) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_READ | WASI_RIGHT_FD_SEEK);
          let read = 0;
          getiovs(iovs, iovsLen).forEach(iov => {
            let r = 0;
            while (r < iov.byteLength) {
              r += fs.readSync(
                stats.real,
                iov,
                r,
                iov.byteLength - r,
                offset + read + r
              );
            }
            read += r;
          });
          this.view.setUint32(nread, read, true);
          return WASI_ESUCCESS;
        }
      ),
      fd_read: wrap(
        (fd: number, iovs: number, iovsLen: number, nread: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_READ);
          let read = 0;
          outer: for (const iov of getiovs(iovs, iovsLen)) {
            let r = 0;
            while (r < iov.byteLength) {
              const rr = fs.readSync(stats.real, iov, r, iov.byteLength - r);
              r += rr;
              read += rr;
              if (rr === 0) {
                break outer;
              }
            }
          }
          this.view.setUint32(nread, read, true);
          return WASI_ESUCCESS;
        }
      ),
      fd_readdir: wrap(
        (
          fd: number,
          bufPtr: number,
          bufLen: number,
          cookie: number,
          bufusedPtr: number
        ) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_READDIR);
          this.refreshMemory();
          const entries = fs.readdirSync(stats.path, { withFileTypes: true });
          const startPtr = bufPtr;
          for (let i = Number(cookie); i < entries.length; i += 1) {
            const entry = entries[i];
            this.view.setBigUint64(bufPtr, BigInt(i + 1), true);
            bufPtr += 8;
            const rstats = fs.statSync(path.resolve(stats.path, entry.name));
            this.view.setBigUint64(bufPtr, BigInt(rstats.ino), true);
            bufPtr += 8;
            this.view.setUint32(bufPtr, Buffer.byteLength(entry.name), true);
            bufPtr += 4;
            let filetype;
            switch (true) {
              case rstats.isBlockDevice():
                filetype = WASI_FILETYPE_BLOCK_DEVICE;
                break;
              case rstats.isCharacterDevice():
                filetype = WASI_FILETYPE_CHARACTER_DEVICE;
                break;
              case rstats.isDirectory():
                filetype = WASI_FILETYPE_DIRECTORY;
                break;
              case rstats.isFIFO():
                filetype = WASI_FILETYPE_SOCKET_STREAM;
                break;
              case rstats.isFile():
                filetype = WASI_FILETYPE_REGULAR_FILE;
                break;
              case rstats.isSocket():
                filetype = WASI_FILETYPE_SOCKET_STREAM;
                break;
              case rstats.isSymbolicLink():
                filetype = WASI_FILETYPE_SYMBOLIC_LINK;
                break;
              default:
                filetype = WASI_FILETYPE_UNKNOWN;
                break;
            }
            this.view.setUint8(bufPtr, filetype);
            bufPtr += 1;
            bufPtr += 3; // padding
            Buffer.from(this.memory.buffer).write(
              entry.name,
              bufPtr,
              bufLen - bufPtr
            );
            bufPtr += Buffer.byteLength(entry.name);
            bufPtr += 8 % bufPtr; // padding
          }
          const bufused = bufPtr - startPtr;
          this.view.setUint32(bufusedPtr, bufused, true);
          return WASI_ESUCCESS;
        }
      ),
      fd_renumber: wrap((from: number, to: number) => {
        CHECK_FD(from, BigInt(0));
        CHECK_FD(to, BigInt(0));
        fs.closeSync((this.FD_MAP.get(from) as File).real);
        this.FD_MAP.set(from, this.FD_MAP.get(to) as File);
        this.FD_MAP.delete(to);
        return WASI_ESUCCESS;
      }),
      fd_seek: wrap(
        (fd: number, offset: number, whence: number, newOffsetPtr: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_SEEK);
          // TODO: Why?
          // Refreshing memory here either way
          this.refreshMemory();
          throw new Error("fd_seek to be implemented (without binding)");

          // const newOffset = binding.seek(stats.real, offset, {
          //  [WASI_WHENCE_CUR]: binding.SEEK_CUR,
          //  [WASI_WHENCE_END]: binding.SEEK_END,
          //  [WASI_WHENCE_SET]: binding.SEEK_SET,
          // }[whence]);
          // if (typeof newOffset === 'number') { // errno
          // throw newOffset;
          // }
          // this.refreshMemory();
          // this.view.setBigUint64(newOffsetPtr, newOffset, true);
          // return WASI_ESUCCESS;
        }
      ),
      fd_tell: wrap((fd: number, offsetPtr: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_TELL);
        // TODO: Why?
        // Refreshing memory here either way
        this.refreshMemory();
        throw new Error("fd_tell to be implemented (without binding)");
        // const currentOffset = binding.seek(stats.real, BigInt(0), SEEK_CUR)
        // if (typeof currentOffset === 'number') {
        //   // errno
        //   throw currentOffset
        // }
        // this.refreshMemory()
        // this.view.setBigUint64(offsetPtr, currentOffset, true)
        // return WASI_ESUCCESS
      }),
      fd_sync: wrap((fd: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_SYNC);
        fs.fsyncSync(stats.real);
        return WASI_ESUCCESS;
      }),
      path_create_directory: wrap(
        (fd: number, pathPtr: number, pathLen: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_CREATE_DIRECTORY);
          if (!stats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          const p = Buffer.from(
            this.memory.buffer,
            pathPtr,
            pathLen
          ).toString();
          fs.mkdirSync(path.resolve(stats.path, p));
          return WASI_ESUCCESS;
        }
      ),
      path_filestat_get: wrap(
        (
          fd: number,
          flags: number,
          pathPtr: number,
          pathLen: number,
          bufPtr: number
        ) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_FILESTAT_GET);
          if (!stats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          const p = Buffer.from(
            this.memory.buffer,
            pathPtr,
            pathLen
          ).toString();
          const rstats = fs.statSync(path.resolve(stats.path, p));
          this.view.setBigUint64(bufPtr, BigInt(rstats.dev), true);
          bufPtr += 8;
          this.view.setBigUint64(bufPtr, BigInt(rstats.ino), true);
          bufPtr += 8;
          this.view.setUint8(
            bufPtr,
            translateFileAttributes(this, undefined, rstats).filetype
          );
          bufPtr += 4;
          this.view.setUint32(bufPtr, Number(rstats.nlink), true);
          bufPtr += 4;
          this.view.setBigUint64(bufPtr, BigInt(rstats.size), true);
          bufPtr += 8;
          this.view.setBigUint64(bufPtr, msToNs(rstats.atimeMs), true);
          bufPtr += 8;
          this.view.setBigUint64(bufPtr, msToNs(rstats.mtimeMs), true);
          bufPtr += 8;
          this.view.setBigUint64(bufPtr, msToNs(rstats.ctimeMs), true);
          bufPtr += 8;
          return WASI_ESUCCESS;
        }
      ),
      path_filestat_set_times: wrap(
        (
          fd: number,
          fstflags: number,
          pathPtr: number,
          pathLen: number,
          stAtim: number,
          stMtim: number
        ) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_FILESTAT_SET_TIMES);
          if (!stats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          const n = now(WASI_CLOCK_REALTIME);
          const atimNow =
            (fstflags & WASI_FILESTAT_SET_ATIM_NOW) ===
            WASI_FILESTAT_SET_ATIM_NOW;
          const mtimNow =
            (fstflags & WASI_FILESTAT_SET_MTIM_NOW) ===
            WASI_FILESTAT_SET_MTIM_NOW;
          const p = Buffer.from(
            this.memory.buffer,
            pathPtr,
            pathLen
          ).toString();
          fs.utimesSync(
            path.resolve(stats.path, p),
            atimNow ? n : stAtim,
            mtimNow ? n : stMtim
          );
          return WASI_ESUCCESS;
        }
      ),
      path_link: wrap(
        (
          oldFd: number,
          oldFlags: number,
          oldPath: number,
          oldPathLen: number,
          newFd: number,
          newPath: number,
          newPathLen: number
        ) => {
          const ostats = CHECK_FD(oldFd, WASI_RIGHT_PATH_LINK_SOURCE);
          const nstats = CHECK_FD(newFd, WASI_RIGHT_PATH_LINK_TARGET);
          if (!ostats.path || !nstats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          const op = Buffer.from(
            this.memory.buffer,
            oldPath,
            oldPathLen
          ).toString();
          const np = Buffer.from(
            this.memory.buffer,
            newPath,
            newPathLen
          ).toString();
          fs.linkSync(
            path.resolve(ostats.path, op),
            path.resolve(nstats.path, np)
          );
          return WASI_ESUCCESS;
        }
      ),
      path_open: wrap(
        (
          dirfd: number,
          dirflags: number,
          pathPtr: number,
          pathLen: number,
          oflags: number,
          fsRightsBase: BigIntPolyfillType,
          fsRightsInheriting: BigIntPolyfillType,
          fsFlags: number,
          fd: number
        ) => {
          const stats = CHECK_FD(dirfd, WASI_RIGHT_PATH_OPEN);

          const read =
            (fsRightsBase & (WASI_RIGHT_FD_READ | WASI_RIGHT_FD_READDIR)) !==
            BigInt(0);
          const write =
            (fsRightsBase &
              (WASI_RIGHT_FD_DATASYNC |
                WASI_RIGHT_FD_WRITE |
                WASI_RIGHT_FD_ALLOCATE |
                WASI_RIGHT_FD_FILESTAT_SET_SIZE)) !==
            BigInt(0);

          let noflags;
          if (write && read) {
            noflags = fs.constants.O_RDWR;
          } else if (read) {
            noflags = fs.constants.O_RDONLY;
          } else if (write) {
            noflags = fs.constants.O_WRONLY;
          }

          let neededBase = WASI_RIGHT_PATH_OPEN;
          let neededInheriting = fsRightsBase | fsRightsInheriting;

          if ((oflags & WASI_O_CREAT) !== 0) {
            noflags |= fs.constants.O_CREAT;
            neededBase |= WASI_RIGHT_PATH_CREATE_FILE;
          }
          if ((oflags & WASI_O_DIRECTORY) !== 0) {
            noflags |= fs.constants.O_DIRECTORY;
          }
          if ((oflags & WASI_O_EXCL) !== 0) {
            noflags |= fs.constants.O_EXCL;
          }
          if ((oflags & WASI_O_TRUNC) !== 0) {
            noflags |= fs.constants.O_TRUNC;
            neededBase |= WASI_RIGHT_PATH_FILESTAT_SET_SIZE;
          }

          // Convert file descriptor flags.
          if ((fsFlags & WASI_FDFLAG_APPEND) !== 0) {
            noflags |= fs.constants.O_APPEND;
          }
          if ((fsFlags & WASI_FDFLAG_DSYNC) !== 0) {
            if (fs.constants.O_DSYNC) {
              noflags |= fs.constants.O_DSYNC;
            } else {
              noflags |= fs.constants.O_SYNC;
            }
            neededInheriting |= WASI_RIGHT_FD_DATASYNC;
          }
          if ((fsFlags & WASI_FDFLAG_NONBLOCK) !== 0) {
            noflags |= fs.constants.O_NONBLOCK;
          }
          if ((fsFlags & WASI_FDFLAG_RSYNC) !== 0) {
            if (fs.constants.O_RSYNC) {
              noflags |= fs.constants.O_RSYNC;
            } else {
              noflags |= fs.constants.O_SYNC;
            }
            neededInheriting |= WASI_RIGHT_FD_SYNC;
          }
          if ((fsFlags & WASI_FDFLAG_SYNC) !== 0) {
            noflags |= fs.constants.O_SYNC;
            neededInheriting |= WASI_RIGHT_FD_SYNC;
          }
          if (
            write &&
            (noflags & (fs.constants.O_APPEND | fs.constants.O_TRUNC)) === 0
          ) {
            neededInheriting |= WASI_RIGHT_FD_SEEK;
          }

          this.refreshMemory();
          const p = Buffer.from(
            this.memory.buffer,
            pathPtr,
            pathLen
          ).toString();
          const fullUnresolved = path.resolve(stats.path, p);
          if (path.relative(stats.path, fullUnresolved).startsWith("..")) {
            return WASI_ENOTCAPABLE;
          }
          let full;
          try {
            full = fs.realpathSync(fullUnresolved);
            if (path.relative(stats.path, full).startsWith("..")) {
              return WASI_ENOTCAPABLE;
            }
          } catch (e) {
            if (e.code === "ENOENT") {
              full = fullUnresolved;
            } else {
              throw e;
            }
          }
          const realfd = fs.openSync(full, noflags);

          const newfd = [...this.FD_MAP.keys()].reverse()[0] + 1;
          this.FD_MAP.set(newfd, {
            real: realfd,
            filetype: undefined,
            rights: {
              base: neededBase,
              inheriting: neededInheriting
            },
            path: full
          });
          stat(this, newfd);
          this.view.setUint32(fd, newfd, true);

          return WASI_ESUCCESS;
        }
      ),
      path_readlink: wrap(
        (
          fd: number,
          pathPtr: number,
          pathLen: number,
          buf: number,
          bufLen: number,
          bufused: number
        ) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_READLINK);
          if (!stats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          const p = Buffer.from(
            this.memory.buffer,
            pathPtr,
            pathLen
          ).toString();
          const full = path.resolve(stats.path, p);
          const r = fs.readlinkSync(full);
          const used = Buffer.from(this.memory.buffer).write(r, buf, bufLen);
          this.view.setUint32(bufused, used, true);
          return WASI_ESUCCESS;
        }
      ),
      path_remove_directory: wrap(
        (fd: number, pathPtr: number, pathLen: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_REMOVE_DIRECTORY);
          if (!stats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          const p = Buffer.from(
            this.memory.buffer,
            pathPtr,
            pathLen
          ).toString();
          fs.rmdirSync(path.resolve(stats.path, p));
          return WASI_ESUCCESS;
        }
      ),
      path_rename: wrap(
        (
          oldFd: number,
          oldPath: number,
          oldPathLen: number,
          newFd: number,
          newPath: number,
          newPathLen: number
        ) => {
          const ostats = CHECK_FD(oldFd, WASI_RIGHT_PATH_RENAME_SOURCE);
          const nstats = CHECK_FD(newFd, WASI_RIGHT_PATH_RENAME_TARGET);
          if (!ostats.path || !nstats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          const op = Buffer.from(
            this.memory.buffer,
            oldPath,
            oldPathLen
          ).toString();
          const np = Buffer.from(
            this.memory.buffer,
            newPath,
            newPathLen
          ).toString();
          fs.renameSync(
            path.resolve(ostats.path, op),
            path.resolve(nstats.path, np)
          );
          return WASI_ESUCCESS;
        }
      ),
      path_symlink: wrap(
        (
          oldPath: number,
          oldPathLen: number,
          fd: number,
          newPath: number,
          newPathLen: number
        ) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_SYMLINK);
          if (!stats.path) {
            return WASI_EINVAL;
          }
          this.refreshMemory();
          const op = Buffer.from(
            this.memory.buffer,
            oldPath,
            oldPathLen
          ).toString();
          const np = Buffer.from(
            this.memory.buffer,
            newPath,
            newPathLen
          ).toString();
          fs.symlinkSync(op, path.resolve(stats.path, np));
          return WASI_ESUCCESS;
        }
      ),
      path_unlink_file: wrap((fd: number, pathPtr: number, pathLen: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_PATH_UNLINK_FILE);
        if (!stats.path) {
          return WASI_EINVAL;
        }
        this.refreshMemory();
        const p = Buffer.from(this.memory.buffer, pathPtr, pathLen).toString();
        fs.unlinkSync(path.resolve(stats.path, p));
        return WASI_ESUCCESS;
      }),
      poll_oneoff: (
        sin: number,
        sout: number,
        nsubscriptions: number,
        nevents: number
      ) => {
        let eventc = 0;
        let waitEnd = 0;
        this.refreshMemory();
        for (let i = 0; i < nsubscriptions; i += 1) {
          const userdata = this.view.getBigUint64(sin, true);
          sin += 8;
          const type = this.view.getUint8(sin);
          sin += 1;
          switch (type) {
            case WASI_EVENTTYPE_CLOCK: {
              sin += 7; // padding
              const identifier = this.view.getBigUint64(sin, true);
              sin += 8;
              const clockid = this.view.getUint32(sin, true);
              sin += 4;
              sin += 4; // padding
              const timestamp = this.view.getBigUint64(sin, true);
              sin += 8;
              const precision = this.view.getBigUint64(sin, true);
              sin += 8;
              const subclockflags = this.view.getUint16(sin, true);
              sin += 2;
              sin += 6; // padding

              const absolute = subclockflags === 1;

              let e = WASI_ESUCCESS;
              const n = now(clockid);
              if (n === null) {
                e = WASI_EINVAL;
              } else {
                const end = absolute ? timestamp : n + timestamp;
                waitEnd =
                  end > waitEnd ? ((end as unknown) as number) : waitEnd;
              }

              this.view.setBigUint64(sout, userdata, true);
              sout += 8;
              this.view.setUint16(sout, e, true); // error
              sout += 2; // pad offset 2
              this.view.setUint8(sout, WASI_EVENTTYPE_CLOCK);
              sout += 1; // pad offset 3
              sout += 5; // padding to 8

              eventc += 1;

              break;
            }
            case WASI_EVENTTYPE_FD_READ:
            case WASI_EVENTTYPE_FD_WRITE: {
              sin += 3; // padding
              const fd = this.view.getUint32(sin, true);
              sin += 4;

              this.view.setBigUint64(sout, userdata, true);
              sout += 8;
              this.view.setUint16(sout, WASI_ENOSYS, true); // error
              sout += 2; // pad offset 2
              this.view.setUint8(sout, type);
              sout += 1; // pad offset 3
              sout += 5; // padding to 8

              eventc += 1;

              break;
            }
            default:
              return WASI_EINVAL;
          }
        }

        this.view.setUint32(nevents, eventc, true);

        while (bindings.hrtime() < waitEnd) {
          // nothing
        }

        return WASI_ESUCCESS;
      },
      proc_exit: (rval: number) => {
        bindings.exit(rval);
        return WASI_ESUCCESS;
      },
      proc_raise: (sig: number) => {
        if (!(sig in SIGNAL_MAP)) {
          return WASI_EINVAL;
        }
        bindings.kill(SIGNAL_MAP[sig]);
        return WASI_ESUCCESS;
      },
      random_get: (bufPtr: number, bufLen: number) => {
        this.refreshMemory();
        bindings.randomFillSync(
          new Uint8Array(this.memory.buffer),
          bufPtr,
          bufLen
        );
        return WASI_ESUCCESS;
      },
      sched_yield() {
        // Single threaded environment
        return WASI_ENOSYS;
      },
      sock_recv() {
        return WASI_ENOSYS;
      },
      sock_send() {
        return WASI_ENOSYS;
      },
      sock_shutdown() {
        return WASI_ENOSYS;
      }
    };
  }

  refreshMemory() {
    // @ts-ignore
    if (!this.view || this.view.buffer.byteLength === 0) {
      this.view = new DataView(this.memory.buffer);
    }
  }

  setMemory(memory: WebAssembly.Memory) {
    this.memory = memory;
  }
}

export default WASI;
