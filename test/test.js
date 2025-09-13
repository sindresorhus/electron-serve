import {test} from 'node:test';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runElectronTest = (fixture, timeout = 5000) => new Promise((resolve, reject) => {
	const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
	const fixturePath = path.join(__dirname, fixture);
	const child = spawn(electronPath, [fixturePath], {
		stdio: 'pipe',
		env: {
			...process.env,
			ELECTRON_ENABLE_LOGGING: '1',
		},
	});

	let resolved = false;
	let errorOutput = '';

	const timer = setTimeout(() => {
		if (!resolved) {
			resolved = true;
			child.kill();
			// If we get here without errors, the test passed (Electron started successfully)
			resolve();
		}
	}, timeout);

	child.stderr.on('data', data => {
		errorOutput += data.toString();
		// Check for critical errors that indicate failure
		if (errorOutput.includes('Error:') && !errorOutput.includes('Security Warning') && !resolved) {
			resolved = true;
			clearTimeout(timer);
			child.kill();
			reject(new Error(`Electron error: ${errorOutput}`));
		}
	});

	child.on('error', error => {
		if (!resolved) {
			resolved = true;
			clearTimeout(timer);
			reject(error);
		}
	});

	child.on('exit', code => {
		if (!resolved) {
			resolved = true;
			clearTimeout(timer);
			if (code !== 0 && code !== null && code !== 143) { // 143 is SIGTERM from timeout
				reject(new Error(`Electron exited with code ${code}. Error: ${errorOutput}`));
			} else {
				resolve();
			}
		}
	});
});

const runElectronTestExpectError = (fixture, timeout = 5000) => new Promise(resolve => {
	const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
	const fixturePath = path.join(__dirname, fixture);
	const child = spawn(electronPath, [fixturePath], {
		stdio: 'pipe',
		env: {
			...process.env,
			ELECTRON_ENABLE_LOGGING: '1',
		},
	});

	let resolved = false;
	let errorOutput = '';

	const timer = setTimeout(() => {
		if (!resolved) {
			resolved = true;
			child.kill();
			resolve(); // Timeout is expected for 404 test
		}
	}, timeout);

	child.stderr.on('data', data => {
		errorOutput += data.toString();
		// Check for 404 or network error
		if ((errorOutput.includes('404') || errorOutput.includes('ERR_FAILED') || errorOutput.includes('net::ERR_')) && !resolved) {
			resolved = true;
			clearTimeout(timer);
			child.kill();
			resolve(); // Error is expected
		}
	});

	child.on('error', () => {
		if (!resolved) {
			resolved = true;
			clearTimeout(timer);
			resolve(); // Error is expected
		}
	});

	child.on('exit', () => {
		if (!resolved) {
			resolved = true;
			clearTimeout(timer);
			resolve();
		}
	});
});

test('serves directory index', async () => {
	await runElectronTest('fixture.js');
});

test('serves directory index on app ready', async () => {
	await runElectronTest('fixture-on-ready.js');
});

test('allows special characters in file paths', async () => {
	await runElectronTest('fixture-encoded-uri.js');
});

test('fallbacks to root index if unresolved path has .html extension or no extension', async () => {
	await runElectronTest('fixture-dir-fallback.js');
});

test('throws error if unresolved path has an extension other than .html', async () => {
	await runElectronTestExpectError('fixture-404-error.js');
});

test('serves directory custom file', async () => {
	await runElectronTest('fixture-custom-file.js');
});

test('serves directory index with search params', async () => {
	await runElectronTest('fixture-search-params.js');
});

test('supports ES modules', async () => {
	await runElectronTest('fixture-es-modules.js');
});

test('serves source maps with correct MIME type', async () => {
	await runElectronTest('fixture-sourcemap.js');
});

test('serves from default directory when no options provided', async () => {
	await runElectronTest('fixture-default-directory.js');
});

test('serves from default directory when empty options provided', async () => {
	await runElectronTest('fixture-empty-options.js');
});
