const path = require('path')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: './lib.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        // rules: [{
        //     test: /\.wasm/,
        //     type: 'asset/inline'
        // }]
    },
    plugins: [
        new WasmPackPlugin({
            extraArgs: '--target web',
            crateDirectory: path.resolve(__dirname, '.'),
        }),
    ],
    experiments: {
        asyncWebAssembly: true,
        // syncWebAssembly: true,
    },
}
