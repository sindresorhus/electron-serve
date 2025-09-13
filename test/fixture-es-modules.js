import {app, BrowserWindow} from 'electron';
import serve from '../index.js';

const loadUrl = serve({directory: `${import.meta.dirname}/es-module-test`});

let mainWindow;

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow({
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
		},
		show: false,
	});

	await loadUrl(mainWindow);

	// Wait for page to load and log content to stdout
	mainWindow.webContents.on('did-finish-load', async () => {
		try {
			const h1Text = await mainWindow.webContents.executeJavaScript(`
				const h1 = document.querySelector('h1');
				return h1 ? h1.textContent : null;
			`);

			if (h1Text) {
				process.stdout.write(h1Text + '\n');
			}
		} catch (error) {
			console.error('Test helper error:', error);
		}
	});
})();
