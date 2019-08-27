#!/bin/bash

set -e

echo " "
echo "============================================="
echo "Running Formatter"
echo "============================================="
echo " "

cargo fmt --all

echo " "
echo "============================================="
echo "Running Tests"
echo "============================================="
echo " "

cargo test -- --nocapture 

echo " "
echo "============================================="
echo "Compiling wasm for web"
echo "============================================="
echo " "

wasm-pack build --target web

echo " "
echo "============================================="
echo "Moving pkg to wapm-shell"
echo "============================================="
echo " "

cp -r pkg/ ../../examples/wapm-shell/assets/wasi-js-transformer
rm ../../examples/wapm-shell/assets/wasi-js-transformer/.gitignore || true
rm ../../examples/wapm-shell/assets/wasi-js-transformer/README.md || true

echo " "
echo "============================================="
echo "Compiling wasm for node"
echo "============================================="
echo " "

wasm-pack build --target nodejs

echo " "
echo "============================================="
echo "Moving pkg to wapm-shell"
echo "============================================="
echo " "

cp -r pkg/ ../../examples/node/wasi-js-transformer
rm ../../examples/node/wasi-js-transformer/.gitignore || true
rm ../../examples/node/wasi-js-transformer/README.md || true


echo " "
echo "============================================="
echo "Done!"
echo "============================================="
echo " "

