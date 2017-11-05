/* global NLE: true */

ningloidEditor.design = {
	init(){
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
	},
};
