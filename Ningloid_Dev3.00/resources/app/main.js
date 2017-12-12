
"use strct";

// Electronのモジュール
const electron = require("electron");

// アプリケーションをコントロールするモジュール
const app = electron.app;

// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow = null;

// 全てのウィンドウが閉じたら終了
app.on("window-all-closed", () => {
	if (process.platform != "darwin") {
		app.quit();
	}
});

// Electronの初期化完了後に実行
app.on("ready", () => {
	/*
	const fs = require("fs");
	const text = fs.readFileSync("window_options.js", "utf-8");
	eval(text);
	*/
	const window_options = require("./window_options.js");
	mainWindow = new BrowserWindow(window_options.browser);
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// ウィンドウが閉じられたらアプリも終了
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
});
