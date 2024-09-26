import { expect } from "@esm-bundle/chai";
import {
  runWasix,
  wat2wasm,
  Wasmer,
  init,
  Directory,
} from "..";

const initialized = (async () => {
  await init({
    // module: new URL("../dist/wasmer_js_bg.wasm", import.meta.url),
    log: "warn",
  });
})();

describe("run", function () {
  this.timeout("60s").beforeAll(async () => await initialized);

  it("can execute a noop program", async () => {
    const noop = `(
            module
                (memory $memory 0)
                (export "memory" (memory $memory))
                (func (export "_start") nop)
            )`;
    const wasm = wat2wasm(noop);
    const module = await WebAssembly.compile(wasm);

    const instance = await runWasix(module, { program: "noop" });
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
  });

  it("can execute a Wasm file", async () => {
    const noop = `(
            module
                (memory $memory 0)
                (export "memory" (memory $memory))
                (func (export "_start") nop)
            )`;
    const wasm = wat2wasm(noop);
    const pkg = await Wasmer.fromWasm(wasm);
    const instance = await pkg.entrypoint!.run();

    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
  });


  it("can start quickjs", async () => {
    const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
    const quickjs = pkg.commands["quickjs"].binary();

    const instance = await runWasix(quickjs, {
      program: "quickjs",
      args: ["--eval", "console.log('Hello, World!')"],
    });
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
    expect(output.stdout).to.contain("Hello, World!");
    expect(output.stderr).to.be.empty;
  });

  it("can read directories", async () => {
    const dir = new Directory();
    await dir.writeFile("/file.txt", "");
    const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
    const quickjs = pkg.commands["quickjs"].binary();

    const instance = await runWasix(quickjs, {
      program: "quickjs",
      args: [
        "--std",
        "--eval",
        `[dirs] = os.readdir("/"); console.log(dirs.join("\\n"))`,
      ],
      mount: {
        "/mount": dir,
      },
    });
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
    expect(output.stdout).to.equal(".\n..\nmount\n");
    expect(output.stderr).to.be.empty;
  });

  it("can read files", async () => {
    const tmp = new Directory();
    await tmp.writeFile("/file.txt", "Hello, World!");
    const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
    const quickjs = pkg.commands["quickjs"].binary();

    const instance = await runWasix(quickjs, {
      program: "quickjs",
      args: [
        "--std",
        "--eval",
        `console.log(std.open('/tmp/file.txt', "r").readAsString())`,
      ],
      mount: {
        "/tmp": tmp,
      },
    });
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
    expect(output.stdout).to.equal("Hello, World!\n");
    expect(output.stderr).to.be.empty;
  });

  it("can read files mounted using DirectoryInit", async () => {
    const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
    const quickjs = pkg.commands["quickjs"].binary();

    const instance = await runWasix(quickjs, {
      program: "quickjs",
      args: [
        "--std",
        "--eval",
        `console.log(std.open('/tmp/file.txt', "r").readAsString())`,
      ],
      mount: {
        "/tmp": {
          "file.txt": "Hello, World!",
        },
      },
    });
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
    expect(output.stdout).to.equal("Hello, World!\n");
    expect(output.stderr).to.be.empty;
  });

  it("can write files", async () => {
    const dir = new Directory();
    const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
    const quickjs = pkg.commands["quickjs"].binary();
    const script = `
            const f = std.open('/mount/file.txt', 'w');
            f.puts('Hello, World!');
            f.close();
        `;

    const instance = await runWasix(quickjs, {
      program: "quickjs",
      args: ["--std", "--eval", script],
      mount: {
        "/mount": dir,
      },
    });
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(await dir.readTextFile("/file.txt")).to.equal("Hello, World!");
  });

  it("can accept strings as stdin", async () => {
    const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
    const quickjs = pkg.commands["quickjs"].binary();

    const instance = await runWasix(quickjs, {
      program: "quickjs",
      args: ["--interactive", "--std"],
      stdin: "console.log('Hello, World!');\nstd.exit(42)\n",
    });
    const output = await instance.wait();

    expect(output.code).to.equal(42);
    expect(output.stdout).to.contain("Hello, World!\n");
    expect(output.stderr).to.be.empty;
  });
});
