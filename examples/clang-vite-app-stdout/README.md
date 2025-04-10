# Vite WASM App

## Setup

```sh
nvm use
npm install
```

## Run

```sh
$HOME/wasi-sdk-25.0-x86_64-linux/bin/clang --sysroot=$HOME/wasi-sdk-25.0-x86_64-linux/share/wasi-sysroot -o src/hello.wasm src/hello.c
npm run build
npm run preview
```
