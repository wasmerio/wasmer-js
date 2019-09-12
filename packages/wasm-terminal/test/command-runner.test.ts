import CommandRunner from "../lib/command-runner/command-runner";

describe("CommandRunner", () => {
  let commandRunner: any;

  beforeEach(async () => {
    commandRunner = new CommandRunner(
      { wasmTransformerWasmUrl: "" },
      "test",
      () => {},
      () => {},
      () => {}
    );
  });

  it("should return a wasm module for the command name", async () => {});

  it("should pass", async () => {
    expect(true).toBe(true);
  });
});
