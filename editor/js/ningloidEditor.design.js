/* global NLE: true, Editor: true */

ningloidEditor.design = {
	init(){
		this.setEditorStyle();
		// リソースマネージャーエリアのtop, width固定
		$("#resourceManager").css("top", $("#game").height());
		$("#resourceManager").css("width", $("#game").width());
			// リソースマネージャーエリアのheightを画面サイズ追従させる
			$("#resourceManager").css("height", $("body").height() - $("#game").height());

		const remote = require("electron").remote;
		const win = remote.getCurrentWindow();
		win.on("resize", () => {
			// エディタエリアのwidthを画面サイズ追従させる
			this.setEditorStyle();
			// リソースマネージャーエリアのheightを画面サイズ追従させる
			$("#resourceManager").css("height", $("body").height() - $("#game").height());
		});
	},
	/**
	 * ゲーム画面をリサイズする
	 * @param  {Number} width ゲームサイズの横幅（高さは16：9で自動合わせされる）
	 */
	gameResize(width){
		$("#game").css({
			width, height: width * 9 / 16,
		});
		const scale = width / ningloid.config.display.width;
		$("#ningloidBase").css({
			"-webkit-transform": `scale(${scale})`,
			"transform": `scale(${scale})`
		});
	},
	/**
	 * エディタの位置・サイズを、ゲームエリア・ウィンドウサイズに応じて調整する
	 */
	setEditorStyle(){
		const gameWidth = $("#game").width();
		const bodyWidth = $("body").width();

		// ゲームサイズに応じて位置調整
		$("#editor").css("left", gameWidth);
		// ゲームサイズ、ウィンドウサイズに応じてサイズ調整
		$("#editor").css("width", bodyWidth - gameWidth);

		// エディタエリアは個別で高さ調整が必要（ウィンドウサイズ変更時）
		$("#editInputArea").css("height", $("body").height() - 90);// 90は上の要素の合計height
		// ファイルタブエリアは個別で横幅調整が必要（ウィンドウサイズ変更時）
		$("#editFileTab").css("width", bodyWidth - gameWidth - 55);// 55は左の要素の合計width
	},
};
