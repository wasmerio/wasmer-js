import { assert, expect } from "@esm-bundle/chai";
import { init, initializeLogger, Wasmer } from "..";

const initialized = (async () => {
	await init(new URL("../dist/wasmer_js_bg.wasm", import.meta.url), undefined,
		{ registry_url: "https://registry.wasmer.wtf/graphql", token: "<YOUR_TOKEN>" }
	);
	initializeLogger("error");
})();


const owner = "<YOUR_NAME>"
const pkg_name = "test-js-sdk"
const app_name = "test-js-sdk"

describe("Registry", function() {
	this.timeout("60s").beforeAll(async () => await initialized);

	it("Has global context", async () => {
		let v = (globalThis as any)["__WASMER_REGISTRY__"];
		expect(typeof v != "undefined")
	});


	it("can create a package with atoms", async () => {
		let manifest =
		{
			"module": [
				{
					"name": "test",
					"abi": "wasi",
					"source": new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00])
				},
				{
					"name": "other-test",
					"source": new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00])
				}
			],
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"import os; print([f for f in os.walk('/public')]); "
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			},

			"fs": {
				"public": {
					"index.html": "Hello, js!",
					"index_timestamp.html": { data: "Hello, js!", modified: 987656789 },
					"index_date.html": { data: "Hello, js!", modified: new Date() }
				}
			}
		}
		await Wasmer.createPackage(manifest);
	})


	it("can create an unnamed package", async () => {
		let manifest =
		{
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"import os; print([f for f in os.walk('/public')]); "
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			},

			"fs": {
				"public": {
					"index.html": "Hello, js!",
					"index_timestamp.html": { data: "Hello, js!", modified: 987656789 },
					"index_date.html": { data: "Hello, js!", modified: new Date() }
				}
			}
		}
		await Wasmer.createPackage(manifest);
	})



	it("can publish unnamed packages", async () => {
		let manifest =
		{
			"package": {
				"name": owner + "/"
			},
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"import os; print([f for f in os.walk('/public')]); "
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			},

			"fs": {
				"public": {
					"index.html": "Hello, js!"
				}
			}
		}

		let wasmerPackage = await Wasmer.createPackage(manifest);
		await Wasmer.publishPackage(wasmerPackage);
	})

	it("can publish named packages", async () => {
		let manifest =
		{
			"package": {
				"name": owner + "/" + pkg_name
			},
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"import os; print([f for f in os.walk('/public')]); "
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			},

			"fs": {
				"public": {
					"index.html": "Hello, js!"
				}
			}
		}

		let wasmerPackage = await Wasmer.createPackage(manifest);
		await Wasmer.publishPackage(wasmerPackage);
	})


	it("can deploy apps", async () => {
		let appConfig = {
			name: app_name,
			owner: owner,
			package: "sha256:34a3b5f5a9108c2b258eb51e9d0978b6778a3696b9c7e713adab33293fb5e4f1",
			env: [["test", "new_value"]],
			default: true

		};

		await Wasmer.deployApp(appConfig);
	})

	it("fails deploying apps with unpublished packages", async () => {

		let manifest =
		{
			"package": {
				"name": owner + "/" + pkg_name
			},
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"import os; print([f for f in os.walk('/public')]); "
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			},

			"fs": {
				"public": {
					"index.html": "A totally new file!"
				}
			}
		}

		let wasmerPackage = await Wasmer.createPackage(manifest);

		let appConfig = {
			name: app_name,
			owner: owner,
			package: wasmerPackage,
			env: [["test", "new_value"]],
			default: true

		};

		try {
			await Wasmer.deployApp(appConfig);
			assert.fail("deploys the app", "should not deploy the app")
		} catch {
		  return
		}
	})


	it("can deploy apps with user-created packages", async () => {

		let manifest =
		{
			"package": {
				"name": owner + "/" + pkg_name
			},
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"import os; print([f for f in os.walk('/public')]); "
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			},

			"fs": {
				"public": {
					"index.html": "Hello, js!"
				}
			}
		}

		let wasmerPackage = await Wasmer.createPackage(manifest);
		await Wasmer.publishPackage(wasmerPackage);

		let appConfig =
		{
			name: app_name,
			owner: owner,
			package: wasmerPackage,
			env: [["test", "new_value"]],
			default: true

		};

		await Wasmer.deployApp(appConfig);
	})

	it("can run user-created packages", async () => {
		let manifest = {
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"print(\"hello, js!\")"
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			}
		};

		let pkg = await Wasmer.createPackage(manifest);
		let instance = await pkg.commands["hello"].run();

		const output = await instance.wait();
		assert(output.stdout === "hello, js!\n")
	})



	it("can mount fs", async () => {
		let manifest =
		{
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"import os; print([f for f in os.walk('/public')]); "
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			},

			"fs": {
				"public": {
					"index.html": "Hello, js!"
				}
			}
		}


		let pkg = await Wasmer.createPackage(manifest);
		let instance = await pkg.commands["hello"].run();

		const output = await instance.wait();
		assert(output.stdout.includes("index.html"))
	})

	it("can read metadata", async () => {
		let manifest =
		{
			"package": {
				"readme": "This is my readme!",
				"license": { data: "This is my license!", modified: new Date() }
			},
			"command": [
				{
					"module": "wasmer/python:python",
					"name": "hello",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-c",
								"import os; print([f for f in os.walk('/public')]); "
							]
						}
					}
				}
			],
			"dependencies": {
				"wasmer/python": "3.12.5+build.7"
			},

			"fs": {
				"public": {
					"index.html": "Hello, js!"
				}
			}
		}


		let pkg = await Wasmer.createPackage(manifest);
		let instance = await pkg.commands["hello"].run();

		const output = await instance.wait();
		assert(output.stdout.includes("index.html"))
	})

	it("can deploy a php app", async () => {
		let manifest = {
			"package": { "name": owner + "/" },
			"command": [
				{
					"module": "php/php:php",
					"name": "run",
					"runner": "wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-t",
								"/app",
								"-S",
								"localhost:8080"
							]
						}
					}
				}
			],
			"dependencies": {
				"php/php": "=8.3.4"
			},
			"fs": {
				"/app": {
					"index.php": "<?php phpinfo();"
				}
			}
		};

		let pkg = await Wasmer.createPackage(manifest);
		await Wasmer.publishPackage(pkg);

		let appConfig =
		{
			name: app_name,
			owner: owner,
			package: pkg,
			default: true
		};

		await Wasmer.deployApp(appConfig);
	})
});
