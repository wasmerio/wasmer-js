import CommandFetcher from "../lib/command-runner/command-fetcher";

let getTerminalConfig = () => {
  return {
    wasmTransformerWasmUrl: ""
  };
};

describe("CommandFetcher", () => {
  let commandFetcher: any;
  let mockWasmModule: any;

  beforeEach(async () => {
    commandFetcher = new CommandFetcher(getTerminalConfig());
    mockWasmModule = {};
    commandFetcher._getWapmUrlForCommandName = jest.fn(() =>
      Promise.resolve("")
    );
    commandFetcher._getWasmModuleFromUrl = jest.fn(() =>
      Promise.resolve(mockWasmModule)
    );
  });

  it("should return a wasm module for the command name", async () => {
    const response = await commandFetcher.getWasmModuleForCommandName("test");
    expect(response).toBe(mockWasmModule);
  });
});
