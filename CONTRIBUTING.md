# Contributing Guide

This document describes the high-level architecture of the `wasmerio/wasmer-js`
repo and how you can contribute to it.

If you want to familiarize yourself with the code base, you are just in the
right place!

## Architecture

This project has two main components,

- The `wasmer-js` crate - a Rust crate that implements the WASIX runtime for a
  JavaScript environment
- The `@wasmer/sdk` package - a JavaScript package that wraps the compiled
  `wasmer-js` crate and makes it available as a NPM package

We use [`wasm-pack`][wasm-pack] to compile the Rust to WebAssembly, then bundle
it into a library with [`rollup`][rollup].

## Design Goals

### Goal 1: Fast Build Times

A clean debug build of the entire workspace shouldn't take any longer than 30
seconds and the entire CI workflow should finish within 10 minutes.

This isn't actually too difficult to achieve as long as you follow some
guidelines:

- Don't add dependencies unless you absolutely need to
- Trim out unnecessary features
- Periodically use `cargo clean && cargo build --timings` to see where compile
  time is spent
- Don't use dependencies that pull in half of crates.io

The rationale behind this is simple - [**a short edit-compile-test cycle is a
force multiplier**][fast-rust-builds]. If you have fast compile times then
developers can recompile and re-run the test suite after every change.

On the other hand, if CI takes 30 minutes to complete, developers will avoid
your project like the plague because getting even the most trivial changes
merged becomes a multi-hour chore.

To help this, we have [a GitHub Action][workflow-timer] which will post comments
on each PR to let you know how much your changes have affected CI times.

### Goal 2: High Level

The `@wasmer/sdk` package should be a high-level interface to WASIX, the Wasmer
Registry, packages, and Wasmer Edge.

Users don't need to care about the inner workings of WASIX or how
multi-threading is implemented. Everything should be abstracted away and provide
a general interface.

Keeping the `@wasmer/sdk` package's public API at a high level of abstraction
has a number of nice benefits,

- A smaller public API is easier to maintain
- Providing users with options and hooks for *everything* can make the library
  very complicated and hard to use, which impacts developer experience
- Not exposing implementation details means you can always change them without
  breaking users

Users **will** ask for more and more complex functionality... As a maintainer,
it's important to know that you can always say *"no"* to a ticket or PR.

## Building

To build this library you will need to have installed in your system:

* Node.JS
* [Rust][Rust]
* [wasm-pack][wasm-pack]
* [wabt][wabt] (for `wasm-strip`)
* [binaryen][binaryen] (for `wasm-opt`)

```sh
npm install
npm run build
```

There is also a command for compiling the Rust in debug mode. This tends to be
a lot faster and includes thread-safety checks.

```sh
npm run build:dev
```

## Testing

The JavaScript SDK has two levels of testing, unit tests and integration tests.

### Unit Tests

Unit tests are for testing the internals of the `wasmer-js` crate. They are
written in Rust and executed using [`wasm-pack`'s test runner][wasm-pack-test].

The unit tests are compiled to WebAssembly, loaded in a browser window on the
fly, and executed.

For example, to run the tests in a headless version of Firefox, you would run
the following:

```sh
wasm-pack test --firefox --headless
```

Using `--open` instead of `--headless` will open a browser window so you can see
the output from the console.

### Integration Tests

Unlike the unit tests, our integration tests are written in TypeScript and
exercise the `@wasmer/sdk` package's public API.

That means whenever you make a change and want to test its effects, you'll need
to rebuild the package (preferably in dev mode so you get `debug_assert!()` and
better back traces).

```sh
npm run build:dev
```

Testing is pretty straightforward:

```sh
npm run test
```

Again, the tests are executed in the browser using browser automation.

You can run individual test files by passing them to `npm run test`. There is also
an option to open the browser window and test it manually.

```sh
npm run test -- --manual --open tests/integration.test.ts
```

## Releasing

This repository uses [Release Please][release-please] to automate a lot of the
work around creating releases.

Every time a commit following the [Conventional Commit Style][conv] is merged
into `main`, the [`release-please.yml`](.github/workflows/release-please.yml)
workflow will run and update the "Release PR" to reflect the new changes.

For commits that just fix bugs (i.e. the message starts with `"fix: "`), the
associated crate will receive a changelog entry and a patch version bump.
Similarly, adding a new feature (i.e. `"feat:"`) does a minor version bump and
adding breaking changes (i.e. `"fix!:"` or `"feat!:"`) will result in a major
version bump.

When the release PR is merged, the updated changelog and bumped version number
will be merged into the `main` branch, the `release-please.yml` workflow will
automatically generate GitHub Releases, and CI will publish the package to NPM.

TL;DR:

1. Use [Conventional Commit Messages][conv] whenever you make a noteworthy change
2. Merge the release PR when ready to release
3. Let the automation do everything else

### Pre-Releases

We don't do too many pre-releases, so it's not automated through *Release
Please*. Instead, if you want to make a pre-release you'll need to bump version
numbers tag a commit, and push the tagged commmit to GitHub.

CI should publish to NPM, automatically.

[binaryen]: https://github.com/WebAssembly/binaryen
[conv]: https://www.conventionalcommits.org/en/v1.0.0/
[fast-rust-builds]: https://matklad.github.io/2021/09/04/fast-rust-builds.html
[release-please]: https://github.com/googleapis/release-please
[rollup]: https://rollupjs.org/
[Rust]: https://www.rust-lang.org/
[wabt]: https://github.com/WebAssembly/wabt
[wasm-pack-test]: https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/testing-your-project.html
[wasm-pack]: https://rustwasm.github.io/wasm-pack/
[workflow-timer]: https://github.com/Michael-F-Bryan/workflow-timer
