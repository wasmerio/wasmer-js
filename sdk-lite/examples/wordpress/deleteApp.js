import { init, Wasmer } from "@wasmer/sdk-lite";
// import { init, Wasmer } from "../../dist/index.js";

const WASMER_TOKEN = process.env.WASMER_TOKEN;

await init({
    registryUrl: "https://registry.wasmer.io/graphql",
    token: WASMER_TOKEN
});

const deleted = await Wasmer.deleteApp({
    id: "da_XYZ"
});

console.log("App deleted!", deleted);
