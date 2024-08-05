import { defineConfig } from "vite";
import { exec } from "node:child_process";

export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  plugins: [
    {
      name: "cargo-build",
      buildStart: () => {
        return new Promise((resolve, reject) => {
          exec(
            "cargo build --target=wasm32-wasi --manifest-path=markdown-renderer/Cargo.toml --release --quiet",
            (err, stdout, stderr) => {
              if (err) {
                console.log("Stdout:", stdout);
                console.log("Stderr:", stderr);
                reject(err);
              } else {
                resolve();
              }
            },
          );
        });
      },
    },
  ],
});
