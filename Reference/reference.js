$(document).ready(function() {
	// リファレンスの生成
	var reference = tag_data;
	for(var tag_class in reference){
		// タグを種別毎にくくるdivを生成
		var $tag_group = $("<div id='" + tag_class + "'></div>");
		// 種別の概要名称を表示するdiv → $tag_groupの中に追加
		var $tag_head = $("<div class='tag_head'><h2>" + reference[tag_class].overview + "</h2></div>");
		$tag_group.append($tag_head);
		// 各タグを$tag_groupに追加していく
		for(var tag_name in reference[tag_class].tag){
			var self = reference[tag_class].tag[tag_name];
			// タグのリファレンスを記述するdiv生成
			var $tag = $("<div id='" + tag_name + "' class='tag' head='#" + tag_class.replace(/kind/g, "list") + "'></div>");
			// タグリファレンスのパラメータを生成
			var param = getParamTable(self);
			// リファレンスの挿入
			$tag.html(
				"<h3 class='tag_name'>[" + self.name + "] " + self.overview + "</h3>" +
				"<p class='tag_description'>" + self.description + "</p>" +
				"<table class='develop_info'>" +
					"<thead><tr><td>実装状態</td><td>改善要望</td><td>未設計項目</td></tr></thead>" +
					"<tbody><tr><td>" + self.develop_info[0] + "</td><td>" + self.develop_info[1] + "</td><td>" + self.develop_info[2] + "</td></tr></tbody>" +
				"</table>" +
				"<table class='tag_parameter'>" +
					"<thead><tr><td>属性</td><td>必須</td><td>デフォルト</td><td>値域</td><td>説明</td></tr></thead>" +
					"<tbody>" + param + "</tbody>" +
				"</table>" + 
				"<div class='tag_example'>記述例<p>" + self.example + "</p></div>"
			);
			$tag_group.append($tag);
		}
		// DOMに追加
		$("#main").append($tag_group);
	}

	// ナビゲーターの作成
	buildNavigator();

	// サイドバー固定用のフラグ
	var side_fixed_flag = false;
	// サイドバーの固定（スクロール判定）
	$(window).on("scroll", function(){
		// スクロールが100を越えたらサイドバーを固定する
		if($(this).scrollTop() > 100 && side_fixed_flag === false){
			$("#side").css({position: "fixed", top: "10px"});
			side_fixed_flag = true;
		}
		// スクロールが100を下回ったら
		if($(this).scrollTop() <= 100 && side_fixed_flag === true){
			$("#side").css({position: "absolute", top: "100px"});
			side_fixed_flag = false;
		}
	});
});

// サイドバーの構築を行う
function buildNavigator(){
	$("#navigator").empty();
	// サイドバーの作成
	$(".tag_head").each(function(index){
		var self = $(this);
		// 対象要素のID
		var target_id = self.parent().attr("id");

		// リストの名称（「立ち絵関連」など）
		var list_title = self.find("h2").html();
		// リストのID
		var list_id = target_id.replace(/kind/g, "list");
		// リストタグ作成
		var $list = $("<li id='" + list_id + "' class='tag_overview'></li>");
		$list.html("<div><a href='#" + target_id + "'>" + list_title + "</a><div id='list_open_image'></div><div id='list_close_image'></div></div><ul class='tag_list' id='nav" + index + "'></ul>");
		$("#navigator").append($list);
	});
	$(".tag").each(function(){
		// タグのくくりを取得する
		var head = $(this).attr("head");
		// idを取得
		var id = $(this).attr("id");
		// タグ名を取得
		var tag_name = $(this).find(".tag_name").html();
		// 挿入するリストDOMオブジェクト
		var $list = $("<li><a href='#" + id + "'>" + tag_name + "</a></li>");
		$("#navigator").find(head).find(".tag_list").append($list);
	});

	// リストの開閉イベント
	$(".tag_overview").find("div").off().on("click", function(e){
		if($(this).parent().find(".tag_list").css("display") == "none"){
			// リスト開く
			$(this).parent().find(".tag_list").show();
			//矢印をOpen状態にする
			$(this).find("#list_open_image").show();
			$(this).find("#list_close_image").hide();
		}
		else{
			// リスト開く
			$(this).parent().find(".tag_list").css("display", "none");
			// 矢印をOpen状態にする
			$(this).find("#list_open_image").hide();
			$(this).find("#list_close_image").show();
		}
	});
}

