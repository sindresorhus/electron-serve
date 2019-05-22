'use strict';
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const electron = require('electron');
const mime = require('mime');

const stat = promisify(fs.stat);

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
		scheme: 'app'
	}, options);

	// TODO: Make directory relative to app root. Document it.
	if (!options.directory) {
		throw new Error('The `directory` option is required');
	}

	options.directory = path.resolve(electron.app.getAppPath(), options.directory);

	const handler = async (request, callback) => {
		const indexPath = path.join(options.directory, 'index.html');
		const filePath = path.join(options.directory, new URL(request.url).pathname);
		const pathName = (await getPath(filePath)) || indexPath;

		fs.readFile(pathName, (error, data) => {
			if (error) {
				throw error;
			}

			const extension = path
				.extname(pathName)
				.toLowerCase()
				.substr(1);
			const mimeType = mime.getType(extension);

			callback({mimeType, data});
		});
	};

	if (electron.protocol.registerStandardSchemes) {
		// Electron <=4
		electron.protocol.registerStandardSchemes([options.scheme], {secure: true});
	} else {
		// Electron >=5
		electron.protocol.registerSchemesAsPrivileged([
			{
				scheme: options.scheme,
				privileges: {
					secure: true,
					standard: true
				}
			}
		]);
	}

	(async () => {
		await electron.app.whenReady();

		const session = options.partition ?
			electron.session.fromPartition(options.partition) :
			electron.session.defaultSession;

		session.protocol.registerBufferProtocol(options.scheme, handler, error => {
			if (error) {
				throw error;
			}
		});
	})();

	return async win => {
		await win.loadURL(`${options.scheme}://-`);
	};
};
