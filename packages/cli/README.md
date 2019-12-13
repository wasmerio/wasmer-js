# @wasmer/cli

The CLI for executing Wasmer-JS

[![Version](https://img.shields.io/npm/v/@wasmer/cli.svg)](https://npmjs.org/package/@wasmer/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@wasmer/cli.svg)](https://npmjs.org/package/@wasmer/cli)
[![License](https://img.shields.io/npm/l/@wasmer/cli.svg)](https://github.com/wasmerio/wasmer-js/blob/master/package.json)

<!-- toc -->

- [@wasmer/cli](#wasmercli)
- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @wasmer/cli
$ wasmer-js COMMAND
running command...
$ wasmer-js (-v|--version|version)
@wasmer/cli/0.5.1 darwin-x64 node-v10.16.3
$ wasmer-js --help [COMMAND]
USAGE
  $ wasmer-js COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`wasmer-js help [COMMAND]`](#wasmer-js-help-command)
- [`wasmer-js run [FILE]`](#wasmer-js-run-file)

## `wasmer-js help [COMMAND]`

display help for wasmer-js

```
USAGE
  $ wasmer-js help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `wasmer-js run [FILE]`

Run a WebAssembly file with Wasmer-JS

```
USAGE
  $ wasmer-js run [FILE]

OPTIONS
  -h, --help       show CLI help
  --dir=dir
  --mapdir=mapdir

EXAMPLE
  $ wasmer-js run hello.wasm
  hello world
```

_See code: [src/commands/run.ts](https://github.com/wasmerio/wasmer-js/blob/v0.5.1/src/commands/run.ts)_

<!-- commandsstop -->
