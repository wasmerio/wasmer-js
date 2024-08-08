import { expect } from "@esm-bundle/chai";
import { Wasmer, init, Directory } from "..";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

const initialized = (async () => {
  await init({
    // module: new URL("../dist/wasmer_js_bg.wasm", import.meta.url),
    log: "warn",
  });
})();

const ansiEscapeCode = /\u001B\[[\d;]*[JDm]/g;

describe("Wasmer.spawn", function () {
  this.timeout("120s").beforeAll(async () => {
    await initialized;
  });

  it("Can run quickjs", async () => {
    const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
    const instance = await pkg.commands["quickjs"].run({
      args: ["--eval", "console.log('Hello, World!')"],
    });
    const output = await instance.wait();

    expect(output.code).to.equal(0);
    expect(output.ok).to.be.true;
    expect(output.stdout).to.equal("Hello, World!\n");
    expect(output.stderr.length).to.equal(0);
  });

  it("Can capture exit codes", async () => {
    const pkg = await Wasmer.fromRegistry("saghul/quickjs");
    const instance = await pkg.commands["quickjs"].run({
      args: ["--std", "--eval", "std.exit(42)"],
    });
    const output = await instance.wait();

    expect(output.code).to.equal(42);
    expect(output.ok).to.be.false;
    expect(output.stdout.length).to.equal(0);
    expect(output.stderr.length).to.equal(0);
  });

  it("Can pass stdin to a dumb echo program", async () => {
    const pkg = await Wasmer.fromRegistry(
      "christoph/wasix-test-stdinout@0.1.1",
    );
    const instance = await pkg.commands["stdinout-loop"].run({
      stdin: "Hello\nWorld!\n",
    });

    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
    expect(output.stderr).to.equal("Hello\n\nWorld!\n\n");
  });

  it("Can communicate with a dumb echo program", async () => {
    // First, start our program in the background
    const pkg = await Wasmer.fromRegistry(
      "christoph/wasix-test-stdinout@0.1.1",
    );
    const instance = await pkg.commands["stdinout-loop"].run();

    const stdin = instance.stdin!.getWriter();
    const stdout = new BufReader(instance.stdout);

    await stdin.write(encoder.encode("Hello,"));
    await stdin.write(encoder.encode(" World!\n"));
    // Note: The program is reading line-by-line, so we can't do
    // stdout.readLine() before the "\n" was sent
    expect(await stdout.readLine()).to.equal("Hello, World!\n");
    await stdin.write(encoder.encode("Done\n"));
    expect(await stdout.readLine()).to.equal("Done\n");

    // Closing stdin will break out of the reading loop
    await stdin.close();
    // And wait for the program to exit
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.code).to.equal(0);
  });

  it("Can communicate with a TTY-aware program", async () => {
    // First, start QuickJS up in the background
    const pkg = await Wasmer.fromRegistry("saghul/quickjs@0.0.3");
    const instance = await pkg.commands["quickjs"].run({
      args: ["--interactive", "--std"],
    });

    const stdin = new RealisticWriter(instance.stdin!);
    const stdout = new BufReader(instance.stdout);

    // QuickJS prints a prompt when it first starts up. Let's read it.
    expect(await stdout.readLine()).to.equal('QuickJS - Type "\\h" for help\n');

    // Then, send a command to the REPL
    await stdin.writeln("console.log('Hello, World!')");
    // The TTY echoes back a bunch of escape codes and stuff.
    expect(await stdout.readAnsiLine()).to.equal(
      "qjs > console.log('Hello, World!')\n",
    );
    // Random newline.
    expect(await stdout.readLine()).to.equal("\n");
    // QuickJS also echoes your input back. Because reasons.
    expect(await stdout.readAnsiLine()).to.equal(
      "console.log('Hello, World!')\n",
    );
    // We get the text we asked for.
    expect(await stdout.readLine()).to.equal("Hello, World!\n");
    // console.log() evaluates to undefined
    expect(await stdout.readAnsiLine()).to.equal("undefined\n");

    // Now that the first command is done, QuickJS will show the prompt
    // again
    expect(await stdout.readAnsiLine()).to.equal("qjs > \n");

    // We're all done. Tell the command to exit.
    await stdin.writeln("std.exit(42)");
    // Our input gets echoed by the TTY
    expect(await stdout.readLine()).to.equal("qjs > std.exit(42)\n");
    // Random newline.
    expect(await stdout.readLine()).to.equal("\n");
    // QuickJS printed the command we just ran.
    expect(await stdout.readAnsiLine()).to.equal("std.exit(42)\n");

    // Wait for the instance to shut down.
    await stdin.close();
    const output = await instance.wait();

    expect(output.code).to.equal(42);
    expect(output.stderr).to.equal("");
  });

  it("can communicate with a subprocess interactively", async () => {
    const pkg = await Wasmer.fromRegistry("sharrattj/bash");
    const instance = await pkg.commands["bash"].run({
      uses: ["christoph/wasix-test-stdinout@0.1.1"],
    });

    const stdin = new RealisticWriter(instance.stdin!);
    const stdout = new BufReader(instance.stdout);

    // Start the stdinout-loop program
    await stdin.writeln("stdinout-loop");
    // echo from the TTY
    expect(await stdout.readLine()).to.equal("stdinout-loop\n");
    // The stdinout-loop program should be running now. Let's send it
    // something
    await stdin.writeln("First");
    // It printed back our input
    expect(await stdout.readLine()).to.equal("\n");
    expect(await stdout.readLine()).to.equal("First\n");
    // Write the next line of input
    await stdin.writeln("Second");
    // Echo from program
    expect(await stdout.readLine()).to.equal("\n");
    expect(await stdout.readLine()).to.equal("Second\n");

    await stdin.close();
    const output = await instance.wait();

    expect(output.code).to.equal(0);
    // It looks like bash does its own TTY echoing, except it printed to
    // stderr instead of stdout like wasmer_wasix::os::Tty
    expect(output.stderr).to.equal(
      "bash-5.1# stdinout-loop\n\n\nFirst\n\n\n\nSecond\n\n\n\nbash-5.1# exit\n",
    );
  });

  it("Can communicate with Python", async () => {
    // First, start python up in the background
    const pkg = await Wasmer.fromRegistry("python/python@0.1.0");
    const instance = await pkg.entrypoint!.run();

    const stdin = new RealisticWriter(instance.stdin!);
    const stdout = new BufReader(instance.stdout);
    const stderr = new BufReader(instance.stderr);

    // First, we'll read the prompt
    expect(await stderr.readLine()).to.equal(
      "Python 3.6.7 (default, Feb 14 2020, 03:17:48) \n",
    );
    expect(await stderr.readLine()).to.equal(
      "[Wasm WASI vClang 9.0.0 (https://github.com/llvm/llvm-project 0399d5a9682b3cef7 on generic\n",
    );
    expect(await stderr.readLine()).to.equal(
      'Type "help", "copyright", "credits" or "license" for more information.\n',
    );

    // Then, send the command to the REPL
    await stdin.writeln("import sys");
    // TTY echo
    expect(await stdout.readLine()).to.equal("import sys\n");
    await stdin.writeln("print(1 + 1)");
    // TTY echo
    expect(await stdout.readLine()).to.equal("\n");
    expect(await stdout.readLine()).to.equal("print(1 + 1)\n");
    // Our output
    expect(await stdout.readLine()).to.equal("\n");
    expect(await stdout.readLine()).to.equal("2\n");
    // We've done what we want, so let's shut it down
    await stdin.writeln("sys.exit(42)");
    // TTY echo
    expect(await stdout.readLine()).to.equal("sys.exit(42)\n");
    expect(await stdout.readLine()).to.equal("\n");

    // Wait for the instance to shut down.
    await stdin.close();
    await stdout.close();
    await stderr.close();
    const output = await instance.wait();

    expect(output.ok).to.be.false;
    expect(output.code).to.equal(42);
    expect(output.stdout).to.equal("");
    // Python prints the prompts to stderr, but our TTY handling prints
    // echoed characters to stdout
    expect(output.stderr).to.equal(">>> >>> >>> >>> >>> ");
  });

  it("can see a mounted directory", async () => {
    const dir = new Directory();
    const pkg = await Wasmer.fromRegistry("sharrattj/coreutils");

    const instance = await pkg.commands["ls"].run({
      args: ["/"],
      mount: { "/mounted": dir },
    });
    const output = await instance.wait();

    const stdout = output.stdout;
    expect(stdout).to.contain("mounted");
    expect(output.ok).to.be.true;
  });

  it("can see files in a mounted directory", async () => {
    const dir = new Directory();
    await dir.writeFile("/file.txt", new Uint8Array());
    const pkg = await Wasmer.fromRegistry("sharrattj/coreutils");

    const instance = await pkg.commands["ls"].run({
      stdin: "",
      args: ["/mounted"],
      mount: { "/mounted": dir },
    });
    const output = await instance.wait();

    expect(output.ok).to.be.true;
    expect(output.stdout).to.equal("file.txt\n");
    expect(output.stderr).to.equal("");
  });

  it("can read from a mounted file", async () => {
    const dir = new Directory();
    await dir.writeFile("/file.txt", encoder.encode("Hello, World!"));
    const pkg = await Wasmer.fromRegistry("sharrattj/coreutils");

    const instance = await pkg.commands["cat"].run({
      args: ["/mounted/file.txt"],
      mount: { "/mounted": dir },
    });
    const output = await instance.wait();

    const stdout = output.stdout;
    expect(stdout).to.equal("Hello, World!");
    expect(output.ok).to.be.true;
  });

  it("can delete files from a mounted directory", async () => {
    const dir = new Directory();
    await dir.writeFile("/file.txt", encoder.encode("Hello, World!"));
    const pkg = await Wasmer.fromRegistry("sharrattj/coreutils");

    const instance = await pkg.commands["rm"].run({
      args: ["/mounted/file.txt"],
      mount: { "/mounted": dir },
    });
    const output = await instance.wait();

    expect(dir.readDir("/")).to.be.empty;
    expect(output.ok).to.be.true;
  });

  it("can delete directories from a mounted directory", async () => {
    const dir = new Directory();
    await dir.createDir("/nested-dir");
    const pkg = await Wasmer.fromRegistry("sharrattj/coreutils");

    const instance = await pkg.commands["rmdir"].run({
      args: ["/mounted/nested-dir"],
      mount: { "/mounted": dir },
    });
    const output = await instance.wait();

    expect(dir.readDir("/")).to.be.empty;
    expect(output.ok).to.be.true;
  });

  it("can write to a mounted directory", async () => {
    const dir = new Directory();
    const pkg = await Wasmer.fromRegistry("sharrattj/bash");

    const instance = await pkg.commands["bash"].run({
      args: ["-c", "echo 'Something else' > /mounted/another-file.txt"],
      mount: { "/mounted": dir },
    });
    await instance.wait();

    expect(await dir.readTextFile("/another-file.txt")).to.equal(
      "Something else\n",
    );
  });
});

