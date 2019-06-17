/* eslint-disable no-unused-vars */

/// This project is based from the Node implementation made by Gus Caplan
/// https://github.com/devsnek/node-wasi
/// However, this JS-WASI is focused on:
/// * Bringing WASI to the Browsers
/// * Make easy to plug different filesystems
/// * Make it type-safe using Typescript

const crypto = require('crypto')
const fs_node = require('fs')
const path = require('path')
const { isatty: isTTY } = require('tty')

const WASI_ESUCCESS = 0
const WASI_E2BIG = 1
const WASI_EACCES = 2
const WASI_EADDRINUSE = 3
const WASI_EADDRNOTAVAIL = 4
const WASI_EAFNOSUPPORT = 5
const WASI_EAGAIN = 6
const WASI_EALREADY = 7
const WASI_EBADF = 8
const WASI_EBADMSG = 9
const WASI_EBUSY = 10
const WASI_ECANCELED = 11
const WASI_ECHILD = 12
const WASI_ECONNABORTED = 13
const WASI_ECONNREFUSED = 14
const WASI_ECONNRESET = 15
const WASI_EDEADLK = 16
const WASI_EDESTADDRREQ = 17
const WASI_EDOM = 18
const WASI_EDQUOT = 19
const WASI_EEXIST = 20
const WASI_EFAULT = 21
const WASI_EFBIG = 22
const WASI_EHOSTUNREACH = 23
const WASI_EIDRM = 24
const WASI_EILSEQ = 25
const WASI_EINPROGRESS = 26
const WASI_EINTR = 27
const WASI_EINVAL = 28
const WASI_EIO = 29
const WASI_EISCONN = 30
const WASI_EISDIR = 31
const WASI_ELOOP = 32
const WASI_EMFILE = 33
const WASI_EMLINK = 34
const WASI_EMSGSIZE = 35
const WASI_EMULTIHOP = 36
const WASI_ENAMETOOLONG = 37
const WASI_ENETDOWN = 38
const WASI_ENETRESET = 39
const WASI_ENETUNREACH = 40
const WASI_ENFILE = 41
const WASI_ENOBUFS = 42
const WASI_ENODEV = 43
const WASI_ENOENT = 44
const WASI_ENOEXEC = 45
const WASI_ENOLCK = 46
const WASI_ENOLINK = 47
const WASI_ENOMEM = 48
const WASI_ENOMSG = 49
const WASI_ENOPROTOOPT = 50
const WASI_ENOSPC = 51
const WASI_ENOSYS = 52
const WASI_ENOTCONN = 53
const WASI_ENOTDIR = 54
const WASI_ENOTEMPTY = 55
const WASI_ENOTRECOVERABLE = 56
const WASI_ENOTSOCK = 57
const WASI_ENOTSUP = 58
const WASI_ENOTTY = 59
const WASI_ENXIO = 60
const WASI_EOVERFLOW = 61
const WASI_EOWNERDEAD = 62
const WASI_EPERM = 63
const WASI_EPIPE = 64
const WASI_EPROTO = 65
const WASI_EPROTONOSUPPORT = 66
const WASI_EPROTOTYPE = 67
const WASI_ERANGE = 68
const WASI_EROFS = 69
const WASI_ESPIPE = 70
const WASI_ESRCH = 71
const WASI_ESTALE = 72
const WASI_ETIMEDOUT = 73
const WASI_ETXTBSY = 74
const WASI_EXDEV = 75
const WASI_ENOTCAPABLE = 76

const WASI_SIGABRT = 0
const WASI_SIGALRM = 1
const WASI_SIGBUS = 2
const WASI_SIGCHLD = 3
const WASI_SIGCONT = 4
const WASI_SIGFPE = 5
const WASI_SIGHUP = 6
const WASI_SIGILL = 7
const WASI_SIGINT = 8
const WASI_SIGKILL = 9
const WASI_SIGPIPE = 10
const WASI_SIGQUIT = 11
const WASI_SIGSEGV = 12
const WASI_SIGSTOP = 13
const WASI_SIGTERM = 14
const WASI_SIGTRAP = 15
const WASI_SIGTSTP = 16
const WASI_SIGTTIN = 17
const WASI_SIGTTOU = 18
const WASI_SIGURG = 19
const WASI_SIGUSR1 = 20
const WASI_SIGUSR2 = 21
const WASI_SIGVTALRM = 22
const WASI_SIGXCPU = 23
const WASI_SIGXFSZ = 24

const WASI_FILETYPE_UNKNOWN = 0
const WASI_FILETYPE_BLOCK_DEVICE = 1
const WASI_FILETYPE_CHARACTER_DEVICE = 2
const WASI_FILETYPE_DIRECTORY = 3
const WASI_FILETYPE_REGULAR_FILE = 4
const WASI_FILETYPE_SOCKET_DGRAM = 5
const WASI_FILETYPE_SOCKET_STREAM = 6
const WASI_FILETYPE_SYMBOLIC_LINK = 7

const WASI_FDFLAG_APPEND = 0x0001
const WASI_FDFLAG_DSYNC = 0x0002
const WASI_FDFLAG_NONBLOCK = 0x0004
const WASI_FDFLAG_RSYNC = 0x0008
const WASI_FDFLAG_SYNC = 0x0010

const WASI_RIGHT_FD_DATASYNC = 0x0000000000000001n
const WASI_RIGHT_FD_READ = 0x0000000000000002n
const WASI_RIGHT_FD_SEEK = 0x0000000000000004n
const WASI_RIGHT_FD_FDSTAT_SET_FLAGS = 0x0000000000000008n
const WASI_RIGHT_FD_SYNC = 0x0000000000000010n
const WASI_RIGHT_FD_TELL = 0x0000000000000020n
const WASI_RIGHT_FD_WRITE = 0x0000000000000040n
const WASI_RIGHT_FD_ADVISE = 0x0000000000000080n
const WASI_RIGHT_FD_ALLOCATE = 0x0000000000000100n
const WASI_RIGHT_PATH_CREATE_DIRECTORY = 0x0000000000000200n
const WASI_RIGHT_PATH_CREATE_FILE = 0x0000000000000400n
const WASI_RIGHT_PATH_LINK_SOURCE = 0x0000000000000800n
const WASI_RIGHT_PATH_LINK_TARGET = 0x0000000000001000n
const WASI_RIGHT_PATH_OPEN = 0x0000000000002000n
const WASI_RIGHT_FD_READDIR = 0x0000000000004000n
const WASI_RIGHT_PATH_READLINK = 0x0000000000008000n
const WASI_RIGHT_PATH_RENAME_SOURCE = 0x0000000000010000n
const WASI_RIGHT_PATH_RENAME_TARGET = 0x0000000000020000n
const WASI_RIGHT_PATH_FILESTAT_GET = 0x0000000000040000n
const WASI_RIGHT_PATH_FILESTAT_SET_SIZE = 0x0000000000080000n
const WASI_RIGHT_PATH_FILESTAT_SET_TIMES = 0x0000000000100000n
const WASI_RIGHT_FD_FILESTAT_GET = 0x0000000000200000n
const WASI_RIGHT_FD_FILESTAT_SET_SIZE = 0x0000000000400000n
const WASI_RIGHT_FD_FILESTAT_SET_TIMES = 0x0000000000800000n
const WASI_RIGHT_PATH_SYMLINK = 0x0000000001000000n
const WASI_RIGHT_PATH_REMOVE_DIRECTORY = 0x0000000002000000n
const WASI_RIGHT_PATH_UNLINK_FILE = 0x0000000004000000n
const WASI_RIGHT_POLL_FD_READWRITE = 0x0000000008000000n
const WASI_RIGHT_SOCK_SHUTDOWN = 0x0000000010000000n

