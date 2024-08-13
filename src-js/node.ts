export * from "./";
import { init as load, InitOutput, WasmerInitInput, VolumeTree } from "./";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Initialize the underlying WebAssembly module, defaulting to an embedded
 * copy of the `*.wasm` file.
 */
export const init = async (
  initValue?: WasmerInitInput,
): Promise<InitOutput> => {
  if (!initValue) {
    initValue = {};
  }

  if (!initValue.module) {
    const path = new URL("wasmer_js_bg.wasm", import.meta.url).pathname;
    initValue.module = await fs.readFile(path);
  }
  return load(initValue);
};

export async function walkDir(dir: string, result: VolumeTree = {}) {
  let list = await fs.readdir(dir);
  for (let item of list) {
    const itemPath = path.join(dir, item);
    let stats = await fs.stat(itemPath);
    if (await stats.isDirectory()) {
      result[item] = {};
      await walkDir(itemPath, result[item] as VolumeTree);
    } else {
      const fileName = path.basename(item);
      result[fileName] = {
        data: new Uint8Array(await fs.readFile(itemPath)), // , { encoding: 'utf-8'}
        modified: stats.mtime,
      };
    }
  }
  return result;
}
