#!/bin/bash

# https://00f.net/2019/04/07/compiling-to-webassembly-with-llvm-and-clang/

set -e

clang --target=wasm32-unknown-wasi --sysroot /tmp/wasi-libc \
  -Os -s -g -o gettimeofday.wasm gettimeofday.c

wasm2wat gettimeofday.wasm -o gettimeofday.wat
