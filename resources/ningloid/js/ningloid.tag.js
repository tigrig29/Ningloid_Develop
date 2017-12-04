ningloid.tag = {};
ningloid.tag.l = {
	start: () => {
		return new Promise((resolve, reject) => {
			if(ningloid.flag.systemSkipMode === true) resolve();
			ningloid.tmp.resolver = resolve;
			ningloid.tmp.stopResolver = resolve;
			if(ningloid.flag.skipMode === true) ningloid.system.skip.resolveAfterSkipWaitTime();
			else if(ningloid.flag.autoMode === true) ningloid.system.auto.resolveAfterAutoWaitTime();
		});
	},
};
ningloid.tag.r = {
	start: () => {
		// Promise
		let resolver = null;
		const p = new Promise((resolve, reject) => resolver = resolve);

		$(`#${ningloid.stat.currentLayer}Inner`).append("<br>");
		resolver();

		return p;
	},
};
ningloid.tag.cm = {
	start: () => {
		// Promise
		let resolver = null;
		const p = new Promise((resolve, reject) => resolver = resolve);
		$(`#${ningloid.stat.currentLayer}Inner`).empty();
		resolver();
		return p;
	},
};
ningloid.tag.s = {
	start: () => new Promise((resolve, reject) => {
		resolve("stop");
	})
};

// ================================================================
// ● 背景関連
// ================================================================
ningloid.tag.bg = {
	vital: ["storage"],
	pm: {
		storage: "",
		left: 0, top: 0, width: null, height: null, fit: "full",
		scale: null, scaleX: null, scaleY: null, scaleZ: null,
		rotate: null, rotateX: null, rotateY: null, rotateZ: null,
		skew: null, skewX: null, skewY: null,
		time: 1E3, method: "fadeIn", easing: "linear",
		click: true, wait: true
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		// bgダミー表示
		ningloid.layer.showDummy("bg");

		// bgキャンバスクリア
		ningloid.canvas.clearStage("bg");

		// 対象レイヤ取得
		const $target = ningloid.layer.getLayer("bg");

		// CSSスタイルを設定
		const style = {
			// opacityは表示演出前に0にしておく必要がある
			opacity: 0,
		};
		if(pm.left) style.left = `${parseInt(pm.left)}px`;
		if(pm.top) style.top = `${pm.top}px`;

		// transform系スタイルを追加
		const transformStyle = ningloid.layer.transform.createChangeShapeStyleByTagParameter(pm);
		$.extend(true, style, transformStyle);
		// 作成したスタイルを適応
		$target.css(style).removeAttr("data-transform");

		// 描画データを作成
		const spriteData = {};
		const bgData = spriteData[`../resources/data/bgimage/${pm.storage}`] = {};
		if(pm.width) bgData.width = parseFloat(pm.width);
		if(pm.height) bgData.height = parseFloat(pm.height);
		// 画像描画
		ningloid.canvas.renderImage("bg", null, spriteData, (stage, renderer) => {
			// fitパラメータによるキャンバス拡縮
			ningloid.canvas.fitCanvasSizeToDisplay(stage, renderer, pm.fit);
			// 表示アニメーション
			ningloid.animate.ext.play($target, {
				method: pm.method,
				duration: parseInt(pm.time),
				easing: pm.easing,
				skippable: pm.click,
			}, [resolver, rejecter], function(){
				// 次へ
				if(String(pm.wait) == "true") resolver();
				// ダミーレイヤhide
				const $dummyWrapper = ningloid.layer.getLayer("dummyWrapper");
				$dummyWrapper.hide();
			});
		});

		// 処理終了待たずに次へ
		if(String(pm.wait) == "false") resolver();

		return p;
	}
};
// 背景を動かす（パノラマ背景や拡大時用）
ningloid.tag.bgMove = {
	vital: [""],
	pm: {},
	start: () => {
		const p = new Promise((resolve, reject) => ningloid.tmp.resolver = resolve);
		return p;
	},
};
// 背景を消去する
ningloid.tag.bgOut = {
	vital: [""],
	pm: {},
	start: () => {
		const p = new Promise((resolve, reject) => ningloid.tmp.resolver = resolve);
		return p;
	},
};
// 暗転や白転
ningloid.tag.blind = {
	vital: [""],
	pm: {},
	start: () => {
		const p = new Promise((resolve, reject) => ningloid.tmp.resolver = resolve);
		return p;
	},
};

