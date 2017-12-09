/* global tag_data: true */

tag_data.kind_of_etc = {
	overview: "その他",
	tag: {
		"eval":{
			name: "eval",
			overview: "JSコードの実行",
			description: "JavaScriptのコードを実行します。ゲーム内変数として、「f.○○」「tf.○○」「sf.○○」が利用できます。",
			develop_info: [
				"テスト実装", "", ""
			],
			parameter:[
				{
					name: "exp", required: "×", default: "-", type: "JS式",
					description: "実行するコードを記述します。"
				},
			],
			example: "\
					;一時変数に代入<br>\
					@eval exp=\"tf.test = 5\"<br>\
					;一時変数に加算<br>\
					@eval exp=\"tf.test++\"<br>\
					;一時変数testの値が5を超えていたら、背景変更<br>\
					@bg storage=test.jpg cond=\"tf.test > 5\"<br><br>\
					;ログに変数の値を出力する<br>\
					@eval exp=\"console.log(tf.test)\"\
					"
		},
		"iscript":{
			name: "iscript",
			overview: "JSコードの記述開始",
			description: "当タグから[endscript]までの区間を、JavaScriptのコードとして実行します。<br>ゲーム内変数として、「f.○○」「tf.○○」「sf.○○」が利用できます。",
			develop_info: [
				"テスト実装", "", ""
			],
			parameter: null,
			example: "\
					;JS開始<br>\
					[iscript]<br>\
					tf.test *= 10;<br>\
					console.log(tf.test);<br>\
					if(tf.test > 100) alert(\"test over 100\");<br>\
					[endscript]<br>\
					"
		},
		"endscript":{
			name: "endscript",
			overview: "JSコードの記述終了",
			description: "[iscript]から当タグまでの区間を、JavaScriptのコードとして実行します。",
			develop_info: [
				"テスト実装", "", ""
			],
			parameter: null,
			example: "\
					;[iscript]の例を御覧ください\
					"
		},
		"macro":{
			name: "macro",
			overview: "マクロの定義開始",
			description: "\
						当タグから[endmacro]までの区間のスクリプトを、マクロ＝新しいタグとして保存します。<br>\
						マクロ中のタグにおけるパラメータ記述では、%を頭につけた指定が可能です。%以降にはマクロに渡されるパラメータ名を記述します。すると、マクロに渡されたパラメータの値をタグに適応させることが出来ます。<br>\
						また%で指定したパラメータは変数「mp.パラメータ名」として呼び出すことが出来、あらに%指定時には、｜を使ってパラメータのデフォルト値を定義することも可能です。詳細は以下の「記述例」を御覧ください。<br>\
						",
			develop_info: [
				"テスト実装", "", "・*によるパラメータ全渡し"
			],
			parameter:[
				{
					name: "name", required: "○", default: "-", type: "文字列",
					description: "マクロ＝新しいタグの名称を指定します。ここで指定した名称のタグを、他のタグ同様に [タグ名] や @タグ名 で利用できるようになります。"
				},
			],
			example: "\
					;クリック待ちとメッセージクリアの合成マクロ：[lcm]<br>\
					[macro name=lcm]<br>\
					[l][cm]<br>\
					[endmacro]<br><br>\
					;シーン切り替えマクロ:[scenechange]<br>\
					[macro name=scenechange]<br>\
					;――メッセージのクリア後、メッセージウィンドウをすぐに隠す――<br>\
					[cm][hidemessage time=0]<br>\
					;――背景の変更を行う――<br>\
					;%storage記述により、[scenechange storage=○○]と指定した時に、[bg storage=○○]が実行される（○○が受け渡される）<br>\
					;[scenechange]マクロにおいてstorageパラメータが指定されなかった場合には、｜以降の\"black.png\"がデフォルト値として適応される。<br>\
					@bg storage=%storage|\"black.png\"<br>\
					;――メッセージウィンドウを表示する――<br>\
					;%showmessagetime記述により、[scenechange showmessagetime=○○]と指定した時に、[showmessage time=○○]が実行される（○○が受け渡される）<br>\
					@showmessage time=%showmessagetime<br>\
					;――表示された背景の画像名を、一時変数に保管しておく――<br>\
					[iscript]<br>\
					<font color=#AAA>// mp.storageには、[scenechange storage=○○]と指定した場合の○○が渡される（%storageと同じ）</font><br>\
					<font color=#AAA>// 一時変数currentbgimageにこの値を代入、もしstorageパラメータ未指定ならmp.storageは空なので、代わりにblack.pngを代入</font><br>\
					tf.currentbgimage = mp.storage || \"black.png\";<br>\
					[endscript]<br>\
					[endmacro]<br><br><br>\
					;※上記で定義したマクロの使用例を[endmacro]の「記述例」に記載しています。\
					"
		},
		"endmacro":{
			name: "endmacro",
			overview: "マクロの定義終了",
			description: "[iscript]から当タグまでの区間のスクリプトを、マクロ＝新しいタグとして保存します。詳細は[macro]の説明を御覧ください。",
			develop_info: [
				"テスト実装", "", ""
			],
			parameter: null,
			example: "\
					;定義済みマクロの使用例（[macro]の「記述例」にて定義したマクロを利用します）<br><br>\
					;[lcm]マクロ<br>\
					こんにちは。クリックでメッセージをクリアします。<br>\
					@lcm<br>\
					こんばんは。もう一度クリックでメッセージをクリアします。<br>\
					@lcm<br><br>\
					;[scenechange]マクロ<br>\
					こんにちは。クリックで背景をafternoon.jpgに切り替えます。[l]<br>\
					@scenechange storage=afternoon.jpg<br>\
					こんばんは。クリックで背景を暗転（black.pngに変更）し、メッセージウィンドウをゆっくり表示します。[l]<br>\
					@scenechange showmessagetime=3000<br>\
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
