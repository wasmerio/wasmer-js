import * as minimist from "minimist";

import { runCommand } from "./commands/run";
import { versionCommand } from "./commands/version";
import { helpCommand } from "./commands/help";

// Define our base help command
const printHelp = () => {
  console.log(`
wasmer-js - @wasmer/cli for using Wasm modules with Wasmer JS from the command line.

Usage:

  wasmer-js COMMAND - run the specified command. The available commands are:

    ${runCommand.name} - ${runCommand.description}
    ${versionCommand.name} - ${versionCommand.description}
    ${helpCommand.name} - ${helpCommand.description}

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
    help: ["h"],
    version: ["v"]
  }
});

const run = () => {
  console.log(argv);

  // Check if we have the version  flag
  if (argv.version) {
    versionCommand.run([], {});
    return;
  }

  // Check if we have any arguments
  if (argv._.length === 0) {
    printHelp();
    return;
  }

  // Get our subcommand
  const subcommand = argv._.shift();

  // Split our arguments into args and flags
  const args = argv._.slice(0);
  const flags = {
    ...argv
  };
  delete flags["_"];

  // Call our correct subcommand
  if (subcommand === versionCommand.name) {
    versionCommand.run(args, flags);
    return;
  } else if (subcommand === helpCommand.name) {
    helpCommand.run(args, flags);
    return;
  } else if (subcommand === runCommand.name) {
    runCommand.run(args, flags);
    return;
  }

  // Print help because we did not recognize the subcommand
  printHelp();
};
run();
