// Service to fetch and instantiate modules
// And cache them to run again

import TerminalConfig from "../terminal-config";

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
  terminalConfig: TerminalConfig;
  commandToBinaryCache: { [key: string]: Uint8Array };
  commandToCompiledModuleCache: { [key: string]: WebAssembly.Module };
  additionalCommandsToUrl: { [key: string]: string };

  constructor(terminalConfig: TerminalConfig) {
    this.terminalConfig = terminalConfig;
    this.commandToBinaryCache = {};
    this.commandToCompiledModuleCache = {};
    this.additionalCommandsToUrl = {};

    // Fill our command to URL Cache with the
    // "additionalWasmCommands" in the Terminal Config
    if (this.terminalConfig.additionalWasmCommands) {
      Object.keys(this.terminalConfig.additionalWasmCommands).forEach(
        commandName => {
          // Using as any on next line as it thinks additionalWasmCommands may be undefined,
          // Even though we check above if it is not.
          this.additionalCommandsToUrl[commandName] = (this.terminalConfig
            .additionalWasmCommands as any)[commandName];
        }
      );
    }
  }

  async getWasmModuleForCommandName(commandName: string, wasmTty?: WasmTty) {
    let commandBinary = this.commandToBinaryCache[commandName];
    if (!commandBinary) {
      // Check if we were passed a resource to get this command name binary
      let commandUrl = undefined;
      if (this.additionalCommandsToUrl[commandName]) {
        commandUrl = this.additionalCommandsToUrl[commandName];
      } else {
        commandUrl = await this._getWapmUrlForCommandName(commandName);
      }

      if (wasmTty) {
        // Save the cursor position
        wasmTty.print("\u001b[s");

        wasmTty.print(
          `[INFO] Downloading "${commandName}" from "${commandUrl}"`
        );
      }

      commandBinary = await this._getBinaryFromUrl(commandUrl);
      this.commandToBinaryCache[commandName] = commandBinary;

      if (wasmTty) {
        // Restore the cursor position
        wasmTty.print("\u001b[u");

        // Clear from cursor to end of screen
        wasmTty.print("\u001b[1000D");
        wasmTty.print("\u001b[0J");
      }
    }

    let cachedData = this.commandToCompiledModuleCache[commandName];
    if (!cachedData) {
      if (wasmTty) {
        // Save the cursor position
        wasmTty.print("\u001b[s");

        wasmTty.print(`[INFO] Doing Transformations for "${commandName}"`);
      }

      // Fetch the wasm modules, but at least show the message for a short while
      cachedData = this.commandToCompiledModuleCache[
        commandName
      ] = await Promise.all([
        this._getWasmModuleFromBinary(
          commandBinary,
          this.terminalConfig.wasmTransformerWasmUrl
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
