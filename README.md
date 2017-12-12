# Ningloid_Developについて
ノベルゲーム開発エンジン『Ningloid』の開発テストバージョンです。

こちらでは、テスト用に簡単な使用方法を記載しています。

[Release](https://github.com/tigrig29/Ningloid_Develop/releases)からダウンロードできます。

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

# フォルダ構成
Ningloid/\
&nbsp;&nbsp;┣ locales/\
&nbsp;&nbsp;┣ resources/\
&nbsp;&nbsp;┃&nbsp;&nbsp;┣ app/ ： エディタ用のデータ\
&nbsp;&nbsp;┃&nbsp;&nbsp;┣ game/ ： ゲーム画面用のデータ\
&nbsp;&nbsp;┃&nbsp;&nbsp;┣ Reference/ ： リファレンスのデータ\
&nbsp;&nbsp;┃&nbsp;&nbsp;┃&nbsp;&nbsp;┗ Reference.html ： リファレンスのWebページ\
&nbsp;&nbsp;┃&nbsp;&nbsp;┗ resources/\
&nbsp;&nbsp;┃&nbsp;&nbsp;　&nbsp;&nbsp;┗ **data/ ： ゲーム内で使用するデータ**\
&nbsp;&nbsp;┃&nbsp;&nbsp;　&nbsp;&nbsp;　&nbsp;&nbsp;┣ **bgimage/ ： 背景データ用フォルダ**\
&nbsp;&nbsp;┃&nbsp;&nbsp;　&nbsp;&nbsp;　&nbsp;&nbsp;┣ **bgm/ ： BGMデータ用フォルダ**\
&nbsp;&nbsp;┃&nbsp;&nbsp;　&nbsp;&nbsp;　&nbsp;&nbsp;┣ **fgimage/ ： キャラ画像データ用フォルダ**\
&nbsp;&nbsp;┃&nbsp;&nbsp;　&nbsp;&nbsp;　&nbsp;&nbsp;┣ **movie/ ： 動画データ用フォルダ**\
&nbsp;&nbsp;┃&nbsp;&nbsp;　&nbsp;&nbsp;　&nbsp;&nbsp;┣ **scenario/ ： シナリオファイル用フォルダ**\
&nbsp;&nbsp;┃&nbsp;&nbsp;　&nbsp;&nbsp;　&nbsp;&nbsp;┗ system/ ： システムデータ用フォルダ\
&nbsp;&nbsp;┗ **ningloid.exe ： Ningloidの実行ファイル**

※太字箇所は、ゲーム開発時に主に利用するファイル・フォルダです。


<font style="color: rgba(0, 0, 0, 0)">aaaa</font>


# Ningloidの使い方

## 起動
Ningloidフォルダの中の『**ningloid.exe**』をクリックして下さい。

## リアルタイムプレビュー
エディタエリアをクリック、あるいは↑↓キーで行カーソル移動すると、カーソル行までの実行状態がゲームエリアにリアルタイムで表示されます。

リアルタイムプレビューでは、エディタのアクティブなタブ（編集中のシナリオファイル）の命令のみ実行します。つまりタブを切り替えるごとにプレビューはリセットされ、また[jump]などのシナリオファイルを移動する命令は実行できません。

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

## エディタの使い方

サンプル画像

![Ningloid説明画像](https://raw.githubusercontent.com/tigrig29/Ningloid_Develop/readme_image/1.png)

編集エリアをクリックすることで、編集が可能になります。\
また複数タブを開くことも可能で、その場合現在アクティブなタブが明るく表示されます。
### ・タブを閉じる
タブの右側の「×」ボタンを押すことで閉じることが出来ます。\
未保存のタブを閉じようとした場合、確認ダイアログが表示されます。
### ・タブの編集状態を確認する
編集を行うと「×」ボタンの位置に**ペンマーク**が表示されます。\
保存を行うとこのマークは消去されます。
### ・タブエリアを横スクロールする
タブエリアでマウスホイール操作する、あるいはタブエリアの左側にある「 ＜ ＞ 」ボタンを押すことで、タブエリアをスクロールすることが出来ます。

## 各ボタンの用途
### ① 新規作成（Ctrl + N）
新規タブをエディタ上に開きます。
### ② 開く（Ctrl + O）
既存のシナリオファイルを開き、新たなタブに展開します。
### ③ 上書き保存（Ctrl + S）
現在編集中のシナリオファイルを上書き保存します。\
新規タブに対して行われた場合、別名保存が実行されます。
### ④. 別名で保存（Ctrl + Shift + S）
現在編集中のシナリオファイルに別名を付けて保存します。
### ⑤. 元に戻す（Ctrl + Z）
エディタ上の編集において、一つ前の状態に戻します。
### ⑥ やり直す（Ctrl + Y）
エディタ上の編集において、一つ後の状態にやり直します。
### ⑦ ゲームを別ウィンドウで起動（F5）
別ウィンドウでゲームを起動します。\
このゲームは、リアルタイムプレビューとは関係なく独立して実行されます。はじめに実行されるシナリオファイルは、first.ksです。
### ⑧ カーソル行以降を実行（Shift + F5）
リアルタイムプレビューを一時停止し、ゲームエリアにて、現在のカーソル位置以降の行の命令を順次実行していきます。
### ⑨ 実行停止
⑧のゲーム実行を開始すると、押下可能になります。\
[l]タグによるクリック待ち状態の時に当ボタンを押すことで、ゲーム実行を終了できます。最終行まで実行を終える、または[s]タグが実行されると、自動的に終了します。
### ※ プレビュー状態表示
以下の４種の状態があります。

| 状態 | 説明 |
|:-----------|:------------|
| 編集中     | シナリオファイルの編集により、一時リアルタイムプレビューが停止さ<br>れている状態です。 |
| プレビュー | リアルタイムプレビューが実行されている状態です。 |
| エラー     | スクリプトエラーにより、リアルタイムプレビューを停止している状態<br>です。エラー箇所を修正し、**保存処理を行うとリアルタイムプレビュー<br>が再度実行**されます。 |
| 実行中     | 「カーソル行以降の実行」が開始され、編集、リアルタイムプレビュー<br>が無効化された状態です。実行停止すると、この状態は解除されます。 |

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

## 挙動がおかしくなった場合
もし動作がおかしくなったり、操作不能になったりした場合には、ショートカットキー『**Ctrl+R**』あるいは『**ツールバー→ウィンドウ→リロード**』で、リロードを行って下さい。

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

# スクリプトの書き方
## タグについて
「タグ」とは、ゲームに何らかの動作をさせるための命令のことです。\
次のような規則で記述します。

![タグ説明画像](https://raw.githubusercontent.com/tigrig29/Ningloid_Develop/readme_image/3.png)

使用できるタグの種類や、各タグの説明は[リファレンス](#リファレンス)を参照してください。

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

## 記述規則

| 規則 | 判定 | 説明 |
|:----|:----|:----|
|記号なし|メッセージ|メッセージウィンドウにテキストとして表示される|
|行頭に @|タグ|タグに応じた処理が実行される（リファレンス参照）|
|[] で囲う|タグ|タグに応じた処理が実行される（リファレンス参照）|
|行頭に ;|コメント|何も実行されない（無視される）|
|行頭に *|ラベル|シナリオの区切り<br>オートセーブが実行される<br>[jump]タグなどでシナリオジャンプが出来る|

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

## スクリプトの例

![スクリプトサンプル](https://raw.githubusercontent.com/tigrig29/Ningloid_Develop/readme_image/2.png)

## リファレンス
各タグの説明が記載されているドキュメントです。

Ningloid.exeを起動し、ツールバー（上部のラベル）の「ヘルプ」→「リファレンス」をクリックすると、規定のブラウザでNingloid公式リファレンスが表示されます。

タグの使い方やパラメータがわからない場合は、こちらを参考にして下さい。

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

# キャラクター定義
キャラクターを表示するには[charashow]タグを使用しますが、予め**CharacterSetting.js**にてキャラクター定義しておく必要があります。

以下の説明は、CharacterSetting.jsの中にもコメントとして記述しています。

## パーツモード設定
キャラクターの立ち絵画像を複数のパーツで構成するかどうかを指定する項目です。

CharaSetting.jsの ```partsMode: "",``` で設定します。以下のモードのどちらかを左記の ```""``` に当てはめます。

| モード | 説明 |
|:----|:----|
|single|差分画像を使いません。|
|multi|差分画像を用いて立ち絵を構成します。キャラクター表示時には、定義したパーツ名を指定することで、自動的に画像を重ね立ち絵を生成します。|

## キャラクター画像定義
キャラクター名、パーツ名、パーツに対応する画像ファイル名を定義します。

### パーツモード："single" の場合
```js
// chara_name の部分にはキャラクター名を記述します
// 必ず一意の名称にして下さい
chara_name: {
    // 立ち絵データの定義
    // データ名: "画像ファイル名"
    // 画像ファイルは「fgimage」フォルダに配置して下さい
    normal: "normal.png",
    second: "second.png",
},
```

### パーツモード："multi" の場合
```js
// chara_name の部分にはキャラクター名を記述します
// 必ず一意の名称にして下さい
chara_name: {
    // 立ち絵データの定義
    // パーツ名称
    pose: {
        // データ名: "画像ファイル名"
        // 画像ファイル名は、「fgimage」フォルダからの相対パス指定も可能です
        normal: "test/pose/normal.png",
        second: "test/pose/second.png",
    },
    // パーツ名称
    face: {
        // データ名: "画像ファイル名"
        angry: "test/face/angry.png",
        sad: "test/face/sad.png"
    }
},
```

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

# システム設定
ゲーム画面の解像度やテキスト表示速度などのシステム設定を行うには、Config.jsを編集して下さい。
詳細はConfig.js内のコメントに記述しています。

<font style="color: rgba(0, 0, 0, 0)">aaaa</font>

# アンケートについて
Ningloid開発テスト版は、大学の卒業研究として制作しております。そのため、論文執筆へ向けて幾つか調査したいことがあり、アンケートの回答をお願いしています。\
差し支えなければ、以下のリンクからアンケートページへジャンプし、回答をよろしくお願いいたします。

[Ningloidに関するアンケート](https://drive.google.com/open?id=1qUGayqtloT6IAbCEa4bHWRYiaVTz9Ba-NsElx7JJ03E)

<!-- 

## 特徴
* 独自エディタ搭載
* リアルタイムプレビューにより、すぐに変更を確認できる

## 未設計項目
* 作成したゲームのパッケージング
* 各種メニュー画面の作成、改変を簡単に行う手段
* コンフィグ画面

-->