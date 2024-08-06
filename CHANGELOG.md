# Changelog

## [0.7.0](https://github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.6.0...wasmer-sdk-v0.7.0) (2024-08-06)


### Features

* Add atoms to manifests and use latest revision of webc crate ([29e26f4](https://github.com/wasmerio/wasmer-js/commit/29e26f4fb0a63f57566459fa654227e7654eb8e6))
* Add registry API and tests ([12b00b7](https://github.com/wasmerio/wasmer-js/commit/12b00b70b88e292618eb972ce46cadd63cb63e1d))
* Allow users to specify just their token while initializing the library + minor fixes ([2b4211c](https://github.com/wasmerio/wasmer-js/commit/2b4211cdd8945e9637fcffa4b713fcc3d7ce37b6))
* Allow users to specify metadata in various formats ([a16acfa](https://github.com/wasmerio/wasmer-js/commit/a16acfac5e19a412d7e365e721b4148753f06d0d))
* Update wasmer dependencies ([9f69d51](https://github.com/wasmerio/wasmer-js/commit/9f69d5166dde24620f952beb9bb8623502ee621c))
* Use same `Wasmer` type as output of created packages, update tests ([21c8ff8](https://github.com/wasmerio/wasmer-js/commit/21c8ff8f81571ce3510b61b39aed7e897cc8e990))


### Bug Fixes

* Add more tests and remove spurious tracing messages ([c3081da](https://github.com/wasmerio/wasmer-js/commit/c3081da7c8ab3e6f8ef8d0c5596d79e4d65a0fb6))
* address comments ([ec087eb](https://github.com/wasmerio/wasmer-js/commit/ec087ebae7cccb5de45628f6d1375e924846b4d8))
* Resolve a deadlock where the future returned by thread pool's sleep_now() method will never resolve when invoked from a syscall ([4ce8a54](https://github.com/wasmerio/wasmer-js/commit/4ce8a54361924b91ae77a00d8c0a6eda4b766f0d))
* Use a global variable to signal which init function to use ([0464d61](https://github.com/wasmerio/wasmer-js/commit/0464d616fc5a9c80a14f3ef609ea00d03f60f04b))
* use env variables in tests ([0fdd6ba](https://github.com/wasmerio/wasmer-js/commit/0fdd6baee10e0d42bb5e00bee044144a5adbec24))
* use git repository to patch `webc` ([9b256b2](https://github.com/wasmerio/wasmer-js/commit/9b256b2dd817fb5f733c8d7756a3119cc98bbb09))
* Use single input for initalization function ([0b5eab9](https://github.com/wasmerio/wasmer-js/commit/0b5eab9f4922ded6a5fe6bcec34ff38ffa2080c9))
* Use spaces instead of tabs in the js part of the code ([ff5db26](https://github.com/wasmerio/wasmer-js/commit/ff5db26e490175e59daa4b1aff234077b729031c))
* with -&gt; assert ([591bdcb](https://github.com/wasmerio/wasmer-js/commit/591bdcbf6b9c77bab957c514cd7517797e0d1d15))

## [0.6.0](https://github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.5.1...wasmer-sdk-v0.6.0) (2023-12-21)


### ⚠ BREAKING CHANGES

* The `@wasmer/sdk` `Runtime` has removed the limit on the maximum number of worker threads it is allowed to spawn. The corresponding `poolSize` option has been removed from `RuntimeOptions`.

### Features

* The `@wasmer/sdk` `Runtime` has removed the limit on the maximum number of worker threads it is allowed to spawn. The corresponding `poolSize` option has been removed from `RuntimeOptions`. ([d5da4ea](https://github.com/wasmerio/wasmer-js/commit/d5da4ea23278f084accc182dc65fd5188aef5dbd))


### Bug Fixes

* Bump the `wasmer` dependency to pick up wasmerio/wasmer[#4366](https://github.com/wasmerio/wasmer-js/issues/4366) ([c3c5a5d](https://github.com/wasmerio/wasmer-js/commit/c3c5a5d4a098b2250c7d9b34debf82f214e78cd9))

## [0.5.1](https://github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.5.0...wasmer-sdk-v0.5.1) (2023-12-15)


### Bug Fixes

* Bumped the `virtual-fs` dependency so we get a non-buggy `StaticFile` implementation (fixes [#366](https://github.com/wasmerio/wasmer-js/issues/366)) ([47b4633](https://github.com/wasmerio/wasmer-js/commit/47b4633716798f27b51e0d221cc519c2bd40cadb))
* Made sure users still get typings whenever they import a file from `dist/` ([956d404](https://github.com/wasmerio/wasmer-js/commit/956d40437adeafac72a446b1106e82516b7063fe))
* Update the `OptionOptions` type definition to accept `Uint8Array` as `stdin`, rather than `ArrayBuffer` ([a1d4045](https://github.com/wasmerio/wasmer-js/commit/a1d404566142863fac116029b5f101b07314f1cc))

## [0.5.0](https://github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.4.1...wasmer-sdk-v0.5.0) (2023-12-13)


### ⚠ BREAKING CHANGES

* Renamed `Wasmer.fromWebc()` to `Wasmer.fromFile()`
* Renamed `Output.stdoutUtf8` and friends to make the more common use case shorter
* Importing `@wasmer/sdk` will now use the smaller, non-embedded bundle by default
  * This should improve page load times for end users by being more cache-friendly and not needing to download/parse a ~6MB `*.js` file on startup
  * Users will need to explicitly import `@wasmer/sdk/dist/WasmerSDKBundled.js` if they want the old behaviour
  * Users may need to call `setWorkerUrl()` to point at `wasmer_js_bg.wasm`

### Features

* Renamed `Output.stdoutUtf8` and friends to make the more common use case shorter ([f94cc58](https://github.com/wasmerio/wasmer-js/commit/f94cc587e4e1aa28c84ebd012a37e046ee5c742f))
* The package now includes `dist/WasmerSDKBundled.*` files which embed the compiled Rust code as a base64 string as well as `dist/WasmerSDK.*` files which load the Rust code from the server as a `*.wasm` binary at runtime ([75c4bf1](https://github.com/wasmerio/wasmer-js/commit/75c4bf130ffacb5b8673074e8c493007ea26a838))
* Importing `@wasmer/sdk` will now use the smaller, non-embedded bundle by default ([75c4bf1](https://github.com/wasmerio/wasmer-js/commit/75c4bf130ffacb5b8673074e8c493007ea26a838))


### Bug Fixes

* A warning will now be emitted when the `@wasmer/sdk` package is loaded outside of a Cross-Origin Isolated context ([4dc5799](https://github.com/wasmerio/wasmer-js/commit/4dc5799edd09ed3d5c74603ac23c81ea1ba02be0))
* Errors encountered when the scheduler handles a message are now logged at the `error` level so they get printed by default ([c5decb5](https://github.com/wasmerio/wasmer-js/commit/c5decb54affce55d1822d9fc9ee35a3fd396907b))
* Mitigated a race condition in the thread pool by marking workers as "busy" when they are sent blocking tasks, rather than when the tasks are received ([35292d8](https://github.com/wasmerio/wasmer-js/commit/35292d874ab89fc35bd8188115e579271e17e2e7))
* The UMD module now exposes `@wasmer/sdk` under the name, `WasmerSDK`, rather than `Library` ([d34bb7a](https://github.com/wasmerio/wasmer-js/commit/d34bb7a7c2f2a7406e2c04e6f587e6b3a36f8991))

## [0.4.1](https://github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.4.0...wasmer-sdk-v0.4.1) (2023-11-30)


### Bug Fixes

* Set the maximum logging level in release mode to DEBUG ([1648a27](https://github.com/wasmerio/wasmer-js/commit/1648a27ade003e1b196dd48b49f77ad912e75ecc))

## [0.4.0](https://github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.3.0...wasmer-sdk-v0.4.0) (2023-11-30)


### ⚠ BREAKING CHANGES

* Renamed `Wasmer.fromWebc()` to `Wasmer.fromFile()`

### Features

* The `Output` you get from `await instance.wait()` now contains `stdoutUtf8` and `stderrUtf8` fields with stdout/stderr lazily parsed as UTF-8 strings ([61f3319](https://github.com/wasmerio/wasmer-js/commit/61f3319757ef3a523fabc680510f67da838289f8))


### Bug Fixes

* Resolved an issue where constructing a `Directory` with a `DirectoryInit` containing a nested file would error out while creating the file's parent directory ([f45f561](https://github.com/wasmerio/wasmer-js/commit/f45f5619b9b82430a40a9ce25bf5c53c7267f401))
* Resolved an unconditional panic when passing a `DirectoryInit` to `Command.spawn()` or `runWasix()`'s `mount` argument ([50df67d](https://github.com/wasmerio/wasmer-js/commit/50df67d48198dc4921d39cf6fef9fb4b646d8789))


### Code Refactoring

* Renamed `Wasmer.fromWebc()` to `Wasmer.fromFile()` ([8bf6868](https://github.com/wasmerio/wasmer-js/commit/8bf6868fc88cf67b9f8e099cb2af4fddc2115adf))

## [0.3.0](https://github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.2.0...wasmer-sdk-v0.3.0) (2023-11-27)


### ⚠ BREAKING CHANGES

* Removed the `Container`, `Manifest`, and `Volume` types
* Functionality needing a `Runtime` will now use a lazily initialized global runtime if one wasn't provided
* Renamed `SpawnConfig` and `RunConfig` to `SpawnOptions` and `RunOptions`.

### Features

* A `Wasmer` package now has a `commands` field which maps a `Command`'s name to its instance ([243d4b9](https://github.com/wasmerio/wasmer-js/commit/243d4b9ad6197263f05c0756d231596a7beb901b))
* A `Wasmer` package now has an `entrypoint` field with a runnable `Command` ([243d4b9](https://github.com/wasmerio/wasmer-js/commit/243d4b9ad6197263f05c0756d231596a7beb901b))
* Added a `Command.binary()` method for accessing the binary run by a `Command` ([243d4b9](https://github.com/wasmerio/wasmer-js/commit/243d4b9ad6197263f05c0756d231596a7beb901b))
* Added a `Wasmer.fromWebc()` constructor for loading a `*.webc` file ([4606724](https://github.com/wasmerio/wasmer-js/commit/4606724282e9b5d49ca6e1456b530154b45094be))
* Functionality needing a `Runtime` will now use a lazily initialized global runtime if one wasn't provided ([70a2083](https://github.com/wasmerio/wasmer-js/commit/70a20838a9fba1712a6905e160075c9ad13b93f8))
* Introduced a `DirectoryInit` type that lets you initialize a `Directory` with a map from file paths to their contents ([553ded5](https://github.com/wasmerio/wasmer-js/commit/553ded5451a7863b8f24889d5ee7bbd269bf4953))
* Rewrote the top-level `Wasmer` type to represent a package that has been loaded and is ready for execution ([9f54cb5](https://github.com/wasmerio/wasmer-js/commit/9f54cb5ab0d4694e7ebdc3e7f7926799f29c6c8d))
* Users are now able to mount directories using either a existing `Directory` or a `DirectoryInit` which will be used to instantiate a new `Directory` ([e43ea8c](https://github.com/wasmerio/wasmer-js/commit/e43ea8c622aa163ca6a61f70f41cf2db932850eb))


### Code Refactoring

* Removed the `Container`, `Manifest`, and `Volume` types ([e2ed292](https://github.com/wasmerio/wasmer-js/commit/e2ed292494667ef73274ecc93e0c13b4fb1e819e))
* Renamed `SpawnConfig` and `RunConfig` to `SpawnOptions` and `RunOptions`. ([e43ea8c](https://github.com/wasmerio/wasmer-js/commit/e43ea8c622aa163ca6a61f70f41cf2db932850eb))

## [0.2.0](https://github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.1.0...wasmer-sdk-v0.2.0) (2023-11-24)


### Features

* Users can now mount a `Directory` (backed by an in-memory filesystem) when spawning WASIX instances ([98e5d92](https://github.com/wasmerio/wasmer-js/commit/98e5d92466763439201a2849ff3d96c2a073f8e2))


### Bug Fixes

* The logger will now proxy all messages to the main thread so output from Web Workers can be captured ([dba73fd](https://github.com/wasmerio/wasmer-js/commit/dba73fd628c8d5c0a57024be298727433aa2de6e))
