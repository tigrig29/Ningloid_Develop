;ラベル
;アクセス名 | 日本語名称（省略可）
*start|スタート

;メッセージレイヤの設定
[messageconfig left=5% top=75% width=90% height=20% opacity=0.8 margin=10px visible=true]
;メッセージレイヤの表示
[showmessage method="lightSpeedIn" time=1000]

;テキストの表示
こんにちは。クリックで次のメッセージへ。[l][cm]

;テキスト
こんばんは。クリックで改行。[l][r]
次のクリックでメッセージレイヤを消去し、その次のクリックで再度表示します。[l]

;メッセージレイヤ消去
@hidemessage
;クリック待ち
@l
;メッセージレイヤ表示
@showmessage time=0

;テキストクリア
[cm]

;テキスト
表示しました。[l][r]
背景を表示します。以後、クリックで背景変更を行います。[l]

;背景の表示
[bg storage="room.jpg" time=1000]

;クリック待ち
[l]

;背景の変更（横長画像の右側だけ表示）
[bg storage="panorama.png" fit=cover left=-1920 time=1000]

;クリック待ち
[l]


;背景の変更（左側だけ）
[bg storage="panorama.png" fit=cover left=0 time=1000]

;クリック待ち
[l]

;背景の変更（画面内にフィットさせる）
[bg storage="panorama.png" time=1000]

;クリック待ち
[l]

;背景の変更（アニメーションを変化）
[bg storage="rouka.jpg" method=flipInX time=1000]

;メッセージクリア
[cm]
;テキスト
背景のテスト終了。[l][cm]
BGMを再生します。クリックでフェードアウトして停止します。[l][cm]

;BGM再生
@playbgm storage="music.ogg" fade=1000 volume=30
;クリック待ち
[l]
;BGM停止
@stopbgm fade=3000

ここからBGMを再生したまま実行していきます。[l][cm]

;BGM再生
@playbgm storage="music.ogg" volume=10

;キャラクター名称用メッセージレイヤを準備
[messageconfig layer=message1 left=5% top=66% width=20% height=7% opacity=0.8 margin=10px marginl=80px visible=true bg-color="rgb(50,90,50)"]

;マクロを定義
;キャラ名称用メッセージレイヤにキャラ名を表示する
[macro name="showcharaname"]
    ;操作レイヤをキャラ名称用に切り替え
    [current layer=message1]
    ;メッセージをクリア
    @er
    ;テキストを入力（nameパラメータを指定されなかった場合は何もしない）
    @text value=%name cond="mp.name"
    [iscript]
        tf.showcharanameFlag = true;
        if($("#message1").css("opacity") == 1) tf.showcharanameFlag = false;
    [endscript]
    ;レイヤを表示
    [showmessage time=%time|300 cond="tf.showcharanameFlag"]
    ;操作レイヤをもとに戻しておく
    [current layer=message0]
[endmacro]

;マクロの定義
[macro name="ler"]
    ;クリックと操作中のメッセージクリアの合成
    [l][er]
[endmacro]

キャラクターを表示します。[ler]

;キャラクター「testA」表示
@charashow name=testA pose=miko1 face=sad left=750px top=400px scale=3.0

;キャラ名、Aちゃんで表示
@showcharaname name=Aちゃん

こんにちは～。[ler]
もう退場するね～[l]

;Aちゃん退場
@charahide name=testA method=fadeOutRight

;キャラ名ウィンドウを隠す
[hidemessage layer=message1]

;メッセージクリア
[er]

別のキャラクターを登場させます。[ler]

;Bちゃん登場
@charashow name=testB left=450px top=400px scale=3.0

;キャラ名、Bちゃんで表示
@showcharaname name=Bちゃん

やぁ。[l][r]
Aちゃんを呼ぶね。[ler]

;Aちゃん再登場
@charashow name=testA pose=school2 left=1150px top=400px scale=3.0

;キャラ名、Aちゃんに切り替え
@showcharaname name=Aちゃん

また来ちゃった。[ler]

;キャラ名、A・Bに切り替え
@showcharaname name=A・B
ふたりとも退場するね～。[ler]

[hidemessage layer=message1]

;Aちゃん退場
@charahide name=testA wait=false
@charahide name=testB



これからシナリオジャンプのテストを行います。[ler]
一度ループしますが、次は違うシナリオが流れるようにします。[ler]

;ゲーム内変数f.test_flagを0で初期化する
;この変数はあとで利用する
[eval exp="f.test_flag=0"]

;[jump]タグはリアルタイムプレビューに対応していないため、以降の処理はF5キーのゲーム実行でご確認下さい
*jump_test


;現在のf.test_flagの値を表示する
現在のテストフラグの値は[r]
[text value="&f.test_flag"][r]
です。[ler]

;ゲーム内変数f.test_flagの値を1増加させる
[eval exp="f.test_flag++"]

テストフラグの値判定[l][r]
;テストフラグの値次第で、表示するテキストを変更する
;初回
[text value="初めての通過なのでループします。" cond="f.test_flag==1"]
;二回目
[text value="既に通過済みであるためループしません。" cond="f.test_flag==2"]

;テキストクリア
[ler]

;初回は
[jump target=*jump_test cond="f.test_flag==1"]

ループを抜けました。[l][r]
サンプルシナリオは以上です。[l][cm]

[stopbgm]

[s]