/* global NLE: true, Editor: true */

ningloidEditor.design = {
	$editActive: null,
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

		// ファイルタブスクローラーのイベント
		$(".editFileTabArrow").on({
			click: (self) => {
				const $self = $(self.currentTarget);
				this.scrollFileTab($self.data("direction"));
			},
		});
		// ファイルタブのイベント
		$("#editFileTab").on({
			click: (self) => {
				const $self = $(self.currentTarget);
				// 変数からデータを読み取って、エディタエリアに表示する
				// activeの更新
				this.activateFileTab($self);
			},
			mouseenter: (e) => {
				// 編集中マークを隠す
				const $target = $(e.currentTarget);
				this.hideEditMarkOnFileTab($target);
			},
			mouseleave: (e) => {
				// 編集中フラグを持っているならば、編集中マークを表示する
				const $target = $(e.currentTarget);
				if($target.attr("editing") == "true") this.showEditMarkOnFileTab($target);
			}
		}, ".fileTab");
		// ファイルタブの閉じるボタンイベント
		$("#editFileTab").on({
			click: (e) => {
				// ファイル閉じる処理
				e.stopPropagation();
			}
		}, ".fileTabCloseButton");
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
	 * カラーテーマを設定する
	 * @param {String} themeName テーマ名称（simple, dark, ...）
	 */
	setTheme(themeName){
		// エディタ上部のテーマ変更
		$("#editFileTabArrowArea").attr("class", "").addClass(`editorTheme-${themeName}`);
		$("#editFileTab").attr("class", "").addClass(`editorTheme-${themeName}`);
		// Aceエディタのテーマ変更
		NLE.editor.changeTheme(themeName);
	},

	// ================================================================
	// ● エディタ系
	// ================================================================
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

	// ================================================================
	// ● エディタ系 - ファイルタブ
	// ================================================================
	/**
	 * ファイルタブを新規挿入する
	 * @param  {String} fileName ファイル名
	 */
	appendFileTab(fileName){
		const fileTabId = `${fileName.split(".")[0]}KS`;
		// 既に開いている場合
		if($(`#${fileTabId}`).length !== 0){
			// タブのアクティブ化
			NLE.design.activateFileTab($(`#${fileTabId}`));
		}
		else{
			// タブの生成
			const $fileTab = $(`<span id="${fileTabId}" class="fileTab">${fileName}</span>`);
			// 編集中/× ボタン
			const $fileTabCloseButton = $("<span class='fileTabCloseButton'><i class='fa fa-close'></i></span>");
			const $fileTabEditButton = $("<span class='fileTabEditButton'><i class='fa fa-pencil'></i></span>");
			$fileTab.append($fileTabCloseButton, $fileTabEditButton);
			// タブをタブエリアに追加
			$("#editFileTab").append($fileTab);
			// タブのアクティブ化
			NLE.design.activateFileTab($fileTab);
		}
	},
	/**
	 * ファイルタブをスクロールする
	 * @param  {String} direction スクロール方向を指定する（left or right）
	 */
	scrollFileTab(direction){
		const $fileTab = $("#editFileTab");
		if(direction == "left") scrollAnimate(-80);
		else if(direction == "right") scrollAnimate(80);
		function scrollAnimate(value){
			let i = 0;
			const id = setInterval(() => {
				$fileTab[0].scrollLeft += value / 10;
				if(++i == 10) clearInterval(id);
			}, 10);
		}
	},
	/**
	 * 指定したファイルタブをアクティブ化する
	 * @param  {$Object} $target アクティブ化するファイルタブのjQueryオブジェクト
	 */
	activateFileTab($target){
		if(this.$editActive) this.$editActive.removeClass("active");
		this.$editActive = $target.addClass("active");
		// エディタエリアを該当ファイルのテキストで更新（未実装）
	},

	// ファイルタブに編集中マークを表示する
	showEditMarkOnFileTab($target){
		$target.attr("editing", "true");
		$target.find(".fileTabCloseButton").hide();
		$target.find(".fileTabEditButton").show();
	},
	// ファイルタブの編集中マークを隠す（ホバー時用）
	hideEditMarkOnFileTab($target){
		$target.find(".fileTabCloseButton").show();
		$target.find(".fileTabEditButton").hide();
	},
	// ファイルタブの編集中マークを消す（保存完了時用）
	removeEditMarkOnFileTab($target){
		$target.attr("editing", "false");
		$target.find(".fileTabCloseButton").show();
		$target.find(".fileTabEditButton").hide();
	},
	// 現在アクティブのファイルタブに編集中マークを表示する
	showEditMarkOnActiveFileTab(){
		const $target = this.$editActive;
		this.showEditMarkOnFileTab($target);
	},
	// 現在アクティブのファイルタブの編集中マークを消去する
	removeEditMarkOnActiveFileTab(){
		const $target = this.$editActive;
		this.removeEditMarkOnFileTab($target);
	},
};