// ================================================================
// ● 動画関連
// ================================================================
// 動画再生
ningloid.tag.playmovie = {
	vital: ["layer", "storage"],
	pm: {
		storage: "", layer: "",
		fade: null, loop: false, volume: 100,
		clickskip: false, clickremove: false, wait: true,
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => resolver = resolve);

		// 動画ファイル選択
		const storage = `../resources/data/movie/${pm.storage}`;
		// オプション
		const options = {};
		if(pm.loop == "true") options.loop = "loop";
		// レイヤ選択
		const $target = ningloid.layer.getLayer(pm.layer);

		// ビデオ要素の追加、実行
		const $video = ningloid.test = ningloid.video.createAndPlay($target, storage, options, (self) => {
			// 終了時のイベント

			// Video再生フラグ消去
			ningloid.flag.playingVideo = false;
			if(String(pm.wait) == "true") resolver();
		});

		// クリック時のイベント追加
		ningloid.video.setClickable($video, pm.clickskip, pm.clickremove);

		// フェードイン
		if(pm.fade !== null){
			ningloid.video.fadeIn($video, parseInt(pm.fade), () => {
				// 再生フラグを立てる
				ningloid.flag.playingVideo = true;
			});
		}
		else{
			// 再生フラグを立てる
			ningloid.flag.playingVideo = true;
		}

		// 次へ
		$video[0].addEventListener("loadeddata", (e) => {
			if(String(pm.wait) == "false") resolver();
		});

		return p;
	}
};

// 動画停止
ningloid.tag.stopmovie = {
	vital: ["layer"],
	pm: {
		layer: "", skip: false, remove: false, wait: true,
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => resolver = resolve);

		// フラグ消去
		ningloid.flag.playingVideo = false;

		// Video要素選択
		const $video = ningloid.video.getVideo(pm.layer);

		// スキップ
		if(pm.skip == "true"){
			let cancelEnd = false;
			// スキップ、リムーブ両方のフラグが立っている場合
			if(pm.remove != "false") cancelEnd = true;
			// スキップ処理
			ningloid.video.skipToEnd($video, cancelEnd);
		}
		// 消去
		if(String(pm.remove) != "false"){
			// システムスキップ
			if(ningloid.flag.systemSkipMode === true) pm.remove = 0;
			// フェードアウト時間
			const time = parseInt(pm.remove);
			// 即時消去（その後、エンドファンクション呼び出し）
			if(time == 0 || isNaN(time)) ningloid.video.remove($video, true);
			// フェードアウト→消去（その後、エンドファンクション呼び出し）
			else{
				ningloid.video.fadeOut($video, time, true, () => {
					// 次へ
					if(String(pm.wait) == "true") resolver();
				});
				// 次へ
				if(String(pm.wait) == "false") resolver();
				return p;
			}
		}
		// 一時停止
		else{
			ningloid.video.pause($video);
			// 次へ
			resolver();
			return p;
		}
	}
};

// 動画再開
ningloid.tag.resumemovie = {
	vital: ["layer"],
	pm: {
		layer: "", volume: 100,
		clickskip: false, clickremove: false, wait: true,
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => resolver = resolve);

		// フラグ
		ningloid.flag.playingVideo = true;

		// Video要素選択
		const $video = ningloid.video.getVideo(pm.layer);

		// 再開
		ningloid.video.resume($video, () => {
			// Video再生フラグ消去
			ningloid.flag.playingVideo = false;
			if(String(pm.wait) == "true") resolver();
		});

		// クリック時のイベント追加
		ningloid.video.setClickable($video, pm.clickskip, pm.clickremove);

		// 次へ
		if(String(pm.wait) == "false") resolver();

		return p;
	}
};

