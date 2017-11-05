/* global NLE: true */

ningloidEditor.parser = {
	// 現在エディタ上でフォーカスしている行数
	currentLine: -1,
	// 現在エディタで開いているシナリオファイルから作成したシナリオ配列データ
	scenarioArray: [],
	// 現在エディタで開いているシナリオファイルから作成した命令配列データ
	orderArray: [],

	// ================================================================
	// ● 統括系
	// ================================================================
	/**
	 * シナリオデータの「○○行から○○行までの区間」の命令を実行する
	 * エディタ上でフォーカスを移動させた時に実行され、その際の区間は「以前のフォーカス行～現在のフォーカス行」とする
	 */
	playFocusSectionOrder(){
		// 編集中は処理をしない（保存で編集状態が解除される）
		if(NLE.editFlag) return;

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
			this.playOrderAfterLoadAutoSave(newLine);
		}
		// その他の場合（フォーカスを下に移動させ、かつセーブ地点をまたいでいない場合）
		else{
			// 以前のフォーカスの次の行から、現在のフォーカス行まで命令を実行する
			this.highSpeedProceedOrder(oldLine + 1, newLine);
		}
	},


	// ================================================================
	// ● シナリオ実行系
	// ================================================================
	/**
	 * シナリオデータのstartLine行からendLine行までの区間の命令を実行する
	 * @param  {Array}  orderArray シナリオの命令配列データ
	 * @param  {Number} startLine  何行目の命令"から"実行するかを指定する
	 * @param  {Number} endLine    何行目の命令"まで"実行するかを指定する
	 */
	playSectionScenario: async function(orderArray, startLine, endLine){
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
	/**
	 * startLineからendLine直前行の命令までを即時実行し、endLine行の命令を通常実行する
	 * @param  {Number} startLine 何行目の命令"から"実行するかを指定する
	 * @param  {Number} endLine   何行目の命令"まで"実行するかを指定する
	 */
	highSpeedProceedOrder: async function(startLine, endLine){
		ningloid.flag.systemSkipMode = true;
		// フォーカス行までの命令の実行（ここまではシステムスキップ＝即時進行）
		await this.playSectionScenario(this.orderArray, startLine, endLine - 1);

		ningloid.flag.systemSkipMode = false;
		// フォーカス行の命令の実行（ここだけ通常速度で実行）
		await this.playSectionScenario(this.orderArray, endLine, endLine);
	},


	// ================================================================
	// ● ロード系
	// ================================================================
	/**
	 * 現在フォーカス行の直近のオートセーブデータをロードする
	 * @param  {Number}   endLine 何行目の命令"まで"実行するかを指定する
	 * @param  {Function} cb      コールバック
	 */
	loadAutoSaveNearEndLine(endLine, cb){
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
	/**
	 * オートセーブデータのロード後に、オートセーブ実行地点の行からendLineまでの命令を実行する
	 * @param  {Number}   endLine 何行目の命令"まで"実行するかを指定する
	 */
	playOrderAfterLoadAutoSave(endLine){
		// オートセーブデータをロードしてから命令実行を行う
		this.loadAutoSaveNearEndLine(endLine, (restartLine) => this.highSpeedProceedOrder(restartLine, endLine));
	},
};

