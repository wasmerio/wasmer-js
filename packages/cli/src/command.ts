import minimist from "minimist";
// @ts-nocheck
// @ts-ignore
import { version } from "./package.json";

export class Command {
  description: string;
  minimistConfig: any;
  runCallback: (flags: any) => void;
  getHelpBody: () => void;

  constructor(commandConfig: {
    description: string;
    minimistConfig: any;
    runCallback: (flags: any) => void;
    getHelpBody: () => void;
  }) {
    this.description = commandConfig.description;
    this.runCallback = commandConfig.runCallback;
    this.getHelpBody = commandConfig.getHelpBody;
    this.minimistConfig = commandConfig.minimistConfig;
  }

  run(args: string[]) {
    const argv = minimist(args, this.minimistConfig);

    // Check if we got passed help
    if (argv.help) {
      this.help();
      return;
    }
    if (argv.version) {
      this.version();
      return;
    }

    this.runCallback(argv);
  }

  version() {
    const versionMessage = `wasmer-js ${version}`;
    console.log(versionMessage);
  }

  help() {
    let helpMessage = `wasmer-js ${version}
${this.description}`;

    const helpBody = this.getHelpBody();
    if (helpBody !== undefined) {
      helpMessage = `${helpMessage} 

${helpBody}`;
    }

    console.log(helpMessage);
  }
}
