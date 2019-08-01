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

// TODO: Rename this to command runner service
// And not make it a singleton
class CommandServiceImpl {
  commandCache: CommandCache;
  commandOptionsForProcessesToRun: Array<any>;
  index: number;

  constructor() {
    this.commandCache = new CommandCache();
    this.commandOptionsForProcessesToRun = [];
    this.index = 0;
  }

  reset() {
    this.commandOptionsForProcessesToRun = [];
    this.index = 0;
  }

  async runCommand(
    xterm: Terminal,
    commandString: string,
    endCallback: Function
  ) {
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
    const options: Array<CommandOptions> = await getCommandOptionsFromAST(
      commandAst[0],
      this.commandCache
    );

    // Generate our process
    const processComlink = Comlink.wrap(
      new Worker("./workers/process/process.worker.js")
    );

    // @ts-ignore
    const process: any = await new processComlink(
      options[0],
      Comlink.proxy((data: any) => {
        let dataString = new TextDecoder("utf-8").decode(data);
        xterm.write(dataString.replace(/\n/g, "\r\n"));
      }),
      Comlink.proxy(() => {
        endCallback();
      })
    );
    await process.start();
  }
}

// Export a singleton
// Since we want a single command service orchestrating workers
const CommandService = new CommandServiceImpl();
export default CommandService;
