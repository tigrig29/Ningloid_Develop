/* global NLE: true, Editor: true, remote: true, BrowserWindow: true */

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
		this.tabObjects.firstKS = new EditorTab("../resources/data/scenario/first.ks");
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
	// ● 実行状態管理
	// ================================================================
	editStart(){
		NLE.flag.edit = true;
		// 編集中 表示切り替え
		this.previewStop();
		$("#gameControl").find(".non-condition").switchClass("error", "editing", 0);
		// ファイルタブの編集中設定
		NLE.design.showEditMarkOnActiveTabLabel();
	},
	editStop(){
		NLE.flag.edit = false;
		// 実行中/編集中 表示切り替え
		$("#gameControl").find(".non-condition").removeClass("editing");
	},
	previewStart(){
		// if(!NLE.flag.canPreview) return;
		// resolve解除
		$("#clickLayer").click();
		// 実行中/編集中 表示切り替え
		$("#gameControl").find(".non-condition").addClass("preview");
	},
	previewStop(){
		// resolve解除
		$("#clickLayer").click();
		// 実行中/編集中 表示切り替え
		$("#gameControl").find(".non-condition").removeClass("preview");
	},
	errorStart(e){
		NLE.flag.error = true;
		$("#gameControl").find(".non-condition").addClass("error");
		// エラー出力
		$.tagError(e);
		if(ningloid.config.develop.mode === true) console.error(e);
	},
	errorEnd(e){
		NLE.flag.error = false;
		$("#gameControl").find(".non-condition").removeClass("error");
	},
	playStart(){
		NLE.flag.playing = true;
		// 実行中/編集中 表示切り替え
		$("#gameControl").find(".playing").show();
		// 停止ボタンを赤くする
		$("#stopGameOnThis").find("i").css("color", "#C00");
		// エディタ編集不可にする
		$("body").append("<div id='wrapperOnPlayingGame'></div>");
		// 停止処理
		$("#wrapperOnPlayingGame").on("click", () => {
			ningloid.stopResolve();
		});
	},
	playEnd(){
		NLE.flag.playing = false;
		// 実行中/編集中 表示切り替え
		$("#gameControl").find(".playing").hide();
		// 停止ボタンを灰色にする
		$("#stopGameOnThis").find("i").css("color", "#555");
		// エディタ隠しを消す
		$("#wrapperOnPlayingGame").remove();
	},

	completeSave(){
		// ファイルタブの編集中解除
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
						const newLine = this.activeTabObject.getLine();
						if(NLE.parser.currentLine != newLine){
							this.activeTabObject.preview();
						}
						break;
					}
				}

				// 伝播を止めて、ゲームのキーバインドを実行させないようにする
				e.stopPropagation();
			}
		});
		$("#editorArea").on({
			click: () => {
				this.activeTabObject.preview();
			},
		}, ".ace_scroller");

		// = = = = = = = = = = = = = = =
		// 新規タブボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#editButtonNewTab").on("click", () => {
			for(let i = 0; ; i++){
				if(!this.tabObjects[`untitled${i}`]){
					this.tabObjects[`untitled${i}`] = new EditorTab(`untitled${i}`);
					break;
				}
			}
		});

		// = = = = = = = = = = = = = = =
		// ファイルオープンボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#editButtonFileOpen").on("click", () => {
			const Dialog = remote.dialog;
			Dialog.showOpenDialog(null, {
				properties: ["openFile"],
				title: "開く",
				defaultPath: ".",
				filters: [
					{name: "シナリオファイル", extensions: ["ks"]},
				]
			}, (filePaths) => {
				if(!filePaths) return;
				// 選択されたファイルの相対パス
				const filePath = `../resources${filePaths[0].replace(/\\/g, "/").split("/resources")[1]}`;
				// ファイル名と、タブに与えるクラス名
				const fileName = filePath.split("scenario/")[1];
				const key = fileName.replace(".ks", "KS");
				// 既に存在する場合
				if(this.tabObjects[key]){
					$("#editTabLabel").find(`.${key}`).mousedown();
				}
				else this.tabObjects[key] = new EditorTab(filePath);
			});
		});

		// = = = = = = = = = = = = = = =
		// 保存ボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#editButtonOverwriteSave").on("click", () => {
			// 空白タブの保存時
			if(!this.activeTabObject.url.includes("/")){
				// 「名前をつけて保存」ダイアログ
				const Dialog = remote.dialog;
				Dialog.showSaveDialog(null, {
					title: "名前をつけて保存",
					defaultPath: ".",
					filters: [
						{name: "シナリオファイル", extensions: ["ks"]},
					]
				}, (savedFiles) => {
					const Tab = this.activeTabObject;
					// タブの対象ファイルURLを設定
					const filePath = Tab.url = `../resources${savedFiles.replace(/\\/g, "/").split("/resources")[1]}`;
					// タブラベルの表示切り替え
					const fileName = filePath.split("scenario/")[1];
					const oldKey = Tab.fileName;
					const newKey = fileName.replace(".ks", "KS");
					Tab.$parent.switchClass(oldKey, newKey, 0);
					$("#editTabLabel").find(`.${oldKey}`).switchClass(oldKey, newKey, 0).find(".fileName").text(fileName);
					Tab.fileName = fileName;
					// タブオブジェクト保管（key変更）
					this.tabObjects[newKey] = this.tabObjects[oldKey];
				});
			}
			// 通常保存
			else{
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
					this.activeTabObject.preview();
				});
			}
			// focus
			this.activeTabObject.focus();
		});

		// = = = = = = = = = = = = = = =
		// 別名保存ボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#editButtonAnotherSave").on("click", () => {
			const Dialog = remote.dialog;
			Dialog.showSaveDialog(null, {
				title: "別名で保存",
				defaultPath: ".",
				filters: [
					{name: "シナリオファイル", extensions: ["ks"]},
				]
			}, (savedFiles) => {
				// キャンセル時
				if(!savedFiles) return;
				// タブの対象ファイルURLを設定
				const filePath = `../resources${savedFiles.replace(/\\/g, "/").split("/resources")[1]}`;
				// 別名保存
				this.activeTabObject.save(() => {
					// ファイルからタブ作成
					const fileName = filePath.split("scenario/")[1];
					const key = fileName.replace(".ks", "KS");
					this.tabObjects[key] = new EditorTab(filePath);
				}, filePath);
			});
		});

		// = = = = = = = = = = = = = = =
		// 元に戻すボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#editButtonUndo").on("click", () => {
			this.activeTabObject.undo();
			this.activeTabObject.focus();
		});

		// = = = = = = = = = = = = = = =
		// やり直しボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#editButtonRedo").on("click", () => {
			this.activeTabObject.redo();
			this.activeTabObject.focus();
		});

		// = = = = = = = = = = = = = = =
		// ゲーム起動ボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#playGameOnAnother").on("click", () => {
			const windowOptions = require("../game/window_options.js");
			let win = new BrowserWindow(windowOptions);
			win.loadURL(`file://${__dirname}/../game/index.html`);
		});

		// = = = = = = = = = = = = = = =
		// 選択行以降を実行するボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#playGameOnThis").on("click", async () => {
			if(NLE.flag.playing) return;
			NLE.reset();
			// フラグ立てる
			this.playStart();
			const activeEditor = this.getActiveEditor();
			const newLine = activeEditor.getCursorPosition().row;

			const stopFlag = await NLE.parser.skipProceedScenario(0, newLine - 1);
			let order = "";
			if(stopFlag != "stop"){
				order = await ningloid.parser.playScenario(ningloid.parser.orderArray, newLine).catch((e) => {
					$.tagError(e);
					if(ningloid.config.develop.mode === true) console.error(e);
				});
			}
			else{
				alert(`${ningloid.parser.line+1}行目のタグで進行を停止しているため、カーソル行以降を実行することが出来ません。`)
			}
			for(let val of order){
				if(val.includes("@jump") || val.split("jump")[0].replace(/\s/g, "") == "["){
					alert("[jump]タグはプレビュー上での実行に対応していません。");
				}
			}
			// フラグ消す
			this.playEnd();
			// リセット
			NLE.reset();
		});

		// = = = = = = = = = = = = = = =
		// 停止ボタンのクリックイベント
		// = = = = = = = = = = = = = = =
		$("#stopGameOnThis").on("click", () => ningloid.stopResolve());
	},
};

