import electron from 'electron';
import {serial as test} from 'ava';
import {Application} from 'spectron';

test.afterEach.always(async t => {
	await t.context.spectron.stop();
});

test('serves directory index', async t => {
	t.context.spectron = new Application({
		path: electron,
		args: ['fixture.js']
	});
	await t.context.spectron.start();
	const {client} = t.context.spectron;
	await client.waitUntilWindowLoaded();
	await client.waitUntilTextExists('h1', '🦄', 5000);
	t.pass();
});

test('serves directory index on app ready', async t => {
	t.context.spectron = new Application({
		path: electron,
		args: ['fixture-on-ready.js']
	});
	await t.context.spectron.start();
	const {client} = t.context.spectron;
	await client.waitUntilWindowLoaded();
	await client.waitUntilTextExists('h1', '🦄', 5000);
	t.pass();
});

test('allows special characters in file paths', async t => {
	t.context.spectron = new Application({
		path: electron,
		args: ['fixture-encoded-uri.js']
	});
	await t.context.spectron.start();
	const {client} = t.context.spectron;
	await client.waitUntilWindowLoaded();
	await client.waitUntilTextExists('h1', '🚀', 5000);
	t.pass();
});

test('fallbacks to root index if unresolved path has .html extension or no extension', async t => {
	t.context.spectron = new Application({
		path: electron,
		args: ['fixture-dir-fallback.js']
	});
	await t.context.spectron.start();
	const {client} = t.context.spectron;
	await client.waitUntilWindowLoaded();
	await client.waitUntilTextExists('h1', '🦄', 5000);
	t.pass();
});

test('throws error if unresolved path has an extension other than .html', async t => {
	t.context.spectron = new Application({
		path: electron,
		args: ['fixture-404-error.js']
	});
	await t.context.spectron.start();
	const {client} = t.context.spectron;
	await client.waitUntilWindowLoaded();
	await t.throwsAsync(client.waitUntilTextExists('h1', '🦄', 5000));
	t.pass();
});