// 動画消去
ningloid.tag.removemovie = {
	vital: ["layer"],
	pm: {
		layer: "", fade: 0, skip: false, wait: true,
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => resolver = resolve);

		// フラグ消去
		ningloid.flag.playingVideo = false;

		// Video要素選択
		const $video = ningloid.video.getVideo(pm.layer);

		// スキップ
		if(pm.skip == "true"){
			// スキップ処理
			ningloid.video.skipToEnd($video, true);
		}
		// システムスキップ
		if(ningloid.flag.systemSkipMode === true) pm.fade = 0;
		// フェードアウト時間
		const time = parseInt(pm.fade);
		// 即時消去（その後、エンドファンクション呼び出し）
		if(time == 0 || isNaN(time)){
			ningloid.video.remove($video, true);
			// 次へ
			resolver();
			return p;
		}
		// フェードアウト→消去（その後、エンドファンクション呼び出し）
		else{
			ningloid.video.fadeOut($video, time, true, () => {
				// 次へ
				if(String(pm.wait) == "true") resolver();
			});
			// 次へ
			if(String(pm.wait) == "false") resolver();
			// resolve重複してしまうので、フェードアウト時はここで処理終了
			return p;
		}
	}
};

// ================================================================
// ● キャラ関連
// ================================================================

ningloid.tag.charashow = {
	vital: ["name"],
	pm: {
		name: "", image: null,
		left: 0, top: 0, scale: 1.0, /* opacity: 1.0, reflect: false,*/
		zindex: 0, /*fromX: null, fromY: null, fromScale: 0,*/
		time: 1E3, method: "fadeIn", easing: "linear",
		click: true, wait: true
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		// fromX/Yが常に０になってしまうので、初期化として、x/yと同値にする
		// if(pm.fromX === null) pm.fromX = pm.x;
		// if(pm.fromY === null) pm.fromY = pm.y;

		ningloid.character.createLayer(pm.name);
		const partsData = {};
		if(pm.image) partsData.partID = pm.image;
		else{
			for(let partGroupID of Object.keys(ningloid.character.data[pm.name])){
				partsData[partGroupID] = {
					partID: pm[partGroupID]
				};
			}
		}
		const spriteData = ningloid.character.createSpriteData(pm.name, partsData);

		const $target = $("#character").find(`#${pm.name}`);
		$target.css("opacity", 0);
		$target.css({
			left: pm.left,
			top: pm.top,
			scale: pm.scale,
			"z-index": parseInt(pm.zindex) || "auto",
		});
		// 画像描画
		ningloid.canvas.renderImage(pm.name, null, spriteData, (stage, renderer) => {
			// 表示アニメーション
			ningloid.animate.ext.play($target, {
				method: pm.method,
				duration: parseInt(pm.time),
				easing: pm.easing,
				skippable: pm.click,
			}, [resolver, rejecter], function(){
				// 次へ
				if(String(pm.wait) == "true") resolver();
			});
		});

		return p;
	}
};

// ================================================================
// ● メッセージ関連
// ================================================================
/**
 * メッセージレイヤの基礎項目を設定する
 * vital : []
 * @layer {String} CurrentLayer 設定対象のメッセージレイヤ番号
 * @left {CSSvalue} 5% メッセージウィンドウの左位置
 * @top {CSSvalue} 5% メッセージウィンドウの上位置
 * @width {CSSvalue} 90% メッセージウィンドウの横幅
 * @height {CSSvalue} 90% メッセージウィンドウの高さ
 * @opacity {0 ~ 1} 0.5 メッセージウィンドウの透過度
 * @color {Color} white テキストの色
 * @margin {CSSvalue} 0 メッセージウィンドウの内側余白（上下左右一括指定）
 * @marginl {CSSvalue} "" メッセージウィンドウの左内側余白（margin属性を上書き）
 * @margint {CSSvalue} "" メッセージウィンドウの上内側余白（margin属性を上書き）
 * @marginr {CSSvalue} "" メッセージウィンドウの右内側余白（margin属性を上書き）
 * @marginb {CSSvalue} "" メッセージウィンドウの下内側余白（margin属性を上書き）
 * @vertical {Boolean} false 縦書き指定
 * @visible {Boolean} false 可視状態指定
 */
