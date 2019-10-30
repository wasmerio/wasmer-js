import { expect, test } from "@oclif/test";

describe("run", () => {
  test
    .stdout()
    .command(["run", __dirname + "/../assets/hello.wasm"])
    .it("runs run", ctx => {
      expect(ctx.stdout).to.contain("Hello");
    });
});
