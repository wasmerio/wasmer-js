// Service to fetch and instantiate modules
// And cache them to run again

import asyncify from "./asyncify";

// @ts-ignore
import stdinWasmUrl from "../../assets/stdin.wasm";

let compiledModules: { [key: string]: WebAssembly.Module } = {};

let commands: any = {
  cowsay: "https://registry-cdn.wapm.dev/contents/_/cowsay/0.1.2/cowsay.wasm",
  a: stdinWasmUrl,
  matrix:
    "https://registry-cdn.wapm.dev/contents/syrusakbary/wasm-matrix/0.0.4/optimized.wasm",
  lolcat: "https://registry-cdn.wapm.dev/contents/_/lolcat/0.1.1/lolcat.wasm"
};

const getWasmModuleFromUrl = async (
  url: string
): Promise<WebAssembly.Module> => {
  // @ts-ignore
  if (WebAssembly.compileStreaming && false) {
    // @ts-ignore
    return await WebAssembly.compileStreaming(fetch(url));
  } else {
    let fetched = await fetch(url);
    let buffer = await fetched.arrayBuffer();
    return await WebAssembly.compile(buffer);
  }
};

export default class CommandCache {
  async getWasmModuleForCommandName(commandName: string) {
    let commandUrl = commands[commandName];
    if (!commandUrl) {
      throw new Error(`command not found ${commandName}`);
    }

    let cachedData = compiledModules[commandUrl];
    if (!cachedData) {
      cachedData = compiledModules[commandUrl] = await getWasmModuleFromUrl(
        commandUrl
      );
    }

    return cachedData;
  }
}
