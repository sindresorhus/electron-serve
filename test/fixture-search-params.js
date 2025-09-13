import {app, BrowserWindow} from 'electron';
import path from 'node:path';
import serve from '../index.js';

const loadUrl = serve({directory: path.join(import.meta.dirname, 'sub')});

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

	// Load URL with search params
	await loadUrl(mainWindow, {id: 4, foo: 'bar'});

	// Wait for page to load and log content to stdout
	mainWindow.webContents.on('did-finish-load', async () => {
		try {
			const h1Text = await mainWindow.webContents.executeJavaScript(`
				const h1 = document.querySelector('h1');
				return h1 ? h1.textContent : null;
			`);

			if (h1Text) {
				process.stdout.write(h1Text + '\n');
				return;
			}

			// For search params test
			const resultText = await mainWindow.webContents.executeJavaScript(`
				const result = document.getElementById('result');
				return result ? result.textContent : null;
			`);

			if (resultText) {
				process.stdout.write(resultText + '\n');
			}
		} catch (error) {
			console.error('Test helper error:', error);
		}
	});
})();
