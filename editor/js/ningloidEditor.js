// // テスト：２窓式
// const {BrowserWindow} = require("electron").remote;
// const windowOptions = require("../game/window_options.js");
// let win = new BrowserWindow(windowOptions);
// win.loadURL(`file://${__dirname}/../game/index.html`);

const ningloidEditor = {
	currentLine: -1,
	init(){
		const windowOption = require("./window_options.js");
		$("#game").css(windowOption.game);

		// 基本レイヤの準備
		ningloid.layer.init();
		// キー・マウスイベントの初期化処理
		ningloid.keyMouse.init();
		// システム系の初期化処理
		ningloid.system.init();
		// キャラ系の初期化処理
		ningloid.character.init();
		ningloid.menu.init();

		document.title = "Ningloid Editor";

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

		// エディタの初期状態はfirst.ks
		$.ajax({
			url: "../resources/data/scenario/first.ks",
			success: (data) => {
				// 取得したテキストをエディタに表示
				editor.setValue(data, -1);
				// シナリオ全文を取得 → 命令配列化
				ningloid.parser.url = "../resources/data/scenario/first.ks";
				this.parser.scenarioArray = $.cloneArray(editor.getSession().getDocument().$lines);
				this.parser.orderArray = ningloid.parser.createOrderArray(this.parser.scenarioArray);
			},
			error: () => {
				// Error
				alert("ファイル[../resources/data/scenario/first.ks]の読み込みに失敗しました。<br>first.ksが実際に存在するかを確認して下さい。");
			}
		});

		// ================================================================
		// ● ゲームへのリアルタイム反映
		// ================================================================

		// エディタ操作のキーバインド
		$("#editor").on({
			mousedown: () => {
				const oldLine = this.currentLine;
				const newLine = editor.getCursorPosition().row;
				// カーソルを順方向（下方向）に移動させた場合
				if(this.currentLine < newLine){
					// エディタのフォーカス行数を更新
					this.currentLine = newLine;
					(async () => {
						ningloid.flag.systemSkipMode = true;
						// フォーカス行までの命令の実行
						await this.parser.playScenario(this.parser.orderArray, oldLine + 1, newLine - 1);

						ningloid.flag.systemSkipMode = false;
						// フォーカス行の命令の実行
						await this.parser.playScenario(this.parser.orderArray, newLine, newLine);
					})();
				}
				// カーソルを逆方向（上方向）に移動させた場合
				else if(this.currentLine > newLine){
					// エディタのフォーカス行数を更新
					this.currentLine = newLine;

					// 復元ラベルを選定
					let labelKey = ningloid.stat.currentLabel;
					let labelLine = ningloid.parser.label.data[ningloid.stat.currentLabel].line;
					if(newLine < labelLine){
						const labelKeys = Object.keys(ningloid.parser.label.data);
						for(let i = labelKeys.length - 1; i >= 0; i--){
							const labelData = ningloid.parser.label.data[labelKeys[i]];
							if(labelData.line < newLine){
								labelKey = labelKeys[i];
								labelLine = labelData.line;
								break;
							}
						}
					}

					const saveKey = `labelSave-${labelKey}`;
					ningloid.system.doLoad(saveKey, false, async () => {
						ningloid.flag.systemSkipMode = true;
						// 復元元のラベルがある行からフォーカス行までの命令の実行
						await this.parser.playScenario(this.parser.orderArray, labelLine+ 1, newLine - 1);

						ningloid.flag.systemSkipMode = false;
						// フォーカス行の命令の実行
						await this.parser.playScenario(this.parser.orderArray, newLine, newLine);
					});
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

ningloidEditor.parser = {
	playScenario: async function(orderArray, startLine, endLine){
		const parser = ningloid.parser;
		parser.line = startLine || 0;

		// 開始行番号から終了行番号までシナリオ実行
		for(let i = parser.line; i <= endLine; i++){
			const order = orderArray[i];

			// 実行中の行数を保存
			parser.line = i + 1;

			// iscriptが実行された場合
			if(parser.tmpScript !== null && !order.includes("[endscript]")){
				parser.tmpScript += order;
				continue;
			}
			// macroが実行された場合
			if(parser.macro.tmpName !== null && !order.includes("[endmacro]")){
				parser.macro.pushOrder(order);
				continue;
			}

			// コメント、メッセージ、ラベルの場合
			if(!$.isArray(order)){
				// 保存
				parser.nextOrder = "";
				await parser.executeOrder(order);
				// 以降の処理実行は不要なので、次のループに進む
				continue;
			}

			const stopFlag = await parser.executePluralOrders(order);
			if(stopFlag === "stop") return;
		}
	},
};

