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
    commandFetcher = new CommandFetcher(getTerminalConfig());

    mockCommandName = "test";
    mockWasmBinary = new Uint8Array();
    mockWasmModule = {};

    commandFetcher._getWapmUrlForCommandName = jest.fn(() =>
      Promise.resolve("")
    );
    commandFetcher._getBinaryFromUrl = jest.fn(() =>
      Promise.resolve(mockWasmBinary)
    );
    commandFetcher._getWasmModuleFromBinary = jest.fn(() =>
      Promise.resolve(mockWasmModule)
    );
  });

  it("should return a wasm module for the command name", async () => {
    const response = await commandFetcher.getWasmModuleForCommandName(
      mockCommandName
    );

    expect(response).toBe(mockWasmModule);
  });

  it("should cache a wasm modules url and wasm module for the command name", async () => {
    const response = await commandFetcher.getWasmModuleForCommandName(
      mockCommandName
    );

    expect(commandFetcher.commandToBinaryCache[mockCommandName]).toBe(
      mockWasmBinary
    );
    expect(commandFetcher.commandToCompiledModuleCache[mockCommandName]).toBe(
      mockWasmModule
    );
  });

  it("should request a wasm binary from additionalWasmCommands on the terminal config", async () => {
    const mockCommandUrl = "http://test-url.com";
    const terminalConfig = getTerminalConfig();
    (terminalConfig.additionalWasmCommands as any)[
      mockCommandName
    ] = mockCommandUrl;
    commandFetcher = new CommandFetcher(terminalConfig);

    commandFetcher._getWapmUrlForCommandName = jest.fn(() =>
      Promise.resolve("")
    );
    commandFetcher._getBinaryFromUrl = jest.fn(() =>
      Promise.resolve(mockWasmBinary)
    );
    commandFetcher._getWasmModuleFromBinary = jest.fn(() =>
      Promise.resolve(mockWasmModule)
    );

    const response = await commandFetcher.getWasmModuleForCommandName(
      mockCommandName
    );

    expect(commandFetcher._getWapmUrlForCommandName.mock.calls.length).toBe(0);
  });
});