// FIXME: Re-enable these test and move it to the "Wasmer.spawn" test suite
// when we fix TTY handling with static inputs.
describe.skip("failing tty handling tests", function () {
  let wasmer: Wasmer;

  this.timeout("120s").beforeAll(async () => {
    await initialized;

    // Note: technically we should use a separate Wasmer instance so tests can't
    // interact with each other, but in this case the caching benefits mean we
    // complete in tens of seconds rather than several minutes.
    wasmer = new Wasmer();
  });

  it("can run a bash session non-interactively", async () => {
    const pkg = await Wasmer.fromRegistry("sharrattj/bash");

    const instance = await pkg.commands["bash"].run({
      stdin: "ls / && exit 42\n",
    });
    console.log("Spawned");

    const { code, stdout, stderr } = await instance.wait();

    expect(code).to.equal(42);
    expect(stdout).to.equal("bin\nlib\ntmp\n");
    expect(stderr).to.equal("");
  });

  it.skip("can communicate with a subprocess", async () => {
    const pkg = await Wasmer.fromRegistry("sharrattj/bash");

    const instance = await pkg.commands["bash"].run({
      uses: ["christoph/wasix-test-stdinout@0.1.1"],
    });

    const stdin = instance.stdin!.getWriter();
    const stdout = new BufReader(instance.stdout);

    await stdin.write(encoder.encode("stdinout-loop\n"));
    // the stdinout-loop program should be running now
    await stdin.write(encoder.encode("First\n"));
    expect(await stdout.readLine()).to.equal("First\n");
    await stdin.write(encoder.encode("Second\n"));
    expect(await stdout.readLine()).to.equal("Second\n");

    await stdin.close();
    const output = await instance.wait();

    console.log(output);
    expect(output.code).to.equal(0);
  });
});

