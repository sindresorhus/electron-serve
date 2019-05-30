import {expectType} from 'tsd';
import {BrowserWindow} from 'electron';
import serve = require('.');

expectType<serve.loadURL>(serve({directory: ''}));

const loadURL = serve({directory: ''});
expectType<Promise<void>>(loadURL(new BrowserWindow()));
