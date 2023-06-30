import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };
import dts from "rollup-plugin-dts";
import typescript from '@rollup/plugin-typescript';

const LIBRARY_NAME = 'lib'; // Change with your library's name
const EXTERNAL = ["whatwg-workers", "node-fetch"]; // Indicate which modules should be treated as external
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

const typescriptPlugin = typescript();
const terserPlugin = terser({
    output: {
        comments: /^!/,
    },
});

const makeConfig = (env = 'development') => {
    let bundleSuffix = env === 'production' ? 'min.' : '';
    const config = {
        input: 'lib.ts',
        external: EXTERNAL,
        output: [
            {
                banner,
                dir: `dist`, // CommonJS
                entryFileNames: `${LIBRARY_NAME}.${bundleSuffix}cjs`,
                chunkFileNames: `[name].${bundleSuffix}cjs`,
                format: 'cjs',
                exports: 'auto',
                globals: GLOBALS
            },
            {
                banner,
                dir: `dist`, // ESM
                entryFileNames: `${LIBRARY_NAME}.${bundleSuffix}mjs`,
                chunkFileNames: `[name].${bundleSuffix}mjs`,
                format: 'es',
                exports: 'auto',
                globals: GLOBALS
            },
            {
                banner,
                name: LIBRARY_NAME,
                file: `dist/${LIBRARY_NAME}.umd.${bundleSuffix}js`, // UMD
                format: 'umd',
                exports: 'auto',
                globals: GLOBALS,
                inlineDynamicImports: true
            }
        ],
        plugins: [ typescriptPlugin ]
    };
    if (env === 'production') {
        config.plugins.push(terserPlugin);
    }
    return config;
};

export default commandLineArgs => {
    const configs = [
        makeConfig('development'),
        {
            input: "./pkg/wasmer_wasix_js.d.ts",
            output: [{ file: "dist/pkg/wasmer_wasix_js.d.ts", format: "es" }],
            plugins: [dts()],
        }
    ];
    // Production
    if (commandLineArgs.environment === 'BUILD:production') {
        configs.push(makeConfig('production'))
    }
    return configs;
};
