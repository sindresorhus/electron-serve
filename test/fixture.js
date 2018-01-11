'use strict';
const electron = require('electron');
const serve = require('..');

const loadUrl = serve({directory: __dirname});

let mainWindow;
electron.app.on('ready', async () => {
	mainWindow = new electron.BrowserWindow();
	loadUrl(mainWindow);
});
