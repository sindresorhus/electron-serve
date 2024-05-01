import {app, BrowserWindow} from 'electron';
import serve from '../index.js';

serve({directory: import.meta.dirname});

let mainWindow;

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow();
	mainWindow.loadURL('app://-/subdir/page.pdf');
})();
