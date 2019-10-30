import CommandRunner from "../src/command-runner/command-runner";

// Need to mock process inside command runner.
jest.mock("../src/process/process", () => {
  return jest.fn().mockImplementation(() => {
    return { mock: () => {} };
  });
});

import * as shellParse from "shell-parse";

const cowsayPipedToLolcatAst = [
  {
    type: "command",
    command: { type: "literal", value: "cowsay" },
    args: [{ type: "literal", value: "hi" }],
    redirects: [
      {
        type: "pipe",
        command: {
          type: "command",
          command: { type: "literal", value: "lolcat" },
          args: [],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }
      }
    ],
    env: {},
    control: ";",
    next: null
  }
];

const wasmFsMock = {};

describe("CommandRunner", () => {
  let commandRunner: any;
  let isFinishedRunningPromise: Promise<any>;
  let wasmCompileMock: any;

  beforeEach(async () => {
    isFinishedRunningPromise = new Promise((resolve, reject) => {
      commandRunner = new CommandRunner(
        {
          fetchCommand: () => Promise.resolve(new Uint8Array([])),
          // @ts-ignore
          wasmFs: wasmFsMock
        },
        "cowsay hi | lolcat",
        () => {},
        () => resolve()
      );
    });

    shellParse.default = jest.fn(() => {
      return cowsayPipedToLolcatAst;
    });

    const getSpawnProcessAsMock = () =>
      jest.fn((commandOptionIndex: number) =>
        Promise.resolve({
          process: {
            start: () => {
              commandRunner._processEndCallback({ commandOptionIndex });
            }
          }
        })
      );

    commandRunner._spawnProcessAsWorker = getSpawnProcessAsMock();
    commandRunner._spawnProcessAsService = getSpawnProcessAsMock();
    commandRunner.supportsSharedArrayBuffer = false;

    const wasmCompileMock = jest.fn(() => Promise.resolve({}));
    WebAssembly.compile = wasmCompileMock;
  });

  it("should fallback to spawning as a service", async () => {
    await commandRunner.runCommand();
    await isFinishedRunningPromise;

    expect(commandRunner._spawnProcessAsService.mock.calls.length).toBe(2);
    expect(commandRunner._spawnProcessAsWorker.mock.calls.length).toBe(0);
  });

  it("should spawn a process for each piped process", async () => {
    await commandRunner.runCommand();
    await isFinishedRunningPromise;

    expect(commandRunner._spawnProcessAsService.mock.calls.length).toBe(2);
    expect(commandRunner._spawnProcessAsWorker.mock.calls.length).toBe(0);
  });

  it("should try to spawn workers if supported", async () => {
    // Do some mocking
    commandRunner._getCommandOptionsFromAST = jest.fn(() =>
      Promise.resolve([{ module: true }, { module: true }])
    );
    commandRunner.supportsSharedArrayBuffer = true;

    await commandRunner.runCommand();
    await isFinishedRunningPromise;

    expect(commandRunner._spawnProcessAsService.mock.calls.length).toBe(0);
    expect(commandRunner._spawnProcessAsWorker.mock.calls.length).toBe(2);
  });
});
