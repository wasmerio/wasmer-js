const fs = require('fs');
// const { TextDecoder, TextEncoder } = require('util');
// Object.assign(global, { TextDecoder, TextEncoder });
const { default: init, WASI, MemFS } = require('../dist/lib.min.cjs');
const { start } = require('repl');
const { abort } = require('process');

const decoder = this.decoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
let stdout = "";
const Stdout = () => new WritableStream({
  write(chunk) { stdout += decoder.decode(chunk, { stream: true }); },
  close() { decoder.decode(); },
  abort() { decoder.decode(); }
});

async function initWasi(moduleBytes, config, imports = {}) {
  let wasi = new WASI(config);
  const module = await WebAssembly.compile(moduleBytes);
  await wasi.instantiate(module, imports);
  return wasi;
}

beforeAll(async () => {
  await init();
});

test('envvar works', async () => {
  const handles = [];
  stdout = "";
  let wasi = await initWasi(fs.readFileSync(__dirname + '/envvar.wasm'), {
    env: {
      DOG: "X",
      TEST: "VALUE",
      TEST2: "VALUE2"
    },
  });
  handles.push(wasi.stdout.pipeTo(Stdout()));
  let code = wasi.start();
  wasi.free();
  await Promise.all(handles);
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
  const handles = [];
  stdout = "";
  let contents = fs.readFileSync(__dirname + '/demo.wasm');
  let wasi = await initWasi(contents, {});
  handles.push(wasi.stdout.pipeTo(Stdout()));
  let code = wasi.start();
  wasi.free();
  await Promise.all(handles);
  expect(stdout).toBe("hello world\n");
});

test('piping works', async () => {
  const handles = [];
  stdout = "";
  let contents = fs.readFileSync(__dirname + '/pipe_reverse.wasm');
  let wasi = await initWasi(contents, {});
  wasi.stdin.getWriter().write((new TextEncoder("utf-8")).encode("Hello World!"));
  handles.push(wasi.stdout.pipeTo(Stdout()));
  let code = wasi.start();
  wasi.free();
  await Promise.all(handles);
  expect(stdout).toBe("!dlroW olleH\n");
});

test('mapdir works', async () => {
  const handles = [];
  stdout = "";
  let contents = fs.readFileSync(__dirname + '/mapdir.wasm');
  let wasi = await initWasi(contents, {});
  wasi.fs.createDir("/a");
  wasi.fs.createDir("/b");
  let file = wasi.fs.open("/file", { read: true, write: true, create: true });
  file.writeString("fileContents");
  file.seek(0);
  // console.log(file.readString());
  // console.log(wasi.fs.readDir("/"));
  handles.push(wasi.stdout.pipeTo(Stdout()));
  let code = wasi.start();
  wasi.free();
  await Promise.all(handles);
  expect(stdout).toBe(`"./a"\n"./b"\n"./file"\n`);
});

test('testing wasm', async () => {
  const handles = [];
  let contents = fs.readFileSync(__dirname + '/test.wasm');
  let wasi = await initWasi(contents, {}, {
    'module': {
      'external': function () { console.log("external: hello world!") }
    }
  });

  // Run the start function
  handles.push(wasi.stdout.pipeTo(Stdout()));
  let exitCode = wasi.start();
  wasi.free();
  await Promise.all(handles);

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
  const handles = [];
  stdout = "";
  let wfs = new MemFS();
  wfs.createDir('/magic');
  let contents = fs.readFileSync(__dirname + '/mapdir.wasm');
  let wasi = await initWasi(contents, { fs: wfs });
  handles.push(wasi.stdout.pipeTo(Stdout()));
  let code = wasi.start();
  wasi.free();
  await Promise.all(handles);
  expect(stdout).toBe(`"./magic"\n`);
});

test('get imports', async () => {
  const handles = [];
  let moduleBytes = fs.readFileSync(__dirname + '/test.wasm');
  let wasi = new WASI({});
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
  handles.push(wasi.stdout.pipeTo(Stdout()));
  let exitCode = wasi.start();
  wasi.free();
  await Promise.all(handles);

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
