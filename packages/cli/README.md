# @wasmer/cli

The CLI for executing Wasmer-JS

[![Version](https://img.shields.io/npm/v/@wasmer/cli.svg)](https://npmjs.org/package/@wasmer/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@wasmer/cli.svg)](https://npmjs.org/package/@wasmer/cli)
[![License](https://img.shields.io/npm/l/@wasmer/cli.svg)](https://github.com/wasmerio/wasmer-js/blob/master/package.json)

Documentation for Wasmer-JS Stack can be found on the [Wasmer Docs](https://docs.wasmer.io/wasmer-js/wasmer-js).

- [Usage](#usage)
- [Commands](#commands)

# Usage

```sh-session
$ npm install -g @wasmer/cli

...npm installation stuff here...

$ wasmer-js

wasmer-js - @wasmer/cli for using Wasm modules with Wasmer JS from the command line.

USAGE:

  $ wasmer-js [SUBCOMMAND] - run the specified command.

  ARGUMENTS:

    [SUBCOMMAND] - A command that can be run by the wasmer-js CLI. The avaiilable commands are:

    run - Run a WebAssembly file with Wasmer-JS
    version - Print the version of the CLI
    help - Show the usage of the passed subcommand

FLAGS:

  --version, -v - Print the version of the CLI.
  --help, -h - Print this help message, or the help message for the specified command
```

# SubCommands

- [`wasmer-js run [FILE]`](#wasmer-js-run-file)
- [`wasmer-js version`](#wasmer-js-help-command)

## `wasmer-js run [FILE]`

Run a WebAssembly file with Wasmer-JS

```
wasmer-js run
Run a WebAssembly file with Wasmer-JS

USAGE:
$ wasmer-js run [FILE]

ARGUMENTS:

[FILE] - The WASI compiled ".wasm" file we would like to run

help - Display this help message

FLAGS:

--dir=[some-directory] - WASI pre-opened directory. Can be passed multiple times for multiple directories.
--mapdir=[host-directory:guest-directory] - Map a host directory to a different location for the wasm module. Can be passed multiple times for multiple directories.
```

## `wasmer-js version`

Display the current wasmer-js CLI version

```
wasmer-js version
Print the version of the CLI

USAGE:
$ wasmer-js version

ARGUMENTS:

help - Display this help message
```
