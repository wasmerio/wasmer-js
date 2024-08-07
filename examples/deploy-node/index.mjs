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

// initializeLogger("trace");

const echo_server_index = `
	async function handler(request) {
	  const out = JSON.stringify({
	    "THIS":"WORKS!",
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

let wasmerPackage = await Wasmer.createPackage(manifest);
// console.log("NISE");

let appConfig = {
    name: APP_NAME,
    owner: APP_OWNER,
    package: wasmerPackage,
    default: true,
};

let res = await Wasmer.deployApp(appConfig);
console.log(res.url);
