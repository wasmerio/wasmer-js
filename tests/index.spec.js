const fs = require('fs');
// const { init, WASI } = require('../');
const { init, WASI } = require('../dist/Library.cjs.js');


test('envvar works', async () => {
  await init();
  const program = fs.readFileSync(__dirname + '/envvar.wasm');
  const module = await WebAssembly.compile(program);
  let wasi = new WASI({
    env: {
      DOG: "X",
      TEST: "VALUE",
      TEST2: "VALUE2"
    }
  }, module);
  let imports = wasi.getImports();
  console.log(imports);
  let instance = WebAssembly.instantiate(module, imports);
  wasi.start(instance);
  expect(wasi.getStdoutString()).toBe("a");
});
