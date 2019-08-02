import { h, Component } from "preact";

import * as Comlink from "comlink";

import { Duplex, PassThrough } from "stream";
import parse_ from "shell-parse";
const parse = parse_;

import { Terminal } from "xterm";

import { WASIExitError, WASIKillError } from "../../../../lib/bindings/browser";

import { CommandOptions, Command } from "./command";

import CommandCache from "./command-cache";

const getCommandOptionsFromAST = (
  ast: any,
  commandCache: CommandCache
): Promise<Array<CommandOptions>> => {
  // The array of command options we are returning
  let commandOptions: Array<CommandOptions> = [];

  let command = ast.command.value;
  let commandArgs = ast.args.map((arg: any) => arg.value);
  let args = [command, ...commandArgs];

  let env = Object.fromEntries(
    Object.entries(ast.env).map(([key, value]: [string, any]) => [
      key,
      value.value
    ])
  );

  // Get other commands from the redirects
  const redirectTask = async () => {
    if (ast.redirects) {
      let astRedirect = ast.redirects[0];
      if (astRedirect && astRedirect.type === "pipe") {
        const redirectedCommandOptions = await getCommandOptionsFromAST(
          astRedirect.command,
          commandCache
        );
        // Add the child options to our command options
        commandOptions = commandOptions.concat(redirectedCommandOptions);
      }
    }
  };

  const getWasmModuleTask = async () => {
    // Get our Wasm Module
    return await commandCache.getWasmModuleForCommandName(command);
  };

  return redirectTask()
    .then(() => getWasmModuleTask())
    .then(wasmModule => {
      commandOptions.unshift({
        args,
        env,
        module: wasmModule
      });
      return commandOptions;
    });
};

export default class CommandRunner {
  commandCache: CommandCache;
  commandOptionsForProcessesToRun: Array<any>;
  spawnedProcesses: Array<any>;

  xterm: Terminal;
  commandString: string;
  endCallback: Function;

  constructor(xterm: Terminal, commandString: string, endCallback: Function) {
    this.commandCache = new CommandCache();
    this.commandOptionsForProcessesToRun = [];
    this.spawnedProcesses = [];
    this.xterm = xterm;
    this.commandString = commandString;
    this.endCallback = endCallback;
  }

  async runCommand() {
    // First, let's parse the string into a bash AST
    const commandAst = parse(this.commandString);
    try {
      if (commandAst.length > 1) {
        throw new Error("Only one command permitted");
      }
      if (commandAst[0].type !== "command") {
        throw new Error("Only commands allowed");
      }
    } catch (c) {
      this.xterm.write(`wapm shell: parse error (${c.toString()})\r\n$ `);
      return;
    }

    // Translate our AST into Command Options
    this.commandOptionsForProcessesToRun = await getCommandOptionsFromAST(
      commandAst[0],
      this.commandCache
    );

    // Spawn the first process
    await this.tryToSpawnProcess(0);
  }

  async tryToSpawnProcess(commandOptionIndex: number) {
    if (
      this.spawnedProcesses.length < 2 &&
      commandOptionIndex < this.commandOptionsForProcessesToRun.length
    ) {
      await this.spawnProcess(commandOptionIndex);
    }
  }

  async spawnProcess(commandOptionIndex: number) {
    // Generate our process
    const processWorker = new Worker("./workers/process/process.worker.js");
    const processComlink = Comlink.wrap(processWorker);

    // @ts-ignore
    const process: any = await new processComlink(
      this.commandOptionsForProcessesToRun[commandOptionIndex],
      // Data Callback
      Comlink.proxy((data: any) => {
        if (
          commandOptionIndex <
          this.commandOptionsForProcessesToRun.length - 1
        ) {
          // Pass along to the next spawned process
          this.spawnedProcesses[1].sendStdInChunk(data);
        } else {
          // Write the output to our terminal
          let dataString = new TextDecoder("utf-8").decode(data);
          this.xterm.write(dataString.replace(/\n/g, "\r\n"));
        }
      }),
      // End Callback
      Comlink.proxy(() => {
        // Terminate our worker
        processWorker.terminate();

        // Remove ourself from the spawned workers
        this.spawnedProcesses.shift();

        if (
          commandOptionIndex <
          this.commandOptionsForProcessesToRun.length - 1
        ) {
          // Try to spawn the next process, if we haven't already
          this.tryToSpawnProcess(commandOptionIndex + 1);
        } else {
          // We are now done!
          // Call the passed end callback
          this.endCallback();
        }
      })
      // Stdin
    );

    // Record this process as spawned
    this.spawnedProcesses.push(process);

    // Try to spawn the next process, if we haven't already
    this.tryToSpawnProcess(commandOptionIndex + 1);

    // Start the process
    process.start();
  }

  kill() {
    // TODO:
    console.error("I am immortal!");
  }
}
