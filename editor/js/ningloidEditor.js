/* global Editor: true */


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
		// [s]タグ等による処理停止状態
		stop: false,
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
		this.design.init();
		this.editor.init();
		// エディタ用タグ上書き
		this.tag.init();
	},
	reset(){
		if(NLE.flag.playing) return;
		// ゲーム画面のリセット
		ningloid.resetGame();
		// シナリオリセット（シナリオ全文を取得 → 命令配列化）
		const activeEditor = this.editor.getActiveEditor();
		ningloid.parser.loadScenario($.cloneArray(activeEditor.getSession().getDocument().$lines));
		// 実行行数のリセット
		NLE.parser.currentLine = -1;
		NLE.editor.editEnd();
		clearTimeout(NLE.editor.timer)
		// オートセーブデータを削除
		ningloid.system.autoSave.clear();
	},
};

const NLE = ningloidEditor;
