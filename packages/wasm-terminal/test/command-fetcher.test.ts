import CommandFetcher from "../lib/command-runner/command-fetcher";

let getTerminalConfig = () => {
  return {
    wasmTransformerWasmUrl: "",
    additionalWasmCommands: {}
  };
};

describe("CommandFetcher", () => {
  let commandFetcher: any;
  let mockCommandName: string;
  let mockWasmBinary: Uint8Array;
  let mockWasmModule: any;

  beforeEach(async () => {
    commandFetcher = new CommandFetcher(getTerminalConfig(), []);

    mockCommandName = "test";
    mockWasmBinary = new Uint8Array();
    mockWasmBinary[0] = 1;
    mockWasmModule = {};

    commandFetcher._getWapmUrlForCommandName = jest.fn(() =>
      Promise.resolve("CommandUrl")
    );
    commandFetcher._getBinaryFromUrl = jest.fn(() =>
      Promise.resolve(mockWasmBinary)
    );
    commandFetcher._getWasmModuleFromBinary = jest.fn(() =>
      Promise.resolve(mockWasmModule)
    );
  });

  it("should return a wasm module for the command name", async () => {
    const response = await commandFetcher.getCommandForCommandName(
      mockCommandName
    );

    expect(response).toBe(mockWasmModule);
  });

  it("should cache a wasm module for the command name", async () => {
    const response = await commandFetcher.getCommandForCommandName(
      mockCommandName
    );

    expect(commandFetcher.commandToCompiledModuleCache[mockCommandName]).toBe(
      mockWasmModule
    );
  });

  it("should call beforeFetchCommand on the terminal config", async () => {
    const mockCommandUrl = "http://test-url.com";
    const terminalConfig = getTerminalConfig();
    (terminalConfig.additionalWasmCommands as any)[
      mockCommandName
    ] = mockCommandUrl;
    const pluginApplyMock = jest.fn(() => {});
    commandFetcher = new CommandFetcher(terminalConfig, [
      {
        apply: pluginApplyMock
      }
    ]);

    commandFetcher._getWapmUrlForCommandName = jest.fn(() =>
      Promise.resolve("CommandUrl")
    );
    commandFetcher._getBinaryFromUrl = jest.fn(() =>
      Promise.resolve(mockWasmBinary)
    );
    commandFetcher._getWasmModuleFromBinary = jest.fn(() =>
      Promise.resolve(mockWasmModule)
    );

    const response = await commandFetcher.getCommandForCommandName(
      mockCommandName
    );

    expect(pluginApplyMock.mock.calls.length).toBe(1);
    // @ts-ignore
    expect(pluginApplyMock.mock.calls[0][0]).toBe("beforeFetchCommand");
  });
});
