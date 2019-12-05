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
		scheme: 'app'
	}, options);

	// TODO: Make directory relative to app root. Document it.
	if (!options.directory) {
		throw new Error('The `directory` option is required');
	}

	options.directory = path.resolve(electron.app.getAppPath(), options.directory);

	const handler = async (request, callback) => {
		const indexPath = path.join(options.directory, 'index.html');
		const filePath = path.join(options.directory, decodeURIComponent(new URL(request.url).pathname));
		const resolvedPath = await getPath(filePath);

		if (resolvedPath || !path.extname(filePath) || path.extname(filePath) === '.html') {
			callback({
				path: resolvedPath || indexPath
			});
		} else {
			callback({error: FILE_NOT_FOUND});
		}
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

	electron.app.on('ready', () => {
		const session = options.partition ?
			electron.session.fromPartition(options.partition) :
			electron.session.defaultSession;
		const electronMajorVersion = Number.parseInt(process.versions.electron.split('.')[0]);
		if (major >= 7) {
			// https://github.com/electron/electron/blob/7-0-x/docs/api/breaking-changes-ns.md
			session.protocol.registerFileProtocol(options.scheme, handler);
		} else {
			session.protocol.registerFileProtocol(options.scheme, handler, error => {
				if (error) {
					throw error;
				}
			});
		}
	});

	return async win => {
		await win.loadURL(`${options.scheme}://-`);
	};
};
