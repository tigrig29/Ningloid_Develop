/* global tag_data: true */

tag_data.kind_of_character = {
	overview: "立ち絵関連",
	tag: {
		"charashow":{
			name: "charashow",
			overview: "キャラクターの登場",
			description: "キャラクターを登場させます。<br>chara_setting.jsのparts_modeによって、必須が「△」（image・pose・face・????）の属性の必要有無が変化します。",
			develop_info: [
				"テスト実装", "テスト中", ""
			],
			parameter:[
				{
					name: "name", required: "○", default: "×", type: "名称",
					description: "登場させる${chara_name}"
				},
				{
					name: "image", required: "△", default: "0", type: "名称",
					description: "登場${chara_image}"
				},
				{
					name: "pose", required: "△", default: "0", type: "名称",
					description: "登場${chara_pose}"
				},
				{
					name: "face", required: "△", default: "0", type: "名称",
					description: "登場${chara_face}"
				},
				{
					name: "????", required: "△", default: "0", type: "名称",
					description: "登場${chara_parts}"
				},
				{
					name: "x", required: "×", default: "center", type: "left,center,right / 数値(px)",
					description: "キャラクターの登場${chara_x}"
				},
				{
					name: "y", required: "×", default: "200", type: "数値(px)",
					description: "キャラクターの登場${chara_y}"
				},
				{
					name: "scale", required: "×", default: "1.0", type: "数値(倍率)",
					description: "${scale}"
				},
				{
					name: "opacity", required: "×", default: "1.0", type: "数値(0.0~1.0)",
					description: "${opacity}"
				},
				{
					name: "reflect", required: "×", default: "false", type: "真偽値",
					description: "キャラクターの画像を左右反転させる場合、trueを指定します。"
				},
				{
					name: "zindex", required: "×", default: "0", type: "数値",
					description: "表示キャラクターの重なり順序を指定します。数値が大きいほど前面に、小さいほど背面に表示されます。"
				},
				{
					name: "fromX", required: "×", default: "center", type: "left,center,right / 数値(px)",
					description: "${fromX}"
				},
				{
					name: "fromY", required: "×", default: "200", type: "数値(px)",
					description: "${fromY}"
				},
				{
					name: "fromScale", required: "×", default: "1.0", type: "数値(倍率)",
					description: "${fromScale}"
				},
				{
					name: "method", required: "×", default: "fadeIn", type: "名称",
					description: "表示${method}"
				},
				{
					name: "time", required: "×", default: "1000", type: "数値(ms)",
					description: "表示${time}"
				},
				{
					name: "click", required: "×", default: "true", type: "真偽値",
					description: "${click}"
				},
				{
					name: "wait", required: "×", default: "true", type: "真偽値",
					description: "${wait}"
				}
			],
			example:"<font color=#4c4>;parts_mode:\"single\"の場合</font><br>" + 
					"[chara_show name=dorayaki image=normal x=left top=400 size=1.5 time=2000]<br><br>" +
					"<font color=#4c4>;parts_mode:\"pose_face\"の場合</font><br>" +
					"@chara_show name=dorayaki pose=banzai face=nikoniko reflect=true zindex<br><br>" +
					"<font color=#4c4>;parts_mode:\"multi\"の場合</font><br>" +
					"@chara_show name=taiyaki pose=normal cloth=seihuku eye=nikoniko mouth=normal method=slideInRight"
		},
	}
};

/*
	,
	kind_of_: {
		overview: "",
		tag: {
			"":{
				name: "",
				overview: "",
				description: "",
				develop_info: [
					"テスト実装", "チェック待ち", ""
				],
				parameter:[
					{
						name: "", required: "×", default: "", type: "",
						description: ""
					},
				],
				example: "@"
			},
		}
	}
 */