const RIGHTS_ALL =
  WASI_RIGHT_FD_DATASYNC |
  WASI_RIGHT_FD_READ |
  WASI_RIGHT_FD_SEEK |
  WASI_RIGHT_FD_FDSTAT_SET_FLAGS |
  WASI_RIGHT_FD_SYNC |
  WASI_RIGHT_FD_TELL |
  WASI_RIGHT_FD_WRITE |
  WASI_RIGHT_FD_ADVISE |
  WASI_RIGHT_FD_ALLOCATE |
  WASI_RIGHT_PATH_CREATE_DIRECTORY |
  WASI_RIGHT_PATH_CREATE_FILE |
  WASI_RIGHT_PATH_LINK_SOURCE |
  WASI_RIGHT_PATH_LINK_TARGET |
  WASI_RIGHT_PATH_OPEN |
  WASI_RIGHT_FD_READDIR |
  WASI_RIGHT_PATH_READLINK |
  WASI_RIGHT_PATH_RENAME_SOURCE |
  WASI_RIGHT_PATH_RENAME_TARGET |
  WASI_RIGHT_PATH_FILESTAT_GET |
  WASI_RIGHT_PATH_FILESTAT_SET_SIZE |
  WASI_RIGHT_PATH_FILESTAT_SET_TIMES |
  WASI_RIGHT_FD_FILESTAT_GET |
  WASI_RIGHT_FD_FILESTAT_SET_TIMES |
  WASI_RIGHT_FD_FILESTAT_SET_SIZE |
  WASI_RIGHT_PATH_SYMLINK |
  WASI_RIGHT_PATH_UNLINK_FILE |
  WASI_RIGHT_PATH_REMOVE_DIRECTORY |
  WASI_RIGHT_POLL_FD_READWRITE |
  WASI_RIGHT_SOCK_SHUTDOWN

const RIGHTS_BLOCK_DEVICE_BASE = RIGHTS_ALL
const RIGHTS_BLOCK_DEVICE_INHERITING = RIGHTS_ALL

const RIGHTS_CHARACTER_DEVICE_BASE = RIGHTS_ALL
const RIGHTS_CHARACTER_DEVICE_INHERITING = RIGHTS_ALL

const RIGHTS_REGULAR_FILE_BASE =
  WASI_RIGHT_FD_DATASYNC |
  WASI_RIGHT_FD_READ |
  WASI_RIGHT_FD_SEEK |
  WASI_RIGHT_FD_FDSTAT_SET_FLAGS |
  WASI_RIGHT_FD_SYNC |
  WASI_RIGHT_FD_TELL |
  WASI_RIGHT_FD_WRITE |
  WASI_RIGHT_FD_ADVISE |
  WASI_RIGHT_FD_ALLOCATE |
  WASI_RIGHT_FD_FILESTAT_GET |
  WASI_RIGHT_FD_FILESTAT_SET_SIZE |
  WASI_RIGHT_FD_FILESTAT_SET_TIMES |
  WASI_RIGHT_POLL_FD_READWRITE
const RIGHTS_REGULAR_FILE_INHERITING = 0n

const RIGHTS_DIRECTORY_BASE =
  WASI_RIGHT_FD_FDSTAT_SET_FLAGS |
  WASI_RIGHT_FD_SYNC |
  WASI_RIGHT_FD_ADVISE |
  WASI_RIGHT_PATH_CREATE_DIRECTORY |
  WASI_RIGHT_PATH_CREATE_FILE |
  WASI_RIGHT_PATH_LINK_SOURCE |
  WASI_RIGHT_PATH_LINK_TARGET |
  WASI_RIGHT_PATH_OPEN |
  WASI_RIGHT_FD_READDIR |
  WASI_RIGHT_PATH_READLINK |
  WASI_RIGHT_PATH_RENAME_SOURCE |
  WASI_RIGHT_PATH_RENAME_TARGET |
  WASI_RIGHT_PATH_FILESTAT_GET |
  WASI_RIGHT_PATH_FILESTAT_SET_SIZE |
  WASI_RIGHT_PATH_FILESTAT_SET_TIMES |
  WASI_RIGHT_FD_FILESTAT_GET |
  WASI_RIGHT_FD_FILESTAT_SET_TIMES |
  WASI_RIGHT_PATH_SYMLINK |
  WASI_RIGHT_PATH_UNLINK_FILE |
  WASI_RIGHT_PATH_REMOVE_DIRECTORY |
  WASI_RIGHT_POLL_FD_READWRITE
const RIGHTS_DIRECTORY_INHERITING = RIGHTS_DIRECTORY_BASE | RIGHTS_REGULAR_FILE_BASE

const RIGHTS_SOCKET_BASE =
  WASI_RIGHT_FD_READ |
  WASI_RIGHT_FD_FDSTAT_SET_FLAGS |
  WASI_RIGHT_FD_WRITE |
  WASI_RIGHT_FD_FILESTAT_GET |
  WASI_RIGHT_POLL_FD_READWRITE |
  WASI_RIGHT_SOCK_SHUTDOWN
const RIGHTS_SOCKET_INHERITING = RIGHTS_ALL

const RIGHTS_TTY_BASE =
  WASI_RIGHT_FD_READ |
  WASI_RIGHT_FD_FDSTAT_SET_FLAGS |
  WASI_RIGHT_FD_WRITE |
  WASI_RIGHT_FD_FILESTAT_GET |
  WASI_RIGHT_POLL_FD_READWRITE
const RIGHTS_TTY_INHERITING = 0n

const WASI_CLOCK_MONOTONIC = 0
const WASI_CLOCK_PROCESS_CPUTIME_ID = 1
const WASI_CLOCK_REALTIME = 2
const WASI_CLOCK_THREAD_CPUTIME_ID = 3

const WASI_EVENTTYPE_CLOCK = 0
const WASI_EVENTTYPE_FD_READ = 1
const WASI_EVENTTYPE_FD_WRITE = 2

const WASI_FILESTAT_SET_ATIM = 1 << 0
const WASI_FILESTAT_SET_ATIM_NOW = 1 << 1
const WASI_FILESTAT_SET_MTIM = 1 << 2
const WASI_FILESTAT_SET_MTIM_NOW = 1 << 3

const WASI_O_CREAT = 1 << 0
const WASI_O_DIRECTORY = 1 << 1
const WASI_O_EXCL = 1 << 2
const WASI_O_TRUNC = 1 << 3

const WASI_PREOPENTYPE_DIR = 0

const WASI_DIRCOOKIE_START = 0

const WASI_STDIN_FILENO = 0
const WASI_STDOUT_FILENO = 1
const WASI_STDERR_FILENO = 2

const WASI_WHENCE_CUR = 0
const WASI_WHENCE_END = 1
const WASI_WHENCE_SET = 2

