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
		this.setKeyMouseEvent();

		// エディタの内部状態に関するイベントをセット
		this.setAceEvent();
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
				// 編集中フラグをfalse、保存済み状態とする
				NLE.editFlag = false;
				// コールバック
				if(cb) cb();
			},
			error: () => {
				// Error
				alert(`ファイル[${url}]の読み込みに失敗しました。<br>${url}が実際に存在するかを確認して下さい。`);
			}
		});
	},
	saveFile(url, cb){
		const editor = this.aceObject;
		const fs = require("fs");
		fs.writeFile(url, editor.getValue(), () => {
			// 編集中フラグをfalse、保存済み状態とする
			NLE.editFlag = false;
			if(cb) cb();
		});
	},

	// ================================================================
	// ● レイヤイベント系
	// ================================================================
	// エディタエリアの操作イベントを付与
	setKeyMouseEvent(){
		const editor = this.aceObject;

		// エディタ操作のキーバインド
		$("#editor").on({
			keydown: (e) => {
				if(e.ctrlKey){
					switch(e.keyCode){
						// Ctrl + S
						case 83:
							// 保存
							$("#editSave").click();
							break;
					}
				}
				// 伝播を止めて、ゲームのキーバインドを実行させないようにする
				e.stopPropagation();
			},
			keyup: (e) => {
				switch(e.keyCode){
					// ← ↑ → ↓ キー
					case 37:
					case 38:
					case 39:
					case 40: {
						const newLine = editor.getCursorPosition().row;
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

		// ファイルオープンボタンのクリックイベント
		$("#editLoad").on("click", () => {
			// input要素をクリック
			$("#editFileOpener").get(0).click();
		});
		// input:file要素にて、ファイル選択が行われたときのイベント
		$("#editFileOpener").on("change", function(){
			// 選択されたファイルの絶対パス
			let filePath = this.files[0].path;
			filePath = filePath.replace(/\\/g, "/");
			filePath = `../resources${filePath.split("/resources")[1]}`;
			// ゲームのリセット
			ningloid.resetGame();

			// 開いたファイルのシナリオテキストをエディタ上に展開する
			ningloid.parser.url = filePath;
			NLE.editor.openFile(filePath, () => {
				// シナリオ全文を取得 → 命令配列化
				NLE.parser.scenarioArray = $.cloneArray(NLE.editor.aceObject.getSession().getDocument().$lines);
				NLE.parser.orderArray = ningloid.parser.createOrderArray(NLE.parser.scenarioArray);
				// オートセーブデータを削除
				ningloid.system.autoSave.clear();
			});
		});

		// 保存ボタンのクリックイベント
		$("#editSave").on("click", () => {
			// テキストデータの保存
			this.saveFile(ningloid.parser.url, () => {
				// ゲームの初期化
				ningloid.resetGame();
				// シナリオ全文を取得 → 命令配列化
				NLE.parser.scenarioArray = $.cloneArray(editor.getSession().getDocument().$lines);
				NLE.parser.orderArray = ningloid.parser.createOrderArray(NLE.parser.scenarioArray);
				// オートセーブデータを削除
				ningloid.system.autoSave.clear();
			});
		});
	},

	// ================================================================
	// ● ace（エディタ）イベント系
	// ================================================================
	setAceEvent(){
		this.aceObject.on("change", (e) => {
			// 編集中フラグをtrueにし、ゲームの実行を止める
			NLE.editFlag = true;
		});
	},
};
