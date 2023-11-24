# Changelog

## [0.2.0](https://www.github.com/wasmerio/wasmer-js/compare/wasmer-sdk-v0.1.0...wasmer-sdk-v0.2.0) (2023-11-24)


### Features

* Users can now mount a `Directory` (backed by an in-memory filesystem) when spawning WASIX instances ([98e5d92](https://www.github.com/wasmerio/wasmer-js/commit/98e5d92466763439201a2849ff3d96c2a073f8e2))


### Bug Fixes

* The logger will now proxy all messages to the main thread so output from Web Workers can be captured ([dba73fd](https://www.github.com/wasmerio/wasmer-js/commit/dba73fd628c8d5c0a57024be298727433aa2de6e))
