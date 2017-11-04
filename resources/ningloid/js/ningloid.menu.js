ningloid.menu = {
	jObj:{},
	// ================================================================
    // ● 初期処理
	// ================================================================
	init(){
		// メニュー系のHTML用CSS読み込み
		ningloid.addCSS("../resources/ningloid/css/ningloidMenu.css");
		// メニュー共通戻るボタンのクリックイベント設定
		$("#menuWrapper").on("click", ".menuClose", (e) => {
			this.hide($(e.currentTarget).parent().attr("id"));
		});

		this.createSaveMenu();
		this.createLoadMenu();
		this.createBacklog();
	},

	// ================================================================
    // ● 取得系
	// ================================================================
	/**
	 * メニューのレイヤを返す
	 * @param  {String} menuID メニュー画面の名称、レイヤのIDを指定する
	 * @return {$Object}       指定したメニュー画面レイヤのjQueryオブジェクト
	 */
	getLayer(menuID){
		return this.jObj[menuID];
	},

	// ================================================================
    // ● 作成系
	// ================================================================
	/**
	 * セーブ画面を作成する
	 * セーブ画面のHTMLデータは、../resources/ningloid/html/save.htmlとする
	 */
	createSaveMenu(){
		const layer = ningloid.layer;
		(async () => {
			// 同期処理、メニューラッパーにsave.htmlから読み取ったHTMLを追加する
			await layer.appendHTML(layer.getLayer("menuWrapper"), "../resources/ningloid/html/save.html");
			// HTMLデータ追加完了後、セーブ画面の各種レイヤを取得する
			const $saveMenu = this.jObj.saveMenu = $("#saveMenu");
			const $saveDataAreaWrapper = $saveMenu.find(".saveDataAreaWrapper");
			// セーブエリアを作成する
			for(let i = 0; i < 5; i++){
				// セーブデータの枠
				const $saveDataArea = $(`<div class="saveDataArea" data-save-number="${i}"></div>`);
				// セーブ番号
				const $saveNumber = $(`<div class="saveNumber">${i+1}</div>`);
				$saveNumber.css("line-height", `${ningloid.config.display.height * 0.19}px`);
				// サムネイルエリア
				const $thumbnail = $("<div class='saveThumbnail'></div>");
				// セーブデータの情報
				const $saveInfo = $("<div class='saveInfo'><div class='saveTitle'></div><div class='saveText'></div></div>");
				// 上記の要素を挿入する
				$saveDataArea.append($saveNumber, $thumbnail, $saveInfo);
				$saveDataAreaWrapper.append($saveDataArea);

				// セーブエリアクリック時の処理
				$saveDataArea.on("click", (e) => {
					// セーブ番号を読み取って、その番号のデータにセーブを行う
					// セーブ完了後、データの更新に従って表示を更新する
					ningloid.system.doSave($(e.currentTarget).data("save-number"), true, () => this.updateSaveData("saveMenu"));
				});
			}
			// 戻るボタンを追加
			$saveMenu.append("<div class='menuClose'><p>×</p></div>");
			// 作成したセーブ画面にセーブデータの情報表示を反映させる
			this.updateSaveData("saveMenu");
		})();
	},
	/**
	 * ロード画面を作成する
	 * ロード画面のHTMLデータは、../resources/ningloid/html/load.htmlとする
	 */
	createLoadMenu(){
		const layer = ningloid.layer;
		(async () => {
			// 同期処理、メニューラッパーにlaod.htmlから読み取ったHTMLを追加する
			await layer.appendHTML(layer.getLayer("menuWrapper"), "../resources/ningloid/html/load.html");
			// HTMLデータ追加完了後、セーブ画面の各種レイヤを取得する
			const $loadMenu = this.jObj.loadMenu = $("#loadMenu");
			const $saveDataAreaWrapper =  $loadMenu.find(".saveDataAreaWrapper");
			// セーブエリアを作成する
			for(let i = 0; i < 5; i++){
				// セーブデータの枠
				const $saveDataArea = $(`<div class="saveDataArea" data-save-number="${i}"></div>`);
				// セーブ番号
				const $saveNumber = $(`<div class="saveNumber">${i+1}</div>`);
				$saveNumber.css("line-height", `${ningloid.config.display.height * 0.19}px`);
				// サムネイルエリア
				const $thumbnail = $("<div class='saveThumbnail'></div>");
				// セーブデータの情報
				const $saveInfo = $("<div class='saveInfo'><div class='saveTitle'></div><div class='saveText'></div></div>");
				// 上記の要素を挿入する
				$saveDataArea.append($saveNumber, $thumbnail, $saveInfo);
				$saveDataAreaWrapper.append($saveDataArea);

				// セーブエリアクリック時の処理
				$saveDataArea.on("click", (e) => {
					this.hide("loadMenu");
					ningloid.system.doLoad($(e.currentTarget).data("save-number"));
				});
			}
			// 戻るボタンを追加
			$loadMenu.append("<div class='menuClose'><p>×</p></div>");
			this.updateSaveData("loadMenu");
		})();
	},
	/**
	 * バックログの初期画面生成
	 * ※ この時点では外枠しか無い
	 */
	createBacklog(){
		const layer = ningloid.layer;
		(async () => {
			// 同期処理、メニューラッパーにlaod.htmlから読み取ったHTMLを追加する
			await layer.appendHTML(layer.getLayer("menuWrapper"), "../resources/ningloid/html/backlog.html");
			const $backlog = this.jObj.backlog = $("#backlog");
			// ログエリアクリック時の処理（その時点まで戻る）
			// $("#logDataAreaWrapper").on("click", ".logDataArea", (e) => {
			// });
			// 戻るボタンを追加
			$backlog.append("<div class='menuClose'><p>×</p></div>");
		})();
	},

	// ================================================================
	// ● 更新系
	// ================================================================
	/**
	 * 画面上のセーブ情報を更新する
	 */
	updateSaveData(menuID){
		const saveData = ningloid.system.getSaveData();
		const $target = this.getLayer(menuID);
		$target.find(".saveDataArea").each((i, self) => {
			// その番号のセーブデータが空の場合は何もせず空っぽにしておく
			if(!saveData[i]) return;
			const $self = $(self);
			// サムネイルを取得して表示する
			$self.find(".saveThumbnail").css({
				"background-image": `url(${saveData[i].thumbnail})`,
			});
			// セーブタイトルを表示する
			$self.find(".saveTitle").text(saveData[i].title || "no-title");
			// セーブ時のメッセージを表示する
			$self.find(".saveText").text(saveData[i].message);
		});
	},
	/**
	 * バックログ画面を更新する
	 * @param  {Array} oldLogData セーブデータをロードする前のログ保管配列
	 */
	updateBacklog(oldLogData){
		const newLogData = ningloid.stat.backlog;
		const operationToAddLog = this.reuseBacklogAndReturnOperation(newLogData, oldLogData);
		this.addNewLogData(newLogData, operationToAddLog);
	},
	/**
	 * ロード時、現在のバックログ画面から再利用できるログデータを選択し、その他を画面から削除する
	 * また、この後新たにログデータを画面を追加する際の各種指標データオブジェクトを返す
	 * @param  {Array}  newLogData 新たにバックログに追加するログデータの保管配列
	 * @param  {Array}  oldLogData バックログ更新前のログデータの保管配列
	 * @return {Object}            バックログ画面に追加すべきログの番号と、バックログの先頭に追加するのか後尾に追加するのかを示したオブジェクト
	 *         					   this.addNewLogDataの第二引数に渡して利用する
	 */
	reuseBacklogAndReturnOperation(newLogData, oldLogData){
		if(!newLogData || newLogData.length == 0) return;
		// 新規追加ログ（newLog）
		// ログデータの先頭、後尾のログナンバーを取得する
		const [newLogFirstNum, newLogLastNum] = [
			newLogData[0].number, newLogData[newLogData.length - 1].number,
		];
		// バックログ画面に追加すべきログの番号（.firstNumに最初の番号、.lastNumに最後の番号）と、
		// バックログの先頭（古いログ側）に追加するのか後尾（新しいログ側）に追加するのかを示したオブジェクト
		// ※method:"prepend"は先頭、"append"は後尾
		const operationToAddLog = {
			method: "append",
			firstNum: newLogFirstNum - 1,
			lastNum: newLogLastNum + 1
		};
		if(oldLogData.length === 0) return operationToAddLog;

		// 現在バックログに表示中のログ（oldLog）
		// ログデータの先頭、後尾のログナンバーを取得する
		const [oldLogFirstNum, oldLogLastNum] = [
			oldLogData[0].number, oldLogData[oldLogData.length - 1].number
		];

		const $backlog = $("#backlog");
		const $logDataAreaWrapper = $backlog.find("#logDataAreaWrapper");

		// oldLogのうち、ロード後も残して良いログデータを判定する
		// oldLogよりnewLogのほうが古い（小さいログ番号を持っている）場合
		if(oldLogFirstNum > newLogFirstNum){
			// newLogとoldLogで一致する箇所がない場合
			// ※正確には、newLogの全範囲がoldLogよりも古い（小さい番号である）場合
			if(oldLogFirstNum > newLogLastNum){
				// 現在のバックログ表示を全て削除する
				$logDataAreaWrapper.empty();
			}
			else{
				const deleteIndex = $(`#logData${newLogLastNum}`).index();
				$(`.logDataArea:gt(${deleteIndex})`).remove();
				// ログ追加オペレーションのメソッド、ログ追加開始番号を更新する
				operationToAddLog.method = "prepend";
				operationToAddLog.lastNum = oldLogFirstNum;
			}
		}
		// oldLogよりnewLogのほうが新しい（大きいログ番号を持っている）あるいは等しい場合
		else{
			// newLog数がoldLog数よりも少ない場合（上記条件と合わせ、newLogがoldLogに包括されている状態）
			if(newLogData.length < oldLogData.length){
				// newLogと一致しているログ以降を削除する
				const deleteIndex = $(`#logData${newLogLastNum}`).index();
				$(`.logDataArea:gt(${deleteIndex})`).remove();
				// ログ追加オペレーションのログ追加開始番号を更新する
				operationToAddLog.firstNum = oldLogLastNum;
			}
			// newLogとoldLogで一致する箇所がない場合
			// ※正確には、newLogの全範囲がoldLogよりも新しい（大きい番号である）場合
			else if(oldLogLastNum < newLogFirstNum){
				// 現在のバックログ表示を全て削除する
				$logDataAreaWrapper.empty();
			}
			else{
				// newLogとoldLogで一致している箇所だけ残して、他は削除する
				const deleteIndex = $(`#logData${newLogFirstNum}`).index();
				$(`.logDataArea:lt(${deleteIndex})`).remove();
				// ログ追加オペレーションの開始番号を更新する
				operationToAddLog.firstNum = oldLogLastNum;
			}
		}
		return operationToAddLog;
	},
	/**
	 * バックログ画面に、受け取ったログデータを一括で挿入する
	 * @param {Array}  newLogData        新たにバックログに追加するログデータの保管配列
	 * @param {Object} operationToAddLog バックログ画面に追加すべきログの番号と、バックログの先頭に追加するのか後尾に追加するのかを示したオブジェクト
	 *         					         this.reuseBacklogAndReturnOperation()から受け取る
	 */
	addNewLogData(newLogData, operationToAddLog){
		if(!newLogData || newLogData.length == 0) return;
		const $backlog = this.getLayer("backlog");
		const $logDataAreaWrapper = $backlog.find("#logDataAreaWrapper");
		// ログの追加
		let logDataAreaAllHtml = "";
		for(let log of newLogData){
			// ログ追加オペレーションの「開始/終了の番号」以下/以上の番号のログは追加しない
			// ※既に上記の処理で画面上に残っているため
			if(log.number <= operationToAddLog.firstNum || log.number >= operationToAddLog.lastNum){
				// 発話者、ログメッセージが異なっていた場合、その部分だけ更新する
				// ※分岐などで発生する
				const $logSpeaker = $(`#logData${log.number}`).find(".logSpeaker");
				if(log.speaker != $logSpeaker.text()) $logSpeaker.text(log.speaker);
				const $logMessage = $(`#logData${log.number}`).find(".logMessage");
				if(log.message != $logMessage.text()) $logMessage.text(log.message);
				continue;
			}
			// ログエリア
			const logDataArea = `<div id="logData${log.number}" class="logDataArea" data-log-number="${log.number}">`;
			// 発話者欄
			const logSpeaker = `<div class="logSpeaker">${log.speaker}`;
			// メッセージ欄
			const logMessage = `<div class="logMessage">${log.message}`;
			logDataAreaAllHtml += `${logDataArea}${logSpeaker}</div>${logMessage}</div></div>`;
		}
		$logDataAreaWrapper[operationToAddLog.method](logDataAreaAllHtml);
	},
	/**
	 * バックログとログデータ保管配列に、新たなログオブジェクト一つを挿入する
	 * @param {Object} logData 追加するログオブジェクト
	 *                         ※ プロパティはningloid.parser.messageExecuteを参照
	 */
	addLog(logData){
		const backlog = ningloid.stat.backlog;
		const $backlog = this.getLayer("backlog");
		const $logDataAreaWrapper = $backlog.find("#logDataAreaWrapper");
		// ログデータ保管
		backlog.push(logData);
		// ログデータがコンフィグ指定数を超えた場合は古いデータから消去する
		if(backlog.length == ningloid.config.backlogCapacity + 1) backlog.shift();
		// ここからバックログ画面への追加
		// ログエリア
		const logDataArea = `<div id="logData${logData.number}" class="logDataArea" data-log-number="${logData.number}">`;
		// 発話者欄
		const logSpeaker = `<div class="logSpeaker">${logData.speaker}`;
		// メッセージ欄
		const logMessage = `<div class="logMessage">${logData.message}`;
		// 追加
		$logDataAreaWrapper.append(`${logDataArea}${logSpeaker}</div>${logMessage}</div></div>`);
	},

	// ================================================================
    // ● 表示系
	// ================================================================
	/**
	 * 各種メニュー画面を表示する
	 * @param  {String} menuID メニューの名称、レイヤIDを指定する
	 */
	show(menuID){
		const $target = this.getLayer(menuID);
		// ロードメニューの場合は、セーブデータによる画面の更新を行う
		if(menuID == "loadMenu") this.updateSaveData(menuID);
		// 表示
		if($target) $target.show();
		$("#menuWrapper").fadeIn("fast");
	},
	/**
	 * 各種メニュー画面を消去する
	 * @param  {String} menuID メニューの名称、レイヤIDを指定する
	 */
	hide(menuID){
		const $target = this.getLayer(menuID);
		const $menuWrapper = $("#menuWrapper");
		// 消去
		$menuWrapper.fadeOut("fast", () => {
			// 指定されたIDのレイヤを消去する
			if($target) $target.hide();
			// ID指定されなかった場合は、表示中のメニューレイヤを全て消去する
			else{
				$menuWrapper.find(".menuLayer").each((i, self) => {
					const $self = $(self);
					if($self.css("display") != "none") $self.hide();
				});
			}
		});
	},
};