// http://man7.org/linux/man-pages/man3/errno.3.html
const ERROR_MAP: { [key: string]: number } = {
  E2BIG: WASI_E2BIG,
  EACCES: WASI_EACCES,
  EADDRINUSE: WASI_EADDRINUSE,
  EADDRNOTAVAIL: WASI_EADDRNOTAVAIL,
  EAFNOSUPPORT: WASI_EAFNOSUPPORT,
  EALREADY: WASI_EALREADY,
  EAGAIN: WASI_EAGAIN,
  // EBADE: WASI_EBADE,
  EBADF: WASI_EBADF,
  // EBADFD: WASI_EBADFD,
  EBADMSG: WASI_EBADMSG,
  // EBADR: WASI_EBADR,
  // EBADRQC: WASI_EBADRQC,
  // EBADSLT: WASI_EBADSLT,
  EBUSY: WASI_EBUSY,
  ECANCELED: WASI_ECANCELED,
  ECHILD: WASI_ECHILD,
  // ECHRNG: WASI_ECHRNG,
  // ECOMM: WASI_ECOMM,
  ECONNABORTED: WASI_ECONNABORTED,
  ECONNREFUSED: WASI_ECONNREFUSED,
  ECONNRESET: WASI_ECONNRESET,
  EDEADLOCK: WASI_EDEADLK,
  EDESTADDRREQ: WASI_EDESTADDRREQ,
  EDOM: WASI_EDOM,
  EDQUOT: WASI_EDQUOT,
  EEXIST: WASI_EEXIST,
  EFAULT: WASI_EFAULT,
  EFBIG: WASI_EFBIG,
  EHOSTDOWN: WASI_EHOSTUNREACH,
  EHOSTUNREACH: WASI_EHOSTUNREACH,
  // EHWPOISON: WASI_EHWPOISON,
  EIDRM: WASI_EIDRM,
  EILSEQ: WASI_EILSEQ,
  EINPROGRESS: WASI_EINPROGRESS,
  EINTR: WASI_EINTR,
  EINVAL: WASI_EINVAL,
  EIO: WASI_EIO,
  EISCONN: WASI_EISCONN,
  EISDIR: WASI_EISDIR,
  // EISNAM: WASI_EISNAM,
  // EKEYEXPIRED: WASI_EKEYEXPIRED,
  // EKEYREJECTED: WASI_EKEYREJECTED,
  // EKEYREVOKED: WASI_EKEYREVOKED,
  // EL2HLT: WASI_EL2HLT,
  // EL2NSYNC: WASI_EL2NSYNC,
  // EL3HLT: WASI_EL3HLT,
  // EL3RST: WASI_EL3RST,
  // ELIBACC: WASI_ELIBACC,
  // ELIBBAD: WASI_ELIBBAD,
  // ELIBMAX: WASI_ELIBMAX,
  // ELIBSCN: WASI_ELIBSCN,
  // ELIBEXEC: WASI_ELIBEXEC,
  // ELNRANGE: WASI_ELNRANGE,
  ELOOP: WASI_ELOOP,
  // EMEDIUMTYPE: WASI_EMEDIUMTYPE,
  EMFILE: WASI_EMFILE,
  EMLINK: WASI_EMLINK,
  EMSGSIZE: WASI_EMSGSIZE,
  EMULTIHOP: WASI_EMULTIHOP,
  ENAMETOOLONG: WASI_ENAMETOOLONG,
  ENETDOWN: WASI_ENETDOWN,
  ENETRESET: WASI_ENETRESET,
  ENETUNREACH: WASI_ENETUNREACH,
  ENFILE: WASI_ENFILE,
  // ENOANO: WASI_ENOANO,
  ENOBUFS: WASI_ENOBUFS,
  // ENODATA: WASI_ENODATA,
  ENODEV: WASI_ENODEV,
  ENOENT: WASI_ENOENT,
  ENOEXEC: WASI_ENOEXEC,
  // ENOKEY: WASI_ENOKEY,
  ENOLCK: WASI_ENOLCK,
  ENOLINK: WASI_ENOLINK,
  // ENOMEDIUM: WASI_ENOMEDIUM,
  ENOMEM: WASI_ENOMEM,
  ENOMSG: WASI_ENOMSG,
  // ENONET: WASI_ENONET,
  // ENOPKG: WASI_ENOPKG,
  ENOPROTOOPT: WASI_ENOPROTOOPT,
  ENOSPC: WASI_ENOSPC,
  // ENOSR: WASI_ENOSR,
  // ENOSTR: WASI_ENOSTR,
  ENOSYS: WASI_ENOSYS,
  // ENOTBLK: WASI_ENOTBLK,
  ENOTCONN: WASI_ENOTCONN,
  ENOTDIR: WASI_ENOTDIR,
  ENOTEMPTY: WASI_ENOTEMPTY,
  ENOTRECOVERABLE: WASI_ENOTRECOVERABLE,
  ENOTSOCK: WASI_ENOTSOCK,
  ENOTTY: WASI_ENOTTY,
  // ENOTUNIQ: WASI_ENOTUNIQ,
  ENXIO: WASI_ENXIO,
  EOVERFLOW: WASI_EOVERFLOW,
  EOWNERDEAD: WASI_EOWNERDEAD,
  EPERM: WASI_EPERM,
  // EPFNOSUPPORT: WASI_EPFNOSUPPORT,
  EPIPE: WASI_EPIPE,
  EPROTO: WASI_EPROTO,
  EPROTONOSUPPORT: WASI_EPROTONOSUPPORT,
  EPROTOTYPE: WASI_EPROTOTYPE,
  ERANGE: WASI_ERANGE,
  // EREMCHG: WASI_EREMCHG,
  // EREMOTE: WASI_EREMOTE,
  // EREMOTEIO: WASI_EREMOTEIO,
  // ERESTART: WASI_ERESTART,
  // ERFKILL: WASI_ERFKILL,
  EROFS: WASI_EROFS,
  // ESHUTDOWN: WASI_ESHUTDOWN,
  ESPIPE: WASI_ESPIPE,
  // ESOCKTNOSUPPORT: WASI_ESOCKTNOSUPPORT,
  ESRCH: WASI_ESRCH,
  ESTALE: WASI_ESTALE,
  // ESTRPIPE: WASI_ESTRPIPE,
  // ETIME: WASI_ETIME,
  ETIMEDOUT: WASI_ETIMEDOUT,
  // ETOOMANYREFS: WASI_ETOOMANYREFS,
  ETXTBSY: WASI_ETXTBSY,
  // EUCLEAN: WASI_EUCLEAN,
  // EUNATCH: WASI_EUNATCH,
  // EUSERS: WASI_EUSERS,
  EXDEV: WASI_EXDEV
  // EXFULL: WASI_EXFULL,
}

