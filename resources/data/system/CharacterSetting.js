const characterData = {
	// キャラクター立ち絵のパーツモードを指定します。
	// 以下の三種類から選択してください。
	// "single"：ポーズ表情すべてまとまった一枚の画像で立ち絵を構成します
	// "multi"：複数の画像で立ち絵を構成します（「ポーズと表情差分」「ポーズと服装と表情差分」など）
	partsMode: "multi",

	// ここからはキャラクターの設定です。
	// キャラ名:{
	//     使用する画像の呼称: "画像データのファイル名（拡張子含む）",
	// }
	// の形で定義します。
	// 画像データのファイルは、プロジェクトフォルダの「data」→「fgimage」に配置してください。
	// また「fgimage」内にフォルダを作成して、その内部に画像データを配置することも可能です（以下の例のtaiyakiの指定）。

	// ここで登録した名称が、シナリオファイル内の[charaShow]などのキャラクター関連タグにて使用できるようになります。

	// 以降の「/*」～「*/」の間はキャラクター設定の例ですので、参考にしてください。

	/*
	// partsMode: "single"の場合
	dorayaki: {
		// 「data」→「fgimage」フォルダ内の、「dorayakiNormal.png」という画像が、キャラ『dorayaki』の『normal』という呼称の立ち絵として登録されます。
		normal: "dorayakiNormal.png",
		normalNikoniko: "dorayakiNormalNikoniko.png",
		banzai: "dorayakiBanzai.png"
		banzaiSyonbori: "dorayakiBanzaiSyonbori.png"
	},
	taiyaki: {
		// 「data」→「fgimage」→「taiyaki」フォルダ内の、「normal.png」という画像が、キャラ『taiyaki』の『normal』という呼称の立ち絵として登録されます。
		normal: "taiyaki/normal.png",
		normalNikoniko: "taiyaki/normalNikoniko.png",
		banzai: "taiyaki/banzai.png",
		banzaiSyonbori: "taiyaki/banzaiSyonbori.png"
	},

	// partsMode: "multi"の場合
	// 自由なパーツ名を複数定義できますが、あまりパーツが多すぎると処理が遅くなる可能性があります
	// パーツは定義順に画面に重ねられます（下の例だと、poseが最背面・mouseが最前面となります）
	dorayaki: {
		// ここはポーズの定義
		pose: {
			normal: "dorayakiNormal.png",
			banzai: "dorayakiBanzai.png"
		},
		// ここは表情差分の定義
		face: {
			nikoniko: "dorayakiNikoniko.png",
			syonbori: "dorayakiSyonbori.png"
		}
	},
	taiyaki: {
		pose: {
			normal: "taiyaki/pose/normal.png",
			banzai: "taiyaki/pose/banzai.png"
		},
		face: {
			nikoniko: "taiyaki/face/nikoniko.png",
			syonbori: "taiyaki/face/syonbori.png"
		}
	},

	// partsMode: "multi"の場合2
	dorayaki: {
		pose: {
			normal: "dorayakiNormal.png",
			banzai: "dorayakiBanzai.png"
		},
		cloth: {
			sihuku: "dorayakiSihuku.png",
			seihuku: "dorayakiSeihuku.png"
		},
		eye: {
			nikoniko: "dorayakiEyeNikoniko.png",
			syonbori: "dorayakiEyeSyonbori.png"
		},
		mouse: {
			nikoniko: "dorayakiMouseNikoniko.png",
			syonbori: "dorayakiMouseSyonbori.png"
		}
	},
	taiyaki: {
		pose: {
			normal: "taiyaki/pose/normal.png",
			banzai: "taiyaki/pose/banzai.png"
		},
		cloth: {
			sihuku: "taiyaki/cloth/sihuku.png",
			seihuku: "taiyaki/cloth/seihuku.png"
		},
		eye: {
			nikoniko: "taiyaki/eye/nikoniko.png",
			syonbori: "taiyaki/eye/syonbori.png"
		},
		mouse: {
			nikoniko: "taiyaki/mouse/nikoniko.png",
			syonbori: "taiyaki/mouse/syonbori.png"
		}
	},

	*/
	// test: {
	// 	normal: "testNormal.png",
	// 	angry: "testAngry.png",
	// },
	test: {
		pose: {
			normal: "test/pose/normal.png",
			second: "test/pose/second.png",
		},
		face: {
			angry: "test/face/angry.png",
			sad: "test/face/sad.png"
		}
	},
	// test: {
	// 	pose: {
	// 		normal: "testMulti/pose/normal.png",
	// 	},
	// 	cloth: {
	// 		school: "testMulti/cloth/school.png",
	// 	},
	// 	eye: {
	// 		angry: "testMulti/eye/angry.png",
	// 	},
	// 	mouth: {
	// 		laugh: "testMulti/mouth/laugh.png",
	// 	}
	// },
};
