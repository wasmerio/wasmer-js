import { expect } from '@esm-bundle/chai';
import { Runtime, run, wat2wasm, Wasmer, Container, init } from "..";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

describe("run", function() {
    this.timeout("60s")
        .beforeAll(async () => await init());

    it("can execute a noop program", async () => {
        const noop = `(
            module
                (memory $memory 0)
                (export "memory" (memory $memory))
                (func (export "_start") nop)
            )`;
        const wasm = wat2wasm(noop);
        const module = await WebAssembly.compile(wasm);
        const runtime = new Runtime(2);

        const instance = run(module, { program: "noop", runtime });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
    });

    it("can start quickjs", async () => {
        let wasmer = new Wasmer();
        const runtime = wasmer.runtime();
        const container = await Container.from_registry("saghul/quickjs@0.0.3", runtime);
        const module = await WebAssembly.compile(container.get_atom("quickjs")!);

        const instance = run(module, { program: "quickjs", args: ["--eval", "console.log('Hello, World!')"], runtime });
        const output = await instance.wait();

        expect(output.ok).to.be.true;
        expect(output.code).to.equal(0);
        expect(decoder.decode(output.stdout)).to.contain("Hello, World!");
        expect(decoder.decode(output.stderr)).to.be.empty;
    });
});

describe("Wasmer.spawn", function() {
    let wasmer: Wasmer;

    this.timeout("120s")
        .beforeAll(async () => {
            await init();

            // Note: technically we should use a separate Wasmer instance so tests can't
            // interact with each other, but in this case the caching benefits mean we
            // complete in tens of seconds rather than several minutes.
            wasmer = new Wasmer();
        });

    it("Can run quickjs", async  () => {
        const instance = await wasmer.spawn("saghul/quickjs@0.0.3", {
            args: ["--eval", "console.log('Hello, World!')"],
            command: "quickjs",
        });
        const output = await instance.wait();

        expect(output.code).to.equal(0);
        expect(output.ok).to.be.true;
        expect(decoder.decode(output.stdout)).to.equal("Hello, World!\n");
        expect(output.stderr.length).to.equal(0);
    });

    it("Can capture exit codes", async () => {
        const instance = await wasmer.spawn("saghul/quickjs", {
            args: ["--std", "--eval", "std.exit(42)"],
            command: "quickjs",
        });
        const output = await instance.wait();

        expect(output.code).to.equal(42);
        expect(output.ok).to.be.false;
        expect(output.stdout.length).to.equal(0);
        expect(output.stderr.length).to.equal(0);
    });

    it("Can communicate via stdin", async () => {
        console.log("Spawning...");

        // First, start python up in the background
        const instance = await wasmer.spawn("saghul/quickjs@0.0.3", {
            args: ["--interactive", "--std"],
            command: "quickjs",
        });

        console.log("Spawned");

        const stdin = instance.stdin!.getWriter();
        const stdout = new BufReader(instance.stdout);

        (async () => {
            const decoder = new TextDecoder("utf8");
            console.log("Reading stderr");
            for await (const chunk of chunks(instance.stderr)) {
                console.log({
                    stderr: decoder.decode(chunk),
                })
            }
        })();

        // First, we'll read the prompt
        console.log("Prompt");
        expect(await stdout.readLine()).to.equal('QuickJS - Type "\\h" for help\n');

        // Then, send the command to the REPL
        console.log("Repl");
        await stdin.write(encoder.encode("console.log('Hello, World!')\n"));
        // Note: the TTY echos our command back
        expect(await stdout.readLine()).to.equal("qjs > console.log('Hello, World!')\n");
        console.log("response", { stdout: await stdout.readToEnd() });
        // And here's our text
        expect(await stdout.readLine()).to.equal("Hello, World!\n");

        // Now tell the instance to quit
        console.log("Exit");
        await stdin.write(encoder.encode("std.exit(42)\n"));
        expect(await stdout.readLine()).to.equal("qjs > std.exit(42)\n");
        await stdin.close();
        await stdout.close();

        // Wait for the instance to shut down.
        const output = await instance.wait();

        console.log(output);
        console.log({
            stdout: decoder.decode(output.stdout),
            stderr: decoder.decode(output.stderr),
        });

        expect(output.ok).to.be.true;
        expect(stdout).to.equal("2\n");
    });

    it("can run a bash session", async () => {
        const instance = await wasmer.spawn("sharrattj/bash", {
            stdin: "ls / && exit 42\n",
        });
        const { code, stdout, stderr } = await instance.wait();

        expect(code).to.equal(42);
        expect(decoder.decode(stdout)).to.equal("bin\nlib\ntmp\n");
        expect(decoder.decode(stderr)).to.equal("");
    });

    it("can communicate with a subprocess", async () => {
        const instance = await wasmer.spawn("sharrattj/bash", {
            args: ["-c", "python"],
            uses: ["python/python@0.1.0"],
        });
        const stdin = instance.stdin!.getWriter();
        // Tell Bash to start Python
        await stdin.write(encoder.encode("python\n"));
        await stdin.write(encoder.encode("import sys; print(sys.version)\nexit()\n"));
        await stdin.close();

        const { code, stdout, stderr } = await instance.wait();

        expect(code).to.equal(42);
        expect(decoder.decode(stdout)).to.equal("bin\nlib\ntmp\n");
        expect(decoder.decode(stderr)).to.equal("");
    });
});

/**
 * A streams adapter to simplify consuming them interactively.
 */
class BufReader {
    private buffer?: Uint8Array;
    private decoder = new TextDecoder();
    private chunks: AsyncGenerator<Uint8Array, undefined>;

    constructor(stream: ReadableStream<Uint8Array>) {
        this.chunks = chunks(stream);
     }

     /**
      * Consume data until the next newline character or EOF.
      */
     async readLine(): Promise<string> {
        const pieces: Uint8Array[] = [];

        while (await this.fillBuffer() && this.buffer) {
            const ASCII_NEWLINE = 0x0A;
            const position = this.buffer.findIndex(b => b == ASCII_NEWLINE);

            console.log({buffer: this.peek(), position});

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
        console.log({ line });
        return line;
     }

     async readToEnd(): Promise<string> {
        const pieces: string[] = [];

        while (await this.fillBuffer()) {
            pieces.push(this.decoder.decode(this.consume()));
        }

        return pieces.join("");
     }

     async close() {
        await this.chunks.return(undefined);
     }

     peek(): string| undefined {
        if (this.buffer) {
            return this.decoder.decode(this.buffer);
        }
     }

     /**
      * Make sure the
      * @returns
      */
     private async fillBuffer() {
        if (this.buffer && this.buffer.byteLength > 0) {
            true;
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

     private consume(amount?: number): Uint8Array {
        if (!this.buffer) {
            throw new Error();
        }

        if (amount) {
            if (amount > this.buffer.byteLength)
            {
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
}

/**
 * Turn a ReadableStream into an async generator.
 */
async function* chunks(stream: ReadableStream<Uint8Array>): AsyncGenerator<Uint8Array> {
    const reader = stream.getReader();

    try {
        let chunk: ReadableStreamReadResult<Uint8Array>;

        do {
            chunk = await reader.read();

            if (chunk.value) {
                yield chunk.value;
            }
        } while(!chunk.done);

    } finally {
        reader.releaseLock();
    }
}
