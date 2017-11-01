
module.exports = {
    "root": true,
    "extends": 'eslint:recommended',
    "parserOptions": {
        "ecmaVersion": 8
    },
    "installedESLint": true, 
    "env": {
        "browser": true,
        "node": true,
        "jquery": true,
        "es6": true,
        "commonjs": true,
    },
    "globals": {
      "PIXI": true,
      "ningloid": true,
      "Container": true,
      "autoDetectRenderer": true,
      "loader": true,
      "resources": true,
      "TextureCache": true,
      "Texture": true,
      "Sprite": true,
      "html2canvas": true,
    },
    "rules": {
        /*エラーが起きやすいもの（基本は全て2）*/
        "no-cond-assign": 0,            // 条件処理内で代入を行わないこと
        "no-console": 0,                // console の使用をしないこと
        /*ベストプラクティス（基本は全て0）*/
        "accessor-pairs": 1,            // getter とsetter はペアで作成すること
        "block-scoped-var": 2,          // 宣言した変数は宣言したブロックスコープ内で利用すること
        "complexity": 2,                // 循環的複雑度が規定値(デフォルト20)以内であること
        "no-empty-pattern": 2,          // 値の入らない分割代入を記述しないこと
        "no-eq-null": 1,                // null または undefined と比較するときは厳密な比較演算子を利用すること
        "no-fallthrough": 1,            // switch文で下のcaseに流れ落ちるコードを作らないこと
        "no-lone-blocks": 1,            // 不必要なコードブロックを作らないこと
        "no-loop-func": 1,              // ループ内においてブロック変数を利用する関数定義を行わないこと
        "no-new-wrappers": 2,           // プリミティブオブジェクトのラッパークラス(String, Number, Boolean)をインスタンス化しないこと
        "no-new": 2,                    // 変数代入を行わないインスタンス生成をしないこと
        "no-redeclare": 2,              // 同じ変数名を再定義しないこと
        "no-unused-labels": 2,          // どこからも使われないラベルを作らないこと
        "no-warning-comments": 2,       // 特定文字列(todo, fixme, xxx)を含むコメントは除去されていること
        "require-await": 0,             // 非同期関数では async 文 が含まれていること
        /*変数（基本は全て0）*/
        "init-declarations": 1,         // 変数定義時に初期化を行うこと
        "no-catch-shadow": 2,           // catch句の外側で定義された変数をcatch句のエラー変数にしないこと
        "no-delete-var": 2,             // 変数宣言したものは delete しないこと
        "no-label-var": 2,              // 同一スコープ内において変数とラベルに同じ名使わないこと
        "no-restricted-globals": 2,     // evet など特定のグローバル変数に値代入を行わないこと
        "no-shadow-restricted-names": 2,// 予約済みグローバル変数(NaN, Infinity, undefined など)に代入を行わないこと
        "no-shadow": 1,                 // 外側のスコープで定義された変数を隠すような変数定義を行わないこと
        "no-undef-init": 1,             // 変数定義時に undefined で初期を行わないこと
        "no-undef": 2,                  // 未定義の変数は利用しないこと
        "no-undefined": 0,              // undefined を使用しないこと
        "no-unused-vars": 0,            // 未使用の定義(変数、関数)は削除すること
        "no-use-before-define": 0,      // 定義より前に使用しないこと
        /*表記法*/
        "comma-dangle": 0,              // オブジェクトまたは配列の最後の要素の後にカンマを書かないこと
        "eol-last": 1,                  // ファイルの最後には空行を入れること
        "indent": [0, 4],               // インデントは4つの空白文字で行うこと（tabも不可）
        "no-trailing-spaces": 1,        // 行末に不要な空白を残さないこと
        "no-mixed-spaces-and-tabs": 1,  // 空白とタブを混在させないこと
        "quotes": [1, "double"],        // 文字列はダブルクォートで記述すること
        "semi": 1,                      // 文末にはセミコロンを記述すること
        /*ECMAScript 6*/
        "arrow-body-style": 1,          // アロー関数の波括弧は必要に応じて記載すること
        "arrow-parens": 1,              // アロー関数の引数部分には丸括弧を記述すること
        "arrow-spacing": 1,             // アロー関数の矢印前後には空白を入れること
        "constructor-super": 1,         // 継承しているクラスのコンストラクタではsuper()を呼び出しており、継承していないクラスのコンストラクタではsuper()を呼び出していないこと"no-duplicate-imports": 1,      // 
        "no-const-assign": 2,           // const 定義された変数の再定義を行わないこと
        "no-dupe-class-members": 2,     // クラスメンバーの名前は重複させないこと
        "no-useless-computed-key": 1,   // 不要な算術プロパティ表記は行わないこと
        "no-useless-constructor": 1,    // 何もしないコンストラクタ または 親クラスのコンストラクタを呼び出すだけのコンストラクタ は記述しないこと
        "no-useless-rename": 1,         // import, export, 分割代入において変数名を変更しないこと
        "no-var": 1,                    // var (メソットスコープ変数) は使わず let または const (ブロックスコープ変数) を使うこと
        "object-shorthand": 0,          // オブジェクト定義時にショートハンドが利用できる場合は利用すること
        "prefer-arrow-callback": 0,     // コールバックにはアロー関数を利用すること
        "prefer-const": 0,              // 再代入を行わない変数は const を利用すること
        "prefer-rest-params": 1,        // arguments の代わりに 残余引数 を利用すること
        "prefer-spread": 1,             // Function.prototype.apply() の代わりに スプレッド演算子 を利用すること
        "prefer-template": 1,           // 文字列結合の代わりにテンプレートリテラルを利用すること
        "rest-spread-spacing": 1,       // 残余引数とスプレッド演算子を記述するときはその演算子と表記の間に空白を入れないこと
        "template-curly-spacing": 1,    // テンプレートリテラルで利用する波括弧の内側には空白を入れないこと
        "yield-star-spacing": 1,        // yield* の * の前には空白を入れず後には空白を入れること
    }
};