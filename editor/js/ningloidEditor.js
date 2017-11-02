// // テスト：２窓式
// const {BrowserWindow} = require("electron").remote;
// const windowOptions = require("../game/window_options.js");
// let win = new BrowserWindow(windowOptions);
// win.loadURL(`file://${__dirname}/../game/index.html`);

const ningloidEditor = {
	currentLine: 0,
	init(){
		const windowOption = require("./window_options.js");
		$("#game").css(windowOption.game);

		ningloid.init();

		this.test();
	},
	test(){
		// エディタエリアのleft固定
		$("#editor").css("left", $("#game").width());
			// エディタエリアのwidthを画面サイズ追従させる
			$("#editor").css("width", $("body").width() - $("#game").width());
		// リソースマネージャーエリアのtop, width固定
		$("#resourceManager").css("top", $("#game").height());
		$("#resourceManager").css("width", $("#game").width());
			// リソースマネージャーエリアのheightを画面サイズ追従させる
			$("#resourceManager").css("height", $("body").height() - $("#game").height());

		const remote = require("electron").remote;
		const win = remote.getCurrentWindow();
		win.on("resize", () => {
			// エディタエリアのwidthを画面サイズ追従させる
			$("#editor").css("width", $("body").width() - $("#game").width());
			// リソースマネージャーエリアのheightを画面サイズ追従させる
			$("#resourceManager").css("height", $("body").height() - $("#game").height());
		});

		// エディタ作成
		const editor = ace.edit("editInputArea");
		// 警告消去
		editor.$blockScrolling = Infinity;
		// 右端折り返し
		editor.getSession().setUseWrapMode(true);

		// フィアルオープンボタンのクリックイベント
		$("#editLoad").on("click", () => {
			// input要素をクリック
			$("#editFileOpener").get(0).click();
		});
		// input:file要素にて、ファイル選択が行われたときのイベント
		$("#editFileOpener").on("change", function(self){
			// 選択されたファイルの絶対パス
			const filePath = this.files[0].path;
			// ファイルを開く
			$.ajax({
				url: filePath,
				success: (data) => {
					// 取得したテキストをエディタに表示
					editor.setValue(data, -1);
				},
				error: () => {
					// Error
					alert(`ファイル[${filePath}]の読み込みに失敗しました。<br>[${filePath}]が実際に存在するか、打ち間違いがないかを確認して下さい。`);
				}
			});
		});

		// ================================================================
		// ● ゲームへのリアルタイム反映
		// ================================================================

		// エディタ操作のキーバインド
		$("#editor").on({
			mousedown: () => {
				const newLine = editor.getCursorPosition().row;
				if(this.currentLine != newLine){
					// エディタのフォーカス行数を更新
					this.currentLine = newLine;
					console.log(this.currentLine)
				}
			},
			keydown: (e) => {
				// 伝播を止めて、ゲームのキーバインドを実行させないようにする
				e.stopPropagation();
			},
			keyup: (e) => {
				const newLine = editor.getCursorPosition().row;
				if(this.currentLine != newLine){
					// エディタのフォーカス行数を更新
					this.currentLine = newLine;
					console.log(this.currentLine)
				}

				// 伝播を止めて、ゲームのキーバインドを実行させないようにする
				e.stopPropagation();
			}
		});
	}
};
