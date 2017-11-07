// // テスト：２窓式
// const {BrowserWindow} = require("electron").remote;
// const windowOptions = require("../game/window_options.js");
// let win = new BrowserWindow(windowOptions);
// win.loadURL(`file://${__dirname}/../game/index.html`);

const ningloidEditor = {
	// 各種Flag変数
	flag:{
		// エラー発生状態を管理する
		error: false,
		// 編集状態（未保存状態）を管理する
		edit: false,
	},
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
	reset(){
		// ゲーム画面のリセット
		ningloid.resetGame();
		// シナリオ全文を取得 → 命令配列化
		this.parser.scenarioArray = $.cloneArray(this.editor.aceObject.getSession().getDocument().$lines);
		this.parser.orderArray = ningloid.parser.createOrderArray(this.parser.scenarioArray);
		// オートセーブデータを削除
		ningloid.system.autoSave.clear();
	},
};

const NLE = ningloidEditor;
