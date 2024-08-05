import { chromeLauncher } from "@web/test-runner";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { fromRollup } from "@web/dev-server-rollup";
import rollupReplace from "@rollup/plugin-replace";
import dotenv from "dotenv";
dotenv.config();

async function add_headers(ctx, next) {
  ctx.set("Cross-Origin-Opener-Policy", "same-origin");
  ctx.set("Cross-Origin-Embedder-Policy", "require-corp");
  await next(ctx);
}

const envPlugin = fromRollup(rollupReplace)({
  preventAssignment: true,
  values: {
    "process.env.WASMER_TOKEN": JSON.stringify(process.env.WASMER_TOKEN),
    "process.env.WASMER_TEST_OWNER": JSON.stringify(
      process.env.WASMER_TEST_OWNER,
    ),
  },
});

export default {
  files: ["tests/**/*.test.ts"],
  plugins: [esbuildPlugin({ ts: true }), envPlugin],
  middlewares: [add_headers],
  browsers: [chromeLauncher({ launchOptions: { devtools: true } })],
  testsFinishTimeout: 10 * 60 * 1000,
  environmentVariables: {
    API_URL: process.env.HELLO,
  },
  groups: [
    {
      name: "reg",
      files: ["tests/registry.test.ts"],
    },
  ],
};
