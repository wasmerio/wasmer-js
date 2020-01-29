import { Command } from "../command";

const showVersion = (args: string[]) => {
  if (args[0] === "help") {
    versionCommand.help();
    return;
  }

  const packageJson = require("../../package.json");
  console.log(`${packageJson.name}: ${packageJson.version}`);
};

export const versionCommand = new Command({
  name: "version",
  description: "Print the version of the CLI",
  runCallback: showVersion,
  getHelpBody: () => {
    return `
USAGE:
$ wasmer-js version

ARGUMENTS:

help - Display this help message
`;
  }
});
