import { expect } from "@esm-bundle/chai";
import { init, initializeLogger, Directory } from "..";

const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

const initialized = (async () => {
    await init(new URL("../dist/wasmer_js_bg.wasm", import.meta.url));
    initializeLogger("warn");
})();

describe("In-Memory Directory", function () {
    this.timeout("60s").beforeAll(async () => await initialized);

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

        expect(contents).to.deep.equal([{ name: "file.txt", type: "file" }]);
    });

    it("create child dir", async () => {
        const dir = new Directory();

        await dir.createDir("/tmp/");

        expect(await dir.readDir("/")).to.deep.equal([
            { name: "tmp", type: "dir" },
        ]);
    });

    it("can be created with DirectoryInit", async () => {
        const dir = new Directory({
            "/file.txt": "file",
            "/another/nested/file.txt": "another",
        });

        expect(await dir.readTextFile("/file.txt")).to.equal("file");
        expect(await dir.readTextFile("/another/nested/file.txt")).to.equal(
            "another",
        );
    });
});

describe("Web FileSystem", function() {
    this.beforeAll(async () => await initialized);

    it("can read an empty dir", async() => {
        const dirHandle = await navigator.storage.getDirectory();

        const dir = Directory.fromBrowser(dirHandle);
        const entries = await dir.readDir("/");

        expect(entries).to.eql([]);
    });

    it("can read a file", async() => {
        const dirHandle = await navigator.storage.getDirectory();
        const f = await dirHandle.getFileHandle("file.txt");
        const writer = await f.createWritable();
        await writer.write("Hello, World!");
        await writer.close();
        const dir = Directory.fromBrowser(dirHandle);

        const contents = await dir.readFile("/file.txt");

        expect(contents).to.equal("Hello, World!");
    });

    it("can create a file", async() => {
        const dirHandle = await navigator.storage.getDirectory();
        const dir = Directory.fromBrowser(dirHandle);

        await dir.writeFile("/file.txt", "Hello, World!");

        const handle = await dirHandle.getFileHandle("file.txt");
        const f = await handle.getFile();
        expect(await f.text()).to.equal("Hello, World!");
    });

    it("can list a directory", async() => {
        const dirHandle = await navigator.storage.getDirectory();
        const f = await dirHandle.getFileHandle("file.txt", {create: true});
        const dir = Directory.fromBrowser(dirHandle);

        const entries = await dir.readDir("/");

        expect(entries).to.eql(["/file.txt"]);
    });

    it("can delete a file", async() => {
        const dirHandle = await navigator.storage.getDirectory();
        const f = await dirHandle.getFileHandle("file.txt", {create: true});
        const dir = Directory.fromBrowser(dirHandle);

        await dir.removeFile("/file.txt");

        const entries: string[] = [];
        for await (const key of (dirHandle as any).keys()) {
            entries.push(key);
        }
        expect(entries).to.eql([]);
    });
});
