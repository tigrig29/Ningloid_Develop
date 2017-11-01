// pixiオブジェクトの簡易記述用変数
const 	Container = PIXI.Container,
		autoDetectRenderer = PIXI.autoDetectRenderer,
		loader = PIXI.loader,
		resources = PIXI.loader.resources,
		TextureCache = PIXI.utils.TextureCache,
		Sprite = PIXI.Sprite;

// ningloidオブジェクトの作成
const ningloid = {
	config: {},
	layer: {},
	parser: {},
	system: {},
	tag: {},
	stat: {
        vertical: "false",
        f: {},// ゲーム内変数（セーブデータ毎の保存）
        currentLayer: "message0",
		currentLabel: null,
        messageNumber: 0,
        backlog: [],
        // 表示中のpixiスプライトの各種パラメータを保管しておく → セーブ時にこれを保存 → ロード時このデータを元に復元
        canvas: {},
	},
	tmp: {
		resolver: () => {},
		currentMessage: "",
		autoStartTimeoutIdOfResolve: null,
		skipStartTimeoutIdOfResolve: null,
	},
	variable: {
		sf: {},
		tf: {},// 一時変数（ロード、リロード、再起動でリセット）
        mp: {},
	},
	flag: {
		animating: 0,
		autoMode: false,
		message:{
			append: false,
			skip: false,
		},
	},
	// 処理スキップ用resolver
	resolve(){
		this.tmp.resolver();
		this.tmp.resolver = () => {};
	},
	// 処理スキップ＆現行シナリオ実行停止
	stopResolve(){
		this.tmp.resolver("stop");
		this.tmp.resolver = () => {};
	},

	// アニメーションスキップ関数
	animSkip(){
		// for(let animKey in this.tmp.animating){
		// 	this.tmp.animating[animKey].each(function(){
		// 		$(this).css("animation-duration", "0ms");
		// 		$(this).velocity("finish");
		// 	});
		// }
		// this.tmp.animating = {};
		const na = this.animate;
		if(this.flag.animating > 0){
			for(let animObj of na.queue){
				na.skipToEnd(animObj);
			}
			na.clearQueue();
			return;
		}
	},

	// テキスト表示のクリック
	messageSkip(){
		if(this.flag.message.append === true){
			this.flag.message.skip = true;
		}
	},

	/**
	 * HTMLファイルを読み取ってその内容を返す
	 * @param  {String}  url 追加対象のHTMLファイルのディレクトリパス
	 * @return {Promise}     同期処理用のPromiseオブジェクト
	 *         				 resolve時：HTMLファイルの中身をそのまま文字列で返す
	 *         				 reject時：読み込み失敗のエラー文章を返す
	 */
	readHTML(url){
		return new Promise((resolve, reject) => {
			$.ajax({
				url,
				success: (data) => {
					// 配列を返す
					resolve(data);
				},
				error: () => {
					// Error
					reject(`ファイル[${url}]の読み込みに失敗しました。<br>[${url}]が実際に存在するか、打ち間違いがないかを確認して下さい。`);
				}
			});
		});
	},
	/**
	 * 指定したCSSファイルを新たなlinkタグとしてindex.htmlに挿入する
	 * @param {String} url 追加対象のCSSファイルのディレクトリパス
	 */
	addCSS(url){
		const link = `<link href="${url}" rel="stylesheet" type="text/css"/>`;
		$("#firstScript").before(link);
	},
	evalScript(str){
		const [stat, variable] = [this.stat, this.variable];
		const [NL, f, sf, tf, mp] = [this, stat.f, variable.sf, variable.tf, variable.mp];
		const returnData = eval(str);
		// システム変数の保存を行う
		this.storeSystemVariable();
		// 返り値がある場合はそのまま返す
		return returnData;
	},
	storeSystemVariable(){
		$.storeData(`${this.config.projectName}_sf`, $.cloneObject(this.variable.sf));
	},
};

// テスト：エディタとゲームを同時起動する
// const {BrowserWindow} = require("electron").remote;
// const windowOptions = require("./windowOptions.js");
// let win = new BrowserWindow(windowOptions);
// win.loadURL(`file://${_dirname}/Reference/reference.html`);

//実行処理
$(document).ready(() => {
	// 基本レイヤの準備
	ningloid.layer.init();
	// キー・マウスイベントの初期化処理
	ningloid.keyMouse.init();
	// システム系の初期化処理
	ningloid.system.init();
	// キャラ系の初期化処理
	ningloid.character.init();
	ningloid.menu.init();

	// ゲームタイトルの設定
	document.title = ningloid.config.projectName;

	// シナリオ開始
	ningloid.parser.init();
});