const SIGNAL_MAP: { [key: string]: string } = {
  [WASI_SIGHUP]: 'SIGHUP',
  [WASI_SIGINT]: 'SIGINT',
  [WASI_SIGQUIT]: 'SIGQUIT',
  [WASI_SIGILL]: 'SIGILL',
  [WASI_SIGTRAP]: 'SIGTRAP',
  [WASI_SIGABRT]: 'SIGABRT',
  // [WASI_SIGIOT]: 'SIGIOT',
  [WASI_SIGBUS]: 'SIGBUS',
  [WASI_SIGFPE]: 'SIGFPE',
  [WASI_SIGKILL]: 'SIGKILL',
  [WASI_SIGUSR1]: 'SIGUSR1',
  [WASI_SIGSEGV]: 'SIGSEGV',
  [WASI_SIGUSR2]: 'SIGUSR2',
  [WASI_SIGPIPE]: 'SIGPIPE',
  [WASI_SIGALRM]: 'SIGALRM',
  [WASI_SIGTERM]: 'SIGTERM',
  [WASI_SIGCHLD]: 'SIGCHLD',
  [WASI_SIGCONT]: 'SIGCONT',
  [WASI_SIGSTOP]: 'SIGSTOP',
  [WASI_SIGTSTP]: 'SIGTSTP',
  [WASI_SIGTTIN]: 'SIGTTIN',
  [WASI_SIGTTOU]: 'SIGTTOU',
  [WASI_SIGURG]: 'SIGURG',
  [WASI_SIGXCPU]: 'SIGXCPU',
  [WASI_SIGXFSZ]: 'SIGXFSZ',
  [WASI_SIGVTALRM]: 'SIGVTALRM'
  // [WASI_SIGPROF]: 'SIGPROF',
  // [WASI_SIGWINCH]: 'SIGWINCH',
  // [WASI_SIGIO]: 'SIGIO',
  // [WASI_SIGINFO]: 'SIGINFO',
  // [WASI_SIGSYS]: 'SIGSYS',
}

const FS_CONSTANTS = {
  UV_FS_SYMLINK_DIR: 1,
  UV_FS_SYMLINK_JUNCTION: 2,
  O_RDONLY: 0,
  O_WRONLY: 1,
  O_RDWR: 2,
  UV_DIRENT_UNKNOWN: 0,
  UV_DIRENT_FILE: 1,
  UV_DIRENT_DIR: 2,
  UV_DIRENT_LINK: 3,
  UV_DIRENT_FIFO: 4,
  UV_DIRENT_SOCKET: 5,
  UV_DIRENT_CHAR: 6,
  UV_DIRENT_BLOCK: 7,
  S_IFMT: 61440,
  S_IFREG: 32768,
  S_IFDIR: 16384,
  S_IFCHR: 8192,
  S_IFBLK: 24576,
  S_IFIFO: 4096,
  S_IFLNK: 40960,
  S_IFSOCK: 49152,
  O_CREAT: 512,
  O_EXCL: 2048,
  O_NOCTTY: 131072,
  O_TRUNC: 1024,
  O_APPEND: 8,
  O_DIRECTORY: 1048576,
  O_NOFOLLOW: 256,
  O_SYNC: 128,
  O_DSYNC: 4194304,
  O_SYMLINK: 2097152,
  O_NONBLOCK: 4,
  S_IRWXU: 448,
  S_IRUSR: 256,
  S_IWUSR: 128,
  S_IXUSR: 64,
  S_IRWXG: 56,
  S_IRGRP: 32,
  S_IWGRP: 16,
  S_IXGRP: 8,
  S_IRWXO: 7,
  S_IROTH: 4,
  S_IWOTH: 2,
  S_IXOTH: 1,
  F_OK: 0,
  R_OK: 4,
  W_OK: 2,
  X_OK: 1,
  UV_FS_COPYFILE_EXCL: 1,
  COPYFILE_EXCL: 1,
  UV_FS_COPYFILE_FICLONE: 2,
  COPYFILE_FICLONE: 2,
  UV_FS_COPYFILE_FICLONE_FORCE: 4,
  COPYFILE_FICLONE_FORCE: 4
}

const msToNs = (ms: number) => {
  const msInt = Math.trunc(ms)
  const decimal = BigInt(Math.round((ms - msInt) * 1000))
  const ns = BigInt(msInt) * 1000n
  return ns + decimal
}

const wrap = <T extends Function>(f: T) => (...args: any[]) => {
  try {
    return f(...args)
  } catch (e) {
    if (typeof e === 'number') {
      return e
    }
    if (e.errno) {
      return ERROR_MAP[e.code] || WASI_EINVAL
    }
    throw e
  }
}

const stat = (wasi: WASI, fd: number): File => {
  const entry = wasi.FD_MAP.get(fd)
  if (!entry) {
    throw WASI_EBADF
  }
  if (entry.filetype === undefined) {
    const stats = wasi.bindings.fs.fstatSync(entry.real)
    let filetype
    let rightsBase
    let rightsInheriting
    switch (true) {
      case stats.isBlockDevice():
        filetype = WASI_FILETYPE_BLOCK_DEVICE
        rightsBase = RIGHTS_BLOCK_DEVICE_BASE
        rightsInheriting = RIGHTS_BLOCK_DEVICE_INHERITING
        break
      case stats.isCharacterDevice(): {
        filetype = WASI_FILETYPE_CHARACTER_DEVICE
        if (wasi.bindings.isTTY(fd)) {
          rightsBase = RIGHTS_TTY_BASE
          rightsInheriting = RIGHTS_TTY_INHERITING
        } else {
          rightsBase = RIGHTS_CHARACTER_DEVICE_BASE
          rightsInheriting = RIGHTS_CHARACTER_DEVICE_INHERITING
        }
        break
      }
      case stats.isDirectory():
        filetype = WASI_FILETYPE_DIRECTORY
        rightsBase = RIGHTS_DIRECTORY_BASE
        rightsInheriting = RIGHTS_DIRECTORY_INHERITING
        break
      case stats.isFIFO():
        filetype = WASI_FILETYPE_SOCKET_STREAM
        rightsBase = RIGHTS_SOCKET_BASE
        rightsInheriting = RIGHTS_SOCKET_INHERITING
        break
      case stats.isFile():
        filetype = WASI_FILETYPE_REGULAR_FILE
        rightsBase = RIGHTS_REGULAR_FILE_BASE
        rightsInheriting = RIGHTS_REGULAR_FILE_INHERITING
        break
      case stats.isSocket():
        filetype = WASI_FILETYPE_SOCKET_STREAM
        rightsBase = RIGHTS_SOCKET_BASE
        rightsInheriting = RIGHTS_SOCKET_INHERITING
        break
      case stats.isSymbolicLink():
        filetype = WASI_FILETYPE_SYMBOLIC_LINK
        break
      default:
        filetype = WASI_FILETYPE_UNKNOWN
        break
    }
    entry.filetype = filetype
    if (entry.rights === undefined) {
      entry.rights = {
        base: rightsBase as bigint,
        inheriting: rightsInheriting
      }
    }
  }
  return entry
}

interface Rights {
  base: bigint
  inheriting?: any
}

interface File {
  real: number
  filetype?: any
  rights: Rights
  path?: any
  fakePath?: any
}

type Exports = {
  [key: string]: any
}

type TypedArray = ArrayLike<any> & {
  BYTES_PER_ELEMENT: number
  set(array: ArrayLike<number>, offset?: number): void
  slice(start?: number, end?: number): TypedArray
}

type WASIBindings = {
  // Current high-resolution real time in a bigint
  hrtime: () => bigint
  // Process functions
  exit: (rval: number) => void
  kill: (signal: string) => void
  // Crypto functions
  randomFillSync: <T>(buffer: T, offset: number, size: number) => T
  // isTTY
  isTTY: (fd: number) => boolean

  // Filesystem
  fs: any
}

type WASIArgs = string[]
type WASIEnv = { [key: string]: string | undefined }
type WASIPreopenedDirs = { [key: string]: string }
type WASIConfig = {
  preopenDirectories: WASIPreopenedDirs
  env: WASIEnv
  args: WASIArgs
  bindings: WASIBindings
}

