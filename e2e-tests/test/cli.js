const assert = require("assert");

describe("@wasmer/cli", function() {
  it("Have the bundle generated", async () => {
    const Run = require("../../packages/cli/lib/commands/run");
    assert(Run);
  });
});
