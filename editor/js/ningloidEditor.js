// // テスト：２窓式
// const {BrowserWindow} = require("electron").remote;
// const windowOptions = require("../game/window_options.js");
// let win = new BrowserWindow(windowOptions);
// win.loadURL(`file://${__dirname}/../game/index.html`);

const ningloidEditor = {
	// 編集状態（未保存状態）を管理するflag
	editFlag: false,
	init(){
		const windowOption = require("./window_options.js");
		$("#game").css(windowOption.game);

		// 基本レイヤの準備
		ningloid.layer.init();
		// キー・マウスイベントの初期化処理
		ningloid.keyMouse.init();
		// システム系の初期化処理
		ningloid.system.init();
		// キャラ系の初期化処理
		ningloid.character.init();
		ningloid.menu.init();

		document.title = "Ningloid Editor";

		// エディタデザインの初期化
		this.editor.init();
		this.design.init();
	},
};

const NLE = ningloidEditor;
