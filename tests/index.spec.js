const fs = require('fs');
// const { init, WASI } = require('../');
const { init, WASI } = require('../dist/Library.cjs.js');

async function doWasi(moduleBytes, config) {
  await init();
  const module = await WebAssembly.compile(moduleBytes);
  let wasi = new WASI(config, module);
  let imports = wasi.getImports();
  let instance = await WebAssembly.instantiate(module, imports);
  wasi.start(instance);
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
  expect(wasi.getStdoutString()).toBe("hello world\n");
});
