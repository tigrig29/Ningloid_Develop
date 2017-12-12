/* global tag_data: true */

tag_data.kind_of_character = {
	overview: "立ち絵関連",
	tag: {
		"charashow":{
			name: "charashow",
			overview: "キャラクターの登場",
			description: "キャラクターを登場させます。<br>CharacterSetting.jsのpartsModeによって、必須が「△」（image・????）のパラメータの必要有無が変化します。",
			develop_info: [
				"テスト実装", "-", "・fromX, Yなどのパラメータ実装<br>reflectパラメータ実装"
			],
			parameter:[
				{
					name: "name", required: "○", default: "×", type: "名称",
					description: "登場させる${charaName}"
				},
				{
					name: "image", required: "△", default: "0", type: "名称",
					description: "登場${charaImage}"
				},
				{
					name: "????", required: "△", default: "0", type: "名称",
					description: "登場${charaParts}"
				},
				{
					name: "left", required: "×", default: "0", type: "数値(px)",
					description: "キャラクターの登場左端位置を指定します。"
				},
				{
					name: "top", required: "×", default: "0", type: "数値(px)",
					description: "キャラクターの登場上端位置を指定します。"
				},
				{
					name: "scale", required: "×", default: "1.0", type: "数値(倍率)",
					description: "${scale}"
				},
				// {
				// 	name: "opacity", required: "×", default: "1.0", type: "数値(0.0~1.0)",
				// 	description: "${opacity}"
				// },
				// {
				// 	name: "reflect", required: "×", default: "false", type: "真偽値",
				// 	description: "キャラクターの画像を左右反転させる場合、trueを指定します。"
				// },
				{
					name: "zindex", required: "×", default: "0", type: "数値",
					description: "表示キャラクターの重なり順序を指定します。数値が大きいほど前面に、小さいほど背面に表示されます。"
				},
				// {
				// 	name: "fromX", required: "×", default: "center", type: "left,center,right / 数値(px)",
				// 	description: "${fromX}"
				// },
				// {
				// 	name: "fromY", required: "×", default: "200", type: "数値(px)",
				// 	description: "${fromY}"
				// },
				// {
				// 	name: "fromScale", required: "×", default: "1.0", type: "数値(倍率)",
				// 	description: "${fromScale}"
				// },
				{
					name: "time", required: "×", default: "1000", type: "数値(ms)",
					description: "表示${time}"
				},
				{
					name: "method", required: "×", default: "fadeIn", type: "名称",
					description: "表示${showMethod}"
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
			example:"\
					;partsMode:\"single\"の場合<br>\
					;立ち絵画像としてimageパラメータを指定する必要がある<br>\
					[charaShow name=test image=normal scale=1.5 time=2000]<br><br>\
					;partsMode:\"multi\"の場合<br>\
					;パーツ画像として、CharaSettingに記述したパーツ名のパラメータを指定する必要がある<br>\
					;パーツとして「pose」「face」の2つを定義した例<br>\
					@charaShow name=test2 pose=test_pose1 face=test_face1\
					"
		},
		"charahide":{
			name: "charahide",
			overview: "キャラクターの退場",
			description: "キャラクターを退場させます。",
			develop_info: [
				"テスト実装", "-", ""
			],
			parameter:[
				{
					name: "name", required: "○", default: "×", type: "名称",
					description: "登場させる${charaName}"
				},
				{
					name: "time", required: "×", default: "1000", type: "数値(ms)",
					description: "表示${time}"
				},
				{
					name: "method", required: "×", default: "fadeIn", type: "名称",
					description: "表示${hideMethod}"
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
			example:"\
					@charahide name=test\
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
