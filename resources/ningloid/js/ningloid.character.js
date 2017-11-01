/* global characterData: true */

ningloid.character = {
	// ================================================================
    // ● メンバ変数
	// ================================================================
	config: {
		partsMode: "single",
	},
	data: {
		// this.define()で、ここにキャラクターの定義データが入力される
	},

	// ================================================================
    // ● 初期処理系
	// ================================================================
	init(){
		// キャラクター定義を構築する
		this.define();
	},
	// キャラクター定義を構築する（オブジェクトとして保管）
	define(){
		// キャラクター定義を読み込む
		for(let key in characterData){
			if(key == "partsMode") this.config.partsMode = characterData.partsMode;
			else this.data[key] = $.cloneObject(characterData[key]);
		}
	},

	// ================================================================
    // ● チェック系
	// ================================================================
	// キャラクター固有レイヤの存在有無を返す
	checkLayerExistance(name){
		if($(`#${name}`).length) return true;
		else return false;
	},

	// ================================================================
    // ● 作成系
	// ================================================================
	/**
	 * 指定キャラクターのレイヤを作成する
	 * @param  {String} characterName キャラクターの名称（CharaSetting.jsで定義した名前を利用する）
	 */
	createLayer(characterName){
		// 指定キャラクターのレイヤが既に存在しているのであれば処理を終了する
		if(this.checkLayerExistance(characterName)) return;

		// キャラクター用にキャンバスレイヤを作成し、画面に追加する
		const layer = ningloid.layer;
		layer.createCanvasLayer({
			target: layer.getLayer("character"),
			id: characterName,
			cls: "characterLayer"
		});
	},
	/**
	 * 描画対象のスプライトデータを作成する
	 * @param  {String} characterName キャラクターの名称（CharaSetting.jsで定義した名前を利用する）
	 * @param  {Object} partsData     描画する立ち絵のパーツの情報
	 *                                1. partsMode: "single"の場合
	 *                                partsData = {
	 *                                		partID: pm.image, // "testA"
	 *                                		spritePropety: {}
	 *                                }
	 *                                2. partsMode: "multi"の場合
	 *                                partsData = {
	 *                                		face: {
	 *                                			partID: pm.face, // "angry"
	 *                                			spritePropety: {}
	 *                                		},
	 *                                		pose: {
	 *                                			partID: pm.pose, // "normal"
	 *                                			spritePropety: {}
	 *                                		},
	 *                                }
	 * @return {Object}               スプライトのデータ（ningloid.canvas.renderImageに渡せる形式）
	 */
	createSpriteData(characterName, partsData){
		// 描画データを作成
		const spriteData = {};

		// 対象画像取得
		if(this.config.partsMode == "single"){
			// partsDataで指定されていない場合、デフォルト値としてキャラクター定義の最上位の値を適応する
			const partID = partsData.partID || Object.keys(this.data[characterName])[0];
			const characterImageFileName = this.data[characterName][partID];
			spriteData[`./data/fgimage/${characterImageFileName}`] = partsData.spriteProperty || {};
		}
		else{
			for(let partGroupID in this.data[characterName]){
				// partsDataで指定されていないパーツに関しては、デフォルト値としてキャラクター定義の最上位の値を適応する
				const partID = partsData[partGroupID].partID || Object.keys(this.data[characterName][partGroupID])[0];
				const partImageFileName = this.data[characterName][partGroupID][partID];
				spriteData[`./data/fgimage/${partImageFileName}`] = partsData[partGroupID].spriteProperty || {};
			}
		}

		return spriteData;
	},
};

