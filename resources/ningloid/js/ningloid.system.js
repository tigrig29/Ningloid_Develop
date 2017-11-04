ningloid.system = {
	saveData: null,

	// ================================================================
	// ● 初期処理
	// ================================================================
	init(){},

	// ================================================================
	// ● 取得系
	// ================================================================
	/**
	 * セーブデータを取得する
	 * @return {Object} セーブデータオブジェクト
	 */
	getSaveData(){
		if(!this.saveData){
			this.saveData = $.getStoreData(`${ningloid.config.projectName}`, ningloid.config.save.type) || {};
		}
		return this.saveData;
	},

	// ================================================================
	// ● セーブ＆ロード
	// ================================================================
	/**
	 * セーブを行う
	 */
	doSave(saveNumber, createThumbnail, cb){
		const [config, parser, layer] = [ningloid.config, ningloid.parser, ningloid.layer];
		const [$canvasWrapper, $systemWrapper] = [layer.getLayer("canvasWrapper"), layer.getLayer("systemWrapper")];

		// セーブデータオブジェクト取得
		const saveData = this.getSaveData();

		// 保存データ
		const data = {
			// セーブタイトル
			title: ningloid.stat.currentLabel ? parser.label.data[ningloid.stat.currentLabel].name : null,
			// セーブ時のメッセージ
			message: ningloid.tmp.currentMessage,
			// セーブ時刻
			time: `${$.getDate()} - ${$.getTime()}`,
			// サムネイル
			thumbnail: null,
			// HTMLデータ
			html: {
				canvasInnerHTML: $canvasWrapper.html(),
				systemInnerHTML: $systemWrapper.html()
			},
			scene: {
				url: parser.url,
				line: parser.line,
				nextOrder: $.cloneArray(parser.nextOrder),
			},
			stat: $.cloneObject(ningloid.stat)
		};

		// サムネイルなし
		if(createThumbnail === false){
			// データの保存
			saveData[saveNumber] = data;
			$.storeData(`${config.projectName}`, saveData, config.save.type);
			if(cb) cb();
			console.log("dosave");
		}
		else{
			// サムネイルの取得
			this.createThumbnail(config.save.thumbnail, (imageCode) => {
				data.thumbnail = imageCode;
				// データの保存
				saveData[saveNumber] = data;
				$.storeData(`${config.projectName}`, saveData, config.save.type);
				if(cb) cb();
				console.log("dosave");
			});
		}
	},
	/**
	 * セーブデータのロード、画面の復元を行う
	 */
	doLoad(saveNumber, scenarioRestart, cb){
		const config = ningloid.config;
		// データの取得
		const saveData = this.getSaveData();
		const data = saveData[saveNumber];
		const scene = data.scene;

		// backlog更新用に前のstatオブジェクトのbacklog配列を保管しておく
		const oldLogData = $.cloneArray(ningloid.stat.backlog);
		// statオブジェクトを更新
		ningloid.stat = $.cloneObject(data.stat);
		if(scenarioRestart !== false){
			// ロード時はブラインドレイヤを表示する
			const $blind = ningloid.layer.getLayer("blind");
			$blind.fadeIn("fast", () => {
				// レイヤの更新を行う
				ningloid.layer.updateLayersFromSaveData(data, () => {
					// 更新終了後、ブラインドレイヤを消す
					$blind.fadeOut("fast", () => {
						// 現行シナリオの実行停止
						ningloid.stopResolve();
						// 新たにシナリオ実行
						ningloid.parser.playScenarioByFile(scene.url, scene.line, scene.nextOrder);

						if(cb) cb();
					});
				});
			});
		}
		// シナリオの自動開始が不要な場合（主にエディタ）
		else{
			// レイヤの更新を行う
			ningloid.layer.updateLayersFromSaveData(data, () => {
				if(cb) cb();
			});
		}
		// バックログの更新
		ningloid.menu.updateBacklog(oldLogData);
		console.log("doload");
	},
	/**
	 * サムネイルを生成する
	 * @param  {Object}   options 生成するサムネイルのオプション
	 *                    .width   {Number} サムネイルの横幅
	 *                    .height  {Number} サムネイルの高さ
	 *                    .quality {String} サムネイルの画質
	 * @param  {Function} cb      サムネイル生成完了時の実行関数（引数は生成したサムネイルのデータURIスキーム）
	 */
	createThumbnail(options, cb){
		// オプションでサムネイル作成しないとなっている場合処理しない
		if(options.create === false){
			if(cb) cb(null);
			return;
		}

		const layer = ningloid.layer;
		const display = ningloid.config.display;

        const $base = layer.getLayer("base");
        // 指定サイズに拡縮する
        const baseTransformStyle = $base.css("transform");
		$base.css("transform", `scale(${options.width / display.width}, ${options.height / display.height})`);
		// キャプチャ
		html2canvas($base.get(0), {
			onrendered: (canvas) => {
				const imageCode = this.createImageCode(canvas, options.quality);
				if(cb) cb(imageCode);
			},
			height: options.height,
			width: options.width,
		});
		// CSSプロパティの変化により画面に影響が出ないよう、一瞬hideする
		// CSSプロパティを元に戻して、表示する
		$base.hide().css("transform", baseTransformStyle).show();
	},
	/**
	 * 受け取ったキャンバスから画像のデータURIスキームを生成する
	 * @param  {Canvas} canvas  画像化するキャンバス
	 * @param  {String} quality 生成する画像の画質
	 * @return {String}         生成した画像のデータURIスキーム
	 */
	createImageCode(canvas, quality) {
		const qualityList = {
			low: 0.3,
			middle: 0.7,
			high: 0.92
		};
		return canvas.toDataURL("image/jpeg", qualityList[quality]);
	},

	// ================================================================
	// ● オートモード操作
	// ================================================================
	auto: {
		/**
		 * オートモードを開始する
		 */
		start(){
			ningloid.flag.autoMode = true;
			if(ningloid.flag.message.append === false) this.resolveAfterAutoWaitTime();
			console.log("autoStart");
		},
		/**
		 * オートモードを停止する
		 */
		stop(){
			ningloid.flag.autoMode = false;
			this.cancelResolveAfterAutoWaitTime();
			console.log("autoStop");
		},
		/**
		 * オートモードON中に実行：オート待ち時間後、次の処理へ進行する
		 */
		resolveAfterAutoWaitTime(){
			ningloid.tmp.autoStartTimeoutIdOfResolve = setTimeout(() => ningloid.resolve(), ningloid.config.message.autoSpeed * 50);
		},
		/**
		 * オートモード停止時に実行：上記のsetTimeoutをキャンセルする
		 */
		cancelResolveAfterAutoWaitTime(){
			const id = ningloid.tmp.autoStartTimeoutIdOfResolve;
			if(id) clearTimeout(id);
			ningloid.tmp.autoStartTimeoutIdOfResolve = null;
		},
	},

	// ================================================================
	// ● スキップモード操作
	// ================================================================
	skip:{
		/**
		 * スキップモードを開始する
		 */
		start(){
			const flag = ningloid.flag;
			const message = ningloid.flag.message;
			flag.skipMode = true;
			// メッセージ表示中ならばメッセージスキップ、表示完了しているならば即時次へ進行
			if(message.append === true) message.skip = true;
			else ningloid.resolve();
			// アニメーション中ならばアニメスキップ
			ningloid.animSkip();
			console.log("skipStart");
		},
		/**
		 * スキップモードを停止する
		 */
		stop(){
			ningloid.flag.skipMode = false;
			console.log("skipStop");
		},
		/**
		 * スキップモードON中に実行：スキップ待ち時間後、次の処理へ進行する
		 */
		resolveAfterSkipWaitTime(){
			ningloid.tmp.skipStartTimeoutIdOfResolve = setTimeout(() => ningloid.resolve(), ningloid.config.message.skipSpeed * 10);
		},
		/**
		 * スキップモード停止時に実行：上記のsetTimeoutをキャンセルする
		 */
		cancelResolveAfterSkipWaitTime(){
			const id = ningloid.tmp.skipStartTimeoutIdOfResolve;
			if(id) clearTimeout(id);
			ningloid.tmp.skipStartTimeoutIdOfResolve = null;
		},
	},
};


