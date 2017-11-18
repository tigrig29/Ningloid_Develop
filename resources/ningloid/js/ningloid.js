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
        // 命令実行ごとにインクリメントし、オートセーブ実行のタイミングを管理する変数
		// この値がsystem.autoSave.intervalの値に達すると、オートセーブが実行される
		autoSaveTimingCounta: 0,
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
		playingVideo: false,
		animating: 0,
		autoMode: false,
		skipMode: false,
		message:{
			append: false,
			skip: false,
		},
	},
	init(){
		// 基本レイヤの準備
		this.layer.init();
		// キー・マウスイベントの初期化処理
		this.keyMouse.init();
		// システム系の初期化処理
		this.system.init();
		// キャラ系の初期化処理
		this.character.init();
		this.menu.init();

		// ゲームタイトルの設定
		document.title = this.config.projectName;

		// シナリオ開始
		this.parser.init();
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

	// ムービーのクリックイベント
	videoClick(){
		const nv = this.video;
		if(this.flag.playingVideo === true){
			// クリッカブルなvideoオブジェクトを全取得
			for(let clickableVideoObj of nv.queue){
				const $video = clickableVideoObj.target;
				const clickremove = clickableVideoObj.clickremove;
				const clickskip = clickableVideoObj.clickskip;

				if(String(clickskip) == "true"){
					let cancelEnd = false;
					// スキップ、リムーブ両方のフラグが立っている場合
					if(String(clickremove) != "false") cancelEnd = true;
					// スキップ処理
					nv.skipToEnd($video, cancelEnd);
				}
				// クリックリムーブ
				if(String(clickremove) != "false"){
					// フェードアウト時間
					const time = parseInt(clickremove);
					// 即時消去（その後、エンドファンクション呼び出し）
					if(time == 0 || isNaN(time)) ningloid.video.remove($video, true);
					// フェードアウト→消去（その後、エンドファンクション呼び出し）
					else ningloid.video.fadeOut($video, time, true);
				}
			}
			nv.clearQueue();
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

	/**
	 * ゲームを起動時の状態に戻す
	 * ※statデータや画面の状態を初期状態にする
	 */
	resetGame(){
		const $layer = ningloid.layer.jObj;

		// 変数の初期化
		this.stat = {
			vertical: "false",
			f: {},
			currentLayer: "message0",
			currentLabel: null,
			messageNumber: 0,
			backlog: [],
			canvas: {},
			autoSaveTimingCounta: 0,
		};
		this.tmp = {
			resolver: () => {},
			currentMessage: "",
			autoStartTimeoutIdOfResolve: null,
			skipStartTimeoutIdOfResolve: null,
		};
		this.variable = {
			sf: {}, tf: {}, mp: {},
		};
		this.flag = {
			animating: 0,
			autoMode: false,
			skipMode: false,
			message:{
				append: false,
				skip: false,
			},
		};

		// キャンバスの初期化
		for(let key in this.canvas.stage){
			this.canvas.clearStage(key);
		}

		// レイヤの初期化
		$layer.dummyWrapper.empty();
		$layer.canvasWrapper.empty();
		$layer.systemWrapper.empty();
		$layer.menuWrapper.empty();

		this.layer.init();
		this.menu.init();

		// 各種イベントの初期化
		this.keyMouse.init();
	},
};


// pixiオブジェクトの簡易記述用変数
const   Container = PIXI.Container,
        autoDetectRenderer = PIXI.autoDetectRenderer,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        TextureCache = PIXI.utils.TextureCache,
        Sprite = PIXI.Sprite;
