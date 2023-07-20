import { VirtualFile } from "./pkg/wasmer_wasix_js.js";

export function VirtualFileReader(file: VirtualFile, opts?: { chunkSize?: number, strategy?: QueuingStrategy<Uint8Array> }): ReadableStream<Uint8Array> {
    let chunkSize = opts?.chunkSize || 65536;
    return new ReadableStream({
        start(controller) {
            this.handle = file;
        },
        async pull(controller) {
            const buf = new Uint8Array(chunkSize);
            const n = await this.handle.read(buf);
            if (n > 0) {
                controller.enqueue(buf.slice(0, n));
            } else {
                controller.close();
            }
        },
        cancel(reason) {
            this.handle = undefined;
        }
    }, opts?.strategy);
}

export function VirtualFileWriter(file: VirtualFile, opts?: { strategy?: QueuingStrategy<Uint8Array> }): WritableStream<Uint8Array> {
    return new WritableStream({
        start() {
            this.handle = file;
        },
        async write(chunk, controller) {
            let n = await this.handle.write(chunk);
            while (n > 0 && n < chunk.length) {
                n += await this.handle.write(chunk.slice(n));
            }
            if (n === 0) {
                controller.error();
                throw new Error("VirtualFileWriter wrote to closed file handle");
            }
        },
        close() {
            this.handle = undefined;
        },
        abort() {
            this.handle = undefined;
        }
    }, opts?.strategy);
}
