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
echo "Compiling Wasm for web"
echo "============================================="
echo " "

wasm-pack build --target web
npx json -I -f pkg/package.json -e 'this.name="@wasmer/wasm-transformer"'
npx json -I -f pkg/package.json -e 'this.publishConfig={"access": "public"}'

echo " "
echo "============================================="
echo "Moving pkg to wasm-transformer"
echo "============================================="
echo " "

cp -r pkg/ ../../packages/wasm-transformer/wasm-pack/web
rm ../../packages/wasm-transformer/wasm-pack/web/.gitignore || true

echo " "
echo "============================================="
echo "Compiling Wasm for node"
echo "============================================="
echo " "

wasm-pack build --target nodejs
npx json -I -f pkg/package.json -e 'this.name="@wasmer/wasm-transformer"'
npx json -I -f pkg/package.json -e 'this.publishConfig={"access": "public"}'

echo " "
echo "============================================="
echo "Moving pkg to wasm-transformer"
echo "============================================="
echo " "

cp -r pkg/ ../../packages/wasm-transformer/wasm-pack/node
rm ../../packages/wasm-transformer/wasm-pack/node/.gitignore || true

echo " "
echo "============================================="
echo "Compiling Wasm for bundler"
echo "============================================="
echo " "

wasm-pack build --target bundler
npx json -I -f pkg/package.json -e 'this.name="@wasmer/wasm-transformer"'
npx json -I -f pkg/package.json -e 'this.publishConfig={"access": "public"}'

echo " "
echo "============================================="
echo "Moving pkg to wasm-transformer"
echo "============================================="
echo " "

cp -r pkg/ ../../packages/wasm-transformer/wasm-pack/bundler
rm ../../packages/wasm-transformer/wasm-pack/bundler/.gitignore || true

echo " "
echo "============================================="
echo "Done!"
echo "============================================="
echo " "

