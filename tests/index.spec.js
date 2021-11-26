const fs = require('fs');
// const { init, WASI } = require('../');
const { init, WASI } = require('../dist/Library.cjs.js');

async function doWasi(moduleBytes, config) {
  await init();
  let wasi = new WASI(config);
  const module = await WebAssembly.compile(moduleBytes);
  await wasi.instantiate(module, {});
  return wasi;
}

test('envvar works', async () => {
  let wasi = await doWasi(fs.readFileSync(__dirname + '/envvar.wasm'), {
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
  let wasi = await doWasi(contents, {});
  let code = wasi.start();
  expect(wasi.getStdoutString()).toBe("hello world\n");
});

test('piping works', async () => {
  let contents = fs.readFileSync(__dirname + '/pipe_reverse.wasm');
  let wasi = await doWasi(contents, {});
  wasi.setStdinString("Hello World!");
  let code = wasi.start();
  expect(wasi.getStdoutString()).toBe("!dlroW olleH\n");
});
