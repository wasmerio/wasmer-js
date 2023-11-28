# Changelog

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
