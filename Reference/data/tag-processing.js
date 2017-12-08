/* global tag_data: true */

tag_data.kind_of_processing = {
	overview: "進行関係",
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
		"s":{
			name: "s",
			overview: "ゲームの停止",
			description: "このタグの地点でゲームの進行処理を停止します。",
			develop_info: [
				"完成", "-", "-"
			],
			parameter: null,
			example: "\
					ここでシナリオ終了<br>\
					[s]\
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