class EditorTab{
	constructor(url){
		// 保存時など、ファイルアクセスのためのURLを保管
		this.url = url;
		this.fileName = url.includes("scenario/") ? url.split("scenario/")[1] : url;
		// シナリオファイルからタブ作成時
		if(url.includes("/")) this.createNewTabByFile(url);
		// 新規空白タブ生成時
		else this.createNewBlankTab(url);
		// 編集時のイベント付与
		this.onChange(() => {
			// 編集が繰り返されるうちは、↓のタイマーをリセットする
			if(NLE.editor.timer !== "done") clearTimeout(NLE.editor.timer);

			// ■編集中フラグをtrueにし、ゲームの実行を止める
			NLE.editor.editStart();
			// 編集から一定時間が経過したらシナリオ実行
			NLE.editor.timer = setTimeout(() => {
				if(NLE.flag.edit === false) return;
				if(NLE.flag.error === true){
					NLE.editor.editStop();
					return;
				}
				// ゲーム画面と、シナリオデータのリセット
				NLE.reset();

				// 命令実行（行数などが変わるので、初期ロードから実行させるため、currentLineを更新する）
				NLE.parser.currentLine = 0;
				this.preview();

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
		const $target = this.$parent = $("<div class='editorInputArea'></div>");
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
	// 空白の新規タブを作成する
	createNewBlankTab(tabName){
		// タブの生成
		this.createNewTab();
		// エディタエリアに判別クラスを与える
		this.$parent.addClass(tabName);

		// ファイル名をタブに表示する
		NLE.design.appendTabLabel(tabName);

		// 保存済み状態とする
		NLE.editor.completeSave();
		// アクティブなエディタとして設定
		this.activate();
	}
	// シナリオファイルを読み取って、エディタに表示する
	createNewTabByFile(url){
		// タブの生成
		this.createNewTab();
		// エディタエリアに判別クラスを与える
		const key = this.fileName.replace(".ks", "KS");
		this.$parent.addClass(key);

		// ファイル名をタブに表示する
		NLE.design.appendTabLabel(this.fileName);
		// ファイルリード
		$.ajax({
			url: url,
			success: (data) => {
				// 取得したテキストをエディタに表示
				this.Editor.setValue(data, -1);
				// 保存済み状態とする
				NLE.editor.completeSave();
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
	// 現在のカーソル行番号を返す
	getLine(){
		return this.Editor.getCursorPosition().row;
	}
	// 表示中のファイルのURLを返す
	getFileUrl(){
		return this.url;
	}

	// ================================================================
	// ● 編集処理系
	// ================================================================
	// undo
	undo(){
		this.Editor.undo();
	}
	// undo
	redo(){
		this.Editor.redo();
	}
	// undoスタック消去
	resetUndoStack(){
		const manager = this.Editor.getSession().getUndoManager();
		manager.reset();
	}
	// 変更イベント設定
	onChange(func){
		this.Editor.on("change", (e) => func(e));
	}
	// 保存
	save(cb, url){
		const fs = require("fs");
		// ファイルに保存
		fs.writeFile(url || this.url, this.Editor.getValue(), () => {
			// ■編集中フラグをfalse、保存済み状態とする
			if(!url){
				NLE.editor.editStop();
				NLE.editor.errorEnd();
				NLE.editor.completeSave();
			}
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
		this.focus();
	}
	// アクティブ解除（他のタブをアクティブにするため、ここのエディタタブを隠す）
	unactivate(){
		this.$parent.hide();
	}
	// エディタをフォーカスする
	focus(){
		this.$parent.find("textarea")[0].focus();
	}
	// 消去（閉じる）
	remove(){
		this.Editor.destroy();
		this.$parent.remove();
		// タブ一覧オブジェクトから消去
		const key = this.fileName.replace(".ks", "KS");
		delete NLE.editor.tabObjects[key];
	}

	// ================================================================
	// ● プレビュー系
	// ================================================================
	preview(){
		// 編集中、エラー発生中は処理をしない（保存で編集状態が解除される）
		if(NLE.flag.edit || NLE.flag.error) return;

		// プレビューフラグがtrueでないと処理しない
		if(!NLE.flag.canPreview) return;

		// プレビュー実行表示
		NLE.editor.previewStart();

		// 現在のフォーカス行
		const newLine = this.getLine();
		NLE.parser.playFocusSectionOrder(newLine);
	}
}
