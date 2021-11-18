const path = require('path')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

module.exports = {
    mode: 'development',
    entry: './lib.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, '.'),
        }),
    ],
    experiments: {
        asyncWebAssembly: true,
        // syncWebAssembly: true,
    },
}
