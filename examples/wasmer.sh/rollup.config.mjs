import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import serve from "rollup-plugin-serve";
import postcss from 'rollup-plugin-postcss';


export default function configure() {
    const config = {
        input: "index.html",
        output: { dir: "dist" },
        plugins: [
            html(),
            typescript(),
            nodeResolve(),
            commonjs(),
            url({
                include: ["**/*.wasm"],
                limit: 1 * 1024 * 1024,
            }),
            postcss({
                extensions: [".css"],
            }),
        ],
    };

    if (process.env.ROLLUP_WATCH) {
        config.plugins.push(serve({
            contentBase: "dist",
            headers: {
                "Cross-Origin-Opener-Policy": "same-origin",
                "Cross-Origin-Embedder-Policy": "require-corp",
            }
        }));
    }

    return config;
}
