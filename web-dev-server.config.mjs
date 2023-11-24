import { chromeLauncher } from '@web/test-runner';
import { esbuildPlugin } from '@web/dev-server-esbuild';

async function add_headers(ctx, next) {
  ctx.set('Cross-Origin-Opener-Policy', "same-origin");
  ctx.set('Cross-Origin-Embedder-Policy', "require-corp");
  await next(ctx);
}

export default {
  files: ['tests/**/*.test.ts'],
  plugins: [esbuildPlugin({ ts: true })],
  middlewares: [add_headers],
  browsers: [chromeLauncher({ launchOptions: { devtools: true } })],
  testsFinishTimeout: 10 * 60 * 1000,
};
