import CommandFetcher from "../lib/command-runner/command-fetcher";

let getTerminalConfig = () => {
  return {
    wasmTransformerWasmUrl: ""
  };
};

describe("CommandFetcher", () => {
  let commandFetcher: any;

  beforeEach(async () => {
    commandFetcher = new CommandFetcher(getTerminalConfig());
  });

  it("should pass", async () => {
    expect(true).toBe(true);
  });
});