ningloid.tag.messageconfig = {
	vital: [],
	pm: {
		layer: ningloid.stat.currentLayer, style: "", bgstyle: "",
		left: "", top: "", width: "", height: "",
		"font-color": "", "line-height": "",
		"bg-color": "", "bg-image": "", opacity: "",
		margin: "", marginl: "", margint: "", marginr: "", marginb: "",
		vertical: false, visible: true
	},
	start: (pm) => {
		// Promise
		let resolver = null;
		const p = new Promise((resolve, reject) => resolver = resolve);

		// スタイル調整
		const style = {};
		if(pm.left !== "") style.left = pm.left;
		if(pm.top !== "") style.top = pm.top;
		if(pm.width !== "") style.width = pm.width;
		if(pm.height !== "") style.height = pm.height;
		if(pm["font-color"] !== "") style.color = pm["font-color"];
		if(pm["line-height"] !== "") style["line-height"] = pm["line-height"];
		// margin（実際はpadding）の調整
		const padding = `${pm.margint || pm.margin} ${pm.marginr || pm.margin} ${pm.marginb || pm.margin} ${pm.marginl || pm.margin}`;
		if(padding !== "") style.padding = padding;

		// 背景色・背景画像の設定
		const bgstyle = {};
		if(pm["bg-color"] !== "") bgstyle["background-color"] = pm["bg-color"];
		if(pm.opacity !== "") bgstyle.opacity = pm.opacity;
		if(pm["bg-image"] !== ""){
			bgstyle["background-image"] = `url(../resources/data/image/${pm["bg-image"]})`;
			bgstyle["background-repeat"] = "none";
		}

		// CSS属性を指定した場合は、上記のスタイルにマージする
		if(pm.style !== "") $.extend(style, JSON.parse(pm.style.replace(/'/g, "\"")));
		if(pm.bgstyle !== "") $.extend(style, JSON.parse(pm.bgstyle.replace(/'/g, "\"")));

		// スタイル適応
		$(`#${pm.layer}Outer`).css(style).css(bgstyle);
		$(`#${pm.layer}Inner`).css(style);

		// 縦書き
		if(String(pm.vertical) == "true"){
			$(`#${pm.layer}Inner`).css({
				"-webkit-writing-mode": "vertical-rl",
				"-ms-writing-mode": "tb-rl",
				"writing-mode": "vertical-rl",
			});
		}

		// 表示（visible）状態の変更
		let display = "block";
		if(String(pm.visible) == "false") display = "none";
		$(`#${pm.layer}`).css({display});

		// 次へ
		resolver();

		return p;
	}
};
ningloid.tag.showmessage = {
	vital: [],
	pm: {
		layer: "",
		time: 3E2, method: "fadeIn", click: true, wait: true
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		// 対象レイヤ
		const $target = pm.layer === "" ? $(`#${ningloid.stat.currentLayer}`) : $(`#${pm.layer}`);

		$target.css("opacity", 0);
		// 不可視状態を解除
		if($target.css("display") == "none") $target.show();
		// 表示アニメーション
		ningloid.animate.ext.play($target, {
			method: pm.method,
			duration: parseInt(pm.time),
			easing: pm.easing,
			skippable: pm.click,
		}, [resolver, rejecter], function(){
			// 次へ
			if(String(pm.wait) == "true") resolver();
		});

		// 処理終了待たずに次へ
		if(String(pm.wait) == "false") resolver();

		return p;
	}
};
ningloid.tag.hidemessage = {
	vital: [],
	pm: {
		layer: "",
		time: 3E2, method: "fadeOut", click: true, wait: true
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		// 対象レイヤ
		const $target = pm.layer === "" ? $(`#${ningloid.stat.currentLayer}`) : $(`#${pm.layer}`);

		// 表示アニメーション
		ningloid.animate.ext.play($target, {
			method: pm.method,
			duration: parseInt(pm.time),
			easing: pm.easing,
			skippable: pm.click,
		}, [resolver, rejecter], function(){
			// 不可視にする
			$target.hide();
			// 次へ
			if(String(pm.wait) == "true") resolver();
		});

		// 処理終了待たずに次へ
		if(String(pm.wait) == "false") resolver();

		return p;
	}
};

// ================================================================
// ● ボタン関連
// ================================================================

// ボタンを画面に追加する
// （挿入対象のレイヤを選択させることで、レイヤごとの管理を可能にする～messageレイヤのみ）
ningloid.tag.button = {
	vital: ["layer"],
	pm: {
		name: "", layer: "", exp: "", role: "",
		text: "", hint: "", style: "",
		x: "", y: "", width: "", height: "",
		border: "", "border-radius": "", "border-style": "", "border-color": "",
		"font": "", "font-color": "", "font-size": "", "font-weight": "",
		"bg-image": "", "bg-color": "",
		enterimg: "", downimg: "", clickimg: "",
		enterse: "", downse: "", clickse: ""
	},
	start: (pm) => {
		// Promise
		let resolver = null;
		let rejecter = null;
		const p = new Promise((resolve, reject) => {
			resolver = resolve;
			rejecter = reject;
		});
		// 対象レイヤ
		const $target = ningloid.layer.getLayer(pm.layer);

		// ボタンのオブジェクト
		const $button = $("<div class='graphicButton eventElement'></div>");

		// ID, テキスト, ヒントを設定
		if(pm.id !== ""){
			// ID重複チェック
			if($(`#${pm.name}`).length){
				// 重複時はエラーを投げ、終了する
				rejecter(`名称「${pm.name}」のボタンは既に存在するため、作成できません。<br>name属性を修正してください。`);
			}
			$button.attr("id", pm.name);
		}
		if(pm.text !== "") $button.html(pm.text);
		if(pm.hint !== "") $button.attr("title", pm.hint);

		// ボタンのスタイル
		const style = {};
		if(pm.x !== "") style.left = pm.x;
		if(pm.y !== "") style.top = pm.y;
		if(pm.width !== "") style.width = pm.width;
		if(pm.height !== "") style.height = pm.height;
		if(pm.border !== ""){
			// 線の太さ
			style.border = `${pm.border} `;
			// 線の種類
			if(pm["border-style"] !== "") style.border += `${pm["border-style"]} `;
			else style.border += "solid ";
			// 線の色
			if(pm["border-color"] !== "") style.border += `${pm["border-color"]} `;
			else style.border += "black ";
		}
		if(pm["border-radius"] !== "") style["border-radius"] = pm["border-radius"];
		if(pm.font !== "") style["font-family"] = pm.font;
		if(pm["font-color"] !== "") style.color = pm["font-color"];
		if(pm["font-size"] !== "") style["font-size"] = pm["font-size"];
		if(pm["font-weight"] !== "") style["font-weight"] = pm["font-weight"];
		if(pm["bg-image"] !== "") style["background-image"] = pm["bg-image"];
		if(pm["bg-color"] !== "") style["background-color"] = pm["bg-color"];

		// スタイル適応
		$button.css(style);

		// 各種イベントセット
		ningloid.layer.setEvent($button, {
			mouseenter: null,
			mouseleave: null,
			mousedown: null,
			mouseup: null,
			click: pm.role,
		});

		// DOMに追加
		$target.append($button);

		// 次へ
		resolver();

		return p;
	}
};
// ボタンの表示演出を行う
ningloid.tag.showbutton = {
	// nameかlayerどちらか必須
	vital: [["name", "layer"]],
	pm: {
		name: "", layer: "",
		time: 3E2, method: "fadeIn", click: true, wait: true
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		// 対象レイヤ
		let $target = null;
		if(pm.layer !== ""){
			const $parent = ningloid.layer.getLayer(pm.layer);
			$target = $parent.find(".graphicButton");
			if($parent.css("opacity") == 0 || $parent.css("display") == "none") pm.method = "show";
		}
		if(pm.name !== "") $target = $(`#${pm.name}`);

		// 表示アニメーション
		ningloid.animate.ext.play($target, {
			method: pm.method,
			duration: parseInt(pm.time),
			// easing: pm.easing,
			skippable: pm.click,
		}, [resolver, rejecter], function(){
			// 次へ
			if(String(pm.wait) == "true") resolver();
		});

		// 処理終了待たずに次へ
		if(String(pm.wait) == "false") resolver();

		return p;
	}
};
// ボタンの消去演出を行う
ningloid.tag.hidebutton = {
	// nameかlayerどちらか必須
	vital: [["name", "layer"]],
	pm: {
		name: "", layer: "",
		time: 3E2, method: "fadeOut", click: true, wait: true
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		// 対象レイヤ
		let $target = null;
		if(pm.layer !== ""){
			const $parent = ningloid.layer.getLayer(pm.layer);
			$target = $parent.find(".graphicButton");
			if($parent.css("opacity") == 0 || $parent.css("display") == "none") pm.method = "hide";
		}
		if(pm.name !== "") $target = $(`#${pm.name}`);

		// 表示アニメーション
		ningloid.animate.ext.play($target, {
			method: pm.method,
			duration: parseInt(pm.time),
			// easing: pm.easing,
			skippable: pm.click,
		}, [resolver, rejecter], function(){
			// 次へ
			if(String(pm.wait) == "true") resolver();
		});

		// 処理終了待たずに次へ
		if(String(pm.wait) == "false") resolver();

		return p;
	}
};
// ================================================================
// ● 音声関連
// ================================================================
ningloid.tag.playbgm = {
	vital: ["storage"],
	pm: {storage: "", fade: false, volume: 100, loop: true, buf: 0, wait: false},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => resolver = resolve);

		let audio = null;
		// オーディオオブジェクトの作成
		if(!ningloid.tmp.audio.bgm[pm.buf]) audio = ningloid.tmp.audio.bgm[pm.buf] = new Audio();
		else audio = ningloid.tmp.audio.bgm[pm.buf];

		// ボリューム設定
		audio.volume = parseInt(pm.volume) / 100;
		// ファイル指定
		audio.src = `../resources/data/bgm/${pm.storage}`;
		// ループ
		if(String(pm.loop) == "true") audio.loop = true;
		audio.onloadeddata = () => {
			// 再生
			audio.play();
			// フェードイン
			if(!(String(pm.fade) == "false" || pm.fade == "0")){
				audio.volume = 0;
				const plusVolume = (parseInt(pm.volume) / 100) / (parseInt(pm.fade) / 10);
				const timer = setInterval(() => {
					if(audio.volume + plusVolume >= 1.0) audio.volume = 1.0;
					else audio.volume += plusVolume;
					if(audio.volume >= parseFloat(pm.volume) / 100) clearInterval(timer);
				}, 10);
			}

			// 次へ
			if(String(pm.wait) == "false") resolver();
		};

		// 終了時
		audio.onended = () => {
			// 次へ
			if(String(pm.wait) == "true") resolver();
		};

		return p;
	}
};

ningloid.tag.stopbgm = {
	vital: [],
	pm: {fade: false, buf: 0, wait: true},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => resolver = resolve);

		if(String(pm.wait) == "true" && ningloid.flag.systemSkipMode === true){
			pm.fade = false;
		}

		const audio = ningloid.tmp.audio.bgm[pm.buf];
		// フェードイン
		if(!(String(pm.fade) == "false" || pm.fade == "0")){
			const minusVolume = audio.volume / (parseInt(pm.fade) / 10);
			const timer = setInterval(() => {
				if(audio.volume - minusVolume < 0) audio.volume = 0.0;
				else audio.volume -= minusVolume;
				if(audio.volume == 0.0){
					clearInterval(timer);
					audio.pause();

					// 次へ
					if(String(pm.wait) == "true") resolver();
				}
			}, 10);
		}
		else{
			// 停止
			audio.pause();

			// 次へ
			if(String(pm.wait) == "true") resolver();
		}

		// 次へ
		if(String(pm.wait) == "false") resolver();

		return p;
	}
};
// ================================================================
// ● ラベル・ジャンプ操作
// ================================================================
ningloid.tag.jump = {
	vital: [["storage", "target"]],
	pm: {
		storage: null, target: null
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		const parser = ningloid.parser;
		if(pm.storage){
			// シナリオファイルの読み込み
			parser.loadScenarioByFile(`../resources/data/scenario/${pm.storage}`).then(() => {
				// 3MB以上のファイルを新規に読み込むと、処理がカクつく可能性がある
				// この場合にはsetTimeoutで↓の処理を囲んだほうが良い
					// setTimeout(() => {}, 200);
				// シナリオの実行
				parser.playScenarioByCache(pm.target ? parser.label[`*${pm.target}`].line : 0);
				// 次へ＆これまでのシナリオファイルの逐次実行を停止する
				resolver("stop");
			});
		}
		else{
			// シナリオの実行
			parser.playScenarioByCache(parser.label[`*${pm.target}`].line);
			// 次へ＆これまでのシナリオファイルの逐次実行を停止する
			resolver("stop");
		}

		return p;
	}
};


// ================================================================
// ● プログラム操作関連
// ================================================================
ningloid.tag.eval = {
	pm: {
		exp: "",
	},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		ningloid.evalScript(pm.exp);

		resolver();

		return p;
	}
};

ningloid.tag.iscript = {
	start: () => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		ningloid.parser.tmpScript = "";

		resolver();
		return p;
	}
};
ningloid.tag.endscript = {
	start: () => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		const parser = ningloid.parser;
		ningloid.evalScript(parser.tmpScript);
		parser.tmpScript = null;

		resolver();

		return p;
	}
};

