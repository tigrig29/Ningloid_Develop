/* global tag_data: true */

tag_data.kind_of_effect = {
	overview: "画面演出関連",
	tag: {
		playmovie:{
			name: "playmovie",
			overview: "動画の再生を行う",
			description: "プログラムで実装できない特殊な画面演出を行います。動画をゲームにオーバーレイで載せます。",
			develop_info: [
				"テスト実装", "-", ""
			],
			parameter:[
				{
					name: "storage", required: "○", default: "×", type: "文字列(アドレス)",
					description: "動画を指定します。対象フォルダは./data/video/overlay/です。${storage_suffix}"
				},
				{
					name: "time", required: "×", default: "500", type: "数値(ms)",
					description: "動画のフェードイン${time}"
				},
			],
			example: "@overlay time=1000"
		},
		stopmovie:{
			name: "stopmovie",
			overview: "特殊な画面演出を停止する",
			description: "特殊画面演出を停止します。",
			develop_info: [
				"<font color=red>未実装</font>", "-", "特になし"
			],
			parameter:[
				{
					name: "time", required: "×", default: "500", type: "数値(ms)",
					description: "動画のフェードアウト${time}"
				},
			],
			example: "@stop_overlay"
		}
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
