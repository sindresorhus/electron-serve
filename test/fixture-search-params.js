'use strict';
const {app, BrowserWindow} = require('electron');
const {join} = require('path');
const serve = require('..');

const loadUrl = serve({directory: join(__dirname, 'sub')});

let mainWindow;

(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow();
	loadUrl(mainWindow, {id: 4, foo: 'bar'});
})();