/**
 * A writer adapter which will send characters to the underlying stream
 * one-by-one.
 *
 * This makes any TTY handling code think it a real human is entering text on
 * the other end.
 */
class RealisticWriter {
  private encoder = new TextEncoder();
  constructor(readonly stream: WritableStream<Uint8Array>) {}

  async writeln(text: string): Promise<void> {
    await this.write(text + "\r\n");
  }

  async write(text: string): Promise<void> {
    const writer = this.stream.getWriter();

    try {
      const message = this.encoder.encode(text);

      for (const byte of message) {
        await writer.ready;
        await writer.write(Uint8Array.of(byte));
      }
    } finally {
      // Note: wait for all bytes to be flushed before returning.
      await writer.ready;
      writer.releaseLock();
    }
  }

  async close(): Promise<void> {
    await this.stream.close();
  }
}

/**
 * A streams adapter to simplify consuming them interactively.
 */
class BufReader {
  private buffer?: Uint8Array;
  private decoder = new TextDecoder();
  private chunks: AsyncGenerator<Uint8Array, undefined>;

  constructor(
    stream: ReadableStream<Uint8Array>,
    private verbose: boolean = false,
  ) {
    this.chunks = chunks(stream);
  }

  /**
   * Consume data until the next newline character or EOF.
   */
  async readLine(): Promise<string> {
    const pieces: Uint8Array[] = [];

    while ((await this.fillBuffer()) && this.buffer) {
      const ASCII_NEWLINE = 0x0a;
      const position = this.buffer.findIndex(b => b == ASCII_NEWLINE);

      this.log({ buffer: this.peek(), position });

      if (position < 0) {
        // Consume the entire chunk.
        pieces.push(this.consume());
      } else {
        // Looks like we've found the newline. Consume everything up to
        // and including it, and stop reading.
        pieces.push(this.consume(position + 1));
        break;
      }
    }

    const line = pieces.map(piece => this.decoder.decode(piece)).join("");
    this.log({ line });
    return line;
  }

