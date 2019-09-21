const fs = require("fs");
const { spy } = require("spyfs");
const sinon = require("sinon");
const { WASI } = require("../../dist/index.cjs.js");
const wasmTransformer = require("./wasm_transformer");
const WasmerFileSystem = require("../../dist/examples/file-system/file-system.cjs.js");
const argv = require("minimist")(process.argv.slice(2));
const chalk = require("chalk");
var readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
let currentStdinLine = "";

// Check if we passed a wasm file
if (argv._.length < 1) {
  throw new Error("You must pass in a wasm file as an argument");
}

const msleep = n => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
};

// Set up our file system (NOTE: We could use node's fs normally for this case)
const wasmerFs = new WasmerFileSystem();
//stdin reading
let stdinReadCounter = 0;
const stdinRead = (stdinBuffer, offset, length, position) => {
  // For some reason, read is called 3 times per actual read
  // Thus we have a counter to handle this.
  // TODO: This should only be needed if we are prompting, and not needed for piping.
  if (stdinReadCounter !== 0) {
    if (stdinReadCounter < 2) {
      stdinReadCounter++;
    } else {
      stdinReadCounter = 0;
    }
    return 0;
  }

  // Since reading will keep requesting data, we need to give end of file
  stdinReadCounter++;

  // Wait for stdin
  let responseStdin = null;
  // Using deasync to simply allow the event loop to run but pause here: https://github.com/abbr/deasync
  require("deasync").loopWhile(() => currentStdinLine.length < 1);
  responseStdin = currentStdinLine;
  currentStdinLine = "";

  // First check for errors
  if (!responseStdin) {
    return 0;
  }

  const buffer = new TextEncoder().encode(responseStdin);
  for (let x = 0; x < buffer.length; ++x) {
    stdinBuffer[x] = buffer[x];
  }

  return buffer.length;
};
wasmerFs.volume.fds[0].read = stdinRead.bind(this);
// stdout / error writing
const stdoutWrite = buffer => {
  console.log(buffer.toString() + "\r\n");
  return buffer.length;
};
wasmerFs.volume.fds[1].write = stdoutWrite.bind(this);
wasmerFs.volume.fds[2].write = stdoutWrite.bind(this);
wasmerFs.fs = spy(wasmerFs.fs, action => {
  console.log(
    chalk.blue(`
  [FS Spy]: ${action.method}
  [FS Spy]: ${action.args}
  `)
  );
});

const wasi = new WASI({
  bindings: {
    ...WASI.defaultBindings,
    fs: wasmerFs.fs
  }
});

// Stub all wasi export methods
Object.keys(wasi.exports).forEach(wasiExportKey => {
  const originalWasiExport = wasi.exports[wasiExportKey];
  wasi.exports[wasiExportKey] = sinon
    .stub(wasi.exports, wasiExportKey)
    .callsFake(function() {
      console.log(
        chalk.green(`
      [Wasi Stub]: ${wasiExportKey}
      [Wasi Stub]: ${JSON.stringify(arguments)}
      `)
      );
      return originalWasiExport.apply(null, arguments);
    });
});

// Read in the input wasm file
const wasmBuffer = fs.readFileSync(argv._[0]);

// Transform the binary
let wasmBinary = new Uint8Array(wasmBuffer);
wasmBinary = wasmTransformer.lower_i64_imports(wasmBinary);

const asyncTask = async () => {
  const response = await WebAssembly.instantiate(wasmBinary, {
    wasi_unstable: wasi.exports
  });
  const inst = response.instance;
  wasi.bind(inst);

  // Take in stdin
  rl.on("line", line => {
    currentStdinLine = line;
  });

  try {
    inst.exports._start();
  } catch (e) {
    console.error("ERROR:");
    console.error(e);
  }
};
asyncTask();
