ningloid.video = {
	queue: [],

	// ================================================================
	// ● 初期処理系
	// ================================================================
	/**
	 * Video要素の作成
	 * @param  {String}  url Videoのsrc属性に渡す動画ファイルのURL
	 * @return {$Object}     Video要素のjQueryオブジェクト
	 */
	create(url){
		return $(`<video src="${url}"></video>`);
	},
	/**
	 * Video要素を作成し、レイヤに挿入し、再生処理を実行する
	 * @param  {$Object}  $target Video挿入対象のレイヤ
	 * @param  {String}   url     Videoのsrc属性に渡す動画ファイルのURL
	 * @param  {Object}   options Videoに渡す属性オプション
	 * @param  {Function} onEnded Video再生終了時の実行処理
	 * @return {$Object}          Video要素のjQueryオブジェクト
	 */
	createAndPlay($target, url, options, onEnded){
		// video要素の生成
		const $video = this.create(url);
		// オプションの付加
		$video.attr(options);
		// レイヤに挿入
		$target.append($video);
		// エンドファンクション
		$video[0].onended = () => {
			if(onEnded) onEnded($video);
		};
		return $video;
	},
	/**
	 * 再生中のVideoに対して、クリック時のイベントを設定する
	 * @param {$Object} $video      対象のVideo要素
	 * @param {Boolean} clickskip   クリック時に動画終端までスキップするか
	 * @param {Boolean} clickremove クリック時に動画要素を画面から消去するか（Numberの指定でフェードアウトになる）
	 */
	setClickable($video, clickskip, clickremove){
		if(!clickskip && !clickremove) return;
		this.pushQueue(this.createClickableVideoObject($video, clickskip, clickremove));
	},

	// ================================================================
	// ● 取得系
	// ================================================================
	/**
	 * 親レイヤの名称から、該当のVideo要素を取得する
	 * @param  {String}  layerName 親レイヤの名称
	 * @return {$Object}           対象のVideo要素
	 */
	getVideo(layerName){
		const $target = ningloid.layer.getLayer(layerName);
		return $target.find("video");
	},
	/**
	 * クリックイベント待ちのVideoオブジェクト配列を返す
	 * @return {Array} クリックイベント待ちキュー
	 */
	getClickableVideoObjects(){
		return this.queue;
	},

	// ================================================================
	// ● データ管理系
	// ================================================================
	/**
	 * クリックイベント待ちVideoオブジェクトの作成
	 * @param  {$Object} $video      対象のVideo要素
	 * @param  {Boolean} clickskip   クリック時に動画終端までスキップするか
	 * @param  {Boolean} clickremove クリック時に動画要素を画面から消去するか（Numberの指定でフェードアウトになる）
	 * @return {Object}              クリックイベント管理オブジェクト
	 */
	createClickableVideoObject($video, clickskip, clickremove){
		/*
		clickableVideoObject = {
			target: アニメーション対象のjQueryオブジェクト,
			clickskip： クリックスキップを実行するか,
			clickremove： クリックリムーブを実行するか（実行する場合ms単位）,
		};
		*/
		return {
			target: $video,
			clickskip, clickremove,
		};
	},
	/**
	 * キューにクリックイベント管理オブジェクトを挿入する
	 * @param  {Object} clickableVideoObject createClikableVideoObjectで作成したオブジェクト
	 */
	pushQueue(clickableVideoObject){
		this.queue.push(clickableVideoObject);
	},
	/**
	 * キューをクリアする
	 */
	clearQueue(){
		this.queue.length = 0;
	},

	// ================================================================
	// ● ビデオ操作系
	// ================================================================
	/**
	 * 再生中のVideoを終端までスキップする
	 * @param  {$Object} $video    対象のVideo要素
	 * @param  {Boolean} cancelEnd Videoのonendファンクションを呼び出さない場合trueを指定する
	 */
	skipToEnd($video, cancelEnd){
		const videoObj = $video.get(0);
		// エンドファンクションを呼び出さないパターン（skipとremoveを同時に行う場合に必要）
		if(cancelEnd){
			videoObj.pause();
			videoObj.currentTime = videoObj.duration - 0.001;
		}
		else videoObj.currentTime = videoObj.duration;
	},
	/**
	 * 再生中のVideoを停止する
	 * @param  {$Object} $video 対象のVideo要素
	 */
	pause($video){
		$video[0].pause();
	},
	/**
	 * VideoをcurrentTimeから再開する
	 * @param  {$Object}  $video  対象のVideo要素
	 * @param  {Function} onEnded Video再生終了時の実行処理
	 */
	resume($video, onEnded){
		const videoObj = $video.get(0);
		videoObj.onended = () => {
			if(onEnded) onEnded();
		};
		videoObj.play();
	},

	// ================================================================
	// ● ビデオ要素系
	// ================================================================
	/**
	 * Video要素をfadeInで表示する
	 * @param  {$Object}  $video  対象のVideo要素
	 * @param  {Number}   time    フェードインDuration
	 * @param  {Function} cb      コールバック
	 */
	fadeIn($video, time, cb){
		$video.css("opacity", 0);
		ningloid.animate.velocity($video, {opacity: 1}, {
			duration: parseInt(time),
			easing: "linear",
			skippable: "true",
		}, () => {if(cb) cb();});
	},
	/**
	 * Video要素を消去する
	 * @param  {$Object} $video  対象のVideo要素
	 * @param  {Boolean} endFlag Videoのonendedファンクションを呼び出す場合、trueを指定する
	 */
	remove($video, endFlag){
		// endFlagが真なら、removeと同時にエンドファンクションを呼び出す
		if(endFlag) $video[0].onended();
		$video.remove();
	},
	/**
	 * Video要素をfadeOutで消去する
	 * @param  {$Object}  $video  対象のVideo要素
	 * @param  {Number}   time    フェードインDuration
	 * @param  {Boolean}  endFlag Videoのonendedファンクションを呼び出す場合、trueを指定する
	 * @param  {Function} cb      コールバック
	 */
	fadeOut($video, time, endFlag, cb){
		// フェードアウトが終わったらRemoveを実行
		// Remove後にエンドファンクションを呼ぶかは引数に従う
		ningloid.animate.velocity($video, {opacity: 0}, {
			duration: parseInt(time),
			easing: "linear",
			skippable: "true",
		}, () => {
			this.remove($video, endFlag);
			if(cb) cb();
		});
	},
};

