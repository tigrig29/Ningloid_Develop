/* global NLE: true, Editor: true */

ningloidEditor.editor = {
	// ace.editで作成したエディターオブジェクト
	aceObject: null,
	// 編集から一定時間経過でゲーム実行処理を行うタイマー
	timer: "done",
	// ================================================================
	// ● 初期処理系
	// ================================================================
	init(){
		// エディタ作成
		window.Editor = this.aceObject = ace.edit("editInputArea");
		// 警告消去
		Editor.$blockScrolling = Infinity;
		// 右端折り返し
		Editor.getSession().setUseWrapMode(true);

		// syntax highlight
		const KAGMode = ace.require("ace/mode/kag").Mode;
		Editor.getSession().setMode(new KAGMode());
		Editor.setTheme("ace/theme/kag-dark");

		// エディタの初期状態はfirst.ks
		ningloid.parser.url = "../resources/data/scenario/first.ks";
		this.openFile(ningloid.parser.url, () => {
			// ゲーム画面と、シナリオデータのリセット
			NLE.reset();
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
		$.ajax({
			url: url,
			success: (data) => {
				// 取得したテキストをエディタに表示
				Editor.setValue(data, -1);
				// 編集中フラグをfalse、保存済み状態とする
				this.editEnd();
				this.editSaveDone();
				// コールバック
				if(cb) cb();
			},
			error: () => {
				// Error
				alert(`ファイル[${url}]の読み込みに失敗しました。<br>${url}が実際に存在するかを確認して下さい。`);
			}
		});
	},
	/**
	 * エディタ上のテキストをファイルに保存する
	 * @param  {String}   url ファイル名（パス）
	 * @param  {Function} cb  コールバック
	 */
	saveFile(url, cb){
		const fs = require("fs");
		// ファイルに保存
		fs.writeFile(url, Editor.getValue(), () => {
			// 編集中フラグをfalse、保存済み状態とする
			this.editEnd();
			this.editSaveDone();
			if(cb) cb();
		});
	},
	// ================================================================
	// ● 編集状態管理
	// ================================================================
	editStart(){
		NLE.flag.edit = true;
		$("#editNowCondition").removeClass("edited").addClass("editing");
		$("#editSaveCondition").removeClass("saved").addClass("not-saved");
	},
	editEnd(){
		NLE.flag.edit = false;
		$("#editNowCondition").removeClass("editing").addClass("edited");
	},
	editSaveDone(){
		$("#editSaveCondition").removeClass("not-saved").addClass("saved");
	},

	// ================================================================
	// ● レイヤイベント系
	// ================================================================
	// エディタエリアの操作イベントを付与
	setKeyMouseEvent(){
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
						const newLine = Editor.getCursorPosition().row;
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

			// 開いたファイルのシナリオテキストをエディタ上に展開する
			ningloid.parser.url = filePath;
			NLE.editor.openFile(filePath, () => {
				// ゲーム画面と、シナリオデータのリセット
				NLE.reset();
			});
		});

		// 保存ボタンのクリックイベント
		$("#editSave").on("click", () => {
			// テキストデータの保存
			this.saveFile(ningloid.parser.url, () => {
				// 時限式ゲーム実行が行われた場合は、以下のゲーム実行処理を行わない
				if(this.timer == "done") return;
				// 時限式ゲーム実行のタイマーが待機状態ならば、タイマーを消す
				else if(this.timer){
					clearTimeout(this.timer);
					this.timer = "done";
				}
				// ゲーム画面と、シナリオデータのリセット
				NLE.reset();
				// 命令実行
				NLE.parser.playFocusSectionOrder();
			});
		});
	},

	// ================================================================
	// ● ace（エディタ）イベント系
	// ================================================================
	setAceEvent(){
		Editor.on("change", (e) => {
			// 編集されたらエラーフラグは消す
			NLE.flag.error = false;

			// 編集が繰り返されるうちは、↓のタイマーをリセットする
			if(this.timer !== "done") clearTimeout(this.timer);

			// 編集中フラグをtrueにし、ゲームの実行を止める
			this.editStart();
			// 編集から一定時間が経過したらシナリオ実行
			this.timer = setTimeout(() => {
				if(NLE.flag.edit === false || NLE.flag.error === true) return;
				this.editEnd();
				// ゲーム画面と、シナリオデータのリセット
				NLE.reset();

				// 命令実行（行数などが変わるので、初期ロードから実行させるため、currentLineを更新する）
				NLE.parser.currentLine = this.aceObject.getCursorPosition().row;
				NLE.parser.playFocusSectionOrder();

				// タイマーを消す
				this.timer = "done";
			}, 2000);
		});
	},
};
