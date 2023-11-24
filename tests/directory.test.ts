import { expect } from '@esm-bundle/chai';
import { Wasmer, init, initializeLogger, Directory } from "..";

let wasmer: Wasmer;
const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

const initialized = (async () => {
    await init();
    initializeLogger("info");
    wasmer = new Wasmer();
})();

describe("In-Memory Directory", function() {
    this.beforeAll(async () => await initialized);

    it("read empty dir", async () => {
        const dir = new Directory();

        const contents = await dir.readDir("/");

        expect(contents.length).to.equal(0);
    });

    it("can round-trip a file", async () => {
        const dir = new Directory();

        await dir.writeFile("/file.txt", encoder.encode("Hello, World!"));
        const contents = await dir.readFile("/file.txt");

        expect(decoder.decode(contents)).to.equal("Hello, World!");
    });

    it("read dir with file", async () => {
        const dir = new Directory();

        await dir.writeFile("/file.txt", new Uint8Array());
        const contents = await dir.readDir("/");

        expect(contents).to.deep.equal(["/file.txt"]);
    });

    it("create child dir", async () => {
        const dir = new Directory();

        await dir.createDir("/tmp/");

        expect(await dir.readDir("/")).to.deep.equal(["/tmp"]);
    });
});

