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
			description: "操作中のメッセージレイヤのメッセージを改行します。操作中のメッセージレイヤ(currentLayer)は[current]タグで指定できます。",
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
			overview: "操作中メッセージレイヤのクリア",
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
					こんにちは。クリックでクリアします。[l][cm]\
					"
		},
		"current":{
			name: "current",
			overview: "操作中レイヤの変更",
			description: "操作中のレイヤを変更します。ここで指定したレイヤがcurrentLayerとなります。<br>初期状態のcurrentLayerはmessage0です。",
			develop_info: [
				"テスト実装", "-", "-"
			],
			parameter:[
				{
					name: "layer", required: "○", default: "-", type: "文字列(名称)",
					description: "操作中に設定するメッセージレイヤの名称を指定します。指定できる名称はmessage0, 1, 2, ...です。"
				},
			],
			example: "@current layer=message1"
		},
		"messageconfig":{
			name: "messageconfig",
			overview: "メッセージレイヤの設定",
			description: "メッセージレイヤの各種設定を変更します。layerパラメータを指定しなかった場合、操作中レイヤ(currentLayer)が対象となります。",
			develop_info: [
				"テスト実装", "-", "-"
			],
			parameter:[
				{
					name: "layer", required: "×", default: "-", type: "文字列(名称)",
					description: "対象のレイヤ名称。message0, 1, 2...。<br>\
								メッセージレイヤの数はConfig.jsで指定できます。"
				},
				{
					name: "left", required: "×", default: "0", type: "数値(px)",
					description: "表示左端位置をピクセルで指定します。"
				},
				{
					name: "top", required: "×", default: "0", type: "数値(px)",
					description: "表示上端位置をピクセルで指定します。"
				},
				{
					name: "width", required: "×", default: "-", type: "数値(px)",
					description: "背景画像の横幅サイズをピクセルで指定します。"
				},
				{
					name: "height", required: "×", default: "-", type: "数値(px)",
					description: "背景画像の高さサイズをピクセルで指定します。"
				},
				{
					name: "time", required: "×", default: "200", type: "数値(ms)",
					description: "${time}"
				},
			],
			example: "@messageconfig name=enigma"
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
