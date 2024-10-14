import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
    fs: {
      allow: ["../..", "node_modules/@wasmer/sdk/dist"],
    },
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
});
