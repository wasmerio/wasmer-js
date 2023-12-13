import nodePolyfills from "rollup-plugin-node-polyfills";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import copy from 'rollup-plugin-copy';
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel';
import { wasm } from '@rollup/plugin-wasm';
import url from "@rollup/plugin-url";

const LIBRARY_NAME = "WasmerSDK"; // Change with your library's name
const EXTERNAL = []; // Indicate which modules should be treated as external
const GLOBALS = {}; // https://rollupjs.org/guide/en/#outputglobals

const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @homepage ${pkg.homepage}
 * @repository ${pkg.repository.url}
 * @license ${pkg.license}
 */`;

const makeConfig = (env = "development", input = "lib.ts", name = LIBRARY_NAME, plugins = []) => {
    const config = {
        input: input,
        external: EXTERNAL,
        output: [
            {
                banner,
                name: name,
                file: `dist/${name}.umd.js`,
                format: "umd",
                exports: "auto",
                globals: GLOBALS,
            },
            {
                banner,
                file: `dist/${name}.cjs`,
                format: "cjs",
                exports: "auto",
                globals: GLOBALS,
            },
            {
                banner,
                file: `dist/${name}.js`,
                format: "es",
                exports: "named",
                globals: GLOBALS,
            },
        ],
        plugins: [
            // getBabelOutputPlugin({
            //     presets: ["@babel/env", {  }]
            // }),
            typescript(),
            ...plugins,
            // url({
            //     include: ["**/*.wasm"],
            //     limit: 100 * 1000 * 1000,
            // }),
            // nodePolyfills(),
            copy({
                targets: [
                  { src: ['pkg/wasmer_js_bg.wasm', 'pkg/wasmer_js_bg.wasm.d.ts'], dest: 'dist' },
                ]
            })
        ],
    };

    if (env === "production") {
        config.plugins.push(
            terser({
                output: {
                    comments: /^!/,
                },
            }),
        );
    }

    return config;
};

export default commandLineArgs => {
    let env = commandLineArgs.environment === "BUILD:production" ? "production": null;
    const configs = [
        makeConfig(env, "lib.ts"),
        makeConfig(env, "lib_bundled.ts", `${LIBRARY_NAME}Bundled`, [wasm({
            maxFileSize: 10 * 1024 * 1024,
        })]),
        {
            input: "./pkg/wasmer_js.d.ts",
            output: [{ file: "dist/pkg/wasmer_js.d.ts", format: "es" }],
            plugins: [dts()],
        },
    ];

    // Production
    // if (commandLineArgs.environment === "BUILD:production") {
    //     configs.push(makeConfig("production"));
    // }

    return configs;
};
