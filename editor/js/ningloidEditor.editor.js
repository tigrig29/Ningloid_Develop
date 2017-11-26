/* global NLE: true, Editor: true */

ningloidEditor.editor = {
	// 使用中のエディタオブジェクト一覧
	tabObjects: {},
	// 現在操作中のエディタオブジェクト
	activeTabObject: null,
	// 編集から一定時間経過でゲーム実行処理を行うタイマー
	timer: "done",
	// ================================================================
	// ● 初期処理系
	// ================================================================
	init(){
		NLE.editor.tabObjects.firstKS = new EditorTab("../resources/data/scenario/first.ks");
		// エディターのリアルタイム反映用イベントをセット
		this.setKeyMouseEvent();

		// エディタのテーマset
		NLE.design.setTheme("dark");
	},
	// ================================================================
	// ● 取得系
	// ================================================================
	getActiveEditor(){
		return this.activeTabObject.getEditor();
	},
	// ================================================================
	// ● 編集状態管理
	// ================================================================
	editStart(){
		NLE.flag.edit = true;
		// 実行中/編集中 表示切り替え
		$("#previewCondition").removeClass("playing error").addClass("editing");
		// ファイルタブの編集中設定
		NLE.design.showEditMarkOnActiveTabLabel();
	},
	editEnd(){
		NLE.flag.edit = false;
		// 実行中/編集中 表示切り替え
		$("#previewCondition").removeClass("editing error").addClass("playing");
	},
	editSaveDone(){
		// ファイルタブの編集中設定
		NLE.design.removeEditMarkOnActiveTabLabel();
	},


	// ================================================================
	// ● シンタックスハイライト
	// ================================================================
	changeTheme(themeName){
		for(let url in this.tabObjects){
			const editor = this.tabObjects[url].getEditor();
			editor.setTheme(`ace/theme/kag-${themeName}`);
		}
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
						const activeEditor = this.getActiveEditor();
						const newLine = activeEditor.getCursorPosition().row;
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
		$("#editorArea").on({
			mousedown: () => {
				NLE.parser.playFocusSectionOrder();
			},
		}, ".ace_scroller");

		// ファイルオープンボタンのクリックイベント
		$("#editLoad").on("click", () => {
			// input要素をクリック
			$("#editFileOpener").get(0).click();
		});
		// input:file要素にて、ファイル選択が行われたときのイベント
		$("#editFileOpener").on("change", (e) => {
			const fileOpener = e.currentTarget;
			// 選択されたファイルの絶対パス
			let filePath = fileOpener.files[0].path;
			filePath = filePath.replace(/\\/g, "/");
			filePath = `../resources${filePath.split("/resources")[1]}`;
			// ファイル名と、タブに与えるクラス名
			const fileName = filePath.split("scenario/")[1];
			const key = `${fileName.split(".")[0]}KS`;
			// 既に存在する場合
			if(this.tabObjects[key]){
				$("#editTabLabel").find(`.${key}`).mousedown();
			}
			else this.tabObjects[key] = new EditorTab(filePath);
			// 同じファイルを連続で指定すると"change"イベントが反応しなくなるので、履歴を消しておく
			fileOpener.value = "";
		});

		// 保存ボタンのクリックイベント
		$("#editSave").on("click", () => {
			// エラーフラグは消す
			NLE.flag.error = false;

			// テキストデータの保存
			this.activeTabObject.save(() => {
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
};

class EditorTab{
	constructor(url){
		// 保存時など、ファイルアクセスのためのURLを保管
		this.url = url;
		// 新規タブ作成
		this.createNewTabByFile(url);
		// 編集時のイベント付与
		this.onChange(() => {
			// 編集が繰り返されるうちは、↓のタイマーをリセットする
			if(NLE.editor.timer !== "done") clearTimeout(NLE.editor.timer);

			// 編集中フラグをtrueにし、ゲームの実行を止める
			NLE.editor.editStart();
			// 編集から一定時間が経過したらシナリオ実行
			NLE.editor.timer = setTimeout(() => {
				if(NLE.flag.edit === false || NLE.flag.error === true) return;
				// ゲーム画面と、シナリオデータのリセット
				NLE.reset();

				// 命令実行（行数などが変わるので、初期ロードから実行させるため、currentLineを更新する）
				NLE.parser.currentLine = this.Editor.getCursorPosition().row;
				NLE.parser.playFocusSectionOrder();

				// タイマーを消す
				NLE.editor.timer = "done";
			}, 2000);
		});
	}
	// ================================================================
	// ● 初期処理系
	// ================================================================
	// エディタを作成する
	createNewTab(){
		// エディタエリア作成
		const $target = this.$parent = $("<div class='newEditorTab editorInputArea'></div>");
		$("#editorArea").append($target);
		// エディタ作成
		const Editor = this.Editor = ace.edit($target.get(0));
		// 警告消去
		Editor.$blockScrolling = Infinity;
		// 右端折り返し
		Editor.getSession().setUseWrapMode(true);

		// syntax highlight
		const KAGMode = ace.require("ace/mode/kag").Mode;
		Editor.getSession().setMode(new KAGMode());
		Editor.setTheme(`ace/theme/kag-${NLE.design.colorTheme}`);
	}
	// シナリオファイルを読み取って、エディタに表示する
	createNewTabByFile(url){
		// タブの生成
		this.createNewTab();
		// エディタエリアに判別クラスを与える
		const fileName = url.split("scenario/")[1];
		const key = `${fileName.split(".")[0]}KS`;
		this.$parent.removeClass("newEditorTab").addClass(key);

		// ファイル名をタブに表示する
		NLE.design.appendTabLabel(fileName);
		// ファイルリード
		$.ajax({
			url: url,
			success: (data) => {
				// 取得したテキストをエディタに表示
				this.Editor.setValue(data, -1);
				// 編集中フラグをfalse、保存済み状態とする
				NLE.editor.editEnd();
				NLE.editor.editSaveDone();
				// アクティブなエディタとして設定
				this.activate();
				// 初回表示時のエディタundoスタックは不要なので消す
				setTimeout(() => this.resetUndoStack(), 100);
			},
			error: () => {
				// Error
				alert(`ファイル[${url}]の読み込みに失敗しました。<br>${url}が実際に存在するかを確認して下さい。`);
			}
		});
	}

	// ================================================================
	// ● 取得系
	// ================================================================
	// エディタオブジェクトを返す
	getEditor(){
		return this.Editor;
	}
	// エディタセッションを返す
	getSession(){
		return this.Editor.getSession();
	}
	getFileUrl(){
		return this.url;
	}

	// ================================================================
	// ● 編集処理系
	// ================================================================
	// undoスタック消去
	resetUndoStack(){
		const manager = this.Editor.getSession().getUndoManager();
		manager.reset();
	}
	// 変更イベント設定
	onChange(func){
		this.Editor.on("change", (e) => func(e));
	}
	// 保存完了
	save(cb){
		const fs = require("fs");
		// ファイルに保存
		fs.writeFile(this.url, this.Editor.getValue(), () => {
			// 編集中フラグをfalse、保存済み状態とする
			NLE.editor.editEnd();
			NLE.editor.editSaveDone();
			if(cb) cb();
		});
	}

	// ================================================================
	// ● 表示処理系
	// ================================================================
	// タブのアクティブ化（ファイルタブエリアのデザイン変化、エディタエリアの更新
	activate(){
		// activeTabObject更新
		if(NLE.editor.activeTabObject) NLE.editor.activeTabObject.unactivate();
		NLE.editor.activeTabObject = this;
		// シナリオ更新
		ningloid.parser.url = this.url;
		// ゲーム画面と、シナリオデータのリセット
		NLE.reset();
		// 表示
		this.$parent.show();

		// エディタをフォーカスする
		this.$parent.find("textarea")[0].focus();
	}
	// アクティブ解除（他のタブをアクティブにするため、ここのエディタタブを隠す）
	unactivate(){
		this.$parent.hide();
	}
	// 消去（閉じる）
	remove(){
		this.Editor.destroy();
		this.$parent.remove();
		// タブ一覧オブジェクトから消去
		const fileName = this.url.split("scenario/")[1];
		const key = `${fileName.split(".")[0]}KS`;
		delete NLE.editor.tabObjects[key];
	}

}
