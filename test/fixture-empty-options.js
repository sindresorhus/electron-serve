import {app, BrowserWindow} from 'electron';
import serve from '../index.js';

// Test default directory behavior - empty options object
const loadUrl = serve({});

let mainWindow;

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow({
		show: false,
	});

	await loadUrl(mainWindow);
})();
