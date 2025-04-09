// import { init, Wasmer } from "@wasmer/sdk-lite";
import { init, Wasmer } from "../../dist/index.js";
// const { init, Wasmer } = require("@wasmer/sdk-lite");

init({
    registryUrl: "https://registry.wasmer.wtf/graphql",
    // token: ""
});

const autobuildApp = await Wasmer.autobuildApp({
    region: "de-mons1", 
    appName: "demo1-xasd",
    repoUrl: "https://github.com/wasmerio/wordpress",
    // kind: "wordpress",
    // domains: ["xyz.static.studio"],
    // secrets: {
    // },
    // jobs: [{
    //   trigger: "postdeployment",
    //   command: "bash",
    //   cliArgs: "wp my-plugin activate ...; echo 'hello';"
    // }],
    params: {
      wordpress: {
        // phpVersion: "8.3",
        adminUsername: "myadmin",
        adminPassword: "mypassword",
        adminEmail: "my@email.com",
        siteName: "bcd",
        language: "es-ES",
        // Other things to preinstall
        // themes: ["twentytwentyfive"],
        // plugins: ["akismet", "myplugin"],
      }
    }
  });

autobuildApp.subscribeToProgress((kind, message) => {
console.log(kind, message);
});
const app = await autobuildApp.finish();
console.log(app);
