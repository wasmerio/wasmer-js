const fs = require('fs');
// const { init, WASI } = require('../');
const { init, WASI } = require('../dist/Library.cjs.js');


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
  let wasi = await initWasi(fs.readFileSync(__dirname + '/envvar.wasm'), {
    env: {
      DOG: "X",
      TEST: "VALUE",
      TEST2: "VALUE2"
    }
  });
  let code = wasi.start();
  expect(wasi.getStdoutString()).toBe(`Env vars:
DOG=X
TEST2=VALUE2
TEST=VALUE
DOG Ok("X")
DOG_TYPE Err(NotPresent)
SET VAR Ok("HELLO")
`);
});

test('demo works', async () => {
  let contents = fs.readFileSync(__dirname + '/demo.wasm');
  let wasi = await initWasi(contents, {});
  let code = wasi.start();
  expect(wasi.getStdoutString()).toBe("hello world\n");
});

test('piping works', async () => {
  let contents = fs.readFileSync(__dirname + '/pipe_reverse.wasm');
  let wasi = await initWasi(contents, {});
  wasi.setStdinString("Hello World!");
  let code = wasi.start();
  expect(wasi.getStdoutString()).toBe("!dlroW olleH\n");
});

test('mapdir works', async () => {
  let contents = fs.readFileSync(__dirname + '/mapdir.wasm');
  let wasi = await initWasi(contents, {});
  wasi.fs.createDir("/a");
  wasi.fs.createDir("/b");
  let file = wasi.fs.open("/file", {read: true, write: true, create: true});
  file.writeString("fileContents");
  file.seek(0);
  // console.log(file.readString());
  // console.log(wasi.fs.readDir("/"));
  let code = wasi.start();
  expect(wasi.getStdoutString()).toBe(`"./a"\n"./b"\n"./file"\n`);
});

test('testing wasm', async() => {

  let contents = fs.readFileSync(__dirname + '/test.wasm');
  let wasi = await initWasi(contents, {
    'module': {
        'external': function() { console.log("external: hello world!") }
    }});

  // Run the start function
  let exitCode = wasi.start();
  let stdout = wasi.getStdoutString();

  // This should print "hello world (exit code: 0)"
  console.log(`${stdout}(exit code: ${exitCode})`);
})
