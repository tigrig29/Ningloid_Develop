// // テスト：２窓式
// const {BrowserWindow} = require("electron").remote;
// const windowOptions = require("../game/window_options.js");
// let win = new BrowserWindow(windowOptions);
// win.loadURL(`file://${__dirname}/../game/index.html`);

const ningloidEditor = {
	init(){
		const windowOption = require("./window_options.js");
		$("#game").css(windowOption.game);

		ningloid.init();
	}
};
