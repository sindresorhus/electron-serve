import {BrowserWindow} from 'electron';

declare namespace electronServe {
	interface Options {
		/**
		The directory to serve, relative to the app root directory.
		*/
		directory: string;

		/**
		Custom scheme. For example, `foo` results in your `directory` being available at `foo://-`.

		@default 'app'
		*/
		scheme?: string;

		/**
		The partition the protocol should be installed to, if you're not using Electron's default partition.

		@default electron.session.defaultSession
		*/
		partition?:string
	}

	interface loadURL {
		/**
		Load the index file in the window.
		*/
		(window: BrowserWindow): Promise<void>;
	}
}

/**
Static file serving for Electron apps.

@example
```
import {app, BrowserWindow} from 'electron';
import serve = require('electron-serve');

const loadURL = serve({directory: 'renderer'});

let mainWindow;

(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow();

	await loadURL(mainWindow);

	// The above is equivalent to this:
	await mainWindow.loadURL('app://-');
	// The `-` is just the required hostname.
})();
```
*/
declare function electronServe(options: electronServe.Options): electronServe.loadURL;

export = electronServe;
