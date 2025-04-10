import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
    fs: {
      allow: ["../../..", "node_modules/@wasmer/sdk/dist"],
    },
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
});
