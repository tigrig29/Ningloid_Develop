/* global tag_data: true */

tag_data.kind_of_bg = {
	overview: "背景関連",
	tag: {
		bg:{
			name: "bg",
			overview: "背景の表示（変更）",
			description: "背景の表示、あるいは変更を行います。",
			develop_info: [
				"テスト実装", "-", "-"
			],
			parameter:[
				{
					name: "storage", required: "○", default: "×", type: "文字列(アドレス)",
					description: "背景画像を指定します。対象フォルダは./data/bgimage/です。${storage_suffix}"
				},
				{
					name: "left", required: "×", default: "0", type: "数値(px)",
					description: "表示左端位置をピクセルで指定します。scaleパラメータで拡大している場合、leftパラメータで位置を調整すると良いでしょう。"
				},
				{
					name: "top", required: "×", default: "0", type: "数値(px)",
					description: "表示上端位置をピクセルで指定します。scaleパラメータで拡大している場合、topパラメータで位置を調整すると良いでしょう。"
				},
				{
					name: "width", required: "×", default: "-", type: "数値(px)",
					description: "背景画像の横幅サイズをピクセルで指定します。scaleパラメータによって、更に拡大縮小されます。<br>\
								また、fitパラメータが\"full\"の場合反映されません。"
				},
				{
					name: "height", required: "×", default: "-", type: "数値(px)",
					description: "背景画像の高さサイズをピクセルで指定します。scaleパラメータによって、更に拡大縮小されます。<br>\
								また、fitパラメータが\"full\"の場合反映されません。"
				},
				{
					name: "fit", required: "×", default: "full", type: "full, none<br>cover, contain",
					description: "背景レイヤを画面サイズにフィットさせるかを指定します。<br>\
								<b>full</b>：縦横ともに画面サイズにピッタリ合わせます。縦横比は画面サイズ依存になります。<br>\
								<b>none</b>：何もしません。<br>\
								<b>cover</b>：縦横比は保持して、背景領域を完全に覆う最小サイズになるように背景画像を拡大縮小します。<br>\
								<b>contain</b>：縦横比は保持して、背景領域に収まる最大サイズになるように背景画像を拡大縮小します。\
								"
				},
				{
					name: "scale", required: "×", default: "1.0", type: "数値(倍率)",
					description: "横、縦、奥行き3方向の拡縮率を一括で指定します。scaleパラメータを指定し、scaleX,Y,Zの個別パラメータも指定した場合、scaleX,Y,Zの方が優先されます。またscaleX,Y,Zパラメータを指定しなかった場合、横・縦2方向の拡縮が行われます（奥行きは無視）。"
				},
				{
					name: "scaleX", required: "×", default: "1.0", type: "数値(倍率)",
					description: "横方向の${scale}"
				},
				{
					name: "scaleY", required: "×", default: "1.0", type: "数値(倍率)",
					description: "縦方向の${scale}"
				},
				{
					name: "scaleZ", required: "×", default: "1.0", type: "数値(倍率)",
					description: "奥行き方向の${scale}"
				},
				{
					name: "rotate", required: "×", default: "0", type: "数値(角度)",
					description: "背景レイヤを回転させます。度数法による指定です。rotateパラメータを指定した上で、rotateX,Y,Zの個別パラメータも指定した場合、rotateX,Y,Zの方が優先されます。またrotateパラメータのみ指定した場合、X軸方向の回転のみが反映されます。"
				},
				{
					name: "rotateX", required: "×", default: "0", type: "数値(角度)",
					description: "X軸方向に背景レイヤを回転させます。度数法による指定です。"
				},
				{
					name: "rotateY", required: "×", default: "0", type: "数値(角度)",
					description: "Y軸方向に背景レイヤを回転させます。度数法による指定です。"
				},
				{
					name: "rotateZ", required: "×", default: "0", type: "数値(角度)",
					description: "Z軸方向に背景レイヤを回転させます。度数法による指定です。"
				},
				{
					name: "skew", required: "×", default: "0", type: "数値(角度)",
					description: "背景レイヤを傾斜変形させます。度数法による指定です。skewパラメータを指定した上で、skewX,Yの個別パラメータも指定した場合、skewX,Yの方が優先されます。またskewパラメータのみ指定した場合、X軸方向の傾斜変形のみが反映されます。"
				},
				{
					name: "skewX", required: "×", default: "0", type: "数値(角度)",
					description: "X軸方向に傾斜変形させます。度数法による指定です。"
				},
				{
					name: "skewY", required: "×", default: "0", type: "数値(角度)",
					description: "Y軸方向に傾斜変形させます。度数法による指定です。"
				},
				{
					name: "time", required: "×", default: "1000", type: "数値(ms)",
					description: "${time}"
				},
				{
					name: "method", required: "×", default: "fadeIn", type: "文字列",
					description: "${showMethod}"
				},
				{
					name: "easing", required: "×", default: "linear", type: "文字列(リンク先参照)",
					description: "${easing}"
				},
				{
					name: "click", required: "×", default: "true", type: "真偽値",
					description: "${click}"
				},
				{
					name: "wait", required: "×", default: "true", type: "真偽値",
					description: "${wait}"
				}
			],
			example: ";通常背景表示<br>\
					[bg storage=test.jpg]<br><br>\
					;表示演出を変える<br>\
					@bg storage=test.jpg method=lightSpeedIn time=3000 easing=easeInQuart<br><br>\
					;変形させる<br>\
					@bg storage=test.jpg scale=0.8 rotate=10.5 rotateY=3 skey=1.5<br><br>\
					;32:9の横長（パノラマ）背景の一部を表示する<br>\
					@bg storage=test.jpg left=1920 fit=cover<br><br>\
					;背景表示演出開始と同時にBGM再生を開始する<br>\
					@bg storage=test.jpg time=3000 click=false wait=false<br>\
					@playbgm storage=test.ogg\
					"
		},
	}
};

/*
	,
	kind_of_: {
		overview: "",
		tag: {
			"":{
				name: "",
				overview: "",
				description: "",
				develop_info: [
					"テスト実装", "チェック待ち", ""
				],
				parameter:[
					{
						name: "", required: "×", default: "", type: "",
						description: ""
					},
				],
				example: "@"
			},
		}
	}
 */
