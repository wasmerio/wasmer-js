#!/bin/bash

set -e

echo "============================================="
echo "Running Tests"
echo "============================================="

cargo test -- --nocapture 

echo "============================================="
echo "Compiling wasm"
echo "============================================="

wasm-pack build --target web

echo "============================================="
echo "Moving pkg to wapm-shell"
echo "============================================="

cp -r pkg/* ../../examples/wapm-shell/assets/wasi-js-transformer
rm ../../examples/wapm-shell/assets/wasi-js-transformer/.gitignore || true
rm ../../examples/wapm-shell/assets/wasi-js-transformer/README.md || true

echo "============================================="
echo "Done!"
echo "============================================="

