import { init, Wasmer } from "@wasmer/sdk-lite";
// import { init, Wasmer } from "../../dist/index.js";

await init({
    registryUrl: "https://registry.wasmer.wtf/graphql",
    // token: ""
});

// Generate a random app name
const randomAppName = `demo-${Math.random().toString(36).substring(2, 10)}`;

const autobuildApp = await Wasmer.autobuildApp({
    region: "be-mons",
    appName: randomAppName,
    repoUrl: "https://github.com/wasmerio/wordpress",
    // managed: true,
    kind: "wordpress",
    // domains: ["testoftheapp.wasmer.dev"],
    jobs: [
        // {command: "bash", cliArgs: ["-c", `echo "Hello for demo"`]},
        {command: "bash", cliArgs: ["-c", `
          echo "Installing plugins... $STATIC_STUDIO_API_KEY";
          php /app/wp-cli.phar --allow-root --path=/app plugin install https://api.static.studio/storage/v1/object/public/plugins/simply-static-pro.zip;
          php /app/wp-cli.phar --allow-root --path=/app plugin install https://api.static.studio/storage/v1/object/public/plugins/simply-static-studio-helper.zip;
          echo "Plugins installed";
          `]},
    ],
    secrets: [
        {name: "STATIC_STUDIO_API_KEY", value: "static-studio-api-key"},
    ],
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
        // language: "es_ES",
        // Other things to preinstall
        // themes: ["twentytwentyfive"],
        // plugins: ["akismet", "myplugin"],
      }
    }
  });

autobuildApp.subscribeToProgress(({kind, message, datetime, stream}) => {
    console.log(datetime, stream, kind, message);
});
let startTime = new Date();
console.log("Waiting for the app to be built...");
const app = await autobuildApp.finish();
console.log("App built!", app);
console.log(app.kind);
console.log("Time taken:", new Date().getTime() - startTime.getTime(), "ms");