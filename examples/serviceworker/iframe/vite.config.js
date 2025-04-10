import { defineConfig } from "vite";

// Custom plugin to serve wasmer@index.html for all routes except those starting with /wasmer@
function wasmerIndexHtmlPlugin() {
  return {
    name: 'wasmer-index-html-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Skip rewriting if the path already starts with /wasmer@
        if (req.url.startsWith('/wasmer@')) {
          return next();
        }
        
        // Rewrite all other requests to wasmer@index.html
        req.url = '/wasmer@index.html';
        next();
      });
    },
    // For production build
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/wasmer@')) {
          return next();
        }
        req.url = '/wasmer@index.html';
        next();
      });
    }
  };
}

export default defineConfig({
  // appType: 'mpa', // disable history fallback
  server: {
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
      "cross-origin-embedder-policy": "require-corp",
      "cross-origin-opener-policy": "same-origin",
      "cross-origin-resource-policy": "cross-origin",
    },
    fs: {
      allow: ["../../..", "."],
    },
    // Uncomment and use this instead of the plugin if preferred
    proxy: {
      '^(?!/wasmer@|/@fs|/@vite).*': {
        target: 'http://localhost:9001/',
        rewrite: () => "/wasmer@index.html",
      },
    },
  },
//   assetsInclude: ['**/*.js', '**/*.wasm', '**/*.html'],
//   build: {
//     modulePreload: {
//       polyfill: false,
//     },
//   },
  plugins: [
    // wasmerIndexHtmlPlugin(),
    // framework()
  ],
});