  /**
   * Read a line of text, interpreting the ANSI escape codes for clearing the
   * line and stripping any other formatting.
   */
  async readAnsiLine(): Promise<string> {
    const rawLine = await this.readLine();

    // Note: QuickJS uses the "move left by n columns" escape code for
    // clearing the line.
    const pieces = rawLine.split(/\x1b\[\d+D/);
    const lastPiece = pieces.pop() || rawLine;
    return lastPiece.replace(ansiEscapeCode, "");
  }

  async readToEnd(): Promise<string> {
    // Note: We want to merge all chunks into a single buffer and decode in
    // one hit. Otherwise we'll have O(n²) performance issues and run the
    // risk of chunks not being aligned to UTF-8 code point boundaries when
    // we decode them.

    const chunks: Uint8Array[] = [];

    while (await this.fillBuffer()) {
      this.log({
        len: chunks.length + 1,
        nextChunk: this.peek(),
      });
      chunks.push(this.consume());
    }

    const totalByteCount = chunks.reduce(
      (accumulator, element) => accumulator + element.byteLength,
      0,
    );
    const buffer = new Uint8Array(totalByteCount);
    let offset = 0;

    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const text = this.decoder.decode(buffer);
    this.log({ text });
    return text;
  }

  async close() {
    await this.chunks.return(undefined);
  }

  peek(): string | undefined {
    if (this.buffer) {
      return this.decoder.decode(this.buffer);
    }
  }

  /**
   * Try to read more bytes into the buffer if it was previously empty.
   * @returns whether the buffer was filled.
   */
  private async fillBuffer() {
    if (this.buffer && this.buffer.byteLength > 0) {
      return true;
    }

    const chunk = await this.chunks.next();

    if (chunk.value && chunk.value.byteLength > 0) {
      this.buffer = chunk.value;
      return true;
    } else {
      this.buffer = undefined;
      return false;
    }
  }

  /**
   * Remove some bytes from the front of `this.buffer`, returning the bytes
   * that were removed. The buffer will be set to `undefined` if all bytes
   * have been consumed.
   *
   * @param amount The number of bytes to remove
   * @returns The removed bytes
   * @throws If the buffer was `undefined` or more bytes were requested than
   * are available
   */
  private consume(amount?: number): Uint8Array {
    if (!this.buffer) {
      throw new Error();
    }

    if (amount) {
      if (amount > this.buffer.byteLength) {
        throw new Error();
      }

      const before = this.buffer.slice(0, amount);
      const rest = this.buffer.slice(amount);
      this.buffer = rest.length > 0 ? rest : undefined;

      return before;
    } else {
      const buffer = this.buffer;
      this.buffer = undefined;
      return buffer;
    }
  }

  /**
   * Log a piece of information if the `verbose` flag is set.
   */
  private log(value: any) {
    if (this.verbose) {
      console.log(value);
    }
  }
}

/**
 * Turn a ReadableStream into an async generator.
 */
async function* chunks(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<Uint8Array> {
  const reader = stream.getReader();

  try {
    let chunk: ReadableStreamReadResult<Uint8Array>;

    do {
      chunk = await reader.read();

      if (chunk.value) {
        yield chunk.value;
      }
    } while (!chunk.done);
  } finally {
    reader.releaseLock();
  }
}
