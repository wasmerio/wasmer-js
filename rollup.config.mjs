import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import { wasm } from "@rollup/plugin-wasm";

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

const makeConfig = (env = "development", input, name, plugins = []) => {
  const config = {
    input,
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
        file: `dist/${name}.mjs`,
        format: "es",
        exports: "named",
        globals: GLOBALS,
      },
    ],
    plugins: [
      typescript({
        rootDir: "src-js",
      }),
      ...plugins,
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
  config.plugins.push(
    replace({
      values: {
        "globalThis.wasmUrl": `"https://unpkg.com/${pkg.name}@${pkg.version}/pkg/wasmer_js_bg.wasm"`,
        "globalThis.workerUrl": `"https://unpkg.com/${pkg.name}@${pkg.version}/dist/WasmerSDK.mjs"`,
      },
      preventAssignment: true,
    }),
  );

  return config;
};

export default commandLineArgs => {
  let env =
    commandLineArgs.environment === "BUILD:production" ? "production" : null;
  const configs = [
    makeConfig(env, "src-js/WasmerSDK.ts", LIBRARY_NAME),
    makeConfig(env, "src-js/WasmerSDKBundled.ts", `${LIBRARY_NAME}Bundled`, [
      wasm({
        maxFileSize: 100 * 1024 * 1024,
      }),
    ]),
    makeConfig(env, "src-js/node.ts", "node"),
    {
      input: "./pkg/wasmer_js.d.ts",
      output: [{ file: "dist/pkg/wasmer_js.d.ts", format: "es" }],
      plugins: [dts()],
    },
  ];

  return configs;
};
