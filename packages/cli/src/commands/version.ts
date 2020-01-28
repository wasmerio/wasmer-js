import { Command } from "../command";

const packageJson = require("../../package.json");

export const versionCommand = new Command({
  name: "version",
  description: "Print the version of the CLI",
  runCallback: () => {
    console.log(`${packageJson.name}: ${packageJson.version}`);
  },
  getHelpBody: () => {
    return `USAGE:
$ wasmer-js version
`;
  }
});
