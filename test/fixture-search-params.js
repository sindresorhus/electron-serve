import {app, BrowserWindow} from 'electron';
import path from 'node:path';
import serve from '../index.js';

const loadUrl = serve({directory: path.join(import.meta.dirname, 'sub')});

let mainWindow;

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow();
	loadUrl(mainWindow, {id: 4, foo: 'bar'});
})();
