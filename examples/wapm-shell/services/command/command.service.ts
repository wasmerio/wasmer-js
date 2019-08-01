import { h, Component } from "preact";

import * as Comlink from "comlink";

import { Duplex, PassThrough } from "stream";
import parse_ from "shell-parse";
const parse = parse_;

import { Terminal, ITerminalOptions } from "xterm";

import { WASIExitError, WASIKillError } from "../../../../lib/bindings/browser";

import { CommandOptions, Command } from "./command";

import CommandCache from "./command-cache";

const getCommandOptionsFromAST = (
  ast: any,
  commandCache: CommandCache
): Promise<CommandOptions> => {
  let command = ast.command.value;
  let commandArgs = ast.args.map((arg: any) => arg.value);
  let args = [command, ...commandArgs];

  let env = Object.fromEntries(
    Object.entries(ast.env).map(([key, value]: [string, any]) => [
      key,
      value.value
    ])
  );

  // TODO:
  /*
  let redirect;
  if (ast.redirects) {
    let astRedirect = ast.redirects[0];
    if (astRedirect && astRedirect.type === "pipe") {
      redirect = commandAstToCommandOptions(astRedirect.command);
    }
  }
   */

  const getWasmModuleTask = async () => {
    // Get our Wasm Module
    return await commandCache.getWasmModuleForCommandName(command);
  };

  return getWasmModuleTask().then(wasmModule => {
    return {
      args,
      env,
      // TODO:
      // redirect,
      module: wasmModule
    };
  });
};

class CommandServiceImpl {
  commandCache: CommandCache;
  processes: Array<any>;

  constructor() {
    this.commandCache = new CommandCache();
    this.processes = [];
  }

  async runCommand(xterm: Terminal, commandString: string) {
    // First, let's parse the string into a bash AST
    const commandAst = parse(commandString);
    try {
      if (commandAst.length > 1) {
        throw new Error("Only one command permitted");
      }
      if (commandAst[0].type !== "command") {
        throw new Error("Only commands allowed");
      }
    } catch (c) {
      xterm.write(`wapm shell: parse error (${c.toString()})\r\n$ `);
      return;
    }

    // Translate our AST into Command Options
    // TODO: Add the Wasm Module to the options
    console.log("ast", commandAst);
    const options = await getCommandOptionsFromAST(
      commandAst[0],
      this.commandCache
    );

    // Generate our process
    const processComlink = Comlink.wrap(
      new Worker("./workers/process/process.worker.js")
    );

    // @ts-ignore
    const process: any = await new processComlink(
      options,
      Comlink.proxy((data: any) => {
        console.log("got data", data);
        console.log("what is my context?", commandAst);
      }),
      "hello"
    );
    await process.start();
    console.log("process object", process);
  }
}

// Export a singleton
// Since we want a single command service orchestrating workers
const CommandService = new CommandServiceImpl();
export default CommandService;
