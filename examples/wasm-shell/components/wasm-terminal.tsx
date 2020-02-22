import { h, Component } from "preact";

// @ts-ignore
import WasmTerminal from "@wasmer/wasm-terminal";
import { fetchCommandFromWAPM } from "./wapm";

import { WASI } from "@wasmer/wasi";
// @ts-ignores
import BrowserWASIBindings from "@wasmer/wasi/bindings/browser";
import { lowerI64Imports } from "@wasmer/wasm-transformer";

import welcomeMessage from "./welcome-message";
import { WasmFs } from "@wasmer/wasmfs";
import { extractContents } from "@wasmer/wasmfs/lib/tar";

WASI.defaultBindings = BrowserWASIBindings;

const commands = {
  callback: (options: any, wasmFs: any) => {
    let myArr = new Uint8Array(1024);
    let stdin = wasmFs.fs.readSync(0, myArr, 0, 1024, 0);
    return Promise.resolve(
      `Callback Command Working! Options: ${options}, stdin: ${myArr}`
    );
  }
};

const getBinaryFromUrl = async (url: string) => {
  const fetched = await fetch(url);
  const buffer = await fetched.arrayBuffer();
  return new Uint8Array(buffer);
};

commands["wasmerboy"] = "./wasmerboy.wasm";
const wasmboyRom = "./tobutobugirl/tobutobugirl.gb";
commands["io-as-debug"] = "./io-as-debug.wasm";
commands["optimized"] = "./optimized.wasm";

var COMPILED_MODULES = {};
/**
 * A simple preact wrapper around the Wasm Terminal
 */
const processWorkerUrl = (document.getElementById("worker") as HTMLImageElement)
  .src;

export default class WasmTerminalComponent extends Component {
  container: HTMLElement | null;
  wasmTerminal: WasmTerminal;
  wasmFs: WasmFs;

  async fetchCommandHandler({args, env}: {
    args: Array<string>,
    env?: { [key: string]: string }
  }) {
    const commandName = args[0];
    const customCommand = (commands as any)[commandName];
    let wasmBinary = undefined;

    if (customCommand) {
      if (typeof customCommand === "string") {
        const fetched = await fetch(customCommand);
        const buffer = await fetched.arrayBuffer();
        wasmBinary = new Uint8Array(buffer);
        return await lowerI64Imports(wasmBinary);
      } else {
        return customCommand;
      }
    } else {
      const binaryName = `/bin/${commandName}`;
      if (!this.wasmFs.fs.existsSync(binaryName)) {
        this.wasmFs.fs.mkdirpSync("/bin");
        let command = await fetchCommandFromWAPM({args, env});

        const packageUrl = command.packageVersion.distribution.downloadUrl;
        let binary = await getBinaryFromUrl(packageUrl);
      
        const packageVersion = command.packageVersion;
        const installedPath = `/_wasmer/wapm_packages/${packageVersion.package.name}@${packageVersion.version}`;
        
        // We extract the contents on the desired directory
        await extractContents(this.wasmFs, binary, installedPath);
        
        const wasmFullPath = `${installedPath}/${command.module.source}`;
        const filesystem = packageVersion.filesystem;
        const wasmBinary = this.wasmFs.fs.readFileSync(wasmFullPath);
        const loweredBinary = await lowerI64Imports(wasmBinary as any);
        const loweredFullPath = `${wasmFullPath}.__lowered__`;
        this.wasmFs.fs.writeFileSync(loweredFullPath, loweredBinary);
        let preopens = {};
        filesystem.forEach(({ wasm, host }) => {
          preopens[wasm] = `${installedPath}/${host}`;
        });
        const mainFunction = new Function(`// wasi
return function main(options) {
  var preopens = ${JSON.stringify(preopens)};
  return {
    "args": options.args,
    "env": options.env,
    // We use the path for the lowered Wasm
    "modulePath": ${JSON.stringify(loweredFullPath)},
    "preopens": preopens,
  };
}
`)();
        this.wasmFs.fs.writeFileSync(binaryName, mainFunction.toString());
      }
      let fileContents = this.wasmFs.fs.readFileSync(binaryName, "utf8");
      let mainProgram = new Function(`return ${fileContents as string}`)();
      let program = mainProgram({args, env});
      if (!(program.modulePath in COMPILED_MODULES)) {
        let programContents;
        try {
          programContents = this.wasmFs.fs.readFileSync(program.modulePath);
        } catch {
          throw new Error(
            `The lowered module ${program.modulePath} doesn't exist`
          );
        }
        COMPILED_MODULES[program.modulePath] = Promise.resolve(
          WebAssembly.compile(programContents)
        );
      }
      program.module = await COMPILED_MODULES[program.modulePath];
      return program;
      // console.log(fileToExecute);
    }
  }

  constructor() {
    super();
    this.wasmFs = new WasmFs();
    this.wasmTerminal = new WasmTerminal({
      fetchCommand: this.fetchCommandHandler,
      processWorkerUrl,
      wasmFs: this.wasmFs
    });

    const TINY_PNG =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    const deser = new Buffer(TINY_PNG, "base64");
    const contents = Uint8Array.from(deser);
    this.wasmFs.volume.writeFileSync("/tiny.png", contents);

    // Kick off fetching and adding the wasmboy rom
    const wasmboyTask = async () => {
      const response = await fetch(wasmboyRom);
      const buffer = await response.arrayBuffer();
      const binary = new Uint8Array(buffer);
      this.wasmFs.volume.writeFileSync("/rom.gb", binary);
    };
    wasmboyTask();

    this.container = null;
  }

  componentDidMount() {
    if (!this.container) {
      return;
    }
    this.wasmTerminal.print(welcomeMessage);

    this.wasmTerminal.open(this.container);
    this.wasmTerminal.fit();
    this.wasmTerminal.focus();
  }

  componentWillUnmount() {
    this.wasmTerminal.destroy();
  }

  printHello() {
    this.wasmTerminal.print("hello");
  }

  runCowsayHello() {
    this.wasmTerminal.runCommand("cowsay hello");
  }

  runViu() {
    this.wasmTerminal.runCommand("viu /tiny.png");
  }

  runIoDevicesDebug() {
    this.wasmTerminal.runCommand("io-as-debug");
  }

  runWasmerBoy() {
    this.wasmTerminal.runCommand("wasmerboy /rom.gb");
  }

  render() {
    return (
      <div id="terminal-component">
        <div>
          <button onClick={() => this.printHello()}>Print "hello"</button>
          <button onClick={() => this.runCowsayHello()}>
            Run Cowsay Hello
          </button>
          <button onClick={() => this.runViu()}>Run Viu</button>
          <button onClick={() => this.runIoDevicesDebug()}>
            Run IO Devices Debug
          </button>
          <button onClick={() => this.runWasmerBoy()}>Run WasmerBoy</button>
          <br />
          <br />
        </div>
        <div id="terminal-container" ref={ref => (this.container = ref)} />
      </div>
    );
  }
}
