import { init, Wasmer } from "@wasmer/sdk";
// import process from "node:process";

// const encoder = new TextEncoder();
// const decoder = new TextDecoder();

// async function connectStreams(instance) {
//   const stdin = instance.stdin?.getWriter();
//   process.stdin.resume();

//   process.stdin.on("data", data => stdin?.write(encoder.encode(data)));

//   instance.stdout.pipeTo(
//     new WritableStream({
//       write: chunk => process.stdout.write(decoder.decode(chunk)),
//     }),
//   );
//   instance.stderr.pipeTo(
//     new WritableStream({
//       write: chunk => process.stderr.write(decoder.decode(chunk)),
//     }),
//   );
// }

async function run() {
  await init();

  let cowsay = await Wasmer.fromRegistry("cowsay");

  let instance = await cowsay.entrypoint.run({ args: ["hello world"] });

  // await connectStreams(instance);
  const output = await instance.wait();
  console.log(output.stdout);
}

run();
