// Service to fetch and instantiate modules
// And cache them to run again

import TerminalConfig from "../terminal-config";

import WasmTty from "../wasm-tty/wasm-tty";

import wasmInit, { lower_i64_imports } from "@wasmer/wasi_js_transformer";

// TODO: Allow passing in your own custom commands / wasm files

let commandToUrlCache: { [key: string]: string } = {};
let compiledModulesCache: { [key: string]: WebAssembly.Module } = {};

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
  url: string,
  wasiJsTransformerWasmUrl: string,
  commandName?: string,
  wasmTty?: WasmTty
): Promise<WebAssembly.Module> => {
  // @ts-ignore
  if (WebAssembly.compileStreaming && false) {
    // @ts-ignore
    return await WebAssembly.compileStreaming(fetch(url));
  } else {
    let fetched = await fetch(url);
    let buffer = await fetched.arrayBuffer();
    let binary = new Uint8Array(buffer);

    if (commandName && wasmTty) {
      // Restore the cursor position
      wasmTty.print("\u001b[u");

      // Clear from cursor to end of screen
      wasmTty.print("\u001b[1000D");
      wasmTty.print("\u001b[0J");

      wasmTty.print(`[INFO] Doing Transformations for "${commandName}"`);
    }

    // Make Modifications to the binary to support browser side WASI.
    await wasmInit(wasiJsTransformerWasmUrl);
    binary = lower_i64_imports(binary);

    const wasmModule = await WebAssembly.compile(binary);
    return wasmModule;
  }
};

export default class CommandFetcher {
  terminalConfig: TerminalConfig;

  constructor(terminalConfig: TerminalConfig) {
    this.terminalConfig = terminalConfig;

    // Fill our command to URL Cache with the
    // "additionalWasmCommands" in the Terminal Config
    if (this.terminalConfig.additionalWasmCommands) {
      Object.keys(this.terminalConfig.additionalWasmCommands).forEach(
        commandName => {
          // Using @ts-ignore on next line as it thinks additionalWasmCommands may be undefined,
          // Even though we check above if it is not.
          // @ts-ignore
          commandToUrlCache[
            commandName
          ] = this.terminalConfig.additionalWasmCommands[commandName];
        }
      );
    }
  }

  async getWasmModuleForCommandName(commandName: string, wasmTty?: WasmTty) {
    let commandUrl = commandToUrlCache[commandName];
    if (!commandUrl) {
      commandUrl = await getWapmUrlForCommandName(commandName);
      commandToUrlCache[commandName] = commandUrl;
    }

    let cachedData = compiledModulesCache[commandUrl];
    if (!cachedData) {
      if (wasmTty) {
        // Save the cursor position
        wasmTty.print("\u001b[s");

        wasmTty.print(
          `[INFO] Downloading "${commandName}" from "${commandUrl}"`
        );
      }

      // Fetch the wasm modules, but at least show the message for a short while
      cachedData = compiledModulesCache[commandUrl] = await Promise.all([
        getWasmModuleFromUrl(
          commandUrl,
          this.terminalConfig.wasiJsTransformerWasmUrl,
          commandName,
          wasmTty
        ),
        new Promise(resolve => setTimeout(resolve, 500))
      ]).then(responses => responses[0]);

      if (wasmTty) {
        // Restore the cursor position
        wasmTty.print("\u001b[u");

        // Clear from cursor to end of screen
        wasmTty.print("\u001b[1000D");
        wasmTty.print("\u001b[0J");
      }
    }

    return cachedData;
  }
}