const WASINodeBindings = {
  hrtime: process.hrtime.bigint,
  exit: process.exit,
  kill: (signal: string) => {
    process.kill(process.pid, signal)
  },
  randomFillSync: crypto.randomFillSync,
  isTTY: isTTY,
  fs: fs_node
}

class WASI {
  static defaultConfig = {
    // https://github.com/WebAssembly/WASI/issues/5
    preopenDirectories: {},
    args: process.argv,
    env: process.env,
    bindings: WASINodeBindings
  }

  memory: WebAssembly.Memory
  view: DataView
  FD_MAP: Map<number, File>
  exports: Exports
  bindings: WASIBindings

  constructor({
    preopenDirectories = {},
    env = {},
    args = [],
    bindings = WASINodeBindings
  }: WASIConfig) {
    // @ts-ignore
    this.memory = undefined
    // @ts-ignore
    this.view = undefined
    this.bindings = bindings

    this.FD_MAP = new Map([
      [
        WASI_STDIN_FILENO,
        {
          real: 0,
          filetype: undefined,
          rights: {
            base: RIGHTS_REGULAR_FILE_BASE
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
            base: RIGHTS_REGULAR_FILE_BASE
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
            base: RIGHTS_REGULAR_FILE_BASE
          },
          path: undefined
        }
      ]
    ])

    let fs = this.bindings.fs

    for (const [k, v] of Object.entries(preopenDirectories)) {
      const real = fs.openSync(v, fs.constants.O_RDONLY)
      const newfd = [...this.FD_MAP.keys()].reverse()[0] + 1
      this.FD_MAP.set(newfd, {
        real,
        filetype: WASI_FILETYPE_DIRECTORY,
        rights: {
          base: RIGHTS_DIRECTORY_BASE,
          inheriting: RIGHTS_DIRECTORY_INHERITING
        },
        fakePath: k,
        path: v
      })
    }

    const getiovs = (iovs: number, iovsLen: number) => {
      // iovs* -> [iov, iov, ...]
      // __wasi_ciovec_t {
      //   void* buf,
      //   size_t buf_len,
      // }

      this.refreshMemory()

      const buffers = Array.from({ length: iovsLen }, (_, i) => {
        const ptr = iovs + i * 8
        const buf = this.view.getUint32(ptr, true)
        const bufLen = this.view.getUint32(ptr + 4, true)
        return new Uint8Array(this.memory.buffer, buf, bufLen)
      })

      return buffers
    }

    const CHECK_FD = (fd: number, rights: bigint) => {
      const stats = stat(this, fd)
      if (rights !== 0n && (stats.rights.base & rights) === 0n) {
        throw WASI_EPERM
      }
      return stats
    }
    const CPUTIME_START = bindings.hrtime()

    const now = (clockId: number) => {
      switch (clockId) {
        case WASI_CLOCK_MONOTONIC:
        case WASI_CLOCK_REALTIME:
          return bindings.hrtime()
        case WASI_CLOCK_PROCESS_CPUTIME_ID:
        case WASI_CLOCK_THREAD_CPUTIME_ID:
          // return bindings.hrtime(CPUTIME_START)
          return bindings.hrtime() - CPUTIME_START
        default:
          return null
      }
    }

    this.exports = {
      args_get: (argv: number, argvBuf: number) => {
        this.refreshMemory()
        let coffset = argv
        let offset = argvBuf
        args.forEach(a => {
          this.view.setUint32(coffset, offset, true)
          coffset += 4
          offset += Buffer.from(this.memory.buffer).write(`${a}\0`, offset)
        })
        return WASI_ESUCCESS
      },
      args_sizes_get: (argc: number, argvBufSize: number) => {
        this.refreshMemory()
        this.view.setUint32(argc, args.length, true)
        const size = args.reduce((acc, a) => acc + Buffer.byteLength(a) + 1, 0)
        this.view.setUint32(argvBufSize, size, true)
        return WASI_ESUCCESS
      },
      environ_get: (environ: number, environBuf: number) => {
        this.refreshMemory()
        let coffset = environ
        let offset = environBuf
        const envProcessed = Object.entries(env).map(([key, value]) => `${key}=${value}`)
        envProcessed.forEach(e => {
          this.view.setUint32(coffset, offset, true)
          coffset += 4
          offset += Buffer.from(this.memory.buffer).write(e, offset)
        })
        return WASI_ESUCCESS
      },
      environ_sizes_get: (environCount: number, environBufSize: number) => {
        this.refreshMemory()
        const envProcessed = Object.entries(env).map(([key, value]) => `${key}=${value}`)
        const size = envProcessed.reduce((acc, e) => acc + Buffer.byteLength(e), 0)
        this.view.setUint32(environCount, envProcessed.length, true)
        this.view.setUint32(environBufSize, size, true)
        return WASI_ESUCCESS
      },
      clock_res_get: (clockId: number, resolution: number) => {
        this.view.setBigUint64(resolution, 0n)
        return WASI_ESUCCESS
      },
      clock_time_get: (clockId: number, precision: number, time: number) => {
        const n = now(clockId)
        if (n === null) {
          return WASI_EINVAL
        }
        this.view.setBigUint64(time, n, true)
        return WASI_ESUCCESS
      },
      fd_advise: wrap((fd: number, offset: number, len: number, advice: number) => {
        CHECK_FD(fd, WASI_RIGHT_FD_ADVISE)
        return WASI_ENOSYS
      }),
      fd_allocate: wrap((fd: number, offset: number, len: number) => {
        CHECK_FD(fd, WASI_RIGHT_FD_ALLOCATE)
        return WASI_ENOSYS
      }),
      fd_close: wrap((fd: number) => {
        const stats = CHECK_FD(fd, 0n)
        fs.closeSync(stats.real)
        this.FD_MAP.delete(fd)
        return WASI_ESUCCESS
      }),
      fd_datasync: (fd: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_DATASYNC)
        fs.fdatasyncSync(stats.real)
        return WASI_ESUCCESS
      },
      fd_fdstat_get: wrap((fd: number, bufPtr: number) => {
        const stats = CHECK_FD(fd, 0n)
        this.refreshMemory()
        this.view.setUint8(bufPtr, stats.filetype) // FILETYPE u8
        this.view.setUint16(bufPtr + 2, 0, true) // FDFLAG u16
        this.view.setUint16(bufPtr + 4, 0, true) // FDFLAG u16
        this.view.setBigUint64(bufPtr + 8, stats.rights.base, true) // u64
        this.view.setBigUint64(bufPtr + 8 + 8, stats.rights.inheriting, true) // u64
        return WASI_ESUCCESS
      }),
      fd_fdstat_set_flags: wrap((fd: number, flags: number) => {
        CHECK_FD(fd, WASI_RIGHT_FD_FDSTAT_SET_FLAGS)
        return WASI_ENOSYS
      }),
      fd_fdstat_set_rights: wrap((fd: number, fsRightsBase: bigint, fsRightsInheriting: bigint) => {
        const stats = CHECK_FD(fd, 0n)
        const nrb = stats.rights.base | fsRightsBase
        if (nrb > stats.rights.base) {
          return WASI_EPERM
        }
        const nri = stats.rights.inheriting | fsRightsInheriting
        if (nri > stats.rights.inheriting) {
          return WASI_EPERM
        }
        stats.rights.base = nrb
        stats.rights.inheriting = nri
        return WASI_ESUCCESS
      }),
      fd_filestat_get: wrap((fd: number, bufPtr: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_FILESTAT_GET)
        const rstats = fs.fstatSync(stats.real)
        this.refreshMemory()
        this.view.setBigUint64(bufPtr, BigInt(rstats.dev), true)
        bufPtr += 8
        this.view.setBigUint64(bufPtr, BigInt(rstats.ino), true)
        bufPtr += 8
        this.view.setUint8(bufPtr, stats.filetype)
        bufPtr += 4
        this.view.setUint32(bufPtr, Number(rstats.nlink), true)
        bufPtr += 4
        this.view.setBigUint64(bufPtr, BigInt(rstats.size), true)
        bufPtr += 8
        this.view.setBigUint64(bufPtr, msToNs(rstats.atimeMs), true)
        bufPtr += 8
        this.view.setBigUint64(bufPtr, msToNs(rstats.mtimeMs), true)
        bufPtr += 8
        this.view.setBigUint64(bufPtr, msToNs(rstats.ctimeMs), true)
        bufPtr += 8
        return WASI_ESUCCESS
      }),
      fd_filestat_set_size: wrap((fd: number, stSize: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_FILESTAT_SET_SIZE)
        fs.ftruncate(stats.real, Number(stSize))
        return WASI_ESUCCESS
      }),
      fd_filestat_set_times: wrap(
        (fd: number, stAtim: number, stMtim: number, fstflags: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_FILESTAT_SET_TIMES)
          const n = now(WASI_CLOCK_REALTIME)
          const atimNow = (fstflags & WASI_FILESTAT_SET_ATIM_NOW) === WASI_FILESTAT_SET_ATIM_NOW
          const mtimNow = (fstflags & WASI_FILESTAT_SET_MTIM_NOW) === WASI_FILESTAT_SET_MTIM_NOW
          fs.futimesSync(stats.real, atimNow ? n : stAtim, mtimNow ? n : stMtim)
          return WASI_ESUCCESS
        }
      ),
      fd_prestat_get: wrap((fd: number, bufPtr: number) => {
        const stats = CHECK_FD(fd, 0n)
        if (!stats.path) {
          return WASI_EINVAL
        }
        this.refreshMemory()
        this.view.setUint8(bufPtr, WASI_PREOPENTYPE_DIR)
        this.view.setUint32(bufPtr + 4, Buffer.byteLength(stats.fakePath), true)
        return WASI_ESUCCESS
      }),
      fd_prestat_dir_name: wrap((fd: number, pathPtr: number, pathLen: number) => {
        const stats = CHECK_FD(fd, 0n)
        if (!stats.path) {
          return WASI_EINVAL
        }
        this.refreshMemory()
        Buffer.from(this.memory.buffer).write(stats.fakePath, pathPtr, pathLen, 'utf8')
        return WASI_ESUCCESS
      }),
      fd_pwrite: wrap(
        (fd: number, iovs: number, iovsLen: number, offset: number, nwritten: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_WRITE | WASI_RIGHT_FD_SEEK)
          let written = 0
          getiovs(iovs, iovsLen).forEach(iov => {
            let w = 0
            while (w < iov.byteLength) {
              w += fs.writeSync(stats.real, iov, w, iov.byteLength - w, offset + written + w)
            }
            written += w
          })
          this.view.setUint32(nwritten, written, true)
          return WASI_ESUCCESS
        }
      ),
      fd_write: wrap((fd: number, iovs: number, iovsLen: number, nwritten: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_WRITE)
        let written = 0
        getiovs(iovs, iovsLen).forEach(iov => {
          let w = 0
          while (w < iov.byteLength) {
            // console.log("FD WRITE", stats.real, iov, w, iov.byteLength - w, 0);
            w += fs.writeSync(stats.real, iov, w, iov.byteLength - w)
          }
          written += w
        })
        this.view.setUint32(nwritten, written, true)
        return WASI_ESUCCESS
      }),
      fd_pread: wrap((fd: number, iovs: number, iovsLen: number, offset: number, nread: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_READ | WASI_RIGHT_FD_SEEK)
        let read = 0
        getiovs(iovs, iovsLen).forEach(iov => {
          let r = 0
          while (r < iov.byteLength) {
            r += fs.readSync(stats.real, iov, r, iov.byteLength - r, offset + read + r)
          }
          read += r
        })
        this.view.setUint32(nread, read, true)
        return WASI_ESUCCESS
      }),
      fd_read: wrap((fd: number, iovs: number, iovsLen: number, nread: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_READ)
        let read = 0
        outer: for (const iov of getiovs(iovs, iovsLen)) {
          let r = 0
          while (r < iov.byteLength) {
            const rr = fs.readSync(stats.real, iov, r, iov.byteLength - r)
            r += rr
            read += rr
            if (rr === 0) {
              break outer
            }
          }
        }
        this.view.setUint32(nread, read, true)
        return WASI_ESUCCESS
      }),
      fd_readdir: wrap(
        (fd: number, bufPtr: number, bufLen: number, cookie: number, bufusedPtr: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_FD_READDIR)
          this.refreshMemory()
          const entries = fs.readdirSync(stats.path, { withFileTypes: true })
          const startPtr = bufPtr
          for (let i = Number(cookie); i < entries.length; i += 1) {
            const entry = entries[i]
            this.view.setBigUint64(bufPtr, BigInt(i + 1), true)
            bufPtr += 8
            const rstats = fs.statSync(path.resolve(stats.path, entry.name))
            this.view.setBigUint64(bufPtr, BigInt(rstats.ino), true)
            bufPtr += 8
            this.view.setUint32(bufPtr, Buffer.byteLength(entry.name), true)
            bufPtr += 4
            let filetype
            switch (true) {
              case rstats.isBlockDevice():
                filetype = WASI_FILETYPE_BLOCK_DEVICE
                break
              case rstats.isCharacterDevice():
                filetype = WASI_FILETYPE_CHARACTER_DEVICE
                break
              case rstats.isDirectory():
                filetype = WASI_FILETYPE_DIRECTORY
                break
              case rstats.isFIFO():
                filetype = WASI_FILETYPE_SOCKET_STREAM
                break
              case rstats.isFile():
                filetype = WASI_FILETYPE_REGULAR_FILE
                break
              case rstats.isSocket():
                filetype = WASI_FILETYPE_SOCKET_STREAM
                break
              case rstats.isSymbolicLink():
                filetype = WASI_FILETYPE_SYMBOLIC_LINK
                break
              default:
                filetype = WASI_FILETYPE_UNKNOWN
                break
            }
            this.view.setUint8(bufPtr, filetype)
            bufPtr += 1
            bufPtr += 3 // padding
            Buffer.from(this.memory.buffer).write(entry.name, bufPtr, bufLen - bufPtr)
            bufPtr += Buffer.byteLength(entry.name)
            bufPtr += 8 % bufPtr // padding
          }
          const bufused = bufPtr - startPtr
          this.view.setUint32(bufusedPtr, bufused, true)
          return WASI_ESUCCESS
        }
      ),
      fd_renumber: wrap((from: number, to: number) => {
        CHECK_FD(from, 0n)
        CHECK_FD(to, 0n)
        fs.closeSync((this.FD_MAP.get(from) as File).real)
        this.FD_MAP.set(from, this.FD_MAP.get(to) as File)
        this.FD_MAP.delete(to)
        return WASI_ESUCCESS
      }),
      fd_seek: wrap((fd: number, offset: number, whence: number, newOffsetPtr: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_SEEK)
        throw new Error('fd_seek to be implemented (without binding)')
        // const newOffset = binding.seek(
        //   stats.real,
        //   offset,
        //   {
        //     [WASI_WHENCE_CUR]: SEEK_CUR,
        //     [WASI_WHENCE_END]: SEEK_END,
        //     [WASI_WHENCE_SET]: SEEK_SET
        //   }[whence]
        // )
        // if (typeof newOffset === 'number') {
        //   // errno
        //   throw newOffset
        // }
        // this.refreshMemory()
        // this.view.setBigUint64(newOffsetPtr, newOffset, true)
        // return WASI_ESUCCESS
      }),
      fd_tell: wrap((fd: number, offsetPtr: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_TELL)
        throw new Error('fd_tell to be implemented (without binding)')
        // const currentOffset = binding.seek(stats.real, 0n, SEEK_CUR)
        // if (typeof currentOffset === 'number') {
        //   // errno
        //   throw currentOffset
        // }
        // this.refreshMemory()
        // this.view.setBigUint64(offsetPtr, currentOffset, true)
        // return WASI_ESUCCESS
      }),
      fd_sync: wrap((fd: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_FD_SYNC)
        fs.fsyncSync(stats.real)
        return WASI_ESUCCESS
      }),
      path_create_directory: wrap((fd: number, pathPtr: number, pathLen: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_PATH_CREATE_DIRECTORY)
        if (!stats.path) {
          return WASI_EINVAL
        }
        this.refreshMemory()
        const p = Buffer.from(this.memory.buffer, pathPtr, pathLen).toString()
        fs.mkdirSync(path.resolve(stats.path, p))
        return WASI_ESUCCESS
      }),
      path_filestat_get: wrap(
        (fd: number, flags: number, pathPtr: number, pathLen: number, bufPtr: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_FILESTAT_GET)
          if (!stats.path) {
            return WASI_EINVAL
          }
          this.refreshMemory()
          const p = Buffer.from(this.memory.buffer, pathPtr, pathLen).toString()
          const rstats = fs.statSync(path.resolve(stats.path, p))
          this.view.setBigUint64(bufPtr, BigInt(rstats.dev), true)
          bufPtr += 8
          this.view.setBigUint64(bufPtr, BigInt(rstats.ino), true)
          bufPtr += 8
          this.view.setUint8(bufPtr, stats.filetype)
          bufPtr += 4
          this.view.setUint32(bufPtr, Number(rstats.nlink), true)
          bufPtr += 4
          this.view.setBigUint64(bufPtr, BigInt(rstats.size), true)
          bufPtr += 8
          this.view.setBigUint64(bufPtr, msToNs(rstats.atimeMs), true)
          bufPtr += 8
          this.view.setBigUint64(bufPtr, msToNs(rstats.mtimeMs), true)
          bufPtr += 8
          this.view.setBigUint64(bufPtr, msToNs(rstats.ctimeMs), true)
          bufPtr += 8
          return WASI_ESUCCESS
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
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_FILESTAT_SET_TIMES)
          if (!stats.path) {
            return WASI_EINVAL
          }
          this.refreshMemory()
          const n = now(WASI_CLOCK_REALTIME)
          const atimNow = (fstflags & WASI_FILESTAT_SET_ATIM_NOW) === WASI_FILESTAT_SET_ATIM_NOW
          const mtimNow = (fstflags & WASI_FILESTAT_SET_MTIM_NOW) === WASI_FILESTAT_SET_MTIM_NOW
          const p = Buffer.from(this.memory.buffer, pathPtr, pathLen).toString()
          fs.utimesSync(path.resolve(stats.path, p), atimNow ? n : stAtim, mtimNow ? n : stMtim)
          return WASI_ESUCCESS
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
          const ostats = CHECK_FD(oldFd, WASI_RIGHT_PATH_LINK_SOURCE)
          const nstats = CHECK_FD(newFd, WASI_RIGHT_PATH_LINK_TARGET)
          if (!ostats.path || !nstats.path) {
            return WASI_EINVAL
          }
          this.refreshMemory()
          const op = Buffer.from(this.memory.buffer, oldPath, oldPathLen).toString()
          const np = Buffer.from(this.memory.buffer, newPath, newPathLen).toString()
          fs.linkSync(path.resolve(ostats.path, op), path.resolve(nstats.path, np))
          return WASI_ESUCCESS
        }
      ),
      path_open: wrap(
        (
          dirfd: number,
          dirflags: number,
          pathPtr: number,
          pathLen: number,
          oflags: number,
          fsRightsBase: bigint,
          fsRightsInheriting: bigint,
          fsFlags: number,
          fd: number
        ) => {
          const stats = CHECK_FD(dirfd, WASI_RIGHT_PATH_OPEN)

          const read = (fsRightsBase & (WASI_RIGHT_FD_READ | WASI_RIGHT_FD_READDIR)) !== 0n
          const write =
            (fsRightsBase &
              (WASI_RIGHT_FD_DATASYNC |
                WASI_RIGHT_FD_WRITE |
                WASI_RIGHT_FD_ALLOCATE |
                WASI_RIGHT_FD_FILESTAT_SET_SIZE)) !==
            0n

          let noflags
          if (write && read) {
            noflags = fs.constants.O_RDWR
          } else if (read) {
            noflags = fs.constants.O_RDONLY
          } else if (write) {
            noflags = fs.constants.O_WRONLY
          }

          let neededBase = WASI_RIGHT_PATH_OPEN
          let neededInheriting = fsRightsBase | fsRightsInheriting

          if ((oflags & WASI_O_CREAT) !== 0) {
            noflags |= fs.constants.O_CREAT
            neededBase |= WASI_RIGHT_PATH_CREATE_FILE
          }
          if ((oflags & WASI_O_DIRECTORY) !== 0) {
            noflags |= fs.constants.O_DIRECTORY
          }
          if ((oflags & WASI_O_EXCL) !== 0) {
            noflags |= fs.constants.O_EXCL
          }
          if ((oflags & WASI_O_TRUNC) !== 0) {
            noflags |= fs.constants.O_TRUNC
            neededBase |= WASI_RIGHT_PATH_FILESTAT_SET_SIZE
          }

          // Convert file descriptor flags.
          if ((fsFlags & WASI_FDFLAG_APPEND) !== 0) {
            noflags |= fs.constants.O_APPEND
          }
          if ((fsFlags & WASI_FDFLAG_DSYNC) !== 0) {
            if (fs.constants.O_DSYNC) {
              noflags |= fs.constants.O_DSYNC
            } else {
              noflags |= fs.constants.O_SYNC
            }
            neededInheriting |= WASI_RIGHT_FD_DATASYNC
          }
          if ((fsFlags & WASI_FDFLAG_NONBLOCK) !== 0) {
            noflags |= fs.constants.O_NONBLOCK
          }
          if ((fsFlags & WASI_FDFLAG_RSYNC) !== 0) {
            if (fs.constants.O_RSYNC) {
              noflags |= fs.constants.O_RSYNC
            } else {
              noflags |= fs.constants.O_SYNC
            }
            neededInheriting |= WASI_RIGHT_FD_SYNC
          }
          if ((fsFlags & WASI_FDFLAG_SYNC) !== 0) {
            noflags |= fs.constants.O_SYNC
            neededInheriting |= WASI_RIGHT_FD_SYNC
          }
          if (write && (noflags & (fs.constants.O_APPEND | fs.constants.O_TRUNC)) === 0) {
            neededInheriting |= WASI_RIGHT_FD_SEEK
          }

          this.refreshMemory()
          const p = Buffer.from(this.memory.buffer, pathPtr, pathLen).toString()
          const fullUnresolved = path.resolve(stats.path, p)
          if (path.relative(stats.path, fullUnresolved).startsWith('..')) {
            return WASI_ENOTCAPABLE
          }
          let full
          try {
            full = fs.realpathSync(fullUnresolved)
            if (path.relative(stats.path, full).startsWith('..')) {
              return WASI_ENOTCAPABLE
            }
          } catch (e) {
            if (e.code === 'ENOENT') {
              full = fullUnresolved
            } else {
              throw e
            }
          }
          const realfd = fs.openSync(full, noflags)

          const newfd = [...this.FD_MAP.keys()].reverse()[0] + 1
          this.FD_MAP.set(newfd, {
            real: realfd,
            filetype: undefined,
            rights: {
              base: neededBase,
              inheriting: neededInheriting
            },
            path: full
          })
          stat(this, newfd)
          this.view.setUint32(fd, newfd, true)

          return WASI_ESUCCESS
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
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_READLINK)
          if (!stats.path) {
            return WASI_EINVAL
          }
          this.refreshMemory()
          const p = Buffer.from(this.memory.buffer, pathPtr, pathLen).toString()
          const full = path.resolve(stats.path, p)
          const r = fs.readlinkSync(full)
          const used = Buffer.from(this.memory.buffer).write(r, buf, bufLen)
          this.view.setUint32(bufused, used, true)
          return WASI_ESUCCESS
        }
      ),
      path_remove_directory: wrap((fd: number, pathPtr: number, pathLen: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_PATH_REMOVE_DIRECTORY)
        if (!stats.path) {
          return WASI_EINVAL
        }
        this.refreshMemory()
        const p = Buffer.from(this.memory.buffer, pathPtr, pathLen).toString()
        fs.rmdirSync(path.resolve(stats.path, p))
        return WASI_ESUCCESS
      }),
      path_rename: wrap(
        (
          oldFd: number,
          oldPath: number,
          oldPathLen: number,
          newFd: number,
          newPath: number,
          newPathLen: number
        ) => {
          const ostats = CHECK_FD(oldFd, WASI_RIGHT_PATH_RENAME_SOURCE)
          const nstats = CHECK_FD(newFd, WASI_RIGHT_PATH_RENAME_TARGET)
          if (!ostats.path || !nstats.path) {
            return WASI_EINVAL
          }
          this.refreshMemory()
          const op = Buffer.from(this.memory.buffer, oldPath, oldPathLen).toString()
          const np = Buffer.from(this.memory.buffer, newPath, newPathLen).toString()
          fs.renameSync(path.resolve(ostats.path, op), path.resolve(nstats.path, np))
          return WASI_ESUCCESS
        }
      ),
      path_symlink: wrap(
        (oldPath: number, oldPathLen: number, fd: number, newPath: number, newPathLen: number) => {
          const stats = CHECK_FD(fd, WASI_RIGHT_PATH_SYMLINK)
          if (!stats.path) {
            return WASI_EINVAL
          }
          this.refreshMemory()
          const op = Buffer.from(this.memory.buffer, oldPath, oldPathLen).toString()
          const np = Buffer.from(this.memory.buffer, newPath, newPathLen).toString()
          fs.symlinkSync(op, path.resolve(stats.path, np))
          return WASI_ESUCCESS
        }
      ),
      path_unlink_file: wrap((fd: number, pathPtr: number, pathLen: number) => {
        const stats = CHECK_FD(fd, WASI_RIGHT_PATH_UNLINK_FILE)
        if (!stats.path) {
          return WASI_EINVAL
        }
        this.refreshMemory()
        const p = Buffer.from(this.memory.buffer, pathPtr, pathLen).toString()
        fs.unlinkSync(path.resolve(stats.path, p))
        return WASI_ESUCCESS
      }),
      poll_oneoff: (sin: number, sout: number, nsubscriptions: number, nevents: number) => {
        let eventc = 0
        let waitEnd = 0
        this.refreshMemory()
        for (let i = 0; i < nsubscriptions; i += 1) {
          const userdata = this.view.getBigUint64(sin, true)
          sin += 8
          const type = this.view.getUint8(sin)
          sin += 1
          switch (type) {
            case WASI_EVENTTYPE_CLOCK: {
              sin += 7 // padding
              const identifier = this.view.getBigUint64(sin, true)
              sin += 8
              const clockid = this.view.getUint32(sin, true)
              sin += 4
              sin += 4 // padding
              const timestamp = this.view.getBigUint64(sin, true)
              sin += 8
              const precision = this.view.getBigUint64(sin, true)
              sin += 8
              const subclockflags = this.view.getUint16(sin, true)
              sin += 2
              sin += 6 // padding

              const absolute = subclockflags === 1

              let e = WASI_ESUCCESS
              const n = now(clockid)
              if (n === null) {
                e = WASI_EINVAL
              } else {
                const end = absolute ? timestamp : n + timestamp
                waitEnd = end > waitEnd ? ((end as unknown) as number) : waitEnd
              }

              this.view.setBigUint64(sout, userdata, true)
              sout += 8
              this.view.setUint16(sout, e, true) // error
              sout += 2 // pad offset 2
              this.view.setUint8(sout, WASI_EVENTTYPE_CLOCK)
              sout += 1 // pad offset 3
              sout += 5 // padding to 8

              eventc += 1

              break
            }
            case WASI_EVENTTYPE_FD_READ:
            case WASI_EVENTTYPE_FD_WRITE: {
              sin += 3 // padding
              const fd = this.view.getUint32(sin, true)
              sin += 4

              this.view.setBigUint64(sout, userdata, true)
              sout += 8
              this.view.setUint16(sout, WASI_ENOSYS, true) // error
              sout += 2 // pad offset 2
              this.view.setUint8(sout, type)
              sout += 1 // pad offset 3
              sout += 5 // padding to 8

              eventc += 1

              break
            }
            default:
              return WASI_EINVAL
          }
        }

        this.view.setUint32(nevents, eventc, true)

        while (bindings.hrtime() < waitEnd) {
          // nothing
        }

        return WASI_ESUCCESS
      },
      proc_exit: (rval: number) => {
        bindings.exit(rval)
        return WASI_ESUCCESS
      },
      proc_raise: (sig: number) => {
        if (!(sig in SIGNAL_MAP)) {
          return WASI_EINVAL
        }
        bindings.kill(SIGNAL_MAP[sig])
        return WASI_ESUCCESS
      },
      random_get: (bufPtr: number, bufLen: number) => {
        this.refreshMemory()
        bindings.randomFillSync(new Uint8Array(this.memory.buffer), bufPtr, bufLen)
        return WASI_ESUCCESS
      },
      sched_yield() {
        // Single threaded environment
        return WASI_ENOSYS
      },
      sock_recv() {
        return WASI_ENOSYS
      },
      sock_send() {
        return WASI_ENOSYS
      },
      sock_shutdown() {
        return WASI_ENOSYS
      }
    }
  }

  refreshMemory() {
    if (this.view === undefined || this.view.byteLength === 0) {
      this.view = new DataView(this.memory.buffer)
    }
  }

  setMemory(memory: WebAssembly.Memory) {
    this.memory = memory
  }
}

export default WASI