ningloid.tag.macro = {
	vital: ["name"],
	pm: {name: ""},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		ningloid.parser.macro.tmpName = pm.name;
		// 同じ名称のマクロが既に存在する場合、上書きする
		ningloid.parser.macro.data[pm.name] = [];

		resolver();
		return p;
	}
};
ningloid.tag.endmacro = {
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		ningloid.parser.macro.tmpName = null;

		resolver();

		return p;
	}
};

ningloid.tag.if = {
	pm: {},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		resolver();

		return p;
	}
};
ningloid.tag.endif = {
	pm: {},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => [resolver, rejecter] = [resolve, reject]);

		resolver();

		return p;
	}
};


// ================================================================
// ● システム関連
// ================================================================

ningloid.tag.wait = {
	vital: ["time"],
	pm: {time: null},
	start: (pm) => {
		// Promise
		let resolver = null;
		const p = new Promise((resolve, reject) => resolver = resolve);
		setTimeout(() => {
			resolver();
		}, parseInt(pm.time))
		return p;
	}
};


ningloid.tag.save = {
	start: () => {
		// Promise
		let resolver = null;
		const p = new Promise((resolve, reject) => resolver = resolve);
		ningloid.system.doSave();
		// console.log("save complete");
		resolver();
		return p;
	}
};
ningloid.tag.load = {
	start: () => {
		// Promise
		let resolver = null;
		const p = new Promise((resolve, reject) => resolver = resolve);
		ningloid.system.doLoad();
		// console.log("load complete");
		resolver();
		return p;
	}
};

ningloid.tag.test = {
	start: () => {
		// Promise
		let resolver = null;
		const p = new Promise((resolve, reject) => resolver = resolve);
		ningloid.menu.show("loadMenu");
		resolver();
		return p;
	}
};

ningloid.tag.test2 = {
	start: () => {
		// Promise
		let resolver = null;
		const p = new Promise((resolve, reject) => resolver = resolve);
		ningloid.parser.playScenarioByCache(28);
		resolver("stop");
		return p;
	}
};


/*
ningloid.tag. = {
	vital: [],
	pm: {},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => resolver = resolve);

		// 次へ
		resolver();

		return p;
	}
};
*/
