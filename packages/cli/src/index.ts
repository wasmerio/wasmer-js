import minimist from "minimist";

import { runCommand } from "./commands/run";
import { getVersion } from "./version";

// Define our base help command
const printHelp = () => {
  console.log(`wasmer-js ${getVersion()}
The Wasmer Engineering Team <engineering@wasmer.io>
Node.js Wasm execution runtime.

USAGE:
    wasmer <SUBCOMMAND>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

SUBCOMMANDS:
    help           Prints this message or the help of the given subcommand(s)
    run            Run a WebAssembly file. Formats accepted: wasm, wat
    validate       Validate a Web Assembly binary`);
};

const printVersion = () => {
  console.log(`wasmer-js ${getVersion()}`);
};

// Use minimist to parse recognized flags and arguments
const argv = minimist(process.argv.slice(2), {
  boolean: ["help", "version"],
  alias: {
    help: ["h"],
    version: ["V"]
  }
});

const run = () => {
  // Check if we have the version  flag
  if (argv.version) {
    printVersion();
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
  delete flags._;

  // Call our correct subcommand
  if (subcommand === "run") {
    runCommand.run(process.argv.slice(3));
    return;
  }

  // Do "run" as the default subcommand
  runCommand.run(process.argv.slice(2));
};
run();
