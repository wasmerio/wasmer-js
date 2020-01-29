const util = require("util");
const exec = util.promisify(require("child_process").exec);
const assert = require("assert");

describe("run", () => {
  it("should be able to run a WASI module", async () => {
    const { stdout, stderr } = await exec(
      "./bin/wasmer-js run ./test/assets/hello.wasm"
    );

    assert(stderr, "Hello from Zig/WASI!");
  });
});
