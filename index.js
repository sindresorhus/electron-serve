'use strict';
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const electron = require('electron');

const stat = promisify(fs.stat);

// See https://cs.chromium.org/chromium/src/net/base/net_error_list.h
const FILE_NOT_FOUND = -6;

const getPath = async path_ => {
	try {
		const result = await stat(path_);

		if (result.isFile()) {
			return path_;
		}

		if (result.isDirectory()) {
			return getPath(path.join(path_, 'index.html'));
		}
	} catch (_) {}
};

module.exports = options => {
	options = Object.assign({
		isCorsEnabled: true,
		scheme: 'app'
	}, options);

	if (!options.directory) {
		throw new Error('The `directory` option is required');
	}

	options.directory = path.resolve(electron.app.getAppPath(), options.directory);

	const handler = async (request, callback) => {
		const indexPath = path.join(options.directory, 'index.html');
		const filePath = path.join(options.directory, decodeURIComponent(new URL(request.url).pathname));
		const resolvedPath = await getPath(filePath);
		const fileExtension = path.extname(filePath);

		if (resolvedPath || !fileExtension || fileExtension === '.html' || fileExtension === '.asar') {
			callback({
				path: resolvedPath || indexPath
			});
		} else {
			callback({error: FILE_NOT_FOUND});
		}
	};

	electron.protocol.registerSchemesAsPrivileged([
		{
			scheme: options.scheme,
			privileges: {
				standard: true,
				secure: true,
				allowServiceWorkers: true,
				supportFetchAPI: true,
				corsEnabled: options.isCorsEnabled
			}
		}
	]);

	electron.app.on('ready', () => {
		const session = options.partition ?
			electron.session.fromPartition(options.partition) :
			electron.session.defaultSession;

		session.protocol.registerFileProtocol(options.scheme, handler);
	});

	return async window_ => {
		await window_.loadURL(`${options.scheme}://-`);
	};
};
