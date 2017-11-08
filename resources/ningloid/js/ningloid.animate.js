ningloid.animate = {
    // アニメーションで利用できるメソッド
    methods: {
		animateCss: [
			"bounce", "flash", "pulse", "rubberBand", "shake", "headShake", "swing", "tada", "wobble", "jello",
			"bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "bounceOut", "bounceOutDown",
			"bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft",
			"fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeOut", "fadeOutDown",
			"fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig", "fadeOutUp",
			"fadeOutUpBig", "flipInX", "flipInY", "flipOutX", "flipOutY", "lightSpeedIn", "lightSpeedOut", "rotateIn",
			"rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rotateOut",
			"rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "hinge", "jackInTheBox",
			"rollIn", "rollOut", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp", "zoomOut",
			"zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp", "slideInDown", "slideInLeft", "slideInRight",
			"slideInUp", "slideOutDown", "slideOutLeft", "slideOutRight", "slideOutUp"
		],
		etc: ["show", "hide", "transition", "universal"]
    },
    easing: {
		easeInSine: [0.47, 0, 0.745, 0.715], easeOutSine: [0.39, 0.575, 0.565, 1], easeInOutSine: [0.445, 0.05, 0.55, 0.95],
		easeInQuad: [0.55, 0.085, 0.68, 0.53], easeOutQuad: [0.25, 0.46, 0.45, 0.94], easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
		easeInCubic: [0.55, 0.055, 0.675, 0.19], easeOutCubic: [0.215, 0.61, 0.355, 1], easeInOutCubic: [0.645, 0.045, 0.355, 1],
		easeInQuart: [0.895, 0.03, 0.685, 0.22], easeOutQuart: [0.165, 0.84, 0.44, 1], easeInOutQuart: [0.77, 0, 0.175, 1],
		easeInQuint: [0.755, 0.05, 0.855, 0.06], easeOutQuint: [0.23, 1, 0.32, 1], easeInOutQuint: [0.86, 0, 0.07, 1],
		easeInExpo: [0.95, 0.05, 0.795, 0.035], easeOutExpo: [0.19, 1, 0.22, 1], easeInOutExpo: [1, 0, 0, 1],
		easeInCirc: [0.6, 0.04, 0.98, 0.335], easeOutCirc: [0.075, 0.82, 0.165, 1], easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
		easeInBack: [0.6, -0.28, 0.735, 0.045], easeOutBack: [0.175, 0.885, 0.32, 1.275], easeInOutBack: [0.68, -0.55, 0.265, 1.55]
    },
	// アニメーション中オブジェクトを保管するキュー
	queue: [],

	// ================================================================
	// ● 取得系
	// ================================================================
	/**
	 * アニメーションで利用できるメソッド名全てを返す
	 * @return {Array} アニメーションで利用できるメソッド名を格納した配列
	 */
	getAllMethod(){
		return [...this.methods.animateCss, ...this.methods.etc];
	},
	/**
	 * アニメーションで利用できるイージング名全てを返す
	 * @return {Array} アニメーションで利用できるイージング名を格納した配列
	 */
	getAllEasing(){
		return Object.keys(this.easing);
	},
	/**
	 * イージング名称からAnimationTimingFunctionの値を作成して返す
	 * @param  {String} easing イージング名称
	 * @return {String}        AnimationTimingFunctionの値
	 *         				   ※linearにはlinearを返し、想定外の値はそのまま返す
	 */
	getAnimationTimingFunction(easing){
		const easingList = this.getAllEasing();
		if(easing == "linear") return "linear";
		else if(easingList.includes(easing)) return `cubic-bezier(${this.easing[easing].join()})`;
		else return easing;
	},

	// ================================================================
	// ● アニメーション管理系
	// ================================================================
	/**
	 * キューにアニメーションオブジェクトを挿入する
	 * @param  {Object} animObj アニメーションの各種情報を格納したオブジェクト
	 */
	pushQueue(animObj){
		this.queue.push(animObj);
	},
	/**
	 * キューを空にする
	 */
	clearQueue(){
		this.queue.length = 0;
	},
	/**
	 * アニメーションオブジェクトの作成
	 * @param  {String}   target アニメーション対象のjQueryオブジェクト
	 * @param  {String}   lib    アニメーション実行ライブラリ名称
	 * @param  {Function} cb     コールバック
	 * @return {Object}          作成したアニメーションオブジェクトを返す
	 */
	createObject(target, lib, cb){
		/*
		animObj = {
			target: アニメーション対象のjQueryオブジェクト,
			lib: アニメーション実行ライブラリ名称,
			complete: コールバック関数
		};
		*/
		const animObj = {target, lib, complete(){
			// コールバック
			if(cb) cb(this);
			// アニメ実行数をデクリメント
			ningloid.flag.animating--;
		}};
		return animObj;
	},
	/**
	 * アニメーションをスキップする
	 * @param  {Object} animObj アニメーションの各種情報を格納したオブジェクト
	 */
	skipToEnd(animObj){
		switch(animObj.lib){
			case "velocity":
				animObj.target.velocity("finish");
				break;
			case "keyframes":
				animObj.target.keyframes("pause");
				if(animObj.complete) animObj.complete();
				break;
			case "animateCss":
				animObj.target.css({"animation-duration": "0s"});
				break;
		}
	},

	// ================================================================
	// ● 実行系
	// ================================================================
	/**
	 * jQueryによるアニメーション
	 * @param  {$Object } target      アニメーション対象のjQueryオブジェクト
	 * @param  {Object  } props       アニメーション対象のスタイルプロパティ
	 * @param  {Object  } options     アニメーションオプション
	 *                    .duration   {Number[ms]} アニメーション時間
	 *                    .easing     {String    } イージング名
	 *                    .skippable  {Boolean   } スキップ可/不可フラグ
	 * @param  {Function} cb          コールバック
	 */
	velocity(target, props, options, cb){
		// アニメーションオブジェクトの作成
		const animObj = this.createObject(target, "velocity", function(self){
			// アニメーション完了時
			// コールバック関数
			if(cb) cb(target);
			self.complete = null;
		});

		// アニメーション開始前に、アニメーション実行数をインクリメント
		ningloid.flag.animating++;
		// アニメーション実行
		target.velocity(props, options.duration, options.easing, function(){
			// コールバックはアニメーションオブジェクトから呼び出す
			animObj.complete();
		});

		// アニメーションキューにオブジェクトを保存
		if(options.skippable !== false) this.queue.push(animObj);
	},
	/**
	 * CSSプロパティの操作によるアニメーション
	 * @param  {$Object } target      アニメーション対象のjQueryオブジェクト
	 * @param  {Object  } transProps トランジションを付加するCSSプロパティ
	 * @param  {Object  } options     アニメーションオプション
	 *                    .duration   {Number[ms]} アニメーション時間
	 *                    .easing     {String    } イージング名
	 *                    .delay      {Number[ms]} アニメーション開始までの待ち時間
	 *                    .direction  {String    } アニメーション方向
	 *                    .count      {Number    } 繰り返し実行数
	 *                    .skippable  {Boolean   } スキップ可/不可フラグ
	 * @param  {Function} cb          コールバック
	 */
	transition(target, transProps, options, cb){
		// アニメーションオブジェクトの作成
		const animObj = this.createObject(target, "keyframes", function(self){
			// アニメーション完了時
			// ・keyframes.jsの処理で付加される"animation"プロパティを削除
			target.css("animation", "");
			// ・アニメーション終了時のCSSプロパティを付与
			switch(options.direction){
				case "reverse":
					break;
				case "alternate":
					if(options.count % 2 == 1) target.css(transProps);
					break;
				case "alternate-reverse":
					if(options.count % 2 == 0) target.css(transProps);
					break;
				default:
					target.css(transProps);
			}
			// コールバック関数
			if(cb) cb(target);
			self.complete = null;
		});

		// イージングをanimationTimingFunctionに変換する
		if(options.easing) options.easing = this.getAnimationTimingFunction(options.easing);

		// アニメーション開始前に、アニメーション実行数をインクリメント
		ningloid.flag.animating++;
		// アニメーション実行
		target.keyframes(transProps, options, function(){
			// コールバックはアニメーションオブジェクトから呼び出す
			animObj.complete();
		});

		// アニメーションキューにオブジェクトを保存
		if(options.skippable !== false) this.queue.push(animObj);
	},
	/**
	 * animate.cssのメソッドを用いたアニメーション
	 * @param  {$Object } target      アニメーション対象のjQueryオブジェクト
	 * @param  {Object  } options     アニメーションオプション
	 *                    .method     {String    } 演出名称
	 *                    .duration   {Number[ms]} アニメーション時間
	 *                    .easing     {String    } イージング名
	 *                    .delay      {Number[ms]} アニメーション開始までの待ち時間
	 *                    .direction  {String    } アニメーション方向
	 *                    .count      {Number    } 繰り返し実行数
	 *                    .skippable  {Boolean   } スキップ可/不可フラグ
	 * @param  {Function} cb          コールバック
	 */
	animateCss(target, options, cb){
		// アニメーションオブジェクトの作成
		const animObj = this.createObject(target, "animateCss", function(){
			// コールバック関数
			if(cb) cb();
		});

		// In, Outに応じて最終opacity値を調整する
		let opacity = true;
		if(options.method.includes("Out") || options.method == "hinge") {
			opacity = false;
		}
		// directionに応じて、最終opacity値を反転調整
		switch(options.direction){
			case "reverse":
				opacity = !opacity;
				break;
			case "alternate":
				if(options.count % 2 == 0) opacity = !opacity;
				break;
			case "alternate-reverse":
				if(options.count % 2 == 1) opacity = !opacity;
				break;
		}
		target.css({opacity: +opacity});

		// イージングをanimationTimingFunctionに変換する
		if(options.easing) options.easing = this.getAnimationTimingFunction(options.easing);

		// アニメーション用プロパティを作成
		const animationProps = {};
		const prefixAry = ["", "-webkit"];
		for(let prefix of prefixAry){
			animationProps[`${prefix}animation-name`] = options.method;
			animationProps[`${prefix}animation-duration`] = `${options.duration / 1000}s`;
			animationProps[`${prefix}animation-timing-function`] = options.easing;
			animationProps[`${prefix}animation-delay`] = `${options.delay / 1000}s`;
			animationProps[`${prefix}animation-iteration-count`] = options.count;
			animationProps[`${prefix}animation-direction`] = options.direction;
		}

		// アニメーション開始前に、アニメーション実行数をインクリメント
		ningloid.flag.animating++;
		// アニメーション実行
		target.animateCss(animationProps, function(){
			// コールバックはアニメーションオブジェクトから呼び出す
			animObj.complete();
		});

		// アニメーションキューにオブジェクトを保存
		if(options.skippable !== false) this.queue.push(animObj);
	},
};

