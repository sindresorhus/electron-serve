# electron-serve

> Static file serving for Electron apps

Normally you would just use `win.loadURL('file://…')`, but that doesn't work when you're making a single-page web app, which most Electron apps are today, as [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History_API)'ed URLs don't exist on disk. It serves files if they exist, and falls back to `index.html` if not, which means you can use router modules like [`react-router`](https://github.com/ReactTraining/react-router), [`vue-router`](https://github.com/vuejs/vue-router), etc.

## Install

```
$ npm install electron-serve
```

*Requires Electron 8 or later.*

## Usage

```js
const {app, BrowserWindow} = require('electron');
const serve = require('electron-serve');

const loadURL = serve({directory: 'renderer'});

let mainWindow;

(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow();

	await loadURL(mainWindow);

	// The above is equivalent to this:
	await mainWindow.loadURL('app://-');
	// The `-` is just the required hostname
})();
```

## API

### serve(options)

#### options

Type: `object`

##### directory

*Required*\
Type: `string`

The directory to serve, relative to the app root directory.

##### scheme

Type: `string`\
Default: `'app'`

Custom scheme. For example, `foo` results in your `directory` being available at `foo://-`.

##### isCorsEnabled

Type: `boolean`\
Default: `true`

Whether [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) should be enabled.
Useful for testing purposes.

##### partition

Type: `string`\
Default: [`electron.session.defaultSession`](https://electronjs.org/docs/api/session#sessiondefaultsession)

The [partition](https://electronjs.org/docs/api/session#sessionfrompartitionpartition-options) the protocol should be installed to, if you're not using Electron's default partition.

## Related

- [electron-util](https://github.com/sindresorhus/electron-util) - Useful utilities for developing Electron apps and modules
- [electron-reloader](https://github.com/sindresorhus/electron-reloader) - Simple auto-reloading for Electron apps during development
- [electron-debug](https://github.com/sindresorhus/electron-debug) - Adds useful debug features to your Electron app
- [electron-context-menu](https://github.com/sindresorhus/electron-context-menu) - Context menu for your Electron app
- [electron-dl](https://github.com/sindresorhus/electron-dl) - Simplified file downloads for your Electron app
- [electron-unhandled](https://github.com/sindresorhus/electron-unhandled) - Catch unhandled errors and promise rejections in your Electron app
