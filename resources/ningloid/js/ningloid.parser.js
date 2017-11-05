
// ================================================================
// Parser：KSファイルを読み取って、命令を解析・実行していくための処理群
// ================================================================
ningloid.parser = {
	url: "",// 実行中のファイル名（アドレス）
	line: 0,// 実行中の行数

	scenarioArray: [],// 実行中のファイルの全テキスト（改行ごとの配列）
	orderArray: [],// 上記全テキストからタグやコメントなどのorderを一つずつに分裂し、それを配列化したもの
	nextOrder: [],// 次に実行する予定の命令

	order: "",// 実行した命令
	orderObj: {},// 実行した命令（オブジェクトとして保存）

	tmpScript: null,// iscript実行時にtrueとなり、一時的にJavascriptコードを保管する変数

	// ================================================================
	// ● 初期処理
	// ================================================================
	init(){
		this.playScenarioByFile("../resources/data/scenario/first.ks");
	},

	// ================================================================
	// ● シナリオ実行系
	// ================================================================
	/**
	 * 渡されたアドレス先のシナリオファイルを読み取り、その命令を一つずつ読み取って実行する
	 * @param  {String} url       読み取る対象のシナリオファイルへのアドレス
	 * @param  {Number} line      命令の実行を開始する行番号を指定する
	 * @param  {Array}  nextOrder 通常の命令実行を始める前に、実行しておく命令がある場合に指定する
	 *                            ※主にロード時に利用する
	 */
	playScenarioByFile(url, line, nextOrder){
		this.loadScenario(url).then((orderArray) => {
			return this.playScenario(orderArray, line, nextOrder);
		}).catch((e) => {
			$.tagError(e);
			if(ningloid.config.develop.mode === true) console.error(e);
		});
	},
	/**
	 * 既に作成済みであるシナリオ命令格納配列から、命令を一つずつ読み取って実行する
	 * @param  {Number} line      命令の実行を開始する行番号を指定する
	 * @param  {Array}  nextOrder 通常の命令実行を始める前に、実行しておく命令がある場合に指定する
	 *                            ※主にロード時に利用する
	 */
	playScenarioByCache(line, nextOrder){
		this.playScenario(this.orderArray, line, nextOrder).catch((e) => {
			$.tagError(e);
			if(ningloid.config.develop.mode === true) console.error(e);
		});
	},
	/**
	 * 渡されたシナリオ命令格納配列から命令を一つずつ読み取って実行する
	 * @param  {Array}  orderArray 実行する命令すべてを格納した配列
	 * @param  {Number} line       命令の実行を開始する行番号を指定する
	 * @param  {Array}  nextOrder  通常の命令実行を始める前に、実行しておく命令がある場合に指定する
	 *                             ※主にロード時に利用する
	 */
	playScenario: async function(orderArray, line, nextOrder){
		this.line = line || 0;

		// ロード時用：残りの命令を実行する
		if($.isArray(nextOrder)){
			await this.executePluralOrders(nextOrder);
		}

		// 通常の命令実行
		for(let i = this.line; i < orderArray.length; i++){
			const order = orderArray[i];
			// 実行中の行数を保存
			this.line = i;

			// iscriptが実行された場合
			if(this.tmpScript !== null && !order.includes("[endscript]")){
				this.tmpScript += order;
				continue;
			}
			// macroが実行された場合
			if(this.macro.tmpName !== null && !order.includes("[endmacro]")){
				this.macro.pushOrder(order);
				continue;
			}

			// コメント、メッセージ、ラベルの場合
			if(!$.isArray(order)){
				// 保存
				this.nextOrder = "";
				await this.executeOrder(order);
				// 以降の処理実行は不要なので、次のループに進む
				continue;
			}

			const stopFlag = await this.executePluralOrders(order);
			if(stopFlag === "stop") return;
		}
	},

	// ================================================================
	// ● ファイルオープン系
	// ================================================================
	/**
	 * シナリオファイルを開き、行毎に分割した配列を返す
	 * @param  {String} url シナリオファイルのアドレス
	 * @return {Promise}    Promise
	 */
	fetchText(url){
		let scenarioArray = [];
		const p = new Promise((resolve, reject) => {
			$.ajax({
				url,
				success: (data) => {
					// 一行ずつ配列に保存
					scenarioArray = data.split(/\r\n|\n/);
					// 配列を返す
					resolve(scenarioArray);
				},
				error: () => {
					// Error
					reject(`ファイル[${url}]の読み込みに失敗しました。<br>[${url}]が実際に存在するか、打ち間違いがないかを確認して下さい。`);
				}
			});
		});
		return p;
	},
	/**
	 * シナリオファイルを読み取り、シナリオ行毎配列、命令格納配列を作成する
	 * @param  {String} url シナリオファイルのアドレス
	 * @return {Array}      シナリオファイル内の命令を全て格納した配列
	 */
	loadScenario: async function(url){
		this.url = url;
		// シナリオファイルを読み取り、実行用の配列を作成
		this.scenarioArray = await this.fetchText(this.url);
		this.orderArray = this.createOrderArray(this.scenarioArray);
		return this.orderArray;
	},

	// ================================================================
	// ● 命令準備系
	// ================================================================
	/**
	 * 命令の種別を判定して返す
	 * @param  {String} order     実行する命令
	 * @return {String} orderType 実行する命令の種別："message", "tag", "comment", "etc"
	 */
	assortOrderType(order){
		// 一行の先頭文字を取得
		const firstChar = order.substring(0, 1);
		let OrderType = "message";
		const tagPatterns = ["@", "["];
		const commentPatterns = [";", "// ", "/*"];
		const etcPatterns = ["#"];
		// 先頭文字が
		// tagPatternsに一致するならタグ
		if(tagPatterns.includes(firstChar)) OrderType = "tag";
		// commentPatternsに一致するならコメント
		else if(commentPatterns.includes(firstChar)) OrderType = "comment";
		// ラベル
		else if(firstChar == "*") OrderType = "label";
		else if(etcPatterns.includes(firstChar)) OrderType = "etc";
		return OrderType;
	},
	/**
	 * 受け取ったシナリオテキスト配列（ファイル全文を行ごとに分割したもの）を、更に命令ごとに分割した配列に変換する
	 * @param  {Array} scenarioArray シナリオテキスト配列
	 * @return {Array} orderArray    ファイル内のシナリオを行毎、そして命令ごとに分割した配列
	 *                               ※基本的には行毎の配列だが、行内にタグ命令が存在する場合は二次元配列となる
	 *                               例：[
	 *                               	"あいうえお",// 1行目
	 *                               	["@l"],// 2行目
	 *                               	["[cm]","[l]", "[cm]"],// 3行目
	 *                               	["かきくけこ", "[message_config]"]// 4行目
	 *                               ]
	 */
	createOrderArray(scenarioArray){
		let tagPart = null;
		let orderArray = [];
		let val = null;
		// 一行ずつ処理
		for(let i = 0; i < scenarioArray.length; i++){
			// 行頭の空白とタブを削除する
			scenarioArray[i] = scenarioArray[i].replace(/^\s+|^\t+/g, "");

			val = scenarioArray[i];
			const firstChar = val.substring(0, 1);
			// コメントの場合はそのままで良い（Return配列にそのまま値を返す）
			if(firstChar == ";") orderArray[i] = val;
			// タグは配列にする
			else if(firstChar == "@") orderArray[i] = [val];
			// ラベルはそのまま渡す（また、ラベルの補完処理を行う）
			else if(firstChar == "*"){
				// ラベル名称と行数の保管
				const labelData = val.split("|");
				this.label.data[labelData[0]] = {
					line: i, name: labelData[1]
				};
				orderArray[i] = val;
			}
			// []式のタグ記述でテキストと混合している場合、配列化する（結果として2次元配列になる）
			// []式のタグの場合（ここが複雑）
			else if(val.includes("[")){
				// 複数のタグが一行に記述されるケースがあるため、[]毎に区切って配列化する
				orderArray[i] = val.split(/(\[.*?\])/);
				// 空の要素が生成されてしまうので、削除しておく
				for(let j = 0; j < orderArray[i].length; j++){
					if(orderArray[i][j] == "") orderArray[i].splice(j, 1);
				}
				// タグが行をまたいでいる場合（行中に [ があって、] がない場合）
				if(String(orderArray[i].slice(-1)).includes("[") && !String(orderArray[i].slice(-1)).includes("]")){
					// タグの前半部（[ ~~~）が保管された配列を保持する
					tagPart = orderArray[i];
					// タグの終端（]）が見つかるまで、次の配列をチェックしていく
					while(!scenarioArray[++i].includes("]")){
						// tagPart配列の一番後ろの要素 = タグの前半部（[ ~~~）に値を挿入していく
						tagPart[tagPart.length - 1] += ` ${scenarioArray[i]}`;
						// 挿入した代わりに、ここの配列の値は空にする
						orderArray[i] = "";
					}
					// タグの終端が見つかったら、終端記号までtagPartに挿入
					tagPart[tagPart.length - 1] += ` ${scenarioArray[i].split(/(^.*?\])/)[1]}`;
					// 挿入した代わりに、ここの配列の終端記号まで（~~~ ]）は除去する
					scenarioArray[i] = scenarioArray[i].replace(/^.*?\]/g, "");
					// ↑ここの配列の残り部分（]記号以降）から再度処理していくため、配列ナンバーをデクリメント
					i--;
				}
			}
			// 文章のみ、その他の場合
			else orderArray[i] = val;
		}
		return orderArray;
	},

	// ================================================================
	// ● 命令実行系
	// ================================================================
	/**
	 * 命令を解析して実行する
	 * @param  {String} order    実行する命令
	 * @return {String} stopFlag 一行ずつ全文の実行をすることを前提に、全文実行をキャンセルする必要がある場合に"stop"となる
	 *                           "stop"はタグの処理のresolve()の引数に渡すことでここに届けることができる
	 */
	executeOrder: async function(order){
		this.order = order;
		// 命令の解析と実行
		if(order == ""){
			this.orderObj = "";
			return;
		}
		// タグ・テキスト（メッセージ）・コメントに仕分ける
		// ※後ほど、ラベルと発言者を追加
		const orderType = this.assortOrderType(order);

		// ログ用の命令データオブジェクトだが、tag以外の場合にはオブジェクトを渡す必要が無いので、Typeを渡す
		if(orderType != "tag"){
			this.orderObj = orderType;
			// 実行した命令をログに表示（tag以外はここで、tagの場合はtag.execute内でログ表示処理を行う）
			$.orderLog();
		}

		if(orderType != "label"){
			// オートセーブの実行判定 → trueなら実行
			// ※labelの場合は、label.executeでセーブ処理を行うため不要
			if(ningloid.system.autoSave.judge()){
				// saveKeyは、file名+行数
				// 例：first100 → 「first.ksの100行目」
				let saveKey = this.url.split("/");
				saveKey = saveKey[saveKey.length - 1].split(".")[0];
				saveKey = `${saveKey}${this.line}`;
				// オートセーブの実行
				ningloid.system.autoSave.execute(`autoSave-${saveKey}`);
			}
		}

		// 命令の実行、stopFlagの受取
		const stopFlag = this[orderType] ? await this[orderType].execute(order) : null;

		// 現在のシナリオファイル全文実行から抜け出す必要がある場合（[s]や[jump]で一行ずつの実行がキャンセルになる場合）
		// soptFlagには"stop"が渡る
		return stopFlag;
	},
	/**
	 * 複数の命令を格納した配列から、命令を解析して実行する
	 * @param  {Array}  arrayOfOrder 実行する命令を複数格納した配列
	 * @return {String} stopFlag     一行ずつ全文の実行をすることを前提に、全文実行をキャンセルする必要がある場合に"stop"となる
	 *                               "stop"はタグの処理のresolve()の引数に渡すことでここに届けることができる
	 */
	executePluralOrders: async function(arrayOfOrder){
		// 次に実行する命令を保存
		this.nextOrder = $.cloneArray(arrayOfOrder);
		// 配列要素を一つずつ取得
		for(let order of arrayOfOrder){
			// 命令の実行
			const stopFlag = await this.executeOrder(order);
			// 次に実行する命令から、今実行した命令を削除する
			if(this.nextOrder.length !== 0) this.nextOrder.shift();
			// 現在のシナリオファイル全文実行から抜け出す必要がある場合（[s]や[jump]で一行ずつの実行がキャンセルになる場合）
			// soptFlagには"stop"が渡り、ループから抜け出す
			if(stopFlag === "stop") return stopFlag;
		}
	},

	// ================================================================
	// ● タグ実行系
	// ================================================================
	tag: {
		/**
		 * タグの実行
		 * @param  {String} order    実行する命令
		 * @return {String} stopFlag シナリオ停止処理を行うタグの場合、trueが渡される
		 */
		execute: async function(order){
			const tagObject = this.createTagObject(this.splitOrder(order));
			const orderName = tagObject.name;
			const orderParam = tagObject.parameter;

			const parser = ningloid.parser;

			// タグのcondパラメータ評価（式を評価して、trueならタグを実行、falseならば実行しないというパラメータ）
			if(orderParam.cond){
				const condFlag = ningloid.evalScript(orderParam.cond);
				if(!condFlag) return;
			}

			// マクロで定義したタグの実行
			if(Object.keys(parser.macro.data).includes(orderName)){
				// ログ表示
				parser.orderObj = {name: orderName, parameter: orderParam};
				$.orderLog();
				// 非同期処理でマクロ実行
				const stopFlag = await parser.macro.execute(tagObject);
				return stopFlag;
			}

			// 指定したタグが見つからない場合のエラー処理
			if(!ningloid.tag[orderName]) throw new Error(`タグ[${orderName}]は存在しません`);

			// 受け取ったパラメータに、タグのデフォルトパラメータをマージする
			const pm = $.extend({}, ningloid.tag[orderName].pm, orderParam);

			// ログ表示
			parser.orderObj = {name: orderName, parameter: pm};
			$.orderLog();

			// タグVitalチェックで引っかかったら停止
			if(!this.getExistanceOfVital(tagObject)){
				// エラー
				throw new Error(`タグの必須属性[${ningloid.tag[orderName].vital}]が入力されていません。`);
			}
			// 非同期処理でタグ実行
			const stopFlag = await ningloid.tag[orderName].start(pm);
			return stopFlag;
		},
		/**
		 * 受け取った命令を、タグ名称、タグパラメータごとに分割し、配列化する
		 * @param  {String} order        実行する命令
		 * @return {Array}  splitedOrder タグ名称、各タグパラメータを要素とする配列
		 */
		splitOrder(order){
			// タグ用記号と無駄な空白を削除 → タグ名、各パラメータ、それぞれ切り分ける
			let splitedOrder = order.replace(/^\s+|@|\[\s*|\s*\]|\s+$/g, "");
				splitedOrder = splitedOrder.split(/\s+/);
			// ↑によって""で囲われたパラメータの空白も区切りとして扱われてしまうので、修正する処理
			for(let i = 0; i < splitedOrder.length; i++){
				const quartNum = splitedOrder[i].split("\"").length - 1;
				// ダブルクォーテーションの数で構文チェック
				if(!(quartNum == 0 || quartNum == 2)){
					if(quartNum == 1){
						// 接合対象の配列番号を保管
						const j = i;
						// 接合回数をカウントする変数
						let counta = 1;
						// 空白の復元 と タグパラメータの接合作業
						// 後ろの"を見つけるまでループ
						while(!splitedOrder[++i].includes("\"")){
							// エラー
							if(i == splitedOrder.length - 1) throw new Error(`パラメータ【${splitedOrder[j]}】ダブルクォート（"）の数が不正です。`);
							// 接合していく
							splitedOrder[j] += ` ${splitedOrder[i]}`;
							counta++;
						}
						// 最後の一回
						splitedOrder[j] += ` ${splitedOrder[i]}`;
						// 接合した値を配列から削除する
						splitedOrder.splice(j + 1, counta);
					}
					// 構文エラー
					else throw new Error("ダブルクォート（\"）の数が不正です。シングルクォート（'）と使い分けてください。");
				}
			}
			return splitedOrder;
		},
		/**
		 * 受け取ったタグ情報配列（タグ名称と各タグパラメータが分離された状態）を、タグ名称とタグパラメータの二つに分ける（まとめる）
		 * @param  {Array}  splitedOrder タグ名称、各タグパラメータを要素とする配列
		 * @return {Object} tagObject    タグ名称とタグパラメータ（全て）を保有するオブジェクト
		 *                  .name      {String} タグ名称
		 *                  .parameter {Object} タグパラメータ郡
		 *                  					例：{
		 *                  						left: "100",
		 *                  						scale: "1.5",
		 *                  						wait: "false"
		 *                  					}
		 */
		createTagObject(splitedOrder){
			const tagObject = {
				name: "",
				parameter: {},
			};
			// タグ名称とタグパラメータに切り分ける
			tagObject.name = splitedOrder[0];

			// パラメータの作成
			const pm = tagObject.parameter = {};
			for(let i = 1; i < splitedOrder.length; i++){
				const targetOrder = splitedOrder[i];
				// パラメータ名とパラメータ値
				const key = targetOrder.split("=")[0];
				let val = targetOrder.replace(`${key}=`, "").replace(/\"/g, "");

				// 構文チェック（key=valになっているか）
				if(!targetOrder.includes("=")) throw new Error(`パラメータ${key}の記述が不正です`);

				// マクロ内のタグ処理時
				// %式の記述を、変数渡しの&式に書き換える（デフォルト値の記述書き換えは、【%hoge|'huga'】→【&mp.hoge||'huga'】）
				if(val/*マクロ判定*/){
					if(val.substring(0, 1) == "%") val = `&${val.replace("%", "mp.").replace("\|", "||").replace("\|\|", "||")}`;
				}

				// パラメータに変数が渡されている場合（&tf.testなど）、変数として処理する
				if(val.substring(0, 1) == "&") pm[key] = ningloid.evalScript(val.replace("&", ""));
				else pm[key] = val;
			}

			return tagObject;
		},
		/**
		 * タグの必須属性（vital parameter）が入力されているかを判定する
		 * @param  {Object}  defaultTagObject ningloid.tagにて定義されている各種タグのオブジェクト
		 * @param  {Object}  orderParam       タグパラメータ郡
		 * @return {Boolean} inputedVitalFlag 必須属性が入力されているかの判定
		 */
		getExistanceOfVital(defaultTagObject, orderParam){
			let existFlag = true;
			// vital記述ありのタグだけ判定（vitalの中身が空の場合は判定しない）
			if(defaultTagObject.vital && defaultTagObject.vital.length > 0){
				// Vitalに記述されているバラメータ名を取り出す
				for(let pm of defaultTagObject.vital){
					existFlag = false;
					// 複数のパラメータのうち、一つを記述していれば良いVital判定（vital:[["A", "B"]]という記述）
					if($.isArray(pm)){
						for(let pmChild of pm){
							// 一つでもパラメータが見つかればフラグをtrue（VitalチェックOK）にする
							if(orderParam[pmChild]) existFlag = true;
						}
					}
					else{
						// パラメータが見つかればフラグをtrue（VitalチェックOK）にする
						if(orderParam[pm]) existFlag = true;
					}

					// 一度でもfalseが出たら、即時Vitalチェック失敗を返す
					if(existFlag === false) return existFlag;
				}
			}
			return existFlag;
		}
	},

	// ================================================================
	// ● メッセージ実行系
	// ================================================================
	message: {
		text: "",
		$target: null,
		index: 0,
		/**
		 * メッセージをcurrentLayerに表示する
		 * @param  {String} text 表示するメッセージテキスト
		 * @return {Promise}     Promise：resolve(), reject(エラーメッセージ)
		 */
		execute(text){
			return new Promise((resolve, reject) => {
				// 表示対象レイヤ
				const $target = this.$target = $(`#${ningloid.stat.currentLayer}Inner`);

				// 表示テキスト（行頭の空白、タブは削除する）
				this.text = text.substring(0, 1) == "_" ? text.slice(1) : text.replace(/^\s+|^\t+/g, "");
				this.index = 0;

				// ================ バックログ用 ================
				// バックログを追加する
				ningloid.menu.addLog({
					number: ningloid.stat.messageNumber,
					speaker: "",
					message: text,
					jump: {
						url: ningloid.parser.url,
						line: ningloid.parser.line,
						nextOrder: ningloid.parser.nextOrder,
					}
				});
				// 現在のメッセージを保管しておく
				ningloid.tmp.currentMessage = text;
				// メッセージナンバーを増加
				ningloid.stat.messageNumber++;
				// ================ ↑ ここまで ↑ ================

				// スキップ時
				if(ningloid.flag.skipMode === true || ningloid.flag.systemSkipMode === true){
					// テキスト一括表示
					$target.html(text);
					// 次へ
					resolve();
				}
				else{
					// テキスト表示中フラグを立てる
					ningloid.flag.message.append = true;
					// コンフィグのshowTypeミスチェック
					// テキスト表示開始
					if(!this[ningloid.config.message.showType]){
						reject(`Error:Config.js<br>message.showType: ${ningloid.config.message.showType}は使用不可能な値です。「fade」か「clatter」を指定してください。`);	
					}
					this[ningloid.config.message.showType](resolve, reject);
				}
			});
		},
		/**
		 * タイプライター式のテキスト表示演出を行う
		 * @param  {etc.} resolver Promise.resolve
		 * @param  {etc.} rejecter Primise.reject
		 */
		clatter(resolver, rejecter){
			const text = this.text;
			const $target = this.$target;
			let currentChar = "";// 現在フェード表示中の１文字
			// テキスト表示速度が0の場合
			if(ningloid.config.message.textSpeed < 1){
				// テキスト一括表示
				$target.html(text);
				// テキスト表示中フラグを消し、次へ
				ningloid.flag.message.append = false;
				resolver();
			}
			// メッセージスキップ時
			else if(ningloid.flag.message.skip === true){
				currentChar = text.substring(this.index, text.length);
				// 空白とタブをエスケープ文字に変換する
				currentChar = currentChar.replace(/\s/g, "&nbsp;").replace(/\t/g, "&#009;");
				$target.append(currentChar);
				// メッセージスキップフラグ消去
				ningloid.flag.message.skip = false;
				// テキスト表示中フラグを消し、次へ
				ningloid.flag.message.append = false;
				resolver();
			}
			// 通常時
			else{
				// 表示対象文字をピックアップし、メッセージレイヤに追加する
				currentChar = text.substring(this.index, ++this.index);
				// 空白とタブをエスケープ文字に変換する
				currentChar = currentChar.replace(/\s/g, "&nbsp;").replace(/\t/g, "&#009;");
				$target.append(currentChar);
				// コンフィグの textSpeed ミリ秒後
				setTimeout(() => {
					// 次の文字表示へ
					if(this.index < text.length) this.clatter(resolver, rejecter);
					// 全テキスト表示完了時
					else{
						// テキスト表示中フラグを消し、次へ
						ningloid.flag.message.append = false;
						resolver();
					}
				}, ningloid.config.message.textSpeed);
			}
		},

		/**
		 * フェード式のテキスト表示演出を行う
		 * @param  {etc.} resolver Promise.resolve
		 * @param  {etc.} rejecter Primise.reject
		 */
		fade(resolver, rejecter){
			const text = this.text;
			const $target = this.$target;
			let $currentChar = $("<span></span>").css("opacity", "0");// 現在フェード表示中のSpan要素
			$target.append($currentChar);
			let currentChar = "";// 現在フェード表示中の１文字
			// テキスト表示速度が0の場合
			if(ningloid.config.message.textSpeed < 1){
				// 表示
				$currentChar.html(text).velocity(
					{opacity: "1"},
					300,
					"easeOutSine",
					function(){
						// フェードイン終了後、Spanタグを削除（負荷軽減のため）
						const self = $(this);
						self.replaceWith(self.html());
						// メッセージスキップフラグ消去
						ningloid.flag.message.skip = false;
						// テキスト表示中フラグを消し、次へ
						ningloid.flag.message.append = false;
						resolver();
					}
				);
			}
			// メッセージスキップ時
			else if(ningloid.flag.message.skip === true){
				currentChar = text.substring(this.index, text.length);
				// 空白とタブをエスケープ文字に変換する
				currentChar = currentChar.replace(/\s/g, "&nbsp;").replace(/\t/g, "&#009;");
				// 表示
				$currentChar.html(currentChar).velocity(
					{opacity: "1"},
					300,
					"easeOutSine",
					function(){
						// フェードイン終了後、Spanタグを削除（負荷軽減のため）
						const self = $(this);
						self.replaceWith(self.html());
						// メッセージスキップフラグ消去
						ningloid.flag.message.skip = false;
						// テキスト表示中フラグを消し、次へ
						ningloid.flag.message.append = false;
						resolver();
					}
				);
			}
			// 通常時
			else{
				currentChar = text.substring(this.index, ++this.index);
				// 空白とタブをエスケープ文字に変換する
				currentChar = currentChar.replace(/\s/g, "&nbsp;").replace(/\t/g, "&#009;");
				// メッセージレイヤに追加し、フェードイン
				$currentChar.html(currentChar).velocity(
					{opacity: "1"},
					300 + ningloid.config.message.textSpeed * 4,
					"easeOutSine",
					function(){
						// フェードイン終了後、Spanタグを削除（負荷軽減のため）
						const self = $(this);
						self.replaceWith(self.html());
					}
				);
				// コンフィグの textSpeed ミリ秒後
				setTimeout(() => {
					// 次の文字表示へ
					if(this.index < text.length) this.fade(resolver, rejecter);
					// 全テキスト表示完了時
					else{
						// テキスト表示中フラグを消し、次へ
						ningloid.flag.message.append = false;
						resolver();
					}
				}, ningloid.config.message.textSpeed);
			}
		},
	},

	// ================================================================
	// ● ラベル系
	// ================================================================
	label: {
		data:{},
		execute: async function(label){
			const key = ningloid.stat.currentLabel = label.split("|")[0];
			// ラベル地点でオートセーブ実行
			await ningloid.system.autoSave.execute(`autoSave-${key}`);
		}
	},

	// ================================================================
	// ● マクロ系
	// ================================================================
	macro: {
		tmpName: null,
		data: {
			// testMacro: [
			// 	"aaaa",
			// 	["[l]", "[cm]"],
			// 	["@eval exp=\"console.log('aiueoi');\""]
			// ]
		},
		/**
		 * 登録済みmacroの実行
		 * @param  {Object} tagObject マクロ名称とマクロに渡す各種パラメータを保管したオブジェクト
	 	 * @return {String} stopFlag  一行ずつ全文の実行をすることを前提に、全文実行をキャンセルする必要がある場合に"stop"となる
	 	 *                            "stop"はタグの処理のresolve()の引数に渡すことでここに届けることができる
		 */
		execute: async function(tagObject){
			// マクロタグに渡されたパラメータは、全てmp変数に渡す
			const mp = ningloid.variable.mp;
			for(let key in tagObject.parameter){
				mp[key] = tagObject.parameter[key];
			}
			for(let val of this.data[tagObject.name]){
				// iscriptが実行された場合
				if(ningloid.parser.tmpScript !== null && !val.includes("[endscript]")){
					ningloid.parser.tmpScript += val;
					continue;
				}
				// macroが実行された場合
				if(this.tmpName !== null && !val.includes("[endmacro ]")){
					this.pushOrder();
					continue;
				}

				// コメントなどの場合
				if(!$.isArray(val)){
					// 実行
					await ningloid.parser.executeOrder(val);
					// 以降の処理実行は不要なので、次のループに進む
					continue;
				}

				const stopFlag = await ningloid.parser.executePluralOrders(val);
				if(stopFlag === "stop"){

					return stopFlag;
				}
			}
		},
		/**
		 * マクロ内の処理として、命令を保管する
		 * @param  {String/Array} order マクロ内で実行する命令（行毎）
		 *                              ※ここに渡される命令は、『"こんにちは"』のようなStringの場合もあるし
		 *                                『["[l]", "[cm]"]』のような配列の場合もある
		 *                                つまり「行ごとに区分けした命令情報」
		 */
		pushOrder(order){
			// 初期化
			if(!$.isArray(this.data[this.tmpName])) this.data[this.tmpName] = [];
			// 対象のマクロ名称の命令配列に保存
			this.data[this.tmpName].push(order);
		},
	},
};

