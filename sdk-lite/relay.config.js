const relayConfig = {
    src: "./src",
    schema: "./schema.graphql",
    artifactDirectory: "./src/__generated__",
    language: "typescript",
    // persistConfig: {
    //   url: process.env.WASMER_RELAY_ENDPOINT || "https://registry.wasmer.io/graphql",
    //   params: {},
    //   concurrency: 10,
    // },
  };
  
  module.exports = relayConfig;
  