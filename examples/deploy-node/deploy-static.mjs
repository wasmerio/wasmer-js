import { init, Wasmer, walkDir } from "@wasmer/sdk/node";

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

const php_file = `<?php
echo "PHP app created from @wasmer/sdk!<br />";

var_dump($_ENV);`;

const manifest = {
    command: [
        {
            module: "wasmer/static-web-server:webserver",
            name: "script",
            runner: "https://webc.org/runner/wasi",
            annotations: {
                wasi: {
                    "main-args": ["--directory-listing=true"],
                },
            },
        },
    ],
    dependencies: {
        "wasmer/static-web-server": "^1",
    },
    fs: {
        "/public": {
            "myfile.txt": "My file",
            "other": await walkDir("./static"),
        },
    },
};

// console.log(JSON.stringify(manifest.fs, null, 2));

console.log("Creating Package...");
let wasmerPackage = await Wasmer.createPackage(manifest);

let appConfig = {
    name: APP_NAME,
    owner: APP_OWNER,
    package: wasmerPackage,
};

console.log("Deploying app...");
let res = await Wasmer.deployApp(appConfig);
console.log(`Deployed successfully: ${res.url}`);