// 上記ningloid.animateで定義した関数を利用して作成した関数郡
// タグの処理に利用するため、パラメータチェックなども行う
ningloid.animate.ext = {
	play(target, options, promise, cb){
		const allMethods = ningloid.animate.getAllMethod();
		if(!allMethods.includes(options.method)){
			// エラー出力、処理終了
			promise[1](`指定されたmethod「${options.method}」は存在しません。`);
		}

		let method = options.method;

		// スキップ時は速度を早める
		if(ningloid.flag.skipMode === true || ningloid.flag.systemSkipMode === true){
			// options.duration = 100;
			if(method.includes("In")) method = "show";
			if(method.includes("Out")) method = "hide";
		}

		switch(method){
			case "fadeIn":
				ningloid.animate.velocity(target, {opacity: "1"}, options, () => {
					if(cb) cb();
				});
				break;
			case "fadeOut":
				ningloid.animate.velocity(target, {opacity: "0"}, options, () => {
					if(cb) cb();
				});
				break;
			case "show":
				target.css("opacity", 1);
				if(cb) cb();
				break;
			case "hide":
				target.css("opacity", 0);
				if(cb) cb();
				break;
			// ユニバーサルトランジションを適応
			case "universal":
				console.log("未作成");
				if(cb) cb();
				break;
			// Animate.cssのアニメーションを適応
			default:
				ningloid.animate.animateCss(target, options, function(){
					if(cb) cb();
				});
		}
	},
};
