/* global tag_data: true */

tag_data.kind_of_message = {
	overview: "メッセージウィンドウ関連",
	tag: {
		"l":{
			name: "l",
			overview: "クリック待ち",
			description: "ユーザのクリック入力を待ちます。クリックされると次の命令へ進行します。",
			develop_info: [
				"完成", "-", "-"
			],
			parameter: null,
			example: "\
					;クリック待ちのみ<br>\
					@l<br><br>\
					;クリックされたら、メッセージをクリアする<br>\
					こんにちは[l][cm]\
					"
		},
		"r":{
			name: "r",
			overview: "改行",
			description: "currentLayerのメッセージを改行します。currentLayerは[current]タグで指定できます。",
			develop_info: [
				"完成", "-", "-"
			],
			parameter: null,
			example: "\
					;クリックされたら、メッセージを改行する<br>\
					おはよう[l][r]<br>\
					こんにちは\
					"
		},
		"er":{
			name: "er",
			overview: "currentメッセージのクリア",
			description: "現在currentであるメッセージレイヤ(currentLayer)のメッセージをクリアします。",
			develop_info: [
				"完成", "-", "-"
			],
			parameter: null,
			example: "\
					;クリックされたら、メッセージをクリアする<br>\
					クリア[l][er]\
					"
		},
		"cm":{
			name: "cm",
			overview: "メッセージのクリア",
			description: "全てのメッセージレイヤのメッセージをクリアします。",
			develop_info: [
				"テスト実装", "-", "・メッセージレイヤの各種プロパティも消去するか"
			],
			parameter: null,
			example: "\
					;クリックされたら、メッセージをクリアする<br>\
					[l][cm]\
					"
		},
		"current":{
			name: "current",
			overview: "操作中レイヤの変更",
			description: "操作中のレイヤを変更します。ここで指定したレイヤがcurrentLayerとなります。",
			develop_info: [
				"テスト実装", "-", "-"
			],
			parameter:[
				{
					name: "layer", required: "○", default: "-", type: "文字列(名称)",
					description: "操作中に設定するメッセージレイヤの名称を指定します。指定できる名称はmessage0, 1, 2, ...です。"
				},
			],
			example: "@"
		},
		"showmessage":{
			name: "showmessage",
			overview: "メッセージウィンドウの表示",
			description: "メッセージウィンドウを表示します。",
			develop_info: [
				"テスト実装", "-", "-"
			],
			parameter:[
				{
					name: "name", required: "×", default: "yoshito", type: "文字列(名称)",
					description: "メッセージウィンドウに表示する発言者の名称を指定します。"
				},
				{
					name: "time", required: "×", default: "200", type: "数値(ms)",
					description: "${time}"
				},
			],
			example: "@showmessage name=enigma"
		},
		"hidemessage":{
			name: "hidemessage",
			overview: "メッセージウィンドウの消去",
			description: "メッセージウィンドウを消去します。",
			develop_info: [
				"テスト実装", "-", "-"
			],
			parameter:[
				{
					name: "time", required: "×", default: "200", type: "数値(ms)",
					description: "${time}"
				},
			],
			example: "@hidemessage"
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
					"テスト実装", "-", ""
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
