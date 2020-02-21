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
wasmer-js 0.7.1
The Wasmer Engineering Team <engineering@wasmer.io>
Node.js Wasm execution runtime.

USAGE:
    wasmer <SUBCOMMAND>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

SUBCOMMANDS:
    help           Prints this message or the help of the given subcommand(s)
    run            Run a WebAssembly file. Formats accepted: wasm, wat
    validate       Validate a Web Assembly binary
```

# SubCommands

- [`wasmer-js [FILE]`](#wasmer-js-run-file) (same as `wasmer-js run [FILE]`)
- [`wasmer-js run [FILE]`](#wasmer-js-run-file)
- [`wasmer-js --version`](#wasmer-js-help-command)

## `wasmer-js run [FILE]`

Run a WebAssembly file with Wasmer-JS

```
$ wasmer-js run
wasmer-js 0.7.1
Run a WebAssembly file. Formats accepted: wasm, wat

USAGE:
    wasmer-js run [FLAGS] [OPTIONS] <path> [--] [--]...

FLAGS:
    -h, --help                              Prints help information
    -V, --version                           Prints version information

OPTIONS:
        --env <env-vars>...                  Pass custom environment variables
        --mapdir <mapped-dirs>...            Map a host directory to a different location for the wasm module
        --dir <pre-opened-directories>...    WASI pre-opened directory

ARGS:
    <path>     Input file
    <-->...    Application arguments
```

## `wasmer-js --version`

Display the current wasmer-js CLI version

```
$ wasmer-js --version
wasmer-js 0.7.1
```
