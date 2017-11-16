/* global tag_data: true */

tag_data.kind_of_bg = {
	overview: "背景関連",
	tag: {
		bg:{
			name: "bg",
			overview: "背景の表示（変更）",
			description: "背景の表示、あるいは変更を行います。",
			develop_info: [
				"テスト実装", "チェック待ち", "特になし"
			],
			parameter:[
				{
					name: "storage", required: "○", default: "×", type: "文字列(アドレス)",
					description: "背景画像を指定します。対象フォルダは./data/bgimage/です。${storage_suffix}"
				},
				{
					name: "left", required: "×", default: "0", type: "数値(px)",
					description: "表示左端位置をピクセルで指定します。scale属性で拡大している場合、left属性で位置を調整すると良いでしょう。"
				},
				{
					name: "top", required: "×", default: "0", type: "数値(px)",
					description: "表示上端位置をピクセルで指定します。scale属性で拡大している場合、top属性で位置を調整すると良いでしょう。"
				},
				{
					name: "scale", required: "×", default: "100", type: "数値(%)",
					description: "${scale}"
				},
				{
					name: "method", required: "×", default: "fadeIn", type: "",
					description: "${method}"
				},
				{
					name: "effect", required: "×", default: "linear", type: "文字列(リンク先参照)",
					description: "${effect}"
				},
				{
					name: "blur", required: "×", default: "0", type: "数値(px)",
					description: "背景にぼかしをかける場合指定します。大体10pxほどが無難です。ぼかしを解除したい場合には、同じ背景画像をbgで表示してください。"
				},
				{
					name: "time", required: "×", default: "1000", type: "数値(ms)",
					description: "${time}"
				},
				{
					name: "clickable", required: "×", default: "true", type: "真偽値",
					description: "${click}"
				},
				{
					name: "wait", required: "×", default: "true", type: "真偽値",
					description: "${wait}"
				}
			],
			example: "@bg storage=house_of_yoshito.png"
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
