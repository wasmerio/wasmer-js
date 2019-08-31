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
echo "Running Clippy"
echo "============================================="
echo " "

cargo clippy

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
npx json -I -f pkg/package.json -e 'this.name="@wasmer/wasi_js_transformer"'

echo " "
echo "============================================="
echo "Moving pkg to wasi_js_transformer"
echo "============================================="
echo " "

cp -r pkg/ ../../packages/wasi_js_transformer
rm ../../packages/wasi_js_transformer/.gitignore || true


echo " "
echo "============================================="
echo "Moving pkg to wapm-shell"
echo "============================================="
echo " "

cp -r pkg/ ../../examples/wasm-shell/assets/wasi-js-transformer
rm ../../examples/wasm-shell/assets/wasi-js-transformer/.gitignore || true
rm ../../examples/wasm-shell/assets/wasi-js-transformer/README.md || true

echo " "
echo "============================================="
echo "Compiling wasm for node"
echo "============================================="
echo " "

wasm-pack build --target nodejs
npx json -I -f pkg/package.json -e 'this.name="@wasmer/wasi_js_transformer"'

echo " "
echo "============================================="
echo "Moving pkg to wapm-shell"
echo "============================================="
echo " "

cp -r pkg/ ../../examples/node-stubbed/wasi-js-transformer
rm ../../examples/node-stubbed/wasi-js-transformer/.gitignore || true
rm ../../examples/node-stubbed/wasi-js-transformer/README.md || true


echo " "
echo "============================================="
echo "Done!"
echo "============================================="
echo " "

