import { init, Wasmer } from "@wasmer/sdk/node";

const WASMER_TOKEN = process.env.WASMER_TOKEN;
const APP_OWNER = process.env.APP_OWNER;
const APP_NAME = process.env.APP_NAME || "my-echo-env-app";
if (!WASMER_TOKEN) {
  throw new Error(
    "Please set the `WASMER_TOKEN` environment variable.\nYou can create a token in https://wasmer.io/settings/access-tokens",
  );
}
if (!APP_OWNER) {
  throw new Error(
    "Please set the `APP_OWNER` to your username in Wasmer (or a namespace you own).",
  );
}

await init({
  // registryUrl: process.env.WASMER_REGISTRY,
  token: WASMER_TOKEN,
});

const echo_server_index = `
	async function handler(request) {
	  const out = JSON.stringify({
	    "HEY":"SDSFD!",
	  });
	  return new Response(out, {
	    headers: { "content-type": "application/json" },
	  });
	}
	
	addEventListener("fetch", (fetchEvent) => {
	  fetchEvent.respondWith(handler(fetchEvent.request));
	});
	`;

const manifest = {
  command: [
    {
      module: "wasmer/winterjs:winterjs",
      name: "script",
      runner: "https://webc.org/runner/wasi",
      annotations: {
        wasi: {
          env: ["JS_PATH=/src/index.js"],
          "main-args": ["/src/index.js"],
        },
      },
    },
  ],
  dependencies: {
    "wasmer/winterjs": "1.2.0",
  },
  fs: {
    "/src": {
      "index.js": echo_server_index,
    },
  },
};

console.log("Creating Package...");
let wasmerPackage = await Wasmer.createPackage(manifest);
// console.log("NISE");

let appConfig = {
  name: APP_NAME,
  owner: APP_OWNER,
  package: wasmerPackage,
};

console.log("Deploying app...");
let res = await Wasmer.deployApp(appConfig);
console.log(`Deployed successfully: ${res.url}`);

// console.log("------");
// console.log("Deploying a new version of the app");

// const newEchoServer = `
// async function handler(request) {
//   const out = JSON.stringify({
// 	"second":"version!",
//   });
//   return new Response(out, {
// 	headers: { "content-type": "application/json" },
//   });
// }

// addEventListener("fetch", (fetchEvent) => {
//   fetchEvent.respondWith(handler(fetchEvent.request));
// });
// `;

// let newManifest = {
//     command: [
//         {
//             module: "wasmer/winterjs:winterjs",
//             name: "script",
//             runner: "https://webc.org/runner/wasi",
//             annotations: {
//                 wasi: {
//                     env: ["JS_PATH=/src/index.js"],
//                     "main-args": ["/src/index.js"],
//                 },
//             },
//         },
//     ],
//     dependencies: {
//         "wasmer/winterjs": "1.2.0",
//     },
//     fs: {
//         "/src": {
//             "index.js": newEchoServer,
//         },
//     },
// };

// console.log("Creating Package...");
// let wasmerNewPackage = await Wasmer.createPackage(newManifest);
// console.log("Deploying app...");
// let appNewConfig = {
//     name: APP_NAME,
//     owner: APP_OWNER,
//     package: wasmerNewPackage,
//     default: true,
// };

// let newVersion = await Wasmer.deployApp(appNewConfig);
// console.log(`Deployed successfully: ${newVersion.url}`);
