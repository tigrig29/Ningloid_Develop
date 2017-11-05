/* global NLE: true */

ningloidEditor.editor = {
	// ace.editで作成したエディターオブジェクト
	aceObject: null,
	// ================================================================
	// ● 初期処理系
	// ================================================================
	init(){
		// エディタ作成
		const editor = this.aceObject = ace.edit("editInputArea");
		// 警告消去
		editor.$blockScrolling = Infinity;
		// 右端折り返し
		editor.getSession().setUseWrapMode(true);

		// エディタの初期状態はfirst.ks
		ningloid.parser.url = "../resources/data/scenario/first.ks";
		this.openFile(ningloid.parser.url, () => {
			// シナリオ全文を取得 → 命令配列化
			NLE.parser.scenarioArray = $.cloneArray(editor.getSession().getDocument().$lines);
			NLE.parser.orderArray = ningloid.parser.createOrderArray(NLE.parser.scenarioArray);
			// オートセーブデータを削除
			ningloid.system.autoSave.clear();
		});

		// エディターのリアルタイム反映用イベントをセット
		this.setEvent();
	},

	// ================================================================
	// ● ファイル操作系
	// ================================================================
	// シナリオファイルを開き、エディタコンテンツ欄にテキストを出力する
	openFile(url, cb){
		const editor = this.aceObject;
		$.ajax({
			url: url,
			success: (data) => {
				// 取得したテキストをエディタに表示
				editor.setValue(data, -1);
				// コールバック
				if(cb) cb();
			},
			error: () => {
				// Error
				alert(`ファイル[${url}]の読み込みに失敗しました。<br>${url}が実際に存在するかを確認して下さい。`);
			}
		});
	},

	// ================================================================
	// ● レイヤイベント系
	// ================================================================
	// エディタエリアの操作イベントを付与
	setEvent(){
		// エディタ操作のキーバインド
		$("#editor").on({
			keydown: (e) => {
				// 伝播を止めて、ゲームのキーバインドを実行させないようにする
				e.stopPropagation();
			},
			keyup: (e) => {
				switch(e.which){
					// ← ↑ → ↓ キー
					case 37:
					case 38:
					case 39:
					case 40: {
						const newLine = this.aceObject.getCursorPosition().row;
						if(NLE.parser.currentLine != newLine){
							NLE.parser.playFocusSectionOrder();
						}
						break;
					}
				}

				// 伝播を止めて、ゲームのキーバインドを実行させないようにする
				e.stopPropagation();
			}
		});
		$("#editInputArea").find(".ace_scroller").on({
			mousedown: () => {
				NLE.parser.playFocusSectionOrder();
			},
		});
	},
};
