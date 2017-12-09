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
		"jump":{
			name: "jump",
			overview: "シナリオのジャンプ",
			description: "指定されたファイル、あるいはラベルにジャンプします。storageかtargetのどちらか、あるいは両方のパラメータ指定が必要です。",
			develop_info: [
				"テスト実装", "・エディタのリアルタイムプレビューに対応していない", "・エディタのリアルタイムプレビューへの対応"
			],
			parameter:[
				{
					name: "storage", required: "△", default: "-", type: "文字列(アドレス)",
					description: "ジャンプ先シナリオファイルを指定します。対象フォルダは「scenario」です。${storageSuffix}"
				},
				{
					name: "target", required: "△", default: "-", type: "文字列(ラベル)",
					description: "ジャンプ先のラベルを指定します。ラベルは、シナリオファイル中で「*」を行頭に指定して定義します。<br>\
								targetパラメータのみ指定した場合は、現在実行中のシナリオファイル内の指定ラベルまでジャンプします。storageパラメータも同時に指定している場合、storageパラメータで指定したシナリオファイル内のラベルにジャンプします。"
				},
			],
			example: "\
					;他のシナリオファイルにジャンプ<br>\
					別ファイルにジャンプします[l]<br>\
					@jump storage=second.ks<br><br>\
					;同じシナリオファイル内の、指定ラベルまでジャンプ<br>\
					該当ラベルまでジャンプします[l]<br>\
					@jump target=*test<br><br>\
					;ゲーム変数を用いて、ジャンプ先を変更<br>\
					f.targetに保存しているラベル名を利用してジャンプ[l]<br>\
					@jump target=&f.target\
					"
		},
		"wait":{
			name: "wait",
			overview: "待機",
			description: "指定した時間だけシナリオ進行を停止します。",
			develop_info: [
				"テスト実装", "-", "-"
			],
			parameter:[
				{
					name: "time", required: "○", default: "-", type: "数値[ms]",
					description: "待機時間を指定します。"
				},
			],
			example: "\
					;背景表示 → 3秒待機 → 背景変更<br>\
					@bg storage=test1.jpg<br>\
					@wait time=3000<br>\
					@bg storage=test2.jpg\
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
