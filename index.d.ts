import Electron = require("electron");

declare namespace electronServe {
	type Options = {
		/**
		 * The directory to serve, relative to the app root directory
		 */
		directory: string;
		/**
		 * Custom scheme. For example, `foo` results in your `directory` being available at `foo://-`
		 * @default 'app'
		 */
		scheme?: string;
		/**
		 * The partition the protocol should be installed to, if you're not using Electron's default partition.
		 * @default electron.session.defaultSession
		 */
		partition?:string
	}
	type serveStatic = (win: Electron.BrowserWindow) => Promise<void>
}

declare function electronServe(options: electronServe.Options): electronServe.serveStatic;

export = electronServe
