const fs = require('fs');
const { default: init, WASI, MemFS } = require('../dist/lib.cjs');

let handles;
let stdout;
let stderr;

const Decoder = () => new TextDecoderStream('utf-8', { ignoreBOM: true, fatal: false });
async function Wasi(config, stdin) {
  let wasi = new WASI(config);
  handles.push(wasi.stdout.pipeThrough(Decoder()).pipeTo(new WritableStream({ write(chunk) { stdout += chunk; } })));
  handles.push(wasi.stderr.pipeThrough(Decoder()).pipeTo(new WritableStream({ write(chunk) { stderr += chunk; } })));
  if (stdin) {
    const encoder = new TextEncoder('utf-8');
    await wasi.stdin.getWriter().write(encoder.encode(stdin));
  }
  return wasi;
}
async function initWasi(path, config, imports = {}, stdin = null) {
  let wasi = await Wasi(config, stdin);
  const module = await WebAssembly.compile(fs.readFileSync(__dirname + path));
  wasi.instantiate(module, imports);
  return wasi;
}
async function endWasi(wasi) {
  wasi.free();
  await Promise.all(handles);
}

beforeAll(async () => {
  await init();
});

beforeEach(() => {
  handles = [];
  stdout = "";
  stderr = "";
});

test('envvar works', async () => {
  let wasi = await initWasi('/envvar.wasm', {
    env: {
      DOG: "X",
      TEST: "VALUE",
      TEST2: "VALUE2"
    },
  });
  wasi.start();
  await endWasi(wasi);
  expect(stdout).toBe(`Env vars:
DOG=X
TEST2=VALUE2
TEST=VALUE
DOG Ok("X")
DOG_TYPE Err(NotPresent)
SET VAR Ok("HELLO")
`);
});

test('demo works', async () => {
  let wasi = await initWasi('/demo.wasm', {});
  wasi.start();
  await endWasi(wasi);
  expect(stdout).toBe("hello world\n");
});

test('piping works', async () => {
  let wasi = await initWasi('/pipe_reverse.wasm', {}, undefined, "Hello World!");
  wasi.start();
  await endWasi(wasi);
  expect(stdout).toBe("!dlroW olleH\n");
});

test('mapdir works', async () => {
  let wasi = await initWasi('/mapdir.wasm', {});
  wasi.fs.createDir("/a");
  wasi.fs.createDir("/b");
  let file = wasi.fs.open("/file", { read: true, write: true, create: true });
  file.writeString("fileContents");
  file.seek(0);
  // console.log(file.text());
  // console.log(wasi.fs.readDir("/"));
  wasi.start();
  await endWasi(wasi);
  expect(stdout).toBe(`"./a"\n"./b"\n"./file"\n`);
});

test('testing wasm', async () => {
  let wasi = await initWasi('/test.wasm', {}, {
    'module': {
      'external': function () { console.log("external: hello world!") }
    }
  });

  // Run the start function
  let exitCode = wasi.start();

  await endWasi(wasi);

  // This should print "hello world (exit code: 0)"
  console.log(`${stdout}(exit code: ${exitCode})`);
})

test('wasi initialize with JS imports', async () => {
  let moduleBytes = fs.readFileSync(__dirname + '/test.wasm');
  let wasi = new WASI({});
  const module = await WebAssembly.compile(moduleBytes);
  let imports = wasi.getImports(module);
  let instance = await WebAssembly.instantiate(module, {
    ...imports,
    'module': {
      'external': function () { console.log("external: hello world!") }
    }
  });
  let code = wasi.start(instance);
  expect(code).toBe(0);
});

test('wasi initialize with JS imports with empty start', async () => {
  let moduleBytes = fs.readFileSync(__dirname + '/test.wasm');
  let wasi = new WASI({});
  const module = await WebAssembly.compile(moduleBytes);
  let imports = wasi.getImports(module);
  let instance = await WebAssembly.instantiate(module, {
    ...imports,
    'module': {
      'external': function () { console.log("external: hello world!") }
    }
  });
  expect(() => wasi.start()).toThrow("You need to provide an instance as argument to `start`, or call `wasi.instantiate` with the `WebAssembly.Instance` manually");
});

test('wasi fs config works', async () => {
  let fs = new MemFS();
  fs.createDir('/magic');
  let wasi = new WASI({ fs });
  expect(wasi.fs.readDir('/').map(e => e.path)).toEqual(['/magic']);
});

test('mapdir with fs config works', async () => {
  let wfs = new MemFS();
  wfs.createDir('/magic');
  let wasi = await initWasi('/mapdir.wasm', { fs: wfs });
  wasi.start();
  await endWasi(wasi);
  expect(stdout).toBe(`"./magic"\n`);
});

test('get imports', async () => {
  let moduleBytes = fs.readFileSync(__dirname + '/test.wasm');
  let wasi = await Wasi({});
  const module = await WebAssembly.compile(moduleBytes);
  let imports = wasi.getImports(module);
  // console.log(imports);
  let instance = await WebAssembly.instantiate(module, {
    ...imports,
    'module': {
      'external': function () { console.log("external: hello world!") }
    }
  });
  wasi.instantiate(instance);
  let exitCode = wasi.start();
  await endWasi(wasi);

  expect(exitCode).toBe(0);

  // This should print "hello world (exit code: 0)"
  console.log(`${stdout}(exit code: ${exitCode})`);

  // expect(Object.keys(imports["wasi_snapshot_preview1"])).toStrictEqual([
  //   "fd_datasync",
  //   "fd_write",
  //   "poll_oneoff",
  //   "fd_advise",
  //   "sock_shutdown",
  //   "fd_prestat_dir_name",
  //   "path_readlink",
  //   "args_sizes_get",
  //   "fd_sync",
  //   "path_symlink",
  //   "path_rename",
  //   "clock_res_get",
  //   "path_unlink_file",
  //   "path_link",
  //   "path_remove_directory",
  //   "fd_allocate",
  //   "path_create_directory",
  //   "environ_sizes_get",
  //   "proc_exit",
  //   "random_get",
  //   "fd_fdstat_set_flags",
  //   "fd_close",
  //   "environ_get",
  //   "fd_readdir",
  //   "fd_read",
  //   "fd_seek",
  //   "fd_filestat_get",
  //   "path_open",
  //   "proc_raise",
  //   "fd_tell",
  //   "fd_fdstat_get",
  //   "sched_yield",
  //   "fd_pread",
  //   "fd_renumber",
  //   "fd_pwrite",
  //   "path_filestat_set_times",
  //   "sock_recv",
  //   "fd_fdstat_set_rights",
  //   "fd_prestat_get",
  //   "path_filestat_get",
  //   "fd_filestat_set_times",
  //   "fd_filestat_set_size",
  //   "sock_send",
  //   "args_get",
  //   "clock_time_get"
  // ]);
})

// TODO: tty, file io, concurrency/threads (workers), networking
