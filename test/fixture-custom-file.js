'use strict';
const {app, BrowserWindow} = require('electron');
const serve = require('..');

const loadUrl = serve({directory: __dirname, file: 'owl'});

let mainWindow;

(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow();
	loadUrl(mainWindow);
})();
