import { h, Component } from "preact";

import * as Comlink from "comlink";

import { Duplex, PassThrough } from "stream";
import parse_ from "shell-parse";
const parse = parse_;

import { Terminal } from "xterm";

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
  spawnedProcessToWorker: Array<any>;
  initialStdinDataForNextProcess: Uint8Array;
  isRunning: boolean;
  isUsingFallback: boolean;
  binaryenScriptPromise?: Promise<string>;

  xterm: Terminal;
  commandString: string;
  endCallback: Function;

  constructor(xterm: Terminal, commandString: string, endCallback: Function) {
    this.commandCache = new CommandCache();
    this.commandOptionsForProcessesToRun = [];
    this.spawnedProcessToWorker = [];
    this.initialStdinDataForNextProcess = new Uint8Array();
    this.isRunning = false;
    this.xterm = xterm;
    this.commandString = commandString;
    this.endCallback = endCallback;

    // Check if we have shared array buffer
    if (!(self as any).SharedArrayBuffer || !(self as any).Atomics || true) {
      this.isUsingFallback = true;

      this.binaryenScriptPromise = fetch("assets/binaryen-88.0.0.js").then(
        response => {
          return response.text();
        }
      );
    } else {
      this.isUsingFallback = false;
    }
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

      // Translate our AST into Command Options
      this.commandOptionsForProcessesToRun = await getCommandOptionsFromAST(
        commandAst[0],
        this.commandCache
      );
    } catch (c) {
      this.xterm.write(`wapm shell: parse error (${c.toString()})\r\n`);
      this.endCallback();
      return;
    }

    this.isRunning = true;

    // Spawn the first process
    await this.tryToSpawnProcess(0);
  }

  async tryToSpawnProcess(commandOptionIndex: number) {
    if (
      this.spawnedProcessToWorker.length < 2 &&
      commandOptionIndex < this.commandOptionsForProcessesToRun.length
    ) {
      await this.spawnProcess(commandOptionIndex);
    }
  }

  async spawnProcess(commandOptionIndex: number) {
    // First set up our fallback if we need to
    let binaryenScript = "";
    if (this.isUsingFallback && this.binaryenScriptPromise) {
      binaryenScript = await this.binaryenScriptPromise;
    }

    // Generate our process
    const processWorker = new Worker("./workers/process/process.worker.js");
    const processComlink = Comlink.wrap(processWorker);

    // @ts-ignore
    const process: any = await new processComlink(
      this.commandOptionsForProcessesToRun[commandOptionIndex],
      // Data Callback
      Comlink.proxy((data: Uint8Array) => {
        if (
          commandOptionIndex <
          this.commandOptionsForProcessesToRun.length - 1
        ) {
          // Pass along to the next spawned process
          if (this.spawnedProcessToWorker.length > 1) {
            this.spawnedProcessToWorker[1].process.receiveStdinChunk(data);
          } else {
            const newInitialStdinData = new Uint8Array(
              data.length + this.initialStdinDataForNextProcess.length
            );
            newInitialStdinData.set(this.initialStdinDataForNextProcess);
            newInitialStdinData.set(
              data,
              this.initialStdinDataForNextProcess.length
            );
            this.initialStdinDataForNextProcess = newInitialStdinData;
          }
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
        this.spawnedProcessToWorker.shift();

        if (
          commandOptionIndex <
          this.commandOptionsForProcessesToRun.length - 1
        ) {
          // Try to spawn the next process, if we haven't already
          this.tryToSpawnProcess(commandOptionIndex + 1);
        } else {
          // We are now done!
          // Call the passed end callback
          this.isRunning = false;
          this.endCallback();
        }
      }),
      // Error Callback
      Comlink.proxy((error: string) => {
        this.xterm.write(
          `Program ${this.commandOptionsForProcessesToRun[commandOptionIndex].args[0]}: ${error}\r\n`
        );
        this.kill();
        this.endCallback();
      }),
      // Stdin
      this.initialStdinDataForNextProcess.length > 0
        ? this.initialStdinDataForNextProcess
        : undefined,
      // Binary Script (Fallback case)
      this.isUsingFallback ? binaryenScript : undefined
    );

    // Remove the initial stdin if we added it
    if (this.initialStdinDataForNextProcess.length > 0) {
      this.initialStdinDataForNextProcess = new Uint8Array();
    }

    // Record this process as spawned
    this.spawnedProcessToWorker.push({
      process,
      worker: processWorker
    });

    // Try to spawn the next process, if we haven't already
    this.tryToSpawnProcess(commandOptionIndex + 1);

    // Start the process
    process.start();
  }

  kill() {
    if (!this.isRunning) {
      return;
    }

    this.spawnedProcessToWorker.forEach(processToWorker => {
      processToWorker.terminate();
    });

    this.commandOptionsForProcessesToRun = [];
    this.spawnedProcessToWorker = [];
    this.isRunning = false;

    this.endCallback();
  }
}
