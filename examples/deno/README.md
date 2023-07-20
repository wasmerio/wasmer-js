# Wasmer/WASI Deno examples

## Hello World

This example outputs hello world in the `stdout`.

```
$ deno run --allow-read helloworld.ts
hello world
(exit code: 0)
```

## Filesystem

This example lists the files and directories on `/`.

```
$ deno run --allow-read fs.ts
"./a"
"./b"
"./file"
(exit code: 0)
```
