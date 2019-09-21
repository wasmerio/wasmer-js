// Service to fetch and instantiate modules
// And cache them to run again

import WasmTerminalPlugin, { CallbackCommand } from "../wasm-terminal-plugin";

import WasmTerminalConfig from "../wasm-terminal-config";

import WasmTty from "../wasm-tty/wasm-tty";

let wasmTransformerInit: any = () => {};
let lowerI64Imports: any = () => {};
/*ROLLUP_REPLACE_BROWSER
import wasmInit, { lower_i64_imports } from "@wasmer/wasm_transformer";
wasmTransformerInit = wasmInit;
lowerI64Imports = lower_i64_imports;
ROLLUP_REPLACE_BROWSER*/

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

export default class CommandFetcher {
  wasmTerminalConfig: WasmTerminalConfig;
  wasmTerminalPlugins: WasmTerminalPlugin[];
  commandToCompiledModuleCache: { [key: string]: WebAssembly.Module };
  wasmTty?: WasmTty;

  constructor(
    wasmTerminalConfig: WasmTerminalConfig,
    wasmTerminalPlugins: WasmTerminalPlugin[],
    wasmTty?: WasmTty
  ) {
    this.wasmTerminalConfig = wasmTerminalConfig;
    this.wasmTerminalPlugins = wasmTerminalPlugins;
    this.commandToCompiledModuleCache = {};

    if (wasmTty) {
      this.wasmTty = wasmTty;
    }
  }

  async getCommandForCommandName(commandName: string, wasmTty?: WasmTty) {
    let cachedData = this.commandToCompiledModuleCache[commandName];
    if (cachedData) {
      return cachedData;
    }

    // Initialize all the variables we need to build the module
    let commandUrl: string | undefined = undefined;
    let commandBinary: Uint8Array | undefined = undefined;
    let commandCallback: CallbackCommand | undefined = undefined;
    let commandCompiledModule: WebAssembly.Module | undefined = undefined;

    this._tryToWriteStatus(`[INFO] Searching for "${commandName}"...`);

    // Run through the plugins
    for (let i = 0; i < this.wasmTerminalPlugins.length; i++) {
      const wasmTerminalPlugin = this.wasmTerminalPlugins[i];

      const responsePromise = wasmTerminalPlugin.apply("beforeFetchCommand", [
        commandName
      ]);
      if (responsePromise) {
        const response = await responsePromise;

        if (!response) {
          i = this.wasmTerminalPlugins.length;
          continue;
        }

        if (typeof response === "string") {
          commandUrl = response;
        } else if (response instanceof Uint8Array) {
          commandBinary = response;
        } else if (typeof response === "function") {
          commandCallback = response;
        } else {
          commandCompiledModule = response;
        }

        i = this.wasmTerminalPlugins.length;
      }
    }

    this._tryToClearStatus();

    if (commandCallback) {
      return commandCallback;
    }

    // Doing things backwars for fetching, transforming, and compilng the module
    // To re-use code in the worst case scenario

    // Check if we were passed a resource to get this command name binary
    if (!commandCompiledModule && !commandBinary && !commandUrl) {
      commandUrl = await this._getWapmUrlForCommandName(commandName);
    }

    this._tryToWriteStatus(
      `[INFO] Downloading "${commandName}" from "${commandUrl}"`
    );

    if (!commandCompiledModule && !commandBinary && commandUrl) {
      commandBinary = await this._getBinaryFromUrl(commandUrl);
    }

    this._tryToClearStatus();

    if (!commandBinary) {
      throw new Error("Could not get the Wasm module binary");
    }

    this._tryToWriteStatus(`[INFO] Doing Transformations for "${commandName}"`);

    // Fetch the Wasm modules, but at least show the message for a short while
    commandCompiledModule = await Promise.all([
      this._getWasmModuleFromBinary(
        commandBinary,
        this.wasmTerminalConfig.wasmTransformerWasmUrl
      ),
      new Promise(resolve => setTimeout(resolve, 500))
    ]).then(responses => responses[0]);

    if (!commandCompiledModule) {
      throw new Error("Could not get/compile the compiled Wasm modules");
    }
    this.commandToCompiledModuleCache[commandName] = commandCompiledModule;

    this._tryToClearStatus();

    return commandCompiledModule;
  }

  _tryToWriteStatus(message: string) {
    if (this.wasmTty) {
      // Save the cursor position
      this.wasmTty.print("\u001b[s");

      this.wasmTty.print(message);
    }
  }

  _tryToClearStatus() {
    if (this.wasmTty) {
      // Restore the cursor position
      this.wasmTty.print("\u001b[u");

      // Clear from cursor to end of screen
      this.wasmTty.print("\u001b[1000D");
      this.wasmTty.print("\u001b[0J");
    }
  }

  async _getWapmUrlForCommandName(commandName: String) {
    const fetchResponse = await fetch("https://registry.wapm.io/graphql", {
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
    });
    const response = await fetchResponse.json();

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
  }

  async _getBinaryFromUrl(url: string) {
    const fetched = await fetch(url);
    const buffer = await fetched.arrayBuffer();
    return new Uint8Array(buffer);
  }

  async _getWasmModuleFromBinary(
    commandBinary: Uint8Array,
    wasmTransformerWasmUrl: string
  ): Promise<WebAssembly.Module> {
    // Make Modifications to the binary to support browser side WASI.
    let transformedBinary = commandBinary;
    await wasmTransformerInit(wasmTransformerWasmUrl);
    transformedBinary = lowerI64Imports(transformedBinary);

    const wasmModule = await WebAssembly.compile(transformedBinary);
    return wasmModule;
  }
}
