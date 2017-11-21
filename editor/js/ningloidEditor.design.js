/* global NLE: true, Editor: true */

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

		// エディタのテーマset
		this.changeTheme("dark");
	},
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
	changeTheme(themeName){
		Editor.setTheme(`ace/theme/kag-${themeName}`);
	}
};
