import {expectType} from 'tsd-check';
import * as electronServe from '.';
import { BrowserWindow } from 'electron';

expectType<electronServe.loadURL>(electronServe({directory:""}));

const loadURL = electronServe({directory:""});
expectType<Promise<void>>(loadURL(new BrowserWindow()));
