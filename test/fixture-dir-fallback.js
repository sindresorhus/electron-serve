'use strict';
const {app, BrowserWindow} = require('electron');
const serve = require('..');

serve({directory: __dirname});

let mainWindow;

(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow();
	mainWindow.loadURL('app://-/subdir/page.html');
})();
