/* global tag_data: true */

tag_data.kind_of_message = {
	overview: "メッセージウィンドウ関連",
	tag: {
		"l":{
			name: "l",
			overview: "クリック入力を待つ",
			description: "ユーザのクリック入力を待ちます。クリックされると次の命令へ進行します。",
			develop_info: [
				"<font color=red>完成</font>", "-", "特になし"
			],
			parameter: null,
			example: "[l]"
		},
		"showmessage":{
			name: "showmessage",
			overview: "メッセージウィンドウの表示",
			description: "メッセージウィンドウを表示します。",
			develop_info: [
				"テスト実装", "チェック待ち", "特になし"
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
				"テスト実装", "チェック待ち", "特になし"
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
