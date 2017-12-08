/* global tag_data: true */

tag_data.kind_of_message = {
	overview: "メッセージウィンドウ関連",
	tag: {
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
				"テスト実装", "-", "・visibleパラメータ実装"
			],
			parameter:[
				{
					name: "layer", required: "×", default: "操作中のレイヤ(currentLayer)", type: "文字列(名称)",
					description: "対象のレイヤ名称。message0, 1, 2...。<br>\
								メッセージレイヤの数はConfig.jsで指定できます。"
				},
				{
					name: "left", required: "×", default: "画面の横幅の5%", type: "数値",
					description: "表示左端位置を指定します。"
				},
				{
					name: "top", required: "×", default: "画面の高さの5%", type: "数値",
					description: "表示上端位置を指定します。"
				},
				{
					name: "width", required: "×", default: "画面の横幅の90%", type: "数値",
					description: "背景画像の横幅サイズを指定します。"
				},
				{
					name: "height", required: "×", default: "画面の高さの90%", type: "数値",
					description: "背景画像の高さサイズを指定します。"
				},
				{
					name: "font-color", required: "×", default: "white", type: "色指定",
					description: "このレイヤに表示されるメッセージの色を指定します。${color}"
				},
				{
					name: "line-height", required: "×", default: "-", type: "数値(px)",
					description: "行間（行の高さ）をピクセル値で指定します。"
				},
				{
					name: "bg-color", required: "×", default: "rgb(50,50,50)", type: "色指定",
					description: "対象のメッセージウィンドウの背景色を指定します。${color}"
				},
				{
					name: "bg-image", required: "×", default: "-", type: "文字列(ファイル名)",
					description: "対象のメッセージウィンドウのフレーム画像を指定します。対象フォルダは「image」です。${storageSuffix}"
				},
				{
					name: "opacity", required: "×", default: "1.0", type: "数値<br>0.0 - 1.0",
					description: "対象のメッセージウィンドウの${opacity}<br>※ウィンドウ（フレーム）部分にのみ適応され、メッセージレイヤ上の文字は透過されません。"
				},
				{
					name: "margin", required: "×", default: "0", type: "数値(px)",
					description: "メッセージレイヤの上下左右の余白を一括で指定します。marginパラメータを指定した上で、更にmargint,b,l,rパラメータを指定した場合、それぞれ上書きされます。"
				},
				{
					name: "margint", required: "×", default: "0", type: "数値(px)",
					description: "メッセージレイヤの上余白を指定します。marginパラメータを指定していた場合、上余白はここで指定した値に上書きされます。"
				},
				{
					name: "marginb", required: "×", default: "0", type: "数値(px)",
					description: "メッセージレイヤの上余白を指定します。marginパラメータを指定していた場合、下余白はここで指定した値に上書きされます。"
				},
				{
					name: "marginl", required: "×", default: "0", type: "数値(px)",
					description: "メッセージレイヤの上余白を指定します。marginパラメータを指定していた場合、左余白はここで指定した値に上書きされます。"
				},
				{
					name: "marginr", required: "×", default: "0", type: "数値(px)",
					description: "メッセージレイヤの上余白を指定します。marginパラメータを指定していた場合、右余白はここで指定した値に上書きされます。"
				},
				{
					name: "vertical", required: "×", default: "false", type: "真偽値",
					description: "対象のメッセージレイヤにおいて、メッセージを縦書きにする場合true, 横書きの場合falseを指定します。"
				},
				// {
				// 	name: "visible", required: "×", default: "true", type: "真偽値",
				// 	description: "対象のメッセージレイヤの表示状態を指定します。trueだと可視、falseだと不可視になります。"
				// },
				{
					name: "style", required: "×", default: "-", type: "JSON",
					description: "<font color=red>JavaScript言語を理解している人向けのパラメータです。</font><br>\
								対象のメッセージレイヤのCSSスタイルを変更します。jQueryのcss関数と同様に一括で指定することが出来ます。JSON形式での指定です。<br>\
								例：style=\"{'left': '10px', 'top': '30px', 'width': '1000px'}\"<br>\
								※各プロパティ名、値をシングルクォーテーションで囲う必要があります。\
								"
				},
				{
					name: "bgstyle", required: "×", default: "-", type: "JSON",
					description: "<font color=red>JavaScript言語を理解している人向けのパラメータです。</font><br>\
								対象のメッセージレイヤの背景（メッセージレイヤの枠部分）のCSSスタイルを変更します。jQueryのcss関数と同様に一括で指定することが出来ます。JSON形式での指定です。<br>\
								例：style=\"{'background-color': '#888', 'opacity': '0.5'}\"<br>\
								※各プロパティ名、値をシングルクォーテーションで囲う必要があります。\
								"
				},
			],
			example: "\
					;操作中のメッセージレイヤをビジュアルノベル形式（下の方に横長のメッセージウィンドウがある感じ）にする<br>\
					@messageconfig left=5% top=75% width=90% height=20% opacity=0.8 margin=10px<br><br>\
					;フレーム画像を適応<br>\
					[messageconfig left=0 top=70% width=1920 height=231px opacity=0.8 margin=10px bg-image=test.png]<br><br>\
					;一部のパラメータだけ更新する<br>\
					;まずビジュアルノベル形式にしてメッセージ表示<br>\
					@messageconfig left=5% top=75% width=90% height=20% opacity=0.8 margin=10px<br>\
					こんにちは。[l]<br>\
					;クリックされたら、メッセージウィンドウの位置を変える<br>\
					@messageconfig left=100px top=300px<br><br>\
					;styleパラメータを利用して、ビジュアルノベル形式のメッセージウィンドウを表現する<br>\
					messageconfig style=\"{'left': '5%', 'top': '75%', 'width': '90%', 'height': '20%'}\" opacity=0.8 margin=10px\
					"
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
					name: "layer", required: "×", default: "操作中のレイヤ(currentLayer)", type: "文字列(名称)",
					description: "対象のレイヤ名称。message0, 1, 2...。<br>\
								メッセージレイヤの数はConfig.jsで指定できます。"
				},
				{
					name: "time", required: "×", default: "300", type: "数値(ms)",
					description: "${time}"
				},
				{
					name: "method", required: "×", default: "fadeIn", type: "文字列",
					description: "${showMethod}"
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
			example: "@showmessage layer=message1 method=bounceIn"
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
					name: "layer", required: "×", default: "操作中のレイヤ(currentLayer)", type: "文字列(名称)",
					description: "対象のレイヤ名称。message0, 1, 2...。<br>\
								メッセージレイヤの数はConfig.jsで指定できます。"
				},
				{
					name: "time", required: "×", default: "300", type: "数値(ms)",
					description: "${time}"
				},
				{
					name: "method", required: "×", default: "fadeOut", type: "文字列",
					description: "${hideMethod}"
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
			example: "@hidemessage layer=message1 method=bounceOut"
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
