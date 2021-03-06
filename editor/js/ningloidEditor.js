/* global Editor: true */


const ningloidEditor = {
	// 各種Flag変数
	flag:{
		// エラー発生状態を管理する
		error: false,
		// 編集状態（未保存状態）を管理する
		editing: false,
		// リアルタイムプレビュー実行状態を管理する
		preview: false,
		// エディタ上でのゲーム実行状態を管理する
		playing: false,

		// リアルタイムプレビュー許可状態を管理する
		canPreview: true,

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
		// ゲーム画面のリセット
		ningloid.resetGame();
		// シナリオリセット（シナリオ全文を取得 → 命令配列化）
		const activeEditor = this.editor.getActiveEditor();
		ningloid.parser.loadScenario($.cloneArray(activeEditor.getSession().getDocument().$lines));
		// 実行行数のリセット
		NLE.parser.currentLine = -1;
		clearTimeout(NLE.editor.timer);
		// 編集/実行状態解除
		NLE.editor.previewStart();
		NLE.editor.editStop();
		NLE.editor.errorEnd();
		// オートセーブデータを削除
		ningloid.system.autoSave.clear();
	},
};

const NLE = ningloidEditor;
