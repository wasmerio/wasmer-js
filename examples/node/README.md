# Wasmer/WASI Node examples

You can run the code with:

```shell
npm i
```

## Hello World

This example outputs hello world in the `stdout`.

```
$ node helloworld.mjs
hello world
(exit code: 0)
```

## Filesystem

This example lists the files and directories on `/`.

```
$ node fs.mjs
"./a"
"./b"
"./file"
(exit code: 0)
```