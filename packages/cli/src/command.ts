export class Command {
  name: string;
  description: string;
  runCallback: (args: string[], flags: any) => void;
  getHelpBody: () => void;

  constructor(commandConfig: {
    name: string;
    description: string;
    runCallback: (args: string[], flags: any) => void;
    getHelpBody: () => void;
  }) {
    this.name = commandConfig.name;
    this.description = commandConfig.description;
    this.runCallback = commandConfig.runCallback;
    this.getHelpBody = commandConfig.getHelpBody;
  }

  run(args: string[], flags: any) {
    // Check if we got passed help
    if (flags.help) {
      this.help();
      return;
    }

    this.runCallback(args, flags);
  }

  help() {
    let helpMessage = `
wasmer-js ${this.name}
${this.description}`;

    const helpBody = this.getHelpBody();
    if (helpBody !== undefined) {
      helpMessage = `${helpMessage} 
${helpBody}
`;
    }

    console.log(helpMessage);
  }
}
