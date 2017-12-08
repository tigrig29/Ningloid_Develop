/* global tag_data: true */

tag_data.kind_of_sound = {
	overview: "音声関連",
	tag: {
		playbgm:{
			name: "playbgm",
			overview: "BGMの再生",
			description: "BGMを再生します。ファイル形式はoggのみ対応しています。",
			develop_info: [
				"テスト実装", "-", "・対応ファイルがoggのみ<br>・フラグ管理などを考慮していない<br>・キャッシュ利用を考慮していない"
			],
			parameter:[
				{
					name: "storage", required: "○", default: "×", type: "文字列<br>(アドレス)",
					description: "音声ファイル名を指定します。対象フォルダは「bgm」です。${storageSuffix}"
				},
				{
					name: "fade", required: "×", default: "0", type: "数値[ms]",
					description: "音声再生のフェードイン${time}<br>0を指定すると、フェードインしません。"
				},
				{
					name: "volume", required: "×", default: "100", type: "数値<br>0 - 100",
					description: "音量を指定します。"
				},
				{
					name: "loop", required: "×", default: "true", type: "真偽値",
					description: "音声が終端に達した際に、再生し直す（ループさせる）かを指定します。trueを指定するとループします。"
				},
				{
					name: "wait", required: "×", default: "false", type: "真偽値",
					description: "${wait}<br>" +
									"※loop=true かつ wait=true にすると、先に進まなくなります。"
				},
			],
			example: "<font color=#4c4>;フェードインあり、ループありで再生</font><br>\
					@playbgm storage=\"test.ogg\" fade=1000<br><br>\
					<font color=#4c4>;フェードインなし、ループなしで再生し、再生完了するまで処理を止める</font><br>\
					@playbgm storage=\"test.ogg\" loop=false wait=true\
					"
		},
		stopbgm:{
			name: "stopbgm",
			overview: "BGMの停止",
			description: "BGMを停止する。",
			develop_info: [
				"テスト実装", "-", "・フラグ管理などを考慮していない"
			],
			parameter:[
				{
					name: "fade", required: "×", default: "0", type: "数値[ms]",
					description: "音声のフェードアウト${time}<br>0を指定すると、フェードインしません。"
				},
				{
					name: "wait", required: "×", default: "true", type: "真偽値",
					description: "フェードアウト${wait}<br>"
				},
			],
			example: "\
					<font color=#4c4>;フェードアウトなしで停止</font><br>\
					@stopbgm<br><br>\
					<font color=#4c4>;フェードアウトありで停止、フェードアウト完了するまで処理を止める</font><br>\
					@stopbgm fade=1000<br><br>\
					<font color=#4c4>;フェードアウトありで停止、フェードアウト完了を待たずに次へ</font><br>\
					@stopbgm fade=1000 wait=false\
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
