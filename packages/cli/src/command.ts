export class Command {
  name: string;
  description: string;
  runCallback: Function;
  getHelpBody: Function;

  constructor(commandConfig: {
    name: string;
    description: string;
    runCallback: Function;
    getHelpBody: Function;
  }) {
    this.name = commandConfig.name;
    this.description = commandConfig.description;
    this.runCallback = commandConfig.runCallback;
    this.getHelpBody = commandConfig.getHelpBody;
  }

  run(args: string[], flags: Object) {
    this.runCallback(args, flags);
  }

  help() {
    console.log(`
wasmer-js ${this.name}
${this.description}

${this.getHelpBody()}
`);
  }
}
