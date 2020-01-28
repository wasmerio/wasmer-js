import * as minimist from "minimist";

import { runCommand } from "./commands/run";

// Define our base help command
const printHelp = () => {
  console.log(`
wasmer-js - @wasmer/cli for using Wasm modules with Wasmer JS from the command line.

Usage:

  wasmer-js COMMAND - run the specified command. The available commands are:

    run - Run a Wasm Module
    help - Print the help message for a specified command
    version - Print the version of the CLI

Flags:

  --version, -v - Print the version of the CLI.
  --help, -h - Print this help message, or the help message for the specified command
`);
};

// Use minimist to parse recognized flags and arguments
const argv = minimist(process.argv.slice(2), {
  boolean: ["help", "version"],
  string: ["dir", "mapdir"],
  alias: {
    help: ["h"]
  }
});

console.log(argv);

// Check if we have any arguments
if (argv._.length === 0) {
  printHelp();
  return;
}

//
