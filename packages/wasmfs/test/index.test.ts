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
    // console.log("realPath", realPath);
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
    // console.log("openSync", openSync);
  });

  it("serialize/deserialzie binaries", async () => {
    let fs = wasmfs.fs;
    const TINY_PNG =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    const deser = new Buffer(TINY_PNG, "base64");
    const contents = Uint8Array.from(deser);
    wasmfs.volume.writeFileSync("/img.png", contents);

    // Serialize to JSON
    const jsonData = wasmfs.toJSON();

    // Create a new FS from the serialized JSON
    const newFs = new WasmFs();
    newFs.fromJSON(jsonData);

    // Assert both files are equal
    let buf = wasmfs.volume.readFileSync("/img.png");
    let buf2 = newFs.volume.readFileSync("/img.png");
    expect(buf).toEqual(buf2);
  });

  it("serializes properly directories", async () => {
    let fs = wasmfs.fs;
    try {
      fs.mkdirSync("/tmp");
    } catch (e) {}
    const jsonData = wasmfs.toJSON();

    // Create a new FS from the serialized JSON
    const newFs = new WasmFs();
    newFs.fromJSON(jsonData);

    var stat1 = wasmfs.fs.lstatSync("/tmp");
    var stat2 = newFs.fs.lstatSync("/tmp");
    expect(stat1.isDirectory()).toBeTruthy();
    expect(stat2.isDirectory()).toBeTruthy();
  });
});
