'use strict';
const {app, BrowserWindow} = require('electron');
const serve = require('..');

const loadUrl = serve({directory: __dirname});

let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow();
	loadUrl(mainWindow);
});