// オブジェクトからタグのパラメータリファレンスを取得する
function getParamTable(data){
	var param = "";
	var description_pattern = {
		chara_name: "キャラクターの名称を指定します。chara_setting.jsで定義した名称を使用してください。",
		chara_image: "parts_mode:\"single\"の場合に使用します。<br>キャラクターの立ち絵名称を指定します。chara_setting.jsで定義した名称を使用してください。",
		chara_pose: "parts_mode:\"pose_face\"の場合に使用します。<br>キャラクターのポーズ名称を指定します。chara_setting.jsで定義した名称を使用してください。",
		chara_face: "parts_mode:\"pose_face\"の場合に使用します。<br>キャラクターの表情名称を指定します。chara_setting.jsで定義した名称を使用してください。",
		chara_parts: "parts_mode:\"multi\"の場合に使用します。chara_setting.jsにて定義したパーツの数だけ指定してください。また属性名「????」には定義したパーツの名称を当てはめてください。" +
					"<br>値にはパーツに対応する要素の名称を指定します。chara_setting.jsで定義した名称を使用してください。",
		chara_x: "位置（左右の位置）を指定します。「left」「center」「right」、あるいはピクセル数値で指定してください。",
		chara_y: "位置（上下の位置）を指定します。ピクセル数値で指定してください。",
		storage_suffix: "このフォルダに画像を配置するか、あるいは別のフォルダに配置し、規定フォルダからの相対パスでアドレスを指定してください。",
		color_suffix: "black, white などの名称のほか、#fff や rgb(255, 255, 255), rgba(255, 255, 255, 1.0)と言った指定も可能です。",
		scale: "拡縮率を指定します。倍率での指定です。",
		opacity: "透過度を指定します。0が透明（不可視）で、1が完全不透明です。",
		method: "演出を指定します。次の名称から選択してください。",
		fromX: "演出開始時のx座標地点（左右位置）を指定します。この値の位置から、x属性の位置まで移動演出を行います。",
		fromY: "演出開始時のy座標地点（上下位置）を指定します。この値の位置から、y属性の位置まで移動演出を行います。",
		fromScale: "演出開始時の拡縮率を指定します。この値の拡縮率から、scale属性の拡縮率まで拡大/縮小演出を行います。",
		effect: "演出におけるeasing設定を行います。詳細は以下を御覧ください。<br><a href='http://semooh.jp/jquery/cont/doc/easing/' target='_blank' style='color:blue'>easing一覧<a>",
		time: "演出にかける時間を指定します。",
		click: "演出をクリックでスキップ出来るように設定する場合true, スキップできないように設定する場合falseを指定します。",
		wait: "演出の終了を待つ場合true, 待たずに次の処理を行う場合falseを指定します。falseを指定することによって、その他の演出（背景表示など）を当演出と同時に行わせることが可能です。",
	};
	if(data.parameter === null) param = "<tr><td colspan='5'>指定できるパラメータはありません。</td></tr>";
	else{
		// パラメータを追加していく
		for(var index in data.parameter){
			var reference = data.parameter[index];
			// 何度も利用するdescription用の簡易記述を置換する
			reference.description = reference.description.replace(/\${(.*?)}/g, function(text, group){
				return description_pattern[group];
			});
			var inner = "<td>" + reference.name + "</td>" + 
						"<td>" + reference.required + "</td>" + 
						"<td>" + reference.default + "</td>" + 
						"<td>" + reference.type + "</td>" + 
						"<td>" + reference.description + "</td>";
			param += "<tr>" + inner + "</tr>";
		}
	}
	return param;
}