// テスト：エディタとゲームを同時起動する
const electron = require("electron");
const {BrowserWindow} = require("electron").remote;
const windowOptions = require("./window_options.js");
windowOptions.width *= 0.7;
windowOptions.height *= 0.7;
let win = new BrowserWindow(windowOptions);
win.loadURL(`file://${__dirname}/../game/index.html`);
