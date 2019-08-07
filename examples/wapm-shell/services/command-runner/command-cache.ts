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
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
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
      const optionalChaining = (baseObject: any, chain: Array<string>): any => {
        const newObject = baseObject[chain[0]];
        chain.shift();
        if (newObject) {
          if (chain.length > 1) {
            return optionalChaining(newObject, chain);
          }

          return true;
        }
        return false;
      };

      if (
        optionalChaining(response, ["data", "command", "module", "publicUrl"])
      ) {
        const wapmModule = response.data.command.module;

        if (wapmModule.abi !== "wasi") {
          throw new Error(
            `${commandName} does not use the wasi abi. Currently, only the wasi abi is supported on the wapm shell.`
          );
        }

        return wapmModule.publicUrl;
      } else {
        throw new Error(`command not found ${commandName}`);
      }
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
      commandUrl = await getWapmUrlForCommandName(commandName);
      commandToUrlCache[commandName] = commandUrl;
    }

    let cachedData = compiledModules[commandUrl];
    if (!cachedData) {
      if (xterm) {
        // Save the cursor position
        xterm.write("\u001b[s");

        xterm.write(`[INFO] Downloading "${commandName}" from "${commandUrl}"`);
      }

      // Fetch the wasm modules, but at least show the message for a short while
      cachedData = compiledModules[commandUrl] = await Promise.all([
        getWasmModuleFromUrl(commandUrl),
        new Promise(resolve => setTimeout(resolve, 500))
      ]).then(responses => responses[0]);

      if (xterm) {
        // Restore the cursor position
        xterm.write("\u001b[u");

        // Clear from cursor to end of screen
        xterm.write("\u001b[1000D");
        xterm.write("\u001b[0J");
      }
    }

    return cachedData;
  }
}
