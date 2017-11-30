/* global tag_data: true */

tag_data.kind_of_sound = {
	overview: "音声関連",
	tag: {
		playbgm:{
			name: "playbgm",
			overview: "BGMの再生",
			description: "BGMを再生する。",
			develop_info: [
				"テスト実装", "チェック待ち", ""
			],
			parameter:[
				{
					name: "storage", required: "×", default: "", type: "",
					description: ""
				},
				{
					name: "fade", required: "×", default: "", type: "",
					description: ""
				},
				{
					name: "volume", required: "×", default: "", type: "",
					description: ""
				},
			],
			example: "@"
		},
		stopbgm:{
			name: "stopbgm",
			overview: "BGMの停止",
			description: "BGMを停止する。",
			develop_info: [
				"テスト実装", "チェック待ち", ""
			],
			parameter:[
				{
					name: "fade", required: "×", default: "", type: "",
					description: ""
				},
			],
			example: "@"
		},
		playse:{
			name: "playse",
			overview: "SEの再生",
			description: "SEを再生する。",
			develop_info: [
				"テスト実装", "チェック待ち", ""
			],
			parameter:[
				{
					name: "storage", required: "×", default: "", type: "",
					description: ""
				},
				{
					name: "fade", required: "×", default: "", type: "",
					description: ""
				},
				{
					name: "volume", required: "×", default: "", type: "",
					description: ""
				},
			],
			example: "@"
		},
		stopse:{
			name: "stopse",
			overview: "SEの停止",
			description: "SEを停止する。",
			develop_info: [
				"テスト実装", "チェック待ち", ""
			],
			parameter:[
				{
					name: "fade", required: "×", default: "", type: "",
					description: ""
				},
			],
			example: "@"
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
