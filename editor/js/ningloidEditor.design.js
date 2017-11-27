/* global NLE: true, Editor: true */

ningloidEditor.design = {
	$editActive: null,
	colorTheme: "dark",
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
		$(".editTabLabelArrow").on({
			mousedown: (self) => {
				const $self = $(self.currentTarget);
				this.scrollTabLabel($self.data("direction"));
			},
		});
		// タブラベルエリアのスクロールイベント
        const mousewheelevent = "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
		$("#editTabLabel").on(mousewheelevent, (e) => {
			const delta = e.originalEvent.deltaY;
			// 上スクロール
			if(delta < 0) $("#editTabLabelArrowLeft").mousedown();
			// 下スクロール
			else $("#editTabLabelArrowRight").mousedown();
		});
		// タブラベル本体のイベント
		$("#editTabLabel").on({
			mousedown: (self) => {
				const $self = $(self.currentTarget);
				// activeの更新（タブラベルのデザイン）
				this.activateTabLabel($self);
				// activeの更新（エディタエリアの表示）
				const key = $self.attr("class").replace(/tabLabel|active|\s/g, "");
				NLE.editor.tabObjects[key].activate();
			},
			mouseenter: (e) => {
				// 編集中マークを隠す
				const $target = $(e.currentTarget);
				this.hideEditMarkOnTabLabel($target);
			},
			mouseleave: (e) => {
				// 編集中フラグを持っているならば、編集中マークを表示する
				const $target = $(e.currentTarget);
				if($target.attr("editing") == "true") this.showEditMarkOnTabLabel($target);
			}
		}, ".tabLabel");
		// タブラベルの閉じるボタンイベント
		$("#editTabLabel").on({
			click: (e) => {
				const $target = $(e.currentTarget).parent();
				const key = $target.attr("class").replace(/tabLabel|active|\s/g, "");
				// 編集中の場合
				if($target.attr("editing") == "true"){
					$.confirm({
						icon: "fa fa-warning",
						title: "",
						content: `"${key.replace("KS", ".ks")}"に対する変更を保存しますか？`,
						smoothContent: false,
						type: "orange",
						boxWidth: "50%",
						useBootstrap: false,
						buttons: {
							save: {
								text: "保存(<u>S</u>)",
								keys: ["s"],
								action: () => {
									NLE.editor.activeTabObject.save(() => this.removeTabLabel($target));
								}
							},
							unsave: {
								text: "保存しない(<u>N</u>)",
								keys: ["n"],
								action: () => this.removeTabLabel($target)
							},
							cancel: {
								text: "キャンセル(<u>ESC</u>)",
								keys: ["esc"],
								action: () => {}
							},
						}
					});
				}
				else this.removeTabLabel($target);

				e.stopPropagation();
			},
			mousedown: (e) => {
				e.stopPropagation();
			}
		}, ".tabLabelCloseButton");
		// タブラベルのドラッグイベント
		$("#editTabLabel").find("table").sortable({
			axis: "x",
			revert: 100,
			opacity: 0.5,
			change: (e, ui) => {
				// ドロップ先を紫色にハイライト
				ui.placeholder.css({
					background: "rgba(128, 0, 128, 0.3)",
					visibility: "visible",
				});
			}
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
		$("#editorArea").css("height", $("body").height() - $("#editButtonArea").height() - $("#editTabLabel").height());
		// ファイルタブエリアは個別で横幅調整が必要（ウィンドウサイズ変更時）
		$("#editTabLabel").css("width", bodyWidth - gameWidth - $("#editTabLabelArrowArea").width());// 55は左の要素の合計width
	},
	/**
	 * カラーテーマを設定する
	 * @param {String} themeName テーマ名称（simple, dark, ...）
	 */
	setTheme(themeName){
		this.colorTheme = themeName;
		// エディタ各エリアのテーマ変更
		$("#editTabLabelArrowArea").attr("class", "").addClass(`editorTheme-${themeName}`);
		$("#editTabLabel").attr("class", "").addClass(`editorTheme-${themeName}`);
		$("#editorArea").attr("class", "").addClass(`editorTheme-${themeName}`);
		// Aceエディタのテーマ変更
		NLE.editor.changeTheme(themeName);
	},

	// ================================================================
	// ● エディタ系 - ファイルタブ
	// ================================================================
	/**
	 * ファイルタブを新規挿入する
	 * @param  {String} fileName ファイル名
	 */
	appendTabLabel(fileName){
		const tabLabelId = fileName.replace(".ks", "KS");
		// 既に開いている場合
		if($("#editTabLabel").find(`.${tabLabelId}`).length !== 0){
			// タブのアクティブ化
			NLE.design.activateTabLabel($("#editTabLabel").find(`.${tabLabelId}`));
		}
		else{
			// タブの生成
			const $tabLabel = $(`<td class="tabLabel ${tabLabelId}">${fileName}</td>`);
			// 編集中/× ボタン
			const $tabLabelCloseButton = $("<span class='tabLabelCloseButton'><i class='fa fa-close'></i></span>");
			const $tabLabelEditButton = $("<span class='tabLabelEditButton'><i class='fa fa-pencil'></i></span>");
			$tabLabel.append($tabLabelCloseButton, $tabLabelEditButton);
			// タブをタブエリアに追加
			if($("#editTabLabel").find(".active").length != 0){
				// アクティブなタブが存在する場合は、その隣に追加する
				$("#editTabLabel").find(".active").after($tabLabel);
			}
			else $("#editTabLabel").find("table").append($tabLabel);
			// タブのアクティブ化
			NLE.design.activateTabLabel($tabLabel);
		}
	},
	/**
	 * ファイルタブをスクロールする
	 * @param  {String} direction スクロール方向を指定する（left or right）
	 */
	scrollTabLabel(direction){
		const $tabLabel = $("#editTabLabel");
		if(direction == "left") scrollAnimate(-80);
		else if(direction == "right") scrollAnimate(80);
		function scrollAnimate(value){
			let i = 0;
			const id = setInterval(() => {
				$tabLabel[0].scrollLeft += value / 10;
				if(++i == 10) clearInterval(id);
			}, 10);
		}
	},
	/**
	 * 指定したファイルタブをアクティブ化する
	 * @param  {$Object} $target アクティブ化するファイルタブのjQueryオブジェクト
	 */
	activateTabLabel($target){
		if(this.$editActive){
			// this.$editActive.removeClass("active");
			$("#editTabLabel").find(".old-active").removeClass("old-active");
			this.$editActive.switchClass("active", "old-active", 0);
		}
		this.$editActive = $target.addClass("active");

		// 対象のタブがエリアの端からはみ出している場合、見える位置までスクロールする
		// 左はみ出し
		const leftOverPixel = $target.offset().left - ($("#game").width() + $("#editTabLabelArrowArea").width());
		if(leftOverPixel < 0) $("#editTabLabel")[0].scrollLeft += leftOverPixel;
		// 右はみ出し（数値「20」はpaddingの値）
		const rightOverPixel = $target.offset().left + $target.width() + 20 - $("body").width();
		if(rightOverPixel > 0) $("#editTabLabel")[0].scrollLeft += rightOverPixel;
	},
	removeTabLabel($target){
		const key = $target.attr("class").replace(/tabLabel|old-active|active|\s/g, "");
		// エディタの削除
		NLE.editor.tabObjects[key].remove();
		// タブラベルの削除
		$target.remove();
		// 他のタブが存在している場合
		if(Object.keys(NLE.editor.tabObjects).length != 0){
			// フォーカスする（フォーカスによりリセット実行される）
			if($("#editTabLabel").find(".old-active").length != 0) $("#editTabLabel").find(".old-active").mousedown();
			else $("#editTabLabel").find(".tabLabel").eq(0).mousedown();
		}
		// リセットのみ実行
		else NLE.reset();
	},

	// ファイルタブに編集中マークを表示する
	showEditMarkOnTabLabel($target){
		$target.attr("editing", "true");
		$target.find(".tabLabelCloseButton").hide();
		$target.find(".tabLabelEditButton").show();
	},
	// ファイルタブの編集中マークを隠す（ホバー時用）
	hideEditMarkOnTabLabel($target){
		$target.find(".tabLabelCloseButton").show();
		$target.find(".tabLabelEditButton").hide();
	},
	// ファイルタブの編集中マークを消す（保存完了時用）
	removeEditMarkOnTabLabel($target){
		$target.attr("editing", "false");
		$target.find(".tabLabelCloseButton").show();
		$target.find(".tabLabelEditButton").hide();
	},
	// 現在アクティブのファイルタブに編集中マークを表示する
	showEditMarkOnActiveTabLabel(){
		const $target = this.$editActive;
		this.showEditMarkOnTabLabel($target);
	},
	// 現在アクティブのファイルタブの編集中マークを消去する
	removeEditMarkOnActiveTabLabel(){
		const $target = this.$editActive;
		this.removeEditMarkOnTabLabel($target);
	},
};
