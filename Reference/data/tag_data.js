var tag_data = {
	kind_of_character:{
		overview: '立ち絵関連',
		tag: {
			'chara_show':{
				name: 'chara_show',
				overview: 'キャラクターの登場',
				description: 'キャラクターを登場させます。<br>chara_setting.jsのparts_modeによって、必須が「△」（image・pose・face・????）の属性の必要有無が変化します。',
				develop_info: [
					'テスト実装', 'テスト中', ''
				],
				parameter:[
					{
						name: 'name', required: '○', default: '×', type: '名称',
						description: '登場させる${chara_name}'
					},
					{
						name: 'image', required: '△', default: '0', type: '名称',
						description: '登場${chara_image}'
					},
					{
						name: 'pose', required: '△', default: '0', type: '名称',
						description: '登場${chara_pose}'
					},
					{
						name: 'face', required: '△', default: '0', type: '名称',
						description: '登場${chara_face}'
					},
					{
						name: '????', required: '△', default: '0', type: '名称',
						description: '登場${chara_parts}'
					},
					{
						name: 'x', required: '×', default: 'center', type: 'left,center,right / 数値(px)',
						description: 'キャラクターの登場${chara_x}'
					},
					{
						name: 'y', required: '×', default: '200', type: '数値(px)',
						description: 'キャラクターの登場${chara_y}'
					},
					{
						name: 'scale', required: '×', default: '1.0', type: '数値(倍率)',
						description: '${scale}'
					},
					{
						name: 'opacity', required: '×', default: '1.0', type: '数値(0.0~1.0)',
						description: '${opacity}'
					},
					{
						name: 'reflect', required: '×', default: 'false', type: '真偽値',
						description: 'キャラクターの画像を左右反転させる場合、trueを指定します。'
					},
					{
						name: 'zindex', required: '×', default: '0', type: '数値',
						description: '表示キャラクターの重なり順序を指定します。数値が大きいほど前面に、小さいほど背面に表示されます。'
					},
					{
						name: 'fromX', required: '×', default: 'center', type: 'left,center,right / 数値(px)',
						description: '${fromX}'
					},
					{
						name: 'fromY', required: '×', default: '200', type: '数値(px)',
						description: '${fromY}'
					},
					{
						name: 'fromScale', required: '×', default: '1.0', type: '数値(倍率)',
						description: '${fromScale}'
					},
					{
						name: 'method', required: '×', default: 'fadeIn', type: '名称',
						description: '表示${method}'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '表示${time}'
					},
					{
						name: 'click', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example:'<font color=#4c4>;parts_mode:"single"の場合</font><br>' + 
						'[chara_show name=dorayaki image=normal x=left top=400 size=1.5 time=2000]<br><br>' +
						'<font color=#4c4>;parts_mode:"pose_face"の場合</font><br>' +
						'@chara_show name=dorayaki pose=banzai face=nikoniko reflect=true zindex<br><br>' +
						'<font color=#4c4>;parts_mode:"multi"の場合</font><br>' +
						'@chara_show name=taiyaki pose=normal cloth=seihuku eye=nikoniko mouth=normal method=slideInRight'
			},
			chara_all_set:{
				name: 'chara_all_set',
				overview: '一括表示するキャラクターを指定する',
				description: 'キャラクター一括表示の準備を行います。ここで指定したキャラクター画像を[chara_all_show]で一括表示できます。',
				develop_info: [
					'テスト実装', 'チェック待ち', '特になし'
				],
				parameter:[
					{
						name: 'name', required: '○', default: '×', type: '文字列',
						description: '${chara_name}'
					},
					{
						name: 'pose', required: '×', default: '0', type: '数値',
						description: '${chara_pose}'
					},
					{
						name: 'cloth', required: '×', default: '0', type: '数値',
						description: '${chara_cloth}'
					},
					{
						name: 'eye', required: '×', default: '0', type: '数値',
						description: '${chara_eye}'
					},
					{
						name: 'mouth', required: '×', default: '0', type: '数値',
						description: '${chara_mouth}'
					},
					{
						name: 'left', required: '×', default: 'pos1', type: 'pos1~5 / 数値(px)',
						description: 'キャラクターの登場位置（左右の位置）を指定します。pos1~5、あるいはピクセル数値で指定してください。'
					},
					{
						name: 'top', required: '×', default: '200', type: '数値(px)',
						description: 'キャラクターの上下方向の登場位置を指定します。ピクセル値での指定です。'
					},
					{
						name: 'size', required: '×', default: '100', type: '数値(%)',
						description: '${scale}'
					},
					{
						name: 'reflect', required: '×', default: 'false', type: '真偽値',
						description: 'キャラクターの画像を反転させる場合に指定します。YouthSignalでは使わない予定？'
					},
					{
						name: 'zindex', required: '×', default: '0', type: '数値',
						description: '表示キャラクターの重なり順序を指定します。数値が大きければ大きいほど、上のレイヤに表示されます。'
					}
				],
				example: '@chara_all_set name=shizuno pose=1 eye=2 mouse=3 left=pos4'
			},
			'chara_all_show':{
				name: 'chara_all_show',
				overview: 'キャラクターの一括表示',
				description: '[chara_all_set]でセットしたキャラクターを一括で表示します。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・timeのデフォルト値<br>・表示演出の種類を明確に'
				],
				parameter:[
					{
						name: 'name', required: '○', default: '×', type: '文字列',
						description: '${chara_name}'
					},
					{
						name: 'method', required: '×', default: 'fadeIn', type: '',
						description: '${method}'
					},
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: '表示${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@chara_all_show name=shizuno time=1000 clickable=false'
			},
			'chara_hide':{
				name: 'chara_hide',
				overview: 'キャラクターの退場',
				description: 'キャラクターを退場させます。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・timeのデフォルト値<br>・退場演出の種類を明確に'
				],
				parameter:[
					{
						name: 'name', required: '○', default: '×', type: '文字列',
						description: '退場させる${chara_name}'
					},
					{
						name: 'method', required: '×', default: 'fadeIn', type: '',
						description: '${method}'
					},
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@chara_hide time=1000'
			},
			'chara_all_hide':{
				name: 'chara_all_hide',
				overview: '全キャラクターの一括退場',
				description: '登場中の全てのキャラクターを同時に退場させます。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・timeのデフォルト値<br>・退場演出の種類を明確に'
				],
				parameter:[
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@chara_all_hide'
			},
			chara_mod:{
				name: 'chara_mod',
				overview: 'キャラクターの画像を変更する',
				description: '登場中のキャラクターのポーズ、服装、表情を変更します。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・timeのデフォルト値<br>・クリックスキップ不可仕様で良いか'
				],
				parameter:[
					{
						name: 'name', required: '○', default: '×', type: '文字列',
						description: '${chara_name}'
					},
					{
						name: 'pose', required: '×', default: '0', type: '数値',
						description: '${chara_pose}'
					},
					{
						name: 'cloth', required: '×', default: '0', type: '数値',
						description: '${chara_cloth}'
					},
					{
						name: 'eye', required: '×', default: '0', type: '数値',
						description: '${chara_eye}'
					},
					{
						name: 'mouth', required: '×', default: '0', type: '数値',
						description: '${chara_mouth}'
					},
					{
						name: 'time', required: '×', default: '300', type: '数値(ms)',
						description: '${time}'
					}
				],
				example: '@chara_mod name=shunpei pose=3 cloth=2 mouth=1'
			},
			'chara_anim':{
				name: 'chara_anim',
				overview: 'キャラクターを動かす',
				description: 'キャラクター画像に様々なアニメーション効果を与えて動かします。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・timeのデフォルト値<br>・その他必要な動作など'
				],
				parameter:[
					{
						name: 'name', required: '○', default: '×', type: '文字列',
						description: '登場させる${chara_name}'
					},
					{
						name: 'left', required: '×', default: '-', type: 'pos1~5 / 数値(px)',
						description: 'キャラクターの登場位置（左右の位置）を指定します。pos1~5、あるいはピクセル数値で指定してください。'
					},
					{
						name: 'top', required: '×', default: '200', type: '数値(px)',
						description: 'キャラクターの上下方向の登場位置を指定します。ピクセル値での指定です。'
					},
					{
						name: 'size', required: '×', default: '100', type: '数値(%)',
						description: '${scale}'
					},
					{
						name: 'opacity', required: '×', default: '1.0', type: '数値(0~1.0)',
						description: '${opacity}'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '表示${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '<font color=#4c4>;left属性の-=300は、「現在地点から300ピクセル左に移動する」という指示です</font><br>' +
						 '@chara_anim name=suzu left="-=300" size=120 time=500'
			},
			chara_hop:{
				name: 'chara_hop',
				overview: 'キャラを数回振り動かす',
				description: 'キャラクターを上下、あるいは左右に小さく数回動かします',
				develop_info: [
					'テスト実装', 'チェック待ち', '・time, value, easingのデフォルト値<br>・クリックスキップ不可で良いか<br>・動きの調整'
				],
				parameter:[
					{
						name: 'name', required: '○', default: '×', type: '文字列',
						description: '${chara_name}'
					},
					{
						name: 'direction', required: '×', default: 'vertical', type: '"vertical" / "horizon"',
						description: 'キャラクターの動作方向を縦方向に設定する場合"vertical"を、水平方向に設定する場合"horizon"を指定します。'
					},
					{
						name: 'value', required: '×', default: '30', type: '数値(px)',
						description: '動作の振り幅を指定します。'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@chara_hop name=mahiro direction=horizon easing=easeOutSine'
			}
		}
	},
	kind_of_bg:{
		overview: '背景関連',
		tag: {
			bg:{
				name: 'bg',
				overview: '背景の表示（変更）',
				description: '背景の表示、あるいは変更を行います。',
				develop_info: [
					'テスト実装', 'チェック待ち', '特になし'
				],
				parameter:[
					{
						name: 'storage', required: '○', default: '×', type: '文字列(アドレス)',
						description: '背景画像を指定します。対象フォルダは./data/bgimage/です。${storage_suffix}'
					},
					{
						name: 'left', required: '×', default: '0', type: '数値(px)',
						description: '表示左端位置をピクセルで指定します。scale属性で拡大している場合、left属性で位置を調整すると良いでしょう。'
					},
					{
						name: 'top', required: '×', default: '0', type: '数値(px)',
						description: '表示上端位置をピクセルで指定します。scale属性で拡大している場合、top属性で位置を調整すると良いでしょう。'
					},
					{
						name: 'scale', required: '×', default: '100', type: '数値(%)',
						description: '${scale}'
					},
					{
						name: 'method', required: '×', default: 'fadeIn', type: '',
						description: '${method}'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'blur', required: '×', default: '0', type: '数値(px)',
						description: '背景にぼかしをかける場合指定します。大体10pxほどが無難です。ぼかしを解除したい場合には、同じ背景画像をbgで表示してください。'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@bg storage=house_of_yoshito.png'
			},
			bgout:{
				name: 'bgout',
				overview: '背景の消去',
				description: '背景を消去します。暗転やホワイトアウトにも利用できます。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・演出の種類'
				],
				parameter:[
					{
						name: 'overlay', required: '×', default: 'true', type: '真偽値',
						description: '暗転、ホワイトアウトのように、画面全体を覆う場合trueを指定します。背景画像だけを消去したい場合には、falseを指定してください。'
					},
					{
						name: 'color', required: '×', default: 'black', type: '色名称 / カラーコード',
						description: '背景画像を消去した際の、画面背景色を指定します。${color_suffix}'
					},
					{
						name: 'method', required: '×', default: 'fadeOut', type: '',
						description: '${method}'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@bgout overlay=false color="rgba(100, 100, 255, 0.8)" clickable=false'
			},
			bgmove:{
				name: 'bgmove',
				overview: '背景の表示位置・拡大率を変更する',
				description: '背景の表示位置、拡大率を変更します。resetを指定することで、元の状態に戻せます。',
				develop_info: [
					'テスト実装', 'チェック待ち', '特になし'
				],
				parameter:[
					{
						name: 'reset', required: '×', default: 'false', type: '真偽値',
						description: '背景の拡縮・位置を規定値に戻す場合trueを指定します。'
					},
					{
						name: 'left', required: '×', default: '0', type: '数値(px)',
						description: '表示左端位置をピクセルで指定します。scale属性で拡大している場合、left属性で位置を調整すると良いでしょう。'
					},
					{
						name: 'top', required: '×', default: '0', type: '数値(px)',
						description: '表示上端位置をピクセルで指定します。scale属性で拡大している場合、top属性で位置を調整すると良いでしょう。'
					},
					{
						name: 'scale', required: '×', default: '100', type: '数値(%)',
						description: '${scale}'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@bgmove left=0 top=540 scale=2.0 time=200<br>' + 
						 '@bgmove reset=true'
			},
			still:{
				name: 'still',
				overview: 'スチル（一枚絵）を表示する',
				description: 'スチル、一枚絵を表示します。差分画像を指定することも可能です。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・time, effect属性のデフォルト値<br>・差分仕様の確認（現状ではベース＋表情差分のみに対応）'
				],
				parameter:[
					{
						name: 'storage', required: '○', default: '×', type: '文字列(アドレス)',
						description: 'スチル画像（差分を用いる場合にはベース画像）のファイル名を指定します。対象フォルダは./data/fgimage/still/です。${storage_suffix}'
					},
					{
						name: 'upon', required: '×', default: '-', type: '文字列(アドレス)',
						description: 'スチルの差分画像のファイル名を指定します。対象フォルダは./data/fgimage/still/です。${storage_suffix}'
					},
					{
						name: 'left', required: '×', default: '0', type: '数値(px)',
						description: '表示左端位置をピクセルで指定します。scale属性で拡大している場合、left属性で位置を調整すると良いでしょう。'
					},
					{
						name: 'top', required: '×', default: '0', type: '数値(px)',
						description: '表示上端位置をピクセルで指定します。scale属性で拡大している場合、top属性で位置を調整すると良いでしょう。'
					},
					{
						name: 'scale', required: '×', default: '100', type: '数値(%)',
						description: '${scale}'
					},
					{
						name: 'method', required: '×', default: 'fadeIn', type: '',
						description: '${method}'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@still storage=yoshito_and_shizuno upon=yoshito_and_shizuno_01'
			},
			stillout:{
				name: 'stillout',
				overview: 'スチル（一枚絵）を消去する',
				description: 'スチル、一枚絵を消去します。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・timeのデフォルト値'
				],
				parameter:[
					{
						name: 'method', required: '×', default: 'fadeIn', type: '',
						description: '${method}'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@stillout time=3000'
			},
			still_mod:{
				name: 'still_mod',
				overview: 'スチル（一枚絵）の差分画像を変更する',
				description: 'スチル、一枚絵の差分画像を変更します。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・timeのデフォルト値<br>・method属性必要か'
				],
				parameter:[
					{
						name: 'storage', required: '○', default: '×', type: '文字列(アドレス)',
						description: 'スチルの差分画像のファイル名を指定します。対象フォルダは./data/fgimage/still/です。${storage_suffix}'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'time', required: '×', default: '300', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@still_mod storage=yoshito_and_shizuno_02'
			},
			still_move:{
				name: 'still_move',
				overview: 'スチルの表示位置・拡大率を変更する',
				description: 'スチルの表示位置、拡大率を変更します。resetを指定することで、元の状態に戻せます。',
				develop_info: [
					'テスト実装', 'チェック待ち', '特になし'
				],
				parameter:[
					{
						name: 'reset', required: '×', default: 'false', type: '真偽値',
						description: '背景の拡縮・位置を規定値に戻す場合trueを指定します。'
					},
					{
						name: 'left', required: '×', default: '0', type: '数値(px)',
						description: '表示左端位置をピクセルで指定します。scale属性で拡大している場合、left属性で位置を調整すると良いでしょう。'
					},
					{
						name: 'top', required: '×', default: '0', type: '数値(px)',
						description: '表示上端位置をピクセルで指定します。scale属性で拡大している場合、top属性で位置を調整すると良いでしょう。'
					},
					{
						name: 'scale', required: '×', default: '100', type: '数値(%)',
						description: '${scale}'
					},
					{
						name: 'effect', required: '×', default: 'linear', type: '文字列(リンク先参照)',
						description: '${effect}'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@still_move left=0 top=540 scale=2.0 time=200<br>' + 
						 '@still_move reset=true'
			},
		}
	},
	kind_of_effect:　{
		overview: '画面演出関連',
		tag: {
			blink:{
				name: 'blink',
				overview: '目の開閉演出を行う',
				description: '目の開閉のように、黒い枠を開く、あるいは閉じる演出を行います。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・ぼかし属性は必要か（導入するのはちょっと難しい様子）<br>・まばたき（ぱちぱちとする）も必要か'
				],
				parameter:[
					{
						name: 'type', required: '○', default: '×', type: '"open" / "close"',
						description: '開閉のどちらかを指定します。目を開く演出を行う場合"open", 目を閉じる演出を行う場合は"close"を指定してください。'
					},
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@blink type=close'
			},
			quake:{
				name: 'quake',
				overview: '画面を揺らす（クエイクを行う）',
				description: '画面をガタガタと揺らす演出を行います。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・x, y, rotation, timeのデフォルト値'
				],
				parameter:[
					{
						name: '×', required: '×', default: '10', type: '数値(px)',
						description: '横方向の振れ幅を指定します。単位はピクセルです。'
					},
					{
						name: 'y', required: '×', default: '10', type: '数値(px)',
						description: '縦方向の振れ幅を指定します。単位はピクセルです。'
					},
					{
						name: 'rotation', required: '×', default: '0', type: '数値(px)',
						description: '回転の揺れを付加する場合に指定します。'
					},
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'clickable', required: '×', default: 'true', type: '真偽値',
						description: '${click}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					}
				],
				example: '@quake x=20 y=0 rotation=5 time=2000'
			},
			eyecatch:{
				name: 'eyecatch',
				overview: 'アイキャッチを表示する',
				description: 'アイキャッチ（シーン間に表示する簡単な映像',
				develop_info: [
					'テスト実装', 'チェック待ち', '・アイキャッチを複数用意しておいて、type属性に割り当てる'
				],
				parameter:[
					{
						name: 'type', required: '×', default: '0', type: '自由名称、番号',
						description: 'アイキャッチのパターンを指定します。あらかじめ打ち合わせを行い、パターンの仕様を確定し、プログラムを作成します。'
					},
				],
				example: '@eyecatch type=2'
			},
			particle:{
				name: 'particle',
				overview: 'パーティクル演出を行う',
				description: 'パーティクルによる様々な画面演出を行います。具体的にどのようなパーティクルがあるかは、typeパラメータを参照してください。',
				develop_info: [
					'<font color=red>未実装</font>', '-', '・typeの種類<br>・具体的にどのような演出にしたいかをtype毎に<br>・フェードイン表示で良いか（timeのデフォルト値）'
				],
				parameter:[
					{
						name: 'type', required: '○', default: '×', type: '文字列(登録名称)',
						description: 'パーティクル演出の種類を選択します。種類は以下の通りです。<br>' + 
									 '"rain", "snow", "sakura"'
					},
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: 'パーティクルのフェードイン${time}'
					},
				],
				example: '@particle type=rain'
			},
			stop_particle:{
				name: 'stop_particle',
				overview: 'パーティクル演出を停止する',
				description: 'パーティクルによる画面演出を停止します。',
				develop_info: [
					'<font color=red>未実装</font>', '-', '・typeの種類<br>・フェードアウト消去で良いか（timeのデフォルト値）'
				],
				parameter:[
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: 'パーティクルのフェードアウト${time}'
					},
				],
				example: '@stop_particle time=1000'
			},
			overlay:{
				name: 'overlay',
				overview: '特殊な画面演出を行う',
				description: 'プログラムで実装できない特殊な画面演出を行います。動画をゲームにオーバーレイで載せます。',
				develop_info: [
					'<font color=red>未実装</font>', '-', '・本当に不可能な画面演出のみこれを使う方向'
				],
				parameter:[
					{
						name: 'storage', required: '○', default: '×', type: '文字列(アドレス)',
						description: '動画を指定します。対象フォルダは./data/video/overlay/です。${storage_suffix}'
					},
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: '動画のフェードイン${time}'
					},
				],
				example: '@overlay time=1000'
			},
			stop_overlay:{
				name: 'stop_overlay',
				overview: '特殊な画面演出を停止する',
				description: '特殊画面演出を停止します。',
				develop_info: [
					'<font color=red>未実装</font>', '-', '特になし'
				],
				parameter:[
					{
						name: 'time', required: '×', default: '500', type: '数値(ms)',
						description: '動画のフェードアウト${time}'
					},
				],
				example: '@stop_overlay'
			}
		}
	},
	kind_of_camera:　{
		overview: 'カメラ関連',
		tag: {
			camera:{
				name: 'camera',
				overview: 'カメラを移動する',
				description: '画面のズームや、ズーム状態での移動、パンなどの演出を行います。<br>カメラの座標は画面中央が(x:0,y:0)です。例えば、画面右上は x:200 y:200 　画面左下は x:-200 y:-200 という座標指定になります。',
				develop_info: [
					'テスト実装', 'チェック待ち', '・クリックスキップ必要か→必要なら独自タグ開発が必要<br>'
				],
				parameter:[
					{
						name: '×', required: '×', default: '-', type: '数値(px)',
						description: 'カメラの移動先X座標を指定します。'
					},
					{
						name: 'y', required: '×', default: '-', type: '数値(px)',
						description: 'カメラの移動先Y座標を指定します。'
					},
					{
						name: 'zoom', required: '×', default: '1.0', type: '数値(倍率)',
						description: '拡大率を指定します。倍率での指定です。'
					},
					{
						name: 'rotate', required: '×', default: '0', type: '数値(°)',
						description: 'カメラの傾きを指定します。角度での指定です。'
					},
					{
						name: 'from_x', required: '×', default: '-', type: '数値(px)',
						description: 'カメラの移動開始時X座標を指定します。'
					},
					{
						name: 'from_y', required: '×', default: '-', type: '数値(px)',
						description: 'カメラの移動開始時Y座標を指定します。'
					},
					{
						name: 'from_zoom', required: '×', default: '1.0', type: '数値(倍率)',
						description: '演出開始時の拡大率を指定します。倍率での指定です。'
					},
					{
						name: 'from_rotate', required: '×', default: '0', type: '数値(°)',
						description: 'カメラの演出開始時の傾きを指定します。角度での指定です。'
					},
					{
						name: 'ease_type', required: '×', default: 'ease', type: '文字列(右参照)',
						description: 'カメラの移動演出を指定できます。ease(開始時点と終了時点を滑らかに再生する)linear(一定の間隔で再生する)ease-in(開始時点をゆっくり再生する)ease-out(終了時点をゆっくり再生する)ease-in-out(開始時点と終了時点をゆっくり再生する)デフォルトはeaseです。'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					},
				],
				example: '@camera zoom=2 x=170 y=100 time=1400'
			},
			reset_camera:{
				name: 'reset_camera',
				overview: 'カメラをリセットする',
				description: 'カメラの位置を初期値に戻します。拡大率も等倍に戻ります。',
				develop_info: [
					'テスト実装', 'チェック待ち', '特になし'
				],
				parameter:[
					{
						name: 'ease_type', required: '×', default: 'ease', type: '文字列(右参照)',
						description: 'カメラの移動演出を指定できます。ease(開始時点と終了時点を滑らかに再生する)linear(一定の間隔で再生する)ease-in(開始時点をゆっくり再生する)ease-out(終了時点をゆっくり再生する)ease-in-out(開始時点と終了時点をゆっくり再生する)デフォルトはeaseです。'
					},
					{
						name: 'time', required: '×', default: '1000', type: '数値(ms)',
						description: '${time}'
					},
					{
						name: 'wait', required: '×', default: 'true', type: '真偽値',
						description: '${wait}'
					},
				],
				example: '@reset_camera'
			},
		}
	},
	kind_of_sound:　{
		overview: '音声関連',
		tag: {
			'playbgm':{
				name: 'tplaybgm',
				overview: 'BGMの再生',
				description: 'BGMを再生します。',
				develop_info: [
					'テスト実装', '-', '特になし'
				],
				parameter:[
					{
						name: 'storage', required: '○', default: '×', type: '文字列(アドレス)',
						description: '音声ファイルを指定します。対象フォルダは./data/bgm/です。${storage_suffix}'
					},
					{
						name: 'loop', required: '×', default: 'true', type: '真偽値',
						description: 'BGMをループさせるかを指定します。ループさせる場合にはtrue, ループさせない場合にはfalseを指定します。'
					},
					{
						name: 'fadein', required: '×', default: 'false', type: '真偽値',
						description: 'BGMをフェードイン再生するかを指定します。フェードさせる場合にはtrue, フェードさせない場合にはfalseを指定します。'
					},
					{
						name: 'time', required: '×', default: '2000', type: '数値(ms)',
						description: 'フェード時間を指定します。'
					},
					{
						name: 'buf', required: '×', default: '0', type: '数値',
						description: '再生対象のオブジェクトを指定します。'
					},
				],
				example: '@playbgm storage=night.ogg loop=true'
			},
			'stopbgm':{
				name: 'tstopbgm',
				overview: 'BGMの停止',
				description: 'BGMを停止します。',
				develop_info: [
					'テスト実装', '-', '特になし'
				],
				parameter:[
					{
						name: 'fadeout', required: '×', default: 'false', type: '真偽値',
						description: 'BGMをフェードアウトするかを指定します。フェードさせる場合にはtrue, フェードさせない場合にはfalseを指定します。'
					},
					{
						name: 'time', required: '×', default: '2000', type: '数値(ms)',
						description: 'フェード時間を指定します。'
					},
					{
						name: 'buf', required: '×', default: '0', type: '数値',
						description: '対象のオブジェクトを指定します。'
					},
				],
				example: '@stopbgm fade=true'
			},
			'wbgm':{
				name: 'wbgm',
				overview: 'BGMの終了を待つ',
				description: 'BGMの終了を待ちます。待つ間クリック不可になります。',
				develop_info: [
					'完成', '-', '特になし'
				],
				parameter: null,
				example: '@wbgm'
			},
			'playse':{
				name: 'tplayse',
				overview: 'SEの再生',
				description: 'SEを再生します。',
				develop_info: [
					'テスト実装', '-', '特になし'
				],
				parameter:[
					{
						name: 'storage', required: '○', default: '×', type: '文字列(アドレス)',
						description: '音声ファイルを指定します。対象フォルダは./data/bgm/です。${storage_suffix}'
					},
					{
						name: 'fadein', required: '×', default: 'false', type: '真偽値',
						description: 'SEをフェードイン再生するかを指定します。フェードさせる場合にはtrue, フェードさせない場合にはfalseを指定します。'
					},
					{
						name: 'time', required: '×', default: '2000', type: '数値(ms)',
						description: 'フェード時間を指定します。'
					},
					{
						name: 'clear', required: '×', default: 'false', type: '真偽値',
						description: 'SE再生時に、再生中SEを停止する場合trueを指定します。'
					},
					{
						name: 'buf', required: '×', default: '0', type: '数値',
						description: '対象のオブジェクトを指定します。'
					},
				],
				example: '@playse storage=chime.ogg'
			},
			'stopse':{
				name: 'tstopse',
				overview: 'SEの停止',
				description: 'SEを停止します。',
				develop_info: [
					'テスト実装', '-', '特になし'
				],
				parameter: [
					{
						name: 'fadeout', required: '×', default: 'false', type: '真偽値',
						description: 'BGMをフェードアウトするかを指定します。フェードさせる場合にはtrue, フェードさせない場合にはfalseを指定します。'
					},
					{
						name: 'time', required: '×', default: '2000', type: '数値(ms)',
						description: 'フェード時間を指定します。'
					},
					{
						name: 'buf', required: '×', default: '0', type: '数値',
						description: '対象のオブジェクトを指定します。'
					},
				],
				example: '@stopse'
			},
			'wse':{
				name: 'wse',
				overview: 'SEの終了を待つ',
				description: 'SEの終了を待ちます。待つ間クリック不可になります。',
				develop_info: [
					'完成', '-', '特になし'
				],
				parameter: null,
				example: '@wse'
			},
			'playvoice':{
				name: 'playvoice',
				overview: 'ボイスの再生',
				description: 'ボイスを再生します。',
				develop_info: [
					'中途実装', '-', '・ファイル名指定無しで、キャラ名指定による自動連番ファイル再生でよいか'
				],
				parameter:[
					/*
					{
						name: 'storage', required: '○', default: '×', type: '文字列(アドレス)',
						description: '音声ファイルを指定します。対象フォルダは./data/bgm/です。${storage_suffix}'
					},
					*/
					{
						name: 'chara', required: '○', default: '×', type: '文字列(キャラ名)',
						description: 'ボイス対象キャラの名称を指定します。当タグの呼出回数に応じて、自動的に連番のボイスが再生されます。<br>' +
									 '例：@playvoice chara=yoshito ⇒ 「再生されるのはyoshito_01」、@playvoice chara=yoshito ⇒ 「再生されるのはyoshito_02」'
					}
				],
				example: '@playvoice chara=yuto'
			},
			'stopvoice':{
				name: 'stopvoice',
				overview: 'ボイスの停止',
				description: 'ボイスを停止します。',
				develop_info: [
					'中途実装', '-', '・必要ない可能性：システム的に止めることはあっても、シナリオ的に止める必要はない？'
				],
				parameter: null,
				example: '@stopvoice'
			},
		}
	},
	kind_of_message:　{
		overview: 'メッセージウィンドウ関連',
		tag: {
			'l':{
				name: 'l',
				overview: 'クリック入力を待つ',
				description: 'ユーザのクリック入力を待ちます。クリックされると次の命令へ進行します。',
				develop_info: [
					'<font color=red>完成</font>', '-', '特になし'
				],
				parameter: null,
				example: '[l]'
			},
			'showmessage':{
				name: 'showmessage',
				overview: 'メッセージウィンドウの表示',
				description: 'メッセージウィンドウを表示します。',
				develop_info: [
					'テスト実装', 'チェック待ち', '特になし'
				],
				parameter:[
					{
						name: 'name', required: '×', default: 'yoshito', type: '文字列(名称)',
						description: 'メッセージウィンドウに表示する発言者の名称を指定します。'
					},
					{
						name: 'time', required: '×', default: '200', type: '数値(ms)',
						description: '${time}'
					},
				],
				example: '@showmessage name=enigma'
			},
			'hidemessage':{
				name: 'hidemessage',
				overview: 'メッセージウィンドウの消去',
				description: 'メッセージウィンドウを消去します。',
				develop_info: [
					'テスト実装', 'チェック待ち', '特になし'
				],
				parameter:[
					{
						name: 'time', required: '×', default: '200', type: '数値(ms)',
						description: '${time}'
					},
				],
				example: '@hidemessage'
			},
			choices:{
				name: 'choices',
				overview: '選択肢の表示',
				description: '選択肢を表示します',
				develop_info: [
					'<font color=red>未実装</font>', '-', '・選択肢のデザイン<br>・表示演出'
				],
				parameter: null,
				example: '----'
			},
		}
	}
};

/*
	,
	kind_of_:　{
		overview: '',
		tag: {
			'':{
				name: '',
				overview: '',
				description: '',
				develop_info: [
					'テスト実装', 'チェック待ち', ''
				],
				parameter:[
					{
						name: '', required: '×', default: '', type: '',
						description: ''
					},
				],
				example: '@'
			},
		}
	}
 */