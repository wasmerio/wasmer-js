// Import fs for reading our test wasm files on disk
import * as fs from "fs";

// Since we are importing the lib directly, also we need to import our
// Node bindings. For the normal library, default bindings are provided :)
// Also, here we are using the "memfs" file system example that way we don't
// create any actual files on our machine
jest.mock("../lib/polyfill/bigint");
const bigIntPolyfill = require("../lib/polyfill/bigint");
bigIntPolyfill.BigIntPolyfill = global.Number;
if ((global as any).BigInt) {
  bigIntPolyfill.BigIntPolyfill = (global as any).BigInt;
}
import { WASI } from "../lib";
import WASINodeBindings from "../lib/bindings/node";
import * as WasiFileSystem from "../examples/file-system/file-system";

const bytesConverter = (buffer: Buffer): Buffer => {
  // Help debugging: https://webassembly.github.io/wabt/demo/wat2wasm/index.html
  let wasi_unstable = Buffer.from("wasi_unstable", "utf8");
  let path_open = Buffer.from("path_open", "utf8");
  var tmp = new Uint8Array(
    1 + wasi_unstable.byteLength + 1 + path_open.byteLength + 1
  );
  tmp[0] = 0x0d;
  tmp.set(new Uint8Array(wasi_unstable), 1);
  tmp[wasi_unstable.byteLength + 1] = 0x09;
  tmp.set(new Uint8Array(path_open), wasi_unstable.byteLength + 2);
  tmp[1 + wasi_unstable.byteLength + 1 + path_open.byteLength + 1] = 0x00;
  let index = buffer.indexOf(tmp);

  let functionTypeIndex = buffer.indexOf(
    new Uint8Array([
      0x60,
      0x09,
      0x7f,
      0x7f,
      0x7f,
      0x7f,
      0x7f,
      0x7e,
      0x7e,
      0x7f,
      0x7f,
      0x01,
      0x7f
    ])
  );
  return buffer;
};

const instantiateWasi = async (
  file: string,
  wasiFs: any,
  args: string[] = [],
  env: { [key: string]: string } = {}
) => {
  let wasi = new WASI({
    preopenDirectories: {
      "/sandbox": "/sandbox"
    },
    env: env,
    args: args,
    bindings: {
      ...WASINodeBindings,
      fs: wasiFs
    }
  });
  const buf = fs.readFileSync(file);
  let bytes = new Uint8Array(buf as any).buffer;
  let { instance } = await WebAssembly.instantiate(bytes, {
    wasi_unstable: wasi.exports
  });
  wasi.setMemory(instance.exports.memory);
  return { wasi, instance };
};

describe("WASI interaction", () => {
  let wasiFs: any;

  beforeEach(async () => {
    wasiFs = WasiFileSystem.generateWasiFileSystem();
    wasiFs.mkdirSync("/sandbox");
    wasiFs.writeFileSync("/sandbox/file1", "contents1");

    const fd_err = wasiFs.openSync("/dev/stderr", "w");
    const fd_out = wasiFs.openSync("/dev/stdout", "w");
    const fd_in = wasiFs.openSync("/dev/stdin", "w");
    expect(fd_err).toBe(2);
    expect(fd_out).toBe(1);
    expect(fd_in).toBe(0);
  });

  it("Helloworld can be run", async () => {
    let { instance, wasi } = await instantiateWasi(
      "test/rs/helloworld.wasm",
      wasiFs
    );
    instance.exports._start();
    expect(await WasiFileSystem.getStdOutFromWasiFileSystem(wasiFs))
      .toMatchInlineSnapshot(`
                              "Hello world!
                              "
                    `);
  });

  it("WASI args work", async () => {
    let { instance, wasi } = await instantiateWasi(
      "test/rs/args.wasm",
      wasiFs,
      ["demo", "-h", "--help", "--", "other"]
    );
    instance.exports._start();
    expect(await WasiFileSystem.getStdOutFromWasiFileSystem(wasiFs))
      .toMatchInlineSnapshot(`
                              "[\\"demo\\", \\"-h\\", \\"--help\\", \\"--\\", \\"other\\"]
                              "
                    `);
  });

  it("WASI env work", async () => {
    let { instance, wasi } = await instantiateWasi(
      "test/rs/env.wasm",
      wasiFs,
      [],
      {
        WASM_EXISTING: "VALUE"
      }
    );
    instance.exports._start();
    expect(await WasiFileSystem.getStdOutFromWasiFileSystem(wasiFs))
      .toMatchInlineSnapshot(`
      "should be set (WASM_EXISTING): Some(\\"VALUE\\")
      shouldn't be set (WASM_UNEXISTING): None
      Set existing var (WASM_EXISTING): Some(\\"NEW_VALUE\\")
      Set unexisting var (WASM_UNEXISTING): Some(\\"NEW_VALUE\\")
      All vars in env:
      WASM_EXISTING: NEW_VALUE
      WASM_UNEXISTING: NEW_VALUE
      "
    `);
  });

  it("converts path_open", async () => {
    let originalBuffer = fs.readFileSync("test/rs/sandbox_file_ok.wasm");
    bytesConverter(originalBuffer);
  });
});
