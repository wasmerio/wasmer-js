import { assert, expect } from "@esm-bundle/chai";
import { init, initializeLogger, Wasmer } from "..";

const initialized = (async () => {
	await init(new URL("../dist/wasmer_js_bg.wasm", import.meta.url));
	initializeLogger("error");
})();

describe("Registry", function() {
	this.timeout("60s").beforeAll(async () => await initialized);

	it("Has global context", async () => {
		let v = (globalThis as any)["__WASMER_REGISTRY__"];
		expect(typeof v != "undefined")
	});

	it("can create a package", async () => {

		let manifest = {
			"command": [
				{
					"module": "wasmer/static-web-server:webserver",
					"name": "script",
					"runner": "https://webc.org/runner/wasi",
					"annotations": {
						"wasi": {
							"main-args": [
								"-w",
								"/settings/config.toml"
							]
						}
					}
				}
			],
			"fs": {
				"public": {
					"index.html": [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x0a],
					"inner": {
						"index.html": [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x0a],
					}
				}
			},
			"dependencies": {
				"wasmer/static-web-server": "^1"
			},
		}

		let result = await Wasmer.createPackage(manifest);

		console.log("\n== Creating a package == ");
		console.log(result.commands)
	})

	//it("can publish packages", async () => {
	//	let manifest = {
	//		"package": {
	//			"name": "<USER>/my-package"
	//		},
	//		"command": [
	//			{
	//				"module": "wasmer/static-web-server:webserver",
	//				"name": "script",
	//				"runner": "https://webc.org/runner/wasi",
	//				"annotations": {
	//					"wasi": {
	//						"main-args": [
	//							"-w",
	//							"/settings/config.toml"
	//						]
	//					}
	//				}
	//			}
	//		],
	//		"fs": {
	//			"public": {
	//				"index.html": [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x0a],
	//				"inner": {
	//					"index.html": [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x0a],
	//				}
	//			}
	//		},
	//		"dependencies": {
	//			"wasmer/static-web-server": "^1"
	//		},
	//	}
	//	let wasmerPackage = await Wasmer.createPackage(manifest);
	//	let result = await Wasmer.publishPackage(wasmerPackage);
	//	console.log("\n== Publishing a package == ");
	//	console.log("Published package hash: ", result.hash);
	//	console.log("Published package manifest: ", result.manifest);
	//})

	////it("can deploy apps", async () => {
	//	let appConfig =
	//	{
	//		name: "my-awesome-app",
	//		owner: "<USER>",
	//		package: "sha256:e1f3be3d017a049aefa2be984f7352b2d901d73fd6daaba2d2c1643a4196cfaa",
	//		env: [["test", "new_value"]],
	//		default: true

	//	};

	//	let result = await Wasmer.deployApp(appConfig);

	//	console.log("\n== Deploying an app == ");
	//	console.log("Deployed app id: ", result.id);
	//	console.log("Deployed app url: ", result.url);
	//})

	//it("can deploy apps with user-created packages", async () => {
	//	let manifest = {
	//		"package": {
	//			"name": "<USER>/my-package"
	//		},

	//		"command": [
	//			{
	//				"module": "wasmer/static-web-server:webserver",
	//				"name": "script",
	//				"runner": "https://webc.org/runner/wasi",
	//				"annotations": {
	//					"wasi": {
	//						"main-args": [
	//							"-w",
	//							"/settings/config.toml"
	//						]
	//					}
	//				}
	//			}
	//		],
	//		"fs": {
	//			"public": {
	//				"index.html": [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x0a],
	//				"inner": {
	//					"index.html": [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x0a],
	//				}
	//			}
	//		},
	//		"dependencies": {
	//			"wasmer/static-web-server": "^1"
	//		},
	//	}

	//	let wasmerPackage = await Wasmer.createPackage(manifest);

	//	let appConfig =
	//	{
	//		name: "my-awesome-app",
	//		owner: "<USER>",
	//		env: [["test", "new_value"]],
	//		default: true

	//	};

	//	let result = await Wasmer.deployApp(appConfig, wasmerPackage);

	//	console.log("\n== Deploying user-created app ==");
	//	console.log("Deployed app id: ", result.id);
	//	console.log("Deployed app url: ", result.url);
	//})


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
				"wasmer/python": "3.12.9+build.9"
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
				"wasmer/python": "3.12.9+build.9"
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
		console.log("\n== Mounting and running user-defined fs == ");
		console.log(manifest);
		console.log("Does this contain 'index.html'?", output.stdout)
		assert(output.stdout.includes("index.html"))
	})
});
