// Import fs for reading our test Wasm files on disk
import * as fs from "fs";

// Import WasmFs
import { WasmFs } from "../../wasmfs/src/index";

// Since we are importing the lib directly, also we need to import our
// Node bindings. For the normal library, default bindings are provided :)
// Also, here we are using the "memfs" file system example that way we don't
// create any actual files on our machine
jest.mock("../src/polyfills/bigint");
const bigIntPolyfill = require("../src/polyfills/bigint");
bigIntPolyfill.BigIntPolyfill = global.Number;
if ((global as any).BigInt) {
  bigIntPolyfill.BigIntPolyfill = (global as any).BigInt;
}
import { WASI } from "../src";
import WASINodeBindings from "../src/bindings/node";

const bytesConverter = (buffer: Buffer): Buffer => {
  // Help debugging: https://webassembly.github.io/wabt/demo/wat2wasm/index.html
  let wasiUnstable = Buffer.from("wasi_unstable", "utf8");
  let pathOpen = Buffer.from("path_open", "utf8");
  let tmp = new Uint8Array(
    1 + wasiUnstable.byteLength + 1 + pathOpen.byteLength + 1
  );
  tmp[0] = 0x0d;
  tmp.set(new Uint8Array(wasiUnstable), 1);
  tmp[wasiUnstable.byteLength + 1] = 0x09;
  tmp.set(new Uint8Array(pathOpen), wasiUnstable.byteLength + 2);
  tmp[1 + wasiUnstable.byteLength + 1 + pathOpen.byteLength + 1] = 0x00;
  let index = buffer.indexOf(tmp);

  // 0000043: 60                                        ; func
  // 0000044: 09                                        ; num params
  // 0000045: 7f                                        ; i32
  // 0000046: 7f                                        ; i32
  // 0000047: 7f                                        ; i32
  // 0000048: 7f                                        ; i32
  // 0000049: 7f                                        ; i32
  // 000004a: 7e                                        ; i64
  // 000004b: 7e                                        ; i64
  // 000004c: 7f                                        ; i32
  // 000004d: 7f                                        ; i32
  // 000004e: 01                                        ; num results
  // 000004f: 7f                                        ; i32
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

const instantiateWASI = async (
  file: string,
  wasmerFileSystem: any,
  args: string[] = [],
  env: { [key: string]: string } = {}
) => {
  let wasi = new WASI({
    preopens: {
      "/sandbox": "/sandbox"
    },
    env: env,
    args: args,
    bindings: {
      ...WASINodeBindings,
      fs: wasmerFileSystem.fs
    }
  });
  const buf = fs.readFileSync(file);
  let bytes = new Uint8Array(buf as any).buffer;
  let { instance } = await WebAssembly.instantiate(bytes, {
    wasi_unstable: wasi.wasiImport
  });
  return { wasi, instance };
};

describe("WASI interaction", () => {
  let wasmerFileSystem: any;

  beforeEach(async () => {
    wasmerFileSystem = new WasmFs();
    wasmerFileSystem.fs.mkdirSync("/sandbox");
    wasmerFileSystem.fs.writeFileSync("/sandbox/file1", "contents1");
  });

  it("Can instantiate with undefined paramaters, or empty object", () => {
    try {
      let wasi = new WASI();
    } catch (e) {
      // Ensure the error is about the node bindings, not empty initialization
      expect(e.message.includes("'fs'")).toBe(true);
    }

    try {
      let wasi = new WASI({});
    } catch (e) {
      // Ensure the error is about the node bindings, not empty initialization
      expect(e.message.includes("'fs'")).toBe(true);
    }
  });

  it("Helloworld can be run", async () => {
    let { instance, wasi } = await instantiateWASI(
      "test/rs/helloworld.wasm",
      wasmerFileSystem
    );
    wasi.start(instance);
    expect(await wasmerFileSystem.getStdOut()).toMatchInlineSnapshot(`
                              "Hello world!
                              "
                    `);
  });

  it("WASI args work", async () => {
    let { instance, wasi } = await instantiateWASI(
      "test/rs/args.wasm",
      wasmerFileSystem,
      ["demo", "-h", "--help", "--", "other"]
    );
    wasi.start(instance);
    expect(await wasmerFileSystem.getStdOut()).toMatchInlineSnapshot(`
                              "[\\"demo\\", \\"-h\\", \\"--help\\", \\"--\\", \\"other\\"]
                              "
                    `);
  });

  it("WASI env work", async () => {
    let { instance, wasi } = await instantiateWASI(
      "test/rs/env.wasm",
      wasmerFileSystem,
      [],
      {
        WASM_EXISTING: "VALUE"
      }
    );
    wasi.start(instance);
    expect(await wasmerFileSystem.getStdOut()).toMatchInlineSnapshot(`
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
