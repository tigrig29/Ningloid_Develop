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
// ● レイヤ関連
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

// 動画再生
ningloid.tag.movie = {
	vital: ["layer"],
	pm: {layer: "", storage: ""},
	start: (pm) => {
		// Promise
		let [resolver, rejecter] = [null, null];
		const p = new Promise((resolve, reject) => resolver = resolve);

		const storage = `../resources/data/movie/${pm.storage}`;

		const $target = ningloid.layer.getLayer(pm.layer);
		const $video = $(`<video style="left:0; top:0; position:absolute;" src="${storage}"></video>`);
		$target.css({
			"mix-blend-mode": "overlay"
		});
		$video.attr("autoplay", "true");
		$video.attr("loop", "true");
		$video.attr("autoplay", "true");
		$target.append($video);

		// 次へ
		resolver();

		return p;
	}
};

// ================================================================
// ● キャラ関連
// ================================================================

ningloid.tag.charaShow = {
	vital: ["name"],
	pm: {
		name: "", image: null,
		left: 0, top: 0, scale: 1.0, opacity: 1.0, reflect: false,
		zindex: 0, fromX: null, fromY: null, fromScale: 0,
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
			scale: pm.scale
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
ningloid.tag.messageConfig = {
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
