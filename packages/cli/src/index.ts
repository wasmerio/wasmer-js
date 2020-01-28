import * as minimist from "minimist";

const argv = minimist(process.argv.slice(2), {
  boolean: ["help"],
  string: ["dir", "mapdir"],
  alias: {
    help: ["h"]
  }
});

console.log(argv);
