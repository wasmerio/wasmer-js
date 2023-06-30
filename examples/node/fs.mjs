import fs from "node:fs";
import url from "node:url";
import { init, WASI, MemFS } from "../../dist/lib.mjs";

async function main() {
  const sentry = new Promise((resolve, reject) => {
    const handle = setInterval(() => {
      console.log("check stdout:", stdout);
    }, 1000);
    setTimeout(() => {
      clearInterval(handle);
      resolve();
    }, 10000);
  });
  Error.stackTraceLimit += 30;
  // This is needed to load the WASI library first
  await init();

  let wasi = new WASI({
    env: {},
    args: [],
    tty: {
      ttyReset() {},
      ttySet(state) {},
      ttyGet() {},
    },
  });

  const buf = fs.readFileSync(url.fileURLToPath(new URL('../../tests/mapdir.wasm', import.meta.url)));

  const module = await WebAssembly.compile(
    new Uint8Array(buf)
  );
  await wasi.instantiate(module, {});

  wasi.fs.createDir("/a");
  wasi.fs.createDir("/b");

  let file = wasi.fs.open("/file", {read: true, write: true, create: true});
  await file.writeString("fileContents");
  console.log("readString: ", await file.readString());
  await file.seek(0);

  let exitCode = wasi.start();
  let stdout = wasi.getStdoutString().catch((e) => {
    console.log("getStdoutString error:", e);
  })

  // await stdout;
  // // This should print "hello world (exit code: 0)"
  // console.log(`${stdout}(exit code: ${exitCode})`);
  // console.log(`wtf: ${stdout}`);
  await sentry;
}

await main();
