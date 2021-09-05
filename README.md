# Tauri Typescript React Boilerplate
A Tauri Typescript React Boilerplate that works out of the box.

- [x] MacOS
- [x] Windows 10
- [x] Linux

## Setup
Follow the [Tauri setup docs](https://tauri.studio/docs/getting-started/intro/) in your platform to get everything set up for Tauri development, then run

```bash
$ yarn
```

### Note for MacOS users
I had to do the following to get `node-gyp` to work...
* Use homebrew to install `vips`, `cmake` and `poppler`: 
```bash
$ brew install vips cmake && brew link --overwrite poppler
```
* [Compile and install OpenEXR.](https://github.com/AcademySoftwareFoundation/openexr/blob/master/INSTALL.md)

### Note for Windows users
I had to run `rustup default stable` to change the default rust toolchain from `gnu` to `msvc`.

## Development

```bash
$ yarn dev
```

There's an example app that shows a little bit of how you can communicate between the front end (Typescript/JS) and back end (Rust)

## Build
```bash
$ yarn build
```
Tauri will walk you through the rest.

## Contributing
Feel free to create an issue or PR. Just understand I don't have a ton of time to contribute to this, so I may not be the fastest at responding.
