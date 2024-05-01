import {app, BrowserWindow} from 'electron';
import serve from '../index.js';

const loadUrl = serve({directory: import.meta.dirname});

let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow();
	loadUrl(mainWindow);
});
