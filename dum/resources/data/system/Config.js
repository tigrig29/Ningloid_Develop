ningloid.config = {
	projectName: "ningloidTest",
	display: {
		// ゲーム画面の解像度
		width: 1920,
		height: 1080,
	},
	layer: {
		fore: {
			num: 3,
		},
		message: {
			num: 3,
		},
	},
	message: {
		showType: "fade",// fade or clatter
		textSpeed: 50,// 速 0 ... 100 遅
		autoSpeed: 30,// 速 0 ... 100 遅
		skipSpeed: 50,// 速 0 ... 100 遅
	},
	backlogCapacity: 10,
	/*
	chara: {
		// 1：差分なし
		// 2：体（ポーズ）＋表情差分
		// 3：体（ポーズ）＋目差分＋口差分
		partsNum: 1,
	},
	*/
	save: {
		// セーブデータの保存方式を指定します。
		// web ： WebStorage（見えない形）に保存します。あらゆる環境で動作しますが、セーブデータの容量に制限があります。
		// webcompress ： "web"と同様の形式で、データを圧縮して保存します。セーブ、ロードに時間がかかりますが、"web"よりも保存可能容量が大きいです。
		// file ： PC環境のみで動作します。.sav形式のファイルとしてセーブデータを保存します。PCのストレージ容量が許す限り、容量に制限はありません。
		type: "file",
		// セーブサムネイルのオプション設定
		thumbnail: {
			// セーブ時の画面状態をサムネイルとして出力する場合「true」、サムネイルを生成しない場合「false」
			create: true,
			// サムネイルの横幅、縦幅
			width: 640,
			height: 360,
			// サムネイルの画質：「low」「middle]「high」
			quality: "middle",
		}
	},



	// 開発モードの設定をします。
	develop: {
		// 開発モードのON・OFFを指定します。ONの場合は「true」、OFFの場合は「false」を指定してください。
		mode:  true,
		// 開発モードにおいて、エラー発生時、アラートを表示する場合「true」、アラートが不要である場合「false」を指定して下さい。
		alert: true
	}
};
