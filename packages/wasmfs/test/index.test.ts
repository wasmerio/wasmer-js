import { WasmFs } from "../src/index";

describe("wasmfs", () => {
  let wasmfs: WasmFs;

  beforeEach(async () => {
    wasmfs = new WasmFs();
  });

  it("should have stdin, stdout, and stderr", async () => {
    expect(wasmfs.fs.existsSync("/dev/stdin")).toBe(true);
    expect(wasmfs.fs.existsSync("/dev/stdout")).toBe(true);
    expect(wasmfs.fs.existsSync("/dev/stderr")).toBe(true);
  });

  it("should be able to retrieve stdout", async () => {
    let stdout = "test";
    wasmfs.fs.writeFileSync("/dev/stdout", stdout);

    const response = await wasmfs.getStdOut();
    expect(response).toBe(stdout);
  });

  it("realpathSync", async () => {
    let realPath = wasmfs.fs.realpathSync("/");
    console.log("realPath", realPath);
    // let realPath2 = wasmfs.fs.realpathSync("/sandbox");
    // console.log("realPath2", realPath2);
    // let x = wasmerFileSystem.fs.realpathBase("/", "utf8");
  });

  it("openSync", async () => {
    let fs = wasmfs.fs;
    try {
      fs.mkdirSync("/tmp");
    } catch (e) {}
    let temp = fs.mkdirSync("/tmp/heeey");
    let openSync = fs.openSync("/tmp/heeey", fs.constants.O_DIRECTORY);
    console.log("openSync", openSync);
  });
});
