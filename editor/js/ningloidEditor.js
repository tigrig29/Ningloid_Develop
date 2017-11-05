// // テスト：２窓式
// const {BrowserWindow} = require("electron").remote;
// const windowOptions = require("../game/window_options.js");
// let win = new BrowserWindow(windowOptions);
// win.loadURL(`file://${__dirname}/../game/index.html`);

const ningloidEditor = {
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

		// エディタデザインの初期化
		this.editor.init();
		this.design.init();
	},
};

const NLE = ningloidEditor;

ningloidEditor.editor = {
	aceObject: null,
	init(){
		// エディタ作成
		const editor = this.aceObject = ace.edit("editInputArea");
		// 警告消去
		editor.$blockScrolling = Infinity;
		// 右端折り返し
		editor.getSession().setUseWrapMode(true);

		// エディタの初期状態はfirst.ks
		ningloid.parser.url = "../resources/data/scenario/first.ks";
		this.openFile(ningloid.parser.url, () => {
			// シナリオ全文を取得 → 命令配列化
			NLE.parser.scenarioArray = $.cloneArray(editor.getSession().getDocument().$lines);
			NLE.parser.orderArray = ningloid.parser.createOrderArray(NLE.parser.scenarioArray);
			// オートセーブデータを削除
			ningloid.system.autoSave.clear();
		});

		// エディターのリアルタイム反映用イベントをセット
		this.setEvent();
	},
	openFile(url, cb){
		const editor = this.aceObject;
		$.ajax({
			url: url,
			success: (data) => {
				// 取得したテキストをエディタに表示
				editor.setValue(data, -1);
				// コールバック
				if(cb) cb();
			},
			error: () => {
				// Error
				alert(`ファイル[${url}]の読み込みに失敗しました。<br>${url}が実際に存在するかを確認して下さい。`);
			}
		});
	},
	setEvent(){
		// エディタ操作のキーバインド
		$("#editor").on({
			keydown: (e) => {
				// 伝播を止めて、ゲームのキーバインドを実行させないようにする
				e.stopPropagation();
			},
			keyup: (e) => {
				switch(e.which){
					// ← ↑ → ↓ キー
					case 37:
					case 38:
					case 39:
					case 40: {
						const newLine = this.aceObject.getCursorPosition().row;
						if(NLE.parser.currentLine != newLine){
							NLE.parser.playSectionOrder();
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
				NLE.parser.playSectionOrder();
			},
		});
	},
};

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
			const filePath = this.files[0].path;
			// ファイルを開く
			$.ajax({
				url: filePath,
				success: (data) => {
					// 取得したテキストをエディタに表示
					NLE.editor.aceObject.setValue(data, -1);
				},
				error: () => {
					// Error
					alert(`ファイル[${filePath}]の読み込みに失敗しました。<br>[${filePath}]が実際に存在するか、打ち間違いがないかを確認して下さい。`);
				}
			});
		});
	},
};

ningloidEditor.parser = {
	currentLine: -1,
	scenarioArray: [],
	orderArray: [],
	playSectionOrder(){
		// 命令実行開始前に、残っているpromiseをクリアする
		// ∵[l]タグなどが実行された後だとpromiseが残ってしまう
		// ※また、jumpタグなどで通常のシナリオ実行が開始されてしまった場合にも、これにより強制終了できる
		// ……だが、jumpタグはバグる（未解決）
		ningloid.stopResolve();

		// 以前のフォーカス行
		const oldLine = this.currentLine;
		// 現在のフォーカス行
		const newLine = NLE.editor.aceObject.getCursorPosition().row;

		// エディタのフォーカス行数を更新
		this.currentLine = newLine;

		// オートセーブデータのリスト（セーブキー、セーブ地点のシナリオ行数を保管したオブジェクト＝オートセーブデータのリスト）
		// saveList = [
		// 		{key: "autoSave-*test", line: 600}, {key: "autoSave-first100", line: 100}, ...
		// ]
		const saveList = ningloid.system.autoSave.list;
		// 以前のフォーカス行 < オートセーブデータ < 現在のフォーカス行
		// となるようなフォーカス移動かを判定
		let i = 0;
		for(; i < saveList.length; i++){
			const saveLine = saveList[i].line;
			if(oldLine < saveLine && saveLine <= newLine) break;
		}
		// 上記の判定がtrueの場合、
		// または 現在のフォーカス行 > 以前のフォーカス行 である（フォーカスを上の行に移動した）場合
		// または 現在のフォーカス行 = 以前のフォーカス行 である（同じ行をクリックした）場合
		if(i < saveList.length || oldLine > newLine || oldLine == newLine){
			// 現在のフォーカス行に最も近いオートセーブデータをロードして、
			// その地点から現在のフォーカス行まで命令を実行する
			this.orderExecuteAfterloadAutoSave(newLine);
		}
		// その他の場合（フォーカスを下に移動させ、かつセーブ地点をまたいでいない場合）
		else{
			// 以前のフォーカスの次の行から、現在のフォーカス行まで命令を実行する
			this.orderExecute(oldLine + 1, newLine);
		}
	},
	playScenario: async function(orderArray, startLine, endLine){
		const parser = ningloid.parser;
		parser.line = startLine || 0;

		// 開始行番号から終了行番号まで命令実行
		for(let i = parser.line; i <= endLine; i++){
			const order = orderArray[i];

			// 実行中の行数を保存
			parser.line = i;

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
	orderExecute: async function(startLine, endLine){
		ningloid.flag.systemSkipMode = true;
		// フォーカス行までの命令の実行（ここまではシステムスキップ＝即時進行）
		await this.playScenario(this.orderArray, startLine, endLine - 1);

		ningloid.flag.systemSkipMode = false;
		// フォーカス行の命令の実行（ここだけ通常速度で実行）
		await this.playScenario(this.orderArray, endLine, endLine);
	},
	orderExecuteAfterloadAutoSave(endLine){
		// オートセーブデータをロードしてから命令実行を行う
		this.loadAutoSave(endLine, (restartLine) => this.orderExecute(restartLine, endLine));
	},
	loadAutoSave(endLine, cb){
		const saveList = ningloid.system.autoSave.list;
		let   restartLine = 0, saveKey = null;

		// 最後の命令の行（現在のフォーカス行）よりも上の行にオートセーブデータがあるかを判定
		for(let saveData of saveList){
			if(saveData.line <= endLine){
				// オートセーブデータが見つかったら、その行数とセーブキーを取得
				restartLine = saveData.line;
				saveKey = saveData.key;
				break;
			}
		}
		// 一致するオートセーブデータがなかった場合
		if(saveKey === null){
			// ゲーム起動時の状態（初期状態）を復元する
			ningloid.resetGame();
			if(cb) cb(restartLine);
		}
		else{
			// セーブキーを元にロード処理を行う
			ningloid.system.doLoad(saveKey, false, () => {
				if(cb) cb(restartLine);
			});
		}
	},
};

