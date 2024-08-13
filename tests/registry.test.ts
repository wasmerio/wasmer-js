import { assert, expect } from "@esm-bundle/chai";
import { init, Wasmer } from "..";

const pkg_name = "test-js-sdk-pkg";
const app_name = "test-js-sdk-app";


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

describe("Registry", function () {
  this.timeout("60s").beforeAll(async () => {
    await init({
      // module: new URL("../dist/wasmer_js_bg.wasm", import.meta.url),
      registryUrl: "https://registry.wasmer.wtf/graphql",
      token: process.env.WASMER_TOKEN,
      log: "error",
    });
  });

  const WASMER_TEST_OWNER = process.env.WASMER_TEST_OWNER;

  it("has global context", async () => {
    let v = (globalThis as any)["__WASMER_REGISTRY__"];
    expect(typeof v != "undefined");
  });

  it("can deploy apps", async () => {
    let appConfig = {
      name: app_name,
      owner: WASMER_TEST_OWNER,
      package:
        "sha256:34a3b5f5a9108c2b258eb51e9d0978b6778a3696b9c7e713adab33293fb5e4f1",
      env: [["test", "new_value"]],
      default: true,
    };

    let appVersion = await Wasmer.deployApp(appConfig);
    assert(appVersion.id.startsWith("dav_"));
    assert(appVersion.app_id.startsWith("da_"));
  });

  it("can delete apps", async () => {
    let appConfig = {
      name: app_name,
      owner: WASMER_TEST_OWNER,
      package:
        "sha256:34a3b5f5a9108c2b258eb51e9d0978b6778a3696b9c7e713adab33293fb5e4f1",
      env: [["test", "new_value"]],
    };

    let appVersion = await Wasmer.deployApp(appConfig);
    assert(appVersion.id.startsWith("dav_"));
    assert(appVersion.app_id.startsWith("da_"));

    await Wasmer.deleteApp({id: appVersion.app_id});
  });

  it("whoami", async () => {
    let user = await Wasmer.whoami();
    assert(user != null);
    assert(user.id.startsWith("u_"));
    assert(user.username != null);
  });

  it("can create a package with atoms", async () => {
    let manifest = {
      module: [
        {
          name: "test",
          abi: "wasi",
          source: new Uint8Array([
            0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
          ]),
        },
        {
          name: "other-test",
          source: new Uint8Array([
            0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
          ]),
        },
      ],
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
          "index_timestamp.html": {
            data: "Hello, js!",
            modified: 987656789,
          },
          "index_date.html": {
            data: "Hello, js!",
            modified: new Date(),
          },
        },
      },
    };
    await Wasmer.createPackage(manifest);
  });

  it("can create an unnamed package", async () => {
    let manifest = {
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
          "index_timestamp.html": {
            data: "Hello, js!",
            modified: 987656789,
          },
          "index_date.html": {
            data: "Hello, js!",
            modified: new Date(),
          },
        },
      },
    };

    await Wasmer.createPackage(manifest);
  });

  it("can use unnamed packages twice", async () => {
    let manifest = {
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
        },
      },
    };

    let wasmerPackage = await Wasmer.createPackage(manifest);

    let appConfig = {
      name: app_name,
      owner: WASMER_TEST_OWNER,
      package: wasmerPackage,
      env: [["test", "new_value"]],
      default: true,
    };

    await Wasmer.deployApp(appConfig);

    let appConfig2 = {
      name: app_name + "2",
      owner: WASMER_TEST_OWNER,
      package: wasmerPackage,
      env: [["test", "new_value"]],
      default: true,
    };

    await Wasmer.deployApp(appConfig2);
  });

  it("can deploy unnamed packages", async () => {
    let manifest = {
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
        },
      },
    };

    let wasmerPackage = await Wasmer.createPackage(manifest);

    let appConfig = {
      name: app_name,
      owner: WASMER_TEST_OWNER,
      package: wasmerPackage,
      env: [["test", "new_value"]],
      default: true,
    };

    await Wasmer.deployApp(appConfig);
  });

  it("can't publish unnamed packages", async () => {
    let manifest = {
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
        },
      },
    };

    let wasmerPackage = await Wasmer.createPackage(manifest);
    try {
      await Wasmer.publishPackage(wasmerPackage);
      assert.fail("publishes the package", "should not publish the package");
    } catch {
      return;
    }
  });

  it("can publish named packages", async () => {
    let manifest = {
      package: {
        name: WASMER_TEST_OWNER + "/" + pkg_name + getRandomInt(1000),
        version: "0.1."+ getRandomInt(10000),
      },
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
        },
      },
    };

    let wasmerPackage = await Wasmer.createPackage(manifest);
    await Wasmer.publishPackage(wasmerPackage);
  });

  it("fails deploying apps with unpublished packages", async () => {
    let manifest = {
      package: {
        name: WASMER_TEST_OWNER + "/" + pkg_name + getRandomInt(1000),
        version: "0.1."+ getRandomInt(10000),
      },
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "A totally new file!",
        },
      },
    };

    let wasmerPackage = await Wasmer.createPackage(manifest);

    let appConfig = {
      name: app_name,
      owner: WASMER_TEST_OWNER,
      package: wasmerPackage,
      env: [["test", "new_value"]],
      default: true,
    };

    try {
      await Wasmer.deployApp(appConfig);
      assert.fail("deploys the app", "should not deploy the app");
    } catch {
      return;
    }
  });

  it("can deploy apps with user-created packages", async () => {
    let manifest = {
      package: {
        name: WASMER_TEST_OWNER + "/" + pkg_name + getRandomInt(1000),
        version: "0.1."+ getRandomInt(10000),
      },
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
        },
      },
    };

    let wasmerPackage = await Wasmer.createPackage(manifest);
    await Wasmer.publishPackage(wasmerPackage);

    let appConfig = {
      name: app_name,
      owner: WASMER_TEST_OWNER,
      package: wasmerPackage,
      env: [["test", "new_value"]],
      default: true,
    };

    await Wasmer.deployApp(appConfig);
  });

  it("can run user-created packages", async () => {
    let manifest = {
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": ["-c", 'print("hello, js!")'],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },
    };

    let pkg = await Wasmer.createPackage(manifest);
    let instance = await pkg.commands["hello"].run();

    const output = await instance.wait();
    assert(output.stdout === "hello, js!\n");
  });

  it("can mount fs", async () => {
    let manifest = {
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
        },
      },
    };

    let pkg = await Wasmer.createPackage(manifest);
    let instance = await pkg.commands["hello"].run();

    const output = await instance.wait();
    assert(output.stdout.includes("index.html"));
  });

  it("can read metadata", async () => {
    let manifest = {
      package: {
        readme: "This is my readme!",
        license: { data: "This is my license!", modified: new Date() },
      },
      command: [
        {
          module: "wasmer/python:python",
          name: "hello",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": [
                "-c",
                "import os; print([f for f in os.walk('/public')]); ",
              ],
            },
          },
        },
      ],
      dependencies: {
        "wasmer/python": "3.12.5+build.7",
      },

      fs: {
        public: {
          "index.html": "Hello, js!",
        },
      },
    };

    let pkg = await Wasmer.createPackage(manifest);
    let instance = await pkg.commands["hello"].run();

    const output = await instance.wait();
    assert(output.stdout.includes("index.html"));
  });

  it("can deploy a php app", async () => {
    let manifest = {
      command: [
        {
          module: "php/php:php",
          name: "run",
          runner: "wasi",
          annotations: {
            wasi: {
              "main-args": ["-t", "/app", "-S", "localhost:8080"],
            },
          },
        },
      ],
      dependencies: {
        "php/php": "=8.3.4",
      },
      fs: {
        "/app": {
          "index.php": "<?php phpinfo();",
        },
      },
    };

    let pkg = await Wasmer.createPackage(manifest);

    let appConfig = {
      name: app_name,
      owner: WASMER_TEST_OWNER,
      package: pkg,
      default: true,
    };

    await Wasmer.deployApp(appConfig);
  });
});
