ningloid.canvas = {
	stage: {},
	renderer: {},
	// ================================================================
	// ● 初期処理系
	// ================================================================
	init(){},
	/**
	 * Pixiキャンバスの要素（PixiStage、PixiRenderer、プロパティ保管オブジェクト）を作成する
	 * @param  {$Object} canvasName ステージ、レンダラ、プロパティ保管用オブジェクトの呼び出しに利用する名称、key
	 * @return {Canvas }             作成したレンダラ
	 */
	createCanvas(canvasName){
		// ステージ作成
		const stage = this.stage[canvasName] = new Container();
		stage.canvasName = canvasName;
		stage.pluginName = "stage";
		// レンダラ作成
		const [width, height] = [ningloid.config.display.width, ningloid.config.display.height];
		const renderer = this.renderer[canvasName] = autoDetectRenderer(width, height, {
			preserveDrawingBuffer: true, transparent: true
		});

		// 作成したレンダラを返す
		return renderer;
	},

	// ================================================================
	// ● データ取得系
	// ================================================================
	/**
     * Pixiステージを返す
     * @param  {String} canvasName 取得するPixiステージの対象レイヤを指定する（bg, fore0..）
     * @return {Pixi  }        		対象レイヤのPixiステージ
     */
	getStage(canvasName){
		return this.stage[canvasName];
	},
	/**
     * Pixiレンダラを返す
     * @param  {String} canvasName 取得するPixiレンダラの対象レイヤを指定する（bg, fore0..）
     * @return {Pixi  }        		対象レイヤのPixiレンダラ
     */
	getRenderer(canvasName){
		return this.renderer[canvasName];
	},
	/**
     * Pixiコンテナ（Spriteを複数まとめて管理しているステージ）を返す
     * @param  {String} canvasName 取得するPixiコンテナの名称を指定する（キャラ名など）
     * @return {Pixi  }        		対象のPixiコンテナ
     */
	getContainer(canvasName){
		return this.container[canvasName];
	},
	/**
	 * キャンバスの各種（Stage, Renderer, Sprite）プロパティを保管したオブジェクトを返す
	 * @param  {String} canvasName 取得対象のキャンバス名称（レイヤのIDと一致する）
	 * @return {Object}        		プロパティ保管オブジェクト
	 */
	getProperty(canvasName){
		return ningloid.stat.canvas[canvasName];
	},

	// ================================================================
	// ● 描画処理系
	// ================================================================

	/**
	 * テクスチャのロードを行い、ロード後処理を実行する
	 * ※既に読み込み済みの画像であっても、表示時、毎回呼び出す関数
	 * @param  {Array / String} file  ロード対象のファイル
	 *                  			  複数ある場合には配列、単数ならば一つのファイルURLを文字列で指定する
	 * @param  {Function}       setup ロード完了後に実行する処理
	 */
	loadTexture(file, setup){
		// 複数のファイル（配列）が渡された場合
		if($.isArray(file)){
			// ロード対象ファイル格納配列
			const loadFile = [];
			for(let pass of file){
				// キャッシュにデータが存在しない場合のみ、ロード対象配列にプッシュする
				if(!resources[pass]) loadFile.push(pass);
			}

			// 全ファイルのPixiTexture化データ配列
			const textures = [];
			// ロード対象ファイルが存在する場合
			if(loadFile.length !== 0){
				// ロード
				loader.add(loadFile).load(() => {
					// PixiTextureデータ作成、配列にプッシュしていく
					for(let pass of file){
						textures.push(resources[pass].texture);
					}
					// セットアップ関数（コールバック）を実行
					// PixiTextureデータ配列を渡す
					if(setup) setup(textures);
				});
			}
			// ロード不要の場合
			else{
				// PixiTextureデータ作成、配列にプッシュしていく
				for(let pass of file){
					textures.push(resources[pass].texture);
				}
				// セットアップ関数（コールバック）を実行
				// PixiTextureデータ配列を渡す
				if(setup) setup(textures);
			}
		}
		else{
			// キャッシュにデータが存在しない場合＝ロードが必要な場合
			if(!resources[file]){
				// ロード
				loader.add(file).load(() => {
					// セットアップ関数（コールバック）を実行
					// ファイルをPixiTexture化したデータを渡す
					if(setup) setup(resources[file].texture);
				});
			}
			// ロード不要の場合
			else{
				// セットアップ関数（コールバック）を実行
				// ファイルをPixiTexture化したデータを渡す
				if(setup) setup(resources[file].texture);
			}
		}
	},
	/**
	 * PixiDisplayObject（stage(container), sprite）のプロパティ操作
	 * @param {PIXI}   pObj     PIXIStage, PIXISpriteのどちらか
	 * @param {Object} property 上記PIXIオブジェクトに設定するプロパティ郡
	 *                          anchor, x, y, width, height, alpha, scale, skew,
	 *                          pivot, rotation, filters……が指定可能（anchorはSpriteのみ）
	 */
	setProperty(pObj, property){
		// プロパティの保管
		this.setPropertyToStat(pObj, property);
		// PIXIオブジェクトにプロパティを設定する
		for(let propName in property){
			this.setPropertyToObject(pObj, propName, property[propName]);
		}
	},
	/**
	 * PixiDisplayObject（stage(container), sprite）のプロパティ一つを設定する
	 * @param {PIXI}     pObj      PIXIStage, PIXISpriteのどちらか
	 * @param {String}   propName  上記PIXIオブジェクトに設定するプロパティ名
	 * @param {Variable} propValue 上記PIXIオブジェクトに設定するプロパティ値
	 */
	setPropertyToObject(pObj, propName, propValue){
		// x, y それぞれ別指定しなければならないプロパティ（PIXI.Point, PIXI.ObservablePoint）の場合
		// 判定は、「pObjのそのプロパティの値が、オブジェクトだった場合」とする
		if(pObj[propName] instanceof Object){
			// x, y それぞれの値をセットする
			if($.isArray(propValue)) pObj[propName].set(propValue[0], propValue[1]);
			else pObj[propName].set(propValue, propValue);
		}
		else pObj[propName] = propValue;
	},
	/**
	 * PixiDisplayObject（stage(container), sprite）のプロパティを、statに保管する
	 * @param {PIXI}     pObj      PIXIStage, PIXISpriteのどちらか
	 * @param {Object}   property  上記PIXIオブジェクトに設定するプロパティ郡
	 */
	setPropertyToStat(pObj, property){
		const stat = ningloid.stat.canvas;
		const canvasName = pObj.canvasName || pObj.parent.canvasName;
		// ダミーキャンバスの場合は保存しない
		if(canvasName.includes("Dummy")) return;
		// プロパティ保存先が存在しない場合、作成する
		if(!stat[canvasName]){
			// statにプロパティ保管用オブジェクト作成
			stat[canvasName] = {
				stage: {}, sprite: {}
			};
		}
		// プロパティ保存先のオブジェクト
		const targetStatObj = stat[canvasName][pObj.pluginName];
		// プロパティの保存
		if(pObj.pluginName == "sprite") targetStatObj[pObj._texture.baseTexture.imageUrl] = property;
		else $.extend(true, targetStatObj, property);
	},
	/**
	 * キャンバス（ステージ）にSpriteを追加する
	 * @param {PIXI}   stage    Sprite追加先のPIXIStage
	 * @param {PIXI}   texture  Sprite作成元のテクスチャ（ロードデータから作成）
	 * @param {Object} property Spriteに設定する各種プロパティ郡
	 */
	addSprite(stage, texture, property){
		// テクスチャからスプライトを作成
		const sprite = new Sprite(texture);
		// ステージに追加
		stage.addChild(sprite);
		// スプライトのプロパティ設定
		// （ここでプロパティ保存のために、sprite.parentが必要 → 上記、先にステージ追加を行っておく必要がある）
		this.setProperty(sprite, property);
		return sprite;
	},
	/**
	 * キャンバス上に指定画像を描画する
	 * @param  {String}   canvasName    描画先キャンバスの名称（キャンバス作成時に登録した名称）
	 * @param  {Object}   stageProperty キャンバスのステージに設定するプロパティ郡
	 * @param  {Object}   spriteData     描画する画像のデータ（詳細以下）（指定できるプロパティはsetPropertyを参照）
	 *                                  { "画像1のディレクトリパス" : {
	 *                                  	画像1に設定するプロパティ名1: 画像1に設定するプロパティ値1,
	 *                                  	画像1に設定するプロパティ名2: 画像1に設定するプロパティ値2,
	 *                                  	...
	 *                                   	},
	 *                                    "画像2のディレクトリパス" : {
	 *                                  	画像2に設定するプロパティ名1: 画像2に設定するプロパティ値1,
	 *                                  	画像2に設定するプロパティ名2: 画像2に設定するプロパティ値2,
	 *                                  	...
	 *                                   	}
	 *                                  }
	 * @param  {Function} cb            キャンバスに画像描画後、行う処理
	 */
	renderImage(canvasName, stageProperty, spriteData, cb){
		const that = this;
		// spriteDataから読み込み画像のファイルパスを取得
		const file = [];
		console.log(spriteData)
		for(let pass in spriteData) file.push(pass);
		// 画像のロード
		this.loadTexture(file, (textureArray) => {
			const stage = that.getStage(canvasName);
			const renderer = that.getRenderer(canvasName);
			// テクスチャの数だけスプライト追加
			for(let texture of textureArray){
				that.addSprite(stage, texture, spriteData[texture.baseTexture.imageUrl]);
			}
			// ステージのプロパティ操作
			that.setProperty(stage, stageProperty);
			// レンダラのサイズをステージのサイズに合わせる
			renderer.resize(stage.width, stage.height);
			// 描画
			renderer.render(stage);
			// コールバック
			if(cb) cb(stage, renderer);
		});
	},

	/**
	 * キャンバスサイズを画面サイズに合わせて拡縮する
	 * @param  {PIXI  } stage    調整対象のキャンバスのステージ
	 * @param  {PIXI  } renderer 調整対象のキャンバスのレンダラ
	 * @param  {String} fitType  "cover"：アスペクト比を保って、画面全体を覆うように拡縮 → 一部画面からはみ出ることがある
	 *                           "contain"：アスペクト比を保って、画面からはみ出ない範囲に拡縮 → 画面内に隙間が出来ることがある
	 *                           "full"：アスペクト比を16：9に強制、画面サイズぴったりに拡縮する
	 *                           "none"：何もしない
	 */
	fitCanvasSizeToDisplay(stage, renderer, fitType){
		// "none"の場合は何もしない
		if(fitType == "none") return;
		// 誤ったタイプ名称が渡された場合はエラーを出して何もしない
		else if(!["cover", "contain", "full"].includes(fitType)){
			$.systemError(`Error of ningloid.canvas.fitCanvasSizeToDisplay：タイプ"${fitType}"は存在しません。`, true);
			return;
		}

		const display = ningloid.config.display;
		// 画面の縦横比
		const displayAspectRatio = display.width / display.height;
		// 表示する背景画像の縦横比
		const stageAspectRatio = stage.width / stage.height;
		// キャンバス拡縮に利用するStageプロパティ操作オブジェクト（key:width, heightのみ利用する）
		const stageProperty = {};
		// fullモード、あるいは画像の縦横比が16:9の場合
		if(fitType == "full" || stageAspectRatio == displayAspectRatio){
			// 画面サイズぴったりにあわせて拡縮する
			[stageProperty.width, stageProperty.height] = [display.width, display.height];
		}
		else{
			// 縦横比に応じて、縦・横どちらを画面サイズぴったりに合わせるか判定する
			let [fitTargetProperty, unfitTargetProperty] = ["width", "height"];
			if((fitType == "cover" && stageAspectRatio > displayAspectRatio) || (fitType == "contain" && stageAspectRatio < 16/9)){
				[fitTargetProperty, unfitTargetProperty] = [unfitTargetProperty, fitTargetProperty];
			}
			// 上記の判定に従って、縦、あるいは横を画面サイズいっぱいに合わせて拡縮する
			// もう一方の辺を、縦横比を維持して拡縮する
			let mag = display[fitTargetProperty] / stage[fitTargetProperty];
			stageProperty[fitTargetProperty] = display[fitTargetProperty];
			stageProperty[unfitTargetProperty] = stage[unfitTargetProperty] * mag;
		}
		// ステージのプロパティ（width, height）を変更
		this.setProperty(stage, stageProperty);
		// レンダラのサイズを変更
		renderer.resize(stage.width, stage.height);
		// 適応
		renderer.render(stage);
	},
	/**
	 * ステージのクリア（キャンバスを空にする）
	 * @param  {String} canvasName クリア対象のキャンバス名称
	 */
	clearStage(canvasName){
		const stage = this.getStage(canvasName);
		const renderer = this.getRenderer(canvasName);
		stage.removeChildren();
		renderer.render(stage);

		// canvasデータオブジェクトのスプライト情報をリセットする
		if(ningloid.stat.canvas[canvasName] && Object.keys(ningloid.stat.canvas[canvasName]).includes("sprite")) ningloid.stat.canvas[canvasName].sprite = {};
	},


	// ================================================================
	// ● ダミー描画系
	// ================================================================
	/**
	 * ダミーレイヤにキャンバスのクローン描画を行う
	 * @param {String}   canvasName クローンの元となるオリジナルキャンバスの名称
	 * @param {Function} cb         コールバック
	 */
	setCloneToDummy(canvasName, cb){
		// ダミーステージ
		const stage = this.getStage(`${canvasName}Dummy`);
		// クリアする
		stage.removeChildren();

		// キャンバスのプロパティ保管オブジェクト取得
		const canvasProperty = this.getProperty(canvasName);
		// プロパティ保管オブジェクトが空ならば、まだ該当レイヤに描画がなされていないとみなして、クローン処理を終了する
		if(!canvasProperty) return;

		// ダミーレイヤに描画
		this.renderImage(`${canvasName}Dummy`, canvasProperty.stage, canvasProperty.sprite, () => {
			// コールバック
			if(cb) cb();
		});
	},


	// ================================================================
	// ● セーブ・ロード系
	// ================================================================
	/**
	 * プロパティ保管オブジェクトのデータを元に、キャンバス描画を行う
	 * @param  {PIXI}     canvasName 対象のキャンバス名称
	 * @param  {Function} cb         コールバック
	 */
	buildCanvasFromStat(canvasName, cb){
		// ステージ
		const stage = this.getStage(canvasName);
		const renderer = this.getRenderer(canvasName);
		// クリアする
		stage.removeChildren();
		renderer.render(stage);

		// キャンバスのプロパティ保管オブジェクト取得
		const canvasProperty = this.getProperty(canvasName);
		// プロパティ保管オブジェクトが空ならば、まだ該当レイヤに描画がなされていないとみなして、処理を終了する
		if(!canvasProperty){
			if(cb) cb();
			return;
		}

		// 描画
		this.renderImage(canvasName, canvasProperty.stage, canvasProperty.sprite, () => {
			// コールバック
			if(cb) cb();
		});
	},
};

