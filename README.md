# Tauri Typescript React Boilerplate
A Tauri Typescript React Boilerplate that works out of the box.

- [x] MacOS
- [x] Windows 10
- [ ] Linux (Probably works but I haven't tested)
- [ ] WSL (almost...)

## Setup
Follow the [Tauri setup docs](https://tauri.studio/docs/getting-started/intro/) in your platform to get everything set up for Tauri development, then run

```bash
$ npm install
```

## Development

```bash
$ npm run dev # or npm run dev:win if you're in the Windows shell
```

There's an example app that shows a little bit of how you can communicate between the front end (Typescript/JS) and back end (Rust)

## Build
```bash
$ npm run build
```
Tauri will walk you through the rest.

## What doesn't work
* Typescript autocomplete. This has to do with the `tauri` npm package. It's probably coming soon...
* Linting and code formatting for Typescript. I might add this later.

## Contributing
Feel free to create an issue or PR. Just understand I don't have a ton of time to contribute to this, so I may not be the fastest at responding.
