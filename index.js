'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');
const util = require('util');
const electron = require('electron');

const stat = util.promisify(fs.stat);

const getPath = async pth => {
	try {
		const result = await stat(pth);

		if (result.isFile()) {
			return pth;
		}

		if (result.isDirectory()) {
			return getPath(path.join(pth, 'index.html'));
		}
	} catch (err) {}
};

module.exports = options => {
	options = Object.assign({
		scheme: 'app'
	}, options);

	// TODO: Make directory relative to app root. Document it.
	if (!options.directory) {
		throw new Error('The `directory` option is required');
	}

	options.directory = path.resolve(electron.app.getAppPath(), options.directory);

	const handler = async (request, callback) => {
		const indexPath = path.join(options.directory, 'index.html');
		const filePath = path.join(options.directory, new url.URL(request.url).pathname);

		callback({
			path: (await getPath(filePath)) || indexPath
		});
	};

	electron.protocol.registerStandardSchemes([options.scheme], {secure: true});

	electron.app.on('ready', () => {
		const session = options.partition ?
			electron.session.fromPartition(options.partition) :
			electron.session.defaultSession;

		session.protocol.registerFileProtocol(options.scheme, handler, error => {
			if (error) {
				throw error;
			}
		});
	});

	return win => {
		win.loadURL(`${options.scheme}://-`);
	};
};
