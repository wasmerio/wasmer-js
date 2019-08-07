// Service to fetch and instantiate modules
// And cache them to run again

import { Terminal } from "xterm";

// @ts-ignore
import stdinWasmUrl from "../../assets/stdin.wasm";

let compiledModules: { [key: string]: WebAssembly.Module } = {};
let commandToUrlCache: { [key: string]: string } = {};

const WAPM_GRAPHQL_QUERY = `query shellGetCommandQuery($command: String!) {
  command: getCommand(name: $command) {
    command
    module {
      abi
      publicUrl
    }
    packageVersion {
      package {
        displayName
      }
    }
  }
}`;

const getWapmUrlForCommandName = async (commandName: String) => {
  return await fetch("https://registry.wapm.io/graphql", {
    method: "POST",
    body: JSON.stringify({
      operationName: "shellGetCommandQuery",
      query: WAPM_GRAPHQL_QUERY,
      variables: {
        command: commandName
      }
    })
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);

      throw new Error(`command not found ${commandName}`);
    });
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
  async getWasmModuleForCommandName(commandName: string, xterm?: Terminal) {
    let commandUrl = commandToUrlCache[commandName];
    if (!commandUrl) {
      const commandUrl = await getWapmUrlForCommandName(commandName);
      commandToUrlCache[commandName] = commandUrl;
    }

    let cachedData = compiledModules[commandUrl];
    if (!cachedData) {
      if (xterm) {
        xterm.write(`[INFO] Downloading "${commandName}" from "${commandUrl}"`);
        xterm.write("\r\n");
      }

      cachedData = compiledModules[commandUrl] = await getWasmModuleFromUrl(
        commandUrl
      );
    }

    return cachedData;
  }
}
