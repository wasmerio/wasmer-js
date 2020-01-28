import { Command } from "../command";

import { runCommand } from "./run";
import { versionCommand } from "./version";

const runHelp = (args: string[]) => {
  if (args.length === 0 || args[0] === "help") {
    helpCommand.help();
    return;
  }
};

const command = new Command({
  name: "help",
  description: "Show the usage of the passed subcommand",
  runCallback: runHelp,
  getHelpBody: () => {
    return `
USAGE:

help [subcommand] - Display the help message for the selected subcommand. 
    
    The available commands (other than help) are:
    ${runCommand.name} - ${runCommand.description}
    ${versionCommand.name} - ${versionCommand.description}`;
  }
});

export const helpCommand = command;
