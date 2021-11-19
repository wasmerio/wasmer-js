const fs = require('fs');
// const { init, WASI } = require('../');
const { init, WASI } = require('../dist/Library.cjs.js');

async function doWasi(moduleBytes, config) {
  const module = await WebAssembly.compile(moduleBytes);
  let wasi = new WASI(config, module);
  let imports = wasi.getImports();
  console.log(imports);
  let instance = WebAssembly.instantiate(module, imports);
  wasi.start(instance);
}

// test('envvar works', async () => {
//   await init();
//   let wasi = await doWasi(fs.readFileSync(__dirname + '/envvar.wasm'), {
//     env: {
//       DOG: "X",
//       TEST: "VALUE",
//       TEST2: "VALUE2"
//     }
//   });
//   expect(wasi.getStdoutString()).toBe("a");
// });

test('demo works', async () => {
  await init();
  let contents = fs.readFileSync(__dirname + '/demo.wasm');
  console.log(contents);
  let wasi = await doWasi(contents, {});
  expect(wasi.getStdoutString()).toBe("a");
});
