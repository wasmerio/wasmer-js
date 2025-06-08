import { resolve } from "path";
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
    rollupOptions: {
      input: {
        // Define entry points for the build
        main: resolve(__dirname, "index.html"),

      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Filenames you want to keep unhashed
          if (chunkInfo.name === "main") {
            return "index.html";
          }

          return "assets/[name].js"; // Hash other entry files
        },
        // Naming patterns for various output file types
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
