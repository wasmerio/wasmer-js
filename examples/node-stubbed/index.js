const fs = require("fs");
const { spy } = require("spyfs");
const sinon = require("sinon");
const { WASI } = require("../../dist/index.cjs.js");
const wasiJsTransformer = require("./wasi-js-transformer");
const WasmerFileSystem = require("../../dist/examples/file-system/file-system.cjs.js");
const argv = require("minimist")(process.argv.slice(2));

const nodeFs = spy(fs, action => {
  console.log(action);
});
const wasmerFs = new WasmerFileSystem();
// stdout / error writing
const stdoutWrite = buffer => {
  console.log("[WASM]: ", buffer.toString());
  return buffer.length;
};
wasmerFs.volume.fds[1].write = stdoutWrite.bind(this);
wasmerFs.volume.fds[2].write = stdoutWrite.bind(this);
wasmerFs.fs = spy(wasmerFs.fs, action => {
  console.log(action);
});

let boundFs = nodeFs;
if (argv.fs && argv.fs.startsWith("wasmer")) {
  boundFs = wasmerFs.fs;
}

const wasi = new WASI({
  // preopenDirectories: { '.': '.' },
  bindings: {
    ...WASI.defaultBindings,
    fs: boundFs
  }
});

// Stub all wasi export methods
Object.keys(wasi.exports).forEach(wasiExportKey => {
  const originalWasiExport = wasi.exports[wasiExportKey];
  wasi.exports[wasiExportKey] = sinon
    .stub(wasi.exports, wasiExportKey)
    .callsFake(function() {
      console.log("Called Wasi Export:", wasiExportKey);
      console.log(arguments);
      return originalWasiExport.apply(null, arguments);
    });
});

if (argv._.length < 1) {
  throw new Error("You must pass in a wasm file as an argument");
}

// Read in the input wasm file
const wasmBuffer = fs.readFileSync(argv._[0]);

// Transform the binary
let wasmBinary = new Uint8Array(wasmBuffer);
wasmBinary = wasiJsTransformer.lower_i64_imports(wasmBinary);

const asyncTask = async () => {
  const response = await WebAssembly.instantiate(wasmBinary, {
    wasi_unstable: wasi.exports
  });
  const inst = response.instance;
  wasi.setMemory(inst.exports.memory);

  try {
    inst.exports._start();
  } catch (e) {
    console.error("ERROR:");
    console.error(e);
  }
};
asyncTask();
