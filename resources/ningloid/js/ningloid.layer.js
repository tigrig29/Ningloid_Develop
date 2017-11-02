ningloid.layer = {
	jObj: {
		base: null,
		dummyWrapper: null,
			bgDummy: null,
			fore0Dummy: null,
			charaDummy: null,
		canvasWrapper: null,
			bg: null,
			chara: null,
			fore0: null,
		systemWrapper: null,
			clickLayer: null,
			message0: null,
			freeLayer: null,
		menuWrapper: null,
		blind: null,
	},
	message: {},

	// ================================================================
	// ● 初期処理
	// ================================================================
	init(){
		const that = this;

		// ベースレイヤ、Dummyラッパー、Canvasラッパー、Systemラッパー、Menuラッパー
		const $base = this.jObj.base = $("#ningloidBase");
		const $dummyWrapper = this.jObj.dummyWrapper = $base.find("#dummyWrapper");
		const $canvasWrapper = this.jObj.canvasWrapper = $base.find("#canvasWrapper");
		const $systemWrapper = this.jObj.systemWrapper = $base.find("#systemWrapper");
		const $menuWrapper = this.jObj.menuWrapper = $base.find("#menuWrapper");

		// ================================================================
		//  Canvasレイヤ
		// ================================================================

		// 背景レイヤ
		this.createCanvasLayer({id: "bg"});
		// キャラレイヤ
		this.createLayer({id: "character", target: $canvasWrapper});
		// 前景レイヤ
		for(let i = 0; i < ningloid.config.layer.fore.num; i++){
			const $fore = this.createCanvasLayer({id: `fore${i}`, cls: "foreLayer"});
			$fore.css("z-index", 100+i);
		}


		// ================================================================
		//  Dummyレイヤ
		// ================================================================

		// Canvasラッパーと同様の構成を作る
		$dummyWrapper.html($canvasWrapper.html());
		$dummyWrapper.find("div").each((i, self) => {
			const $self = $(self);
			// idをダミーの名称に変換
			const id = $self.attr("id");
			$self.attr("id", `${id}Dummy`).addClass("dummyLayer").empty();
			// キャララッパー以外、全てのレイヤにキャンバスを追加する
			if(id != "chara") this.appendCanvas($self);
			// this.jObjにレイヤを保管
			this.jObj[`${id}Dummy`] = $self;
		});


		// ================================================================
		//  Systemレイヤ
		// ================================================================

		// クリックレイヤ
		this.createSystemLayer({id: "clickLayer"});
		// メッセージレイヤ
		for(let i = 0; i < ningloid.config.layer.message.num; i++){
			const $message = this.createSystemLayer({id: `message${i}`, cls: "messageLayer"});
			this.createSystemLayer({id: `message${i}Outer`, cls: "messageOuter", target: $message});
			this.createSystemLayer({id: `message${i}Inner`, cls: "messageInner", target: $message});
		}
		// フリーレイヤ
		this.createSystemLayer({id: "freeLayer"});

		// ================================================================
		//  Menuレイヤ
		// ================================================================
		// ningloid.menu.init()に記述


		// ================================================================
		//  その他のレイヤ
		// ================================================================

		// ブラインドレイヤ
		const $blind = this.jObj.blind = $("<div id='blind'>Now Loading...</div>");
		$base.after($blind);

		// ningloid.layer.jObjにcanvasレイヤ、systemレイヤを保管
		this.storeLayer();

		// PC版のみ（今のところ、Electronでのウィンドウサイズしか取得できないから）
		// 画面サイズ調整 ================================================================
		const display = ningloid.config.display;
		const [width, height] = [display.width, display.height];
		const style = {width, height};
		// ラッパー（統括）系レイヤには、コンフィグで指定したピクセルサイズを与えておくだけ
		$(".wrapper").css(style);
		// ベースレイヤには、ゲーム画面サイズに応じてスケールをかける
		const remote = require("electron").remote;
		const win = remote.getCurrentWindow();

		// エディタ内にゲームを表示している時は、サイズをウィンドウのの７割に設定
		if($base.parent().attr("id") == "game" && $("#editorText")){
			const gameWidth = $("#game").width();
			$.extend(style, {
				"-webkit-transform": `scale(${gameWidth / width}`,
				"transform": `scale(${gameWidth / width})`,
			});
		}
		// 通常時はウィンドウサイズに合わせる
		else{
			$.extend(style, {
				"-webkit-transform": `scale(${win.getContentSize()[0] / width}`,
				"transform": `scale(${win.getContentSize()[0] / width})`,
			});
		}
		$base.css(style);
		// ブラインドレイヤも同様にスケールをかけて、ついでに「Loading」の文字を中央に表示できるようにline-height調整もする
		$.extend(style, {"line-height": `${height}px`});
		$blind.css(style);
	},

	// ================================================================
	// ● 新規レイヤ作成系
	// ================================================================
	/**
	 * divレイヤを作成し、任意の親レイヤに挿入する
	 * @param   {Object } obj 以下各種プロパティ
	 * 		              .id     {String}  作成するレイヤの名称、固有ID
	 * 		              .cls    {String}  作成するレイヤに与えるクラス
	 * 		              .target {$Object} 挿入する対象のレイヤ、親レイヤ
	 * @return  {$Object}     作成したdivのjQueryObject
	 */
	createLayer(obj){
		// id, classの付与
		let id = "", cls = "";
		if(obj.id) id = `id="${obj.id}"`;
		if(obj.cls) cls = `class="${obj.cls}"`;
		// divレイヤ作成
		const $layer = $(`<div ${id} ${cls}></div>`);
		// 挿入
		obj.target.append($layer);
		return $layer;
	},
	/**
	 * 描画用レイヤを作成し、画面に挿入する
	 * @param  {Object } obj createLayerと同じ
	 * @return {$Object}     createLayerと同じ
	 */
	createCanvasLayer(obj){
		// target:Canvasラッパーで作成
		if(!obj.target) obj.target = this.getLayer("canvasWrapper");
		obj.cls = obj.cls ? `${obj.cls} canvasLayer` : "canvasLayer";
		const $layer = this.createLayer(obj);
		// Pixiステージ作成 → レンダラ作成 → レンダラビューをレイヤに挿入
		this.appendCanvas($layer);
		return $layer;
	},
	/**
	 * システム用レイヤを作成し、画面に挿入する
	 * @param  {Object } obj createLayerと同じ
	 * @return {$Object}     createLayerと同じ
	 */
	createSystemLayer(obj){
		// target:Systemラッパーで作成
		if(!obj.target) obj.target = this.getLayer("systemWrapper");
		obj.cls = obj.cls ? `${obj.cls} systemLayer` : "systemLayer";
		const $layer = this.createLayer(obj);
		return $layer;
	},
	/**
	 * レイヤに描画キャンバスを追加する
	 * @param  {$Object} $target キャンバス挿入対象のjQueryオブジェクト
	 */
	appendCanvas($target){
		const canvasName = $target.attr("id");
		const renderer = ningloid.canvas.getRenderer(canvasName) || ningloid.canvas.createCanvas(canvasName);
		$target.append(renderer.view);
	},
	/**
	 * HTMLファイルを読み取って、その内容のレイヤを生成し、画面に追加する
	 * @param  {$Object} $target     生成したレイヤの追加対象とする親レイヤ
	 * @param  {String}  htmlFileUrl 生成するレイヤの情報を記述したHTMLファイルのディレクトリパス
	 * @return {Promise}     		 同期処理用のPromiseオブジェクト
	 */
	appendHTML($target, htmlFileUrl){
		// 同期処理にて、HTMLファイルの読み込みが終わったら、レイヤに追加する
		return new Promise((resolve, reject) => {
			(async () => {
				$target.append(await ningloid.readHTML(htmlFileUrl));
				resolve();
			})();
		});
	},

	// ================================================================
	// ● データ取得系
	// ================================================================
	// 指定した名称のレイヤを返す（ningloid.layer.jObj内）
	getLayer(name){
		return this.jObj[name];
	},

	// ================================================================
	// ● データ管理系
	// ================================================================
	/**
	 * ningloid.layer.jObjに、canvasWrapperとsystemWrapper内のjQueryオブジェクトを保管する
	 * ※ロード時（HTML更新時）に毎回呼び出す必要がある
	 */
	storeLayer(){
		const $canvasWrapper = this.getLayer("canvasWrapper");
		const $systemWrapper = this.getLayer("systemWrapper");
		// canvasレイヤ全て取得して、jObjに保管
		$canvasWrapper.children("div").each((i, self) => {
			const $self = $(self);
			this.jObj[$self.attr("id")] = $self;
		});
		// systemレイヤ全て取得して、jObjに保管
		$systemWrapper.children("div").each((i, self) => {
			const $self = $(self);
			this.jObj[$self.attr("id")] = $self;
		});
	},

	// ================================================================
	// ● ロード（再構築）系
	// ================================================================
	/**
	 * セーブデータからレイヤの復元を行う
	 * @param  {Object}   saveData セーブデータオブジェクト
	 * @param  {Function} cb       コールバック
	 */
	updateLayersFromSaveData(saveData, cb){
		const [systemInnerHTML, canvasInnerHTML] = [saveData.html.systemInnerHTML, saveData.html.canvasInnerHTML];
		// systemWrapperの中身を更新する
		this.updateSystemLayers(systemInnerHTML);
		// canvasWrapperの中身を更新する
		this.updateCanvasLayers(canvasInnerHTML, () => {
			// ningloid.layer.jObjに各種レイヤオブジェクトを保管し直す
			this.storeLayer();
			// イベントの復元
			this.restoreEvent();
			if(cb) cb();
		});
	},
	/**
	 * canvasWrapperのインナーHTMLを更新する
	 * @param  {String}   canvasInnerHTML canvasWrapperのインナーHTML
	 * @param  {Function} cb              コールバック
	 */
	updateCanvasLayers(canvasInnerHTML, cb){
		// canvasWrapperの中身を更新
		const $canvasWrapper = this.getLayer("canvasWrapper");
		$canvasWrapper.empty().html(canvasInnerHTML);

		// 同期処理でキャンバスの復元を行う
		// ※同期処理にしないと、PIXI.loaderが重複実行されてErrorを吐く
		const canvasLayers = [];
		$canvasWrapper.find(".canvasLayer").each((i, self) => canvasLayers.push($(self)));
		(async () => {
			let i = 0, completeFunction = null;
			for(let $target of canvasLayers){
				if(i == canvasLayers.length - 1) completeFunction = cb;
				await this.restoreCanvas($target, completeFunction);
				i++;
			}
		})();
	},
	/**
	 * キャンバスプロパティ保管オブジェクトのデータを元に、キャンバスを復元する
	 * @param  {$Object}  $target          復元対象のキャンバスを包括するレイヤ
	 * @param  {Function} completeFunction キャンバス復元後に実行する処理
	 * @return {Promise}                   Promise（同期処理用）
	 */
	restoreCanvas($target, completeFunction){
			// Promise
			let [resolver, rejecter] = [null, null];
			const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

			// 現在HTMLに存在するキャンバスを削除し、新たにキャンバスを挿入する
			$target.empty();
			this.appendCanvas($target);
			// 挿入したキャンバスに、キャンバスプロパティ保管オブジェクトのデータを描画する
			ningloid.canvas.buildCanvasFromStat($target.attr("id"), () => {
				if(completeFunction) completeFunction();
				// 描画完了後、次の処理の実行許可
				resolver();
			});

			return p;
	},
	/**
	 * systemWrapperのインナーHTMLを更新する
	 * @param  {String}   systemInnerHTML systemWrapperのインナーHTML
	 * @param  {Function} cb              コールバック
	 */
	updateSystemLayers(systemInnerHTML){
		const $systemWrapper = this.getLayer("systemWrapper");
		$systemWrapper.empty().html(systemInnerHTML);
	},
	/**
	 * イベント保有要素のイベントを復元する
	 */
	restoreEvent(){
		// クリックレイヤのイベント復元
		ningloid.keyMouse.init();
		// イベント保持レイヤのイベントの復元
		$(".eventElement").each((i, self) => {
			const $self = $(self);
			// カスタムデータからイベント処理名を取得
			const event = {
				mouseenter: $self.data("mouseenter"),
				mouseleave: $self.data("mouseleave"),
				mousedown: $self.data("mousedown"),
				mouseup: $self.data("mouseup"),
				click: $self.data("click"),
			};
			// イベントセット
			this.setEvent($self, event);
		});
	},

	// ================================================================
	// ● ダミー描画系
	// ================================================================
	/**
	 * ダミーレイヤに該当レイヤのクローンを作成し、表示する
	 * @param  {String} canvasName オリジナルレイヤのID（キャンバスの名称）
	 */
	showDummy(canvasName){
		ningloid.canvas.setCloneToDummy(canvasName, () => {
			// オリジナルのレイヤのスタイル取得 → ダミーレイヤにスタイル反映
			const $dummyLayer = this.getLayer(`${canvasName}Dummy`);
			const $originLayer = this.getLayer(canvasName);
			$dummyLayer.attr("style", $originLayer.attr("style"));

			// 表示
			const $dummyWrapper = this.getLayer("dummyWrapper");
			$dummyWrapper.show();
		});
	},


	// ================================================================
    // ● イベント設定系
	// ================================================================
	setEvent($target, event){
		// イベントエレメントとしてクラスを付与する
		const classData = $target.attr("class");
		if(!classData.includes("eventElement")) $target.addClass("eventElement");

		// 各種実行処理郡
		const role = {
			save : () => ningloid.menu.show("saveMenu"),
			load : () => ningloid.menu.show("loadMenu"),
		};

		// イベント一覧
		const eventData = {};

		// イベントの保存（ロード復元用）と、イベントデータの追加
		if(event.mouseenter){
			$target.attr("data-mouseenter", event.mouseenter);
			eventData.mouseenter = (e) => {
				role[event.mouseenter]();
				e.stopPropagation();
			};
		}
		if(event.mouseleave){
			$target.attr("data-mouseleave", event.mouseleave);
			eventData.mouseleave = (e) => {
				role[event.mouseleave]();
				e.stopPropagation();
			};
		}
		if(event.mousedown){
			$target.attr("data-mousedown", event.mousedown);
			eventData.mousedown = (e) => {
				role[event.mousedown]();
				e.stopPropagation();
			};
		}
		if(event.mouseup){
			$target.attr("data-mouseup", event.mouseup);
			eventData.mouseup = (e) => {
				role[event.mouseup]();
				e.stopPropagation();
			};
		}
		if(event.click){
			$target.attr("data-click", event.click);
			eventData.click = (e) => {
				role[event.click]();
				// e.stopPropagation();
			};
		}

		// イベントのセット
		$target.on(eventData);
    },

	// ================================================================
    // ● CSS操作系
	// ================================================================
	transform: {
		/**
		 * 渡されたtransformプロパティ（scale, rotate, skew, translateの内1つ）をまとめて、オブジェクト化する
		 * ※jquery.transform.js依存
		 * @param  {Object} allSettingObj    "scale", "rotate", "skew", "translate"など、
		 *                                     一括指定に利用できるプロパティ名とその値
		 *                                     例：{scale: 1.0}、{rotate: 45}、{skew: null}など
		 * @param  {Object} singleSettingObj "○○X", "○○Y", "○○Z"など、
		 *                                     座標一方向に対して単体で指定するプロパティ名とその値
		 *                                     例：{scaleX: 1.5}、{rotateZ: "5deg"}、{skewY: null}など
		 * @return {Object} style              transformプロパティをまとめたオブジェクト
		 *                                     例1-1：{scale: 0.5}
		 *                                     例1-2：{scaleX: 0.5, scaleY: 1.0, scaleZ: 1.5}
		 *                                     例2-1：{rotate: 45}
		 *                                     例2-2：{rotateX: 0, rotateY: 45, rotateZ: 90}
		 */
		createStyleObject(allSettingObj, singleSettingObj){
			const style = {};
			// allSettingObj（省略：aso）のkeyとvalueを取得
			const [asoKey, asoVal] = [Object.keys(allSettingObj)[0], Object.values(allSettingObj)[0]];
			// singleSettingObjに値が格納されている場合（nullでない場合）
			if(Object.values(singleSettingObj).some((val) => !!val)){
				// singleSettingObjのkeyとvalueからスタイルプロパティを追加
				for(let key in singleSettingObj){
					// singleSettingObjのvalueが空（null）の場合は、allSettingObjのvalueを与える
					style[key] = parseFloat(singleSettingObj[key] || asoVal);
				}
			}
			// singleSettingObjのvalueが全て空（null）で、且つallSettingObjのvalueが存在する（nullでない）場合
			else if(asoVal){
				// allSettingObjのkeyとvalueからスタイルプロパティを追加
				style[asoKey] = parseFloat(asoVal);
			}
			// 構築したスタイルを返す
			return style;
		},
		/**
		 * scale・rotate・skewプロパティをまとめた変形用スタイルオブジェクトの作成
		 * ※jquery.transform.js依存
		 * @param  {Object} scaleObj  適応させるscaleプロパティをまとめたオブジェクト
		 *                             例：{scale: "1.0", scaleX: null, scaleY: null, scaleZ: 0.5}
		 * @param  {Object} rotateObj 適応させるrotateプロパティをまとめたオブジェクト
		 *                             例：{rotate: "10", rotateX: "45deg", rotateY: null, rotateZ: 50}
		 * @param  {Object} skewObj   適応させるskewプロパティをまとめたオブジェクト
		 *                             例：{skew: null, skewX: null, skewY: "15"}
		 * @return {Object}            変形用のtransformプロパティをまとめたスタイルオブジェクト
		 *                             ※変化のないプロパティ（「scale:1.0」や「rotate:0」など）は無し
		 *                             例1：{scale: 1.5, rotate: "10deg", skew: "25deg"}
		 *                             例2：{
		 *                             		scaleX: 0.5, scaleY: 0.8, scaleZ: 1.5,
		 *                             		rotateX: "20deg", rotateZ: "5deg",
		 *                             		skew: "5deg"
		 *                             }
		 *                             例3：{
		 *                             		rotate: "20deg",
		 *                             		skewX: "5deg"
		 *                             }
		 */
		createChangeShapeStyleObject(scaleObj, rotateObj, skewObj){
			// createStyleObject()を利用して、scale/rotate/skewのスタイルオブジェクトを作成する
			const [scaleStyle, rotateStyle, skewStyle] = [
				this.createStyleObject({scale: scaleObj.scale}, {scaleX: scaleObj.scaleX, scaleY: scaleObj.scaleY, scaleZ: scaleObj.scaleZ}),
				this.createStyleObject({rotate: rotateObj.rotate}, {rotateX: rotateObj.rotateX, rotateY: rotateObj.rotateY, rotateZ: rotateObj.rotateZ}),
				this.createStyleObject({skew: skewObj.skew}, {skewX: skewObj.skewX, skewY: skewObj.skewY})
			];
			// scaleプロパティの体裁調整
			for(let key in scaleStyle){
				// 値が1.0の場合、変形は行われないので削除する
				if(scaleStyle[key] == 1.0) delete scaleStyle[key];
			}
			for(let key in rotateStyle){
				// 値が0の場合、変形は行われないので削除する
				if(rotateStyle[key] == 0) delete rotateStyle[key];
				// rotateプロパティの操作は"deg"単位とする
				else rotateStyle[key] += "deg";
			}
			for(let key in skewStyle){
				// 値が0の場合、変形は行われないので削除する
				if(skewStyle[key] == 0) delete skewStyle[key];
				// skewプロパティの操作は"deg"単位とする
				else skewStyle[key] += "deg";
			}
			// 体裁調整を終えた3つのスタイルオブジェクトをマージして、変形用スタイルオブジェクトとして返す
			return $.extend(true, {}, scaleStyle, rotateStyle, skewStyle);
		},
		/**
		 * 変形用スタイルオブジェクトの作成（ningloidタグのパラメータを渡すだけで利用できる）
		 * @param  {Object} pm 当関数を利用するningloidタグのパラメータオブジェクト
		 * @return {Object}    上記、createChangeShapeStyleObject()と同様
		 */
		createChangeShapeStyleByTagParameter(pm){
			// createChangeShapeStyleObjectを利用
			// 各種プロパティの値は、タグパラメータpmから渡す
			return this.createChangeShapeStyleObject({
				scale: pm.scale, scaleX: pm.scaleX, scaleY: pm.scaleY, scaleZ: pm.scaleZ
			}, {
				rotate: pm.rotate, rotateX: pm.rotateX, rotateY: pm.rotateY, rotateZ: pm.rotateZ
			}, {
				skew: pm.skew, skewX: pm.skewX, skewY: pm.skewY
			});
		},
	},
};

