// Class that contains the "Options" for contructing and creating commands in a process

type CommandOptions = {
  args: string[];
  env: { [key: string]: string };
  preopens?: { [key: string]: string };
  module?: WebAssembly.Module;
  callback?: Function;
};

export default CommandOptions;
