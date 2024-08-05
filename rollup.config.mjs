import terser from "@rollup/plugin-terser";
import pkg from "./package.json" with { type: "json" };
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
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
        file: `dist/${name}.js`,
        format: "es",
        exports: "named",
        globals: GLOBALS,
      },
    ],
    plugins: [
      typescript(),
      ...plugins,
      copy({
        targets: [
          {
            src: ["pkg/wasmer_js_bg.wasm", "pkg/wasmer_js_bg.wasm.d.ts"],
            dest: "dist",
          },
        ],
      }),
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
        "globalThis.wasmUrl": `"https://unpkg.com/${pkg.name}@${pkg.version}/dist/wasmer_js_bg.wasm"`,
        "globalThis.workerUrl": `"https://unpkg.com/${pkg.name}@${pkg.version}/dist/WasmerSDK.js"`,
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
    makeConfig(env, "WasmerSDK.ts", LIBRARY_NAME),
    makeConfig(env, "WasmerSDKBundled.ts", `${LIBRARY_NAME}Bundled`, [
      wasm({
        maxFileSize: 100 * 1024 * 1024,
      }),
    ]),
    {
      input: "./pkg/wasmer_js.d.ts",
      output: [{ file: "dist/pkg/wasmer_js.d.ts", format: "es" }],
      plugins: [dts()],
    },
  ];

  return configs;
};
