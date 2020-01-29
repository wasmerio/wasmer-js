import { Command } from "../command";

export const versionCommand = new Command({
  name: "version",
  description: "Print the version of the CLI",
  runCallback: () => {
    const packageJson = require("../../package.json");
    console.log(`${packageJson.name}: ${packageJson.version}`);
  },
  getHelpBody: () => {
    return `
USAGE:
$ wasmer-js version
`;
  }
});
