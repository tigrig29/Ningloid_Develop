/* global tag_data: true */

tag_data.kind_of_effect = {
	overview: "画面演出関連",
	tag: {
		playmovie:{
			name: "playmovie",
			overview: "動画の再生を行う",
			description: "指定したレイヤ上で動画を再生します。<br>※レイヤ合成させる場合には、該当レイヤにbrendmodeタグを使用してください。",
			develop_info: [
				"テスト実装", "-", "・volume実装<br>・対応ファイル形式の確認、拡張など（現在は.webmのみ）"
			],
			parameter:[
				{
					name: "storage", required: "○", default: "×", type: "文字列<br>(アドレス)",
					description: "動画ファイル名を指定します。対象フォルダは./data/video/です。${storage_suffix}"
				},
				{
					name: "layer", required: "○", default: "x", type: "文字列<br>(レイヤ名)",
					description: "動画を挿入する${viewLayer}"
				},
				{
					name: "fade", required: "×", default: "0", type: "数値[ms]",
					description: "動画のフェードイン${time}<br>0を指定すると、フェードインしません。"
				},
				{
					name: "loop", required: "×", default: "false", type: "真偽値",
					description: "動画が終端に達した際に、再生し直す（ループさせる）かを指定します。trueを指定するとループします。"
				},
				{
					name: "volume", required: "×", default: "100", type: "数値<br>0 - 100",
					description: "再生動画の音量を指定します。"
				},
				{
					name: "clickskip", required: "×", default: "false", type: "真偽値",
					description: "クリックされた際に動画を終端までスキップするかを指定します。スキップする場合true、しない場合falseを指定して下さい。"
				},
				{
					name: "clickremove", required: "×", default: "false", type: "false<br>or<br>数値[ms]",
					description: "クリックされた際に動画を画面から消去するかを指定します。<br>" +
									"false：消去しません。<br>" +
									"数値[ms]：指定した数値[ms]のフェードアウトを実行して、動画を消去します。<br>" +
									"※0やtrueを指定すると、フェードアウトではなく、即時消去が実行されます。"
				},
				{
					name: "wait", required: "×", default: "true", type: "真偽値",
					description: "trueの場合、動画再生が完了するまで次の処理を実行しません。<br>" +
									"動画再生中に何らかの処理を行いたい場合にはfalseを指定してください。<br>" +
									"また、何らかの処理のあとに、動画再生完了を待つ場合には[waitmovie]タグを使用します。"
				},
			],
			example: ""
		},
		stopmovie:{
			name: "stopmovie",
			overview: "動画を停止する",
			description: "指定したレイヤ上で再生されている動画を停止します。",
			develop_info: [
				"テスト実装", "-", ""
			],
			parameter:[
				{
					name: "layer", required: "○", default: "x", type: "文字列<br>(レイヤ名)",
					description: "再生中の動画が挿入されている${viewLayer}"
				},
				{
					name: "skip", required: "×", default: "false", type: "真偽値",
					description: "動画再生${skip}"
				},
				{
					name: "remove", required: "×", default: "false", type: "false<br>or<br>数値[ms]",
					description: "動画を画面から消去するかを指定します。<br>" +
									"false：消去しません。<br>" +
									"数値[ms]：指定した数値[ms]のフェードアウトを実行して、動画を消去します。<br>" +
									"※0やtrueを指定すると、フェードアウトではなく、即時消去が実行されます。"
				},
				{
					name: "wait", required: "×", default: "true", type: "真偽値",
					description: "※removeに数値を指定した場合のみ意味を持ちます。<br>" +
									"フェードアウト${wait}"
				},
			],
			example: ""
		},
		resumemovie:{
			name: "resumemovie",
			overview: "動画を再開する",
			description: "指定したレイヤ上の、停止中の動画を再開します。",
			develop_info: [
				"テスト実装", "-", "・volume実装<br>"
			],
			parameter:[
				{
					name: "layer", required: "○", default: "x", type: "文字列<br>(レイヤ名)",
					description: "再生中の動画が挿入されている${viewLayer}"
				},
				{
					name: "volume", required: "×", default: "100", type: "数値<br>0 - 100",
					description: "再生動画の音量を指定します。"
				},
				{
					name: "clickskip", required: "×", default: "false", type: "真偽値",
					description: "クリックされた際に動画を終端までスキップするかを指定します。スキップする場合true、しない場合falseを指定して下さい。"
				},
				{
					name: "clickremove", required: "×", default: "false", type: "false<br>or<br>数値[ms]",
					description: "クリックされた際に動画を画面から消去するかを指定します。<br>" +
									"false：消去しません。<br>" +
									"数値[ms]：指定した数値[ms]のフェードアウトを実行して、動画を消去します。<br>" +
									"※0やtrueを指定すると、フェードアウトではなく、即時消去が実行されます。"
				},
				{
					name: "wait", required: "×", default: "true", type: "真偽値",
					description: "trueの場合、動画再生が完了するまで次の処理を実行しません。<br>" +
									"動画再生中に何らかの処理を行いたい場合にはfalseを指定してください。<br>" +
									"また、何らかの処理のあとに、動画再生完了を待つ場合には[waitmovie]タグを使用します。"
				},
			],
			example: ""
		},
		removemovie:{
			name: "removemovie",
			overview: "動画を消去する",
			description: "指定したレイヤ上の、停止中の動画を再開します。",
			develop_info: [
				"テスト実装", "-", ""
			],
			parameter:[
				{
					name: "layer", required: "○", default: "x", type: "文字列<br>(レイヤ名)",
					description: "再生中の動画が挿入されている${viewLayer}"
				},
				{
					name: "fade", required: "×", default: "0", type: "数値[ms]",
					description: "動画のフェードアウト${time}<br>0を指定すると、フェードアウトせず即時消去されます。"
				},
				{
					name: "skip", required: "×", default: "false", type: "真偽値",
					description: "動画再生${skip}"
				},
				{
					name: "wait", required: "×", default: "true", type: "真偽値",
					description: "フェードアウト${wait}"
				},
			],
			example: "@"
		},
	}
};

/*
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
 */
