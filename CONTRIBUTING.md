## Contributing Guide

### Building

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

### Testing

Build the package and run the tests:

```sh
npm run build:dev
npm run test
```

### Releasing

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

[binaryen]: https://github.com/WebAssembly/binaryen
[conv]: https://www.conventionalcommits.org/en/v1.0.0/
[release-please]: https://github.com/googleapis/release-please
[Rust]: https://www.rust-lang.org/
[wabt]: https://github.com/WebAssembly/wabt
[wasm-pack]: https://rustwasm.github.io/wasm-pack/
