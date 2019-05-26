/* eslint-disable import/no-extraneous-dependencies */
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
