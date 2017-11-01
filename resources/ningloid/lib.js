// electron jQuery読み込み
const $ = jQuery = require("../resources/libs/jquery-3.0.0.min.js");

(function($){
    // オブジェクトの値渡し（オブジェクトをコピーして返す）
    $.cloneObject = (obj) => $.extend(true, {}, obj);
    // 配列の値渡し（オブジェクトをコピーして返す）
    $.cloneArray = (array) => $.extend(true, [], array);

    // クリックスキップ配列にオブジェクトをプッシュする
    $.clickSkipPush = (click, target, key) => {
        let retKey = false;
        if(String(click) == "true"){
            // すでに同じkeyのオブジェクトがある場合、別名にする
            if(!ningloid.tmp.animating[key]) retKey = key;
            else retKey = `key${ningloid.tmp.animating.length}`;
            ningloid.tmp.animating[retKey] = target;
            return retKey;
        }
        return retKey;
    };
    // クリックスキップ後処理（追加したオブジェクトを消去する）
    $.clickSkipClear = (key) => {
        if(key !== false) delete ningloid.tmp.animating[key];
    };

    // 対象セレクタのDOMオブジェクトのキャプチャ画像を取得する
    $.screenshot = (selector, cb) => {
        html2canvas($(selector).get(0),{
          onrendered: (canvas) => {
            const dataURI = canvas.toDataURL("image/png");
            if(cb) cb(dataURI);
          }
        });
    };

    // 現在の日にちを取得する
    $.getDate = function(target) {
        const nowdate = new Date();
        // 年
        const year = nowdate.getFullYear();
        // 月
        const month = nowdate.getMonth() + 1;
        // 日
        const date = nowdate.getDate();

        // 引数次第で戻り値を変更する
        let ret =  `${year}/${month}/${date}`;
        switch(target){
            case "year":
                ret = year; break;
            case "month":
                ret = month; break;
            case "date":
                ret = date; break;
        }

        return ret;
    };

    // 現在の時刻を取得する
    $.getTime = function(target) {
        const nowdate = new Date();
        // 時間
        const hour = nowdate.getHours();
        // 分
        const minute = nowdate.getMinutes();
        // 秒
        const second = nowdate.getSeconds();

        // 引数次第で戻り値を変更する
        let ret =  `${hour}:${minute}:${second}`;
        switch(target){
            case "hour":
                ret = hour; break;
            case "minute":
                ret = minute; break;
            case "second":
                ret = second; break;
        }

        return ret;
    };

    /* ================================================ */
    // ● コンソール系
    /* ================================================ */

    // コンソールにまとまった情報を表示する
    $.groupLog = (group, data) => {
        console.groupCollapsed(group[0], group[1]);
        for(let val of data){
            if($.isArray(val)) console.log(val[0], val[1]);
            else console.log(val);
        }
        console.groupEnd();
    };
    // 実行情報をコンソール表示するテンプレート
    $.orderLog = () => {
        let parse = ningloid.parser;
        // 開発モードの判定：開発モードでないならばログ表示しない
        if(ningloid.config.develop.mode !== true) return;
        // order、orderObj共に空ならばログ表示しない
        if(!parse.order && !parse.orderObj) return;

        // ログのタイトル部分
        let title = `%c[${parse.url}]:${parse.line}行目`;
        // ログの実行命令表記
        let order = `%c${parse.order}`;
        // ログ出力
        $.groupLog([title, "color:purple"],[
            [order, "color:blue"],
            parse.orderObj
        ]);
    };

    /* ================================================ */
    // ● エラー系
    /* ================================================ */

    $.tagError = (message) => {
        let parse = ningloid.parser;
        console.error("エラーが発生しました。以下の情報を確認してください。");
        $.groupLog([`%c[${parse.url}]:${parse.line}行目`, "color:red"],[
            [`%c${String(message).replace(/<br>/g, "\n").replace(/<(".*?"|'.*?'|[^'"])*?>/g, "")}`, "color:red"],
            [`%c${parse.order}`, "color:blue"],
            parse.orderObj
        ]);
        // 開発モードでない場合は終了
        if(ningloid.config.develop.mode !== true) return;
        // アラート表示オプションONならば
        if(ningloid.config.develop.alert === true){
                $.confirm({
                    icon: "fa fa-warning",
                    title: "<b>Error !</b>",
                    content: `[<font color='red'>${parse.url}]：${parse.line}行目でエラーが発生しました。</font><br><font color='blue'>${parse.order}</font><br>${message}`,
                    smoothContent: false,
                    type: "red",
                    typeAnimated: true,
                    boxWidth: "700px",
                    useBootstrap: false,
                    buttons: {
                        close: () => {}
                    }
                });
        }
    };
    $.systemError = (message, consoleOnly) => {
        let parse = ningloid.parser;
        // 開発モードでない場合は終了
        if(ningloid.config.develop.mode !== true) return;
        console.error(String(message).replace(/<br>/g, "\n\t").replace(/<(".*?"|'.*?'|[^'"])*?>/g, ""));
        // アラート表示オプションONならば
        if(ningloid.config.develop.alert === true && consoleOnly !== true){
                $.confirm({
                    icon: "fa fa-warning",
                    title: "<b>Error !</b>",
                    content: message,
                    smoothContent: false,
                    type: "red",
                    typeAnimated: true,
                    boxWidth: "700px",
                    useBootstrap: false,
                    buttons: {
                        close: () => {}
                    }
                });
        }
    };


    /* ================================================ */
    // ● セーブ・ロード系
    /* ================================================ */

    // 実行ファイルのパスを取得
    $.getProcessPath = function(){
        const path = process.execPath;
        // MACOS用
        let tmpIndex = path.indexOf(".app");
        let os = "mac";
        // WinOS用
        if(path.indexOf(".app") == -1){
            tmpIndex = path.indexOf(".exe");
            os="win";
        }
        // パスの取得
        const tmpPath = path.substr(0,tmpIndex);
        let pathIndex =0;
        if(os=="mac"){
            pathIndex = tmpPath.lastIndexOf("/");
        }else{
            pathIndex = tmpPath.lastIndexOf("\\");
        }

        // 最終パス
        const outPath = path.substr(0,pathIndex);
        return outPath;
    };

    // ストレージにデータを保存する
    $.storeData = (key, data, type) => {
        const jsonData = JSON.stringify(data);
        switch(type){
            case "webcompress":
                $.storeWebCompress(key, jsonData);
                break;
            case "file":
                $.storeFile(key, jsonData);
                break;
            default:
                $.storeWeb(key, jsonData);
        }
    };
    // Webのローカルストレージに保存する（高速・容量少）
    $.storeWeb = (key, data) => localStorage.setItem(key, escape(data));
    // Webのローカルストレージに、データを圧縮して保存する（低速・容量中）
    $.storeWebCompress = (key, data) => {};
    // デスクトップアプリのみ：プロジェクトフォルダのstoreファイルに保存する（高速・容量大）
    $.storeFile = (key, data) => {
        const fs = require("fs");

        let outPath = "";
            outPath = $.getProcessPath();

        //mac os Sierra 対応
        /*
        if(process.execPath.indexOf("var/folders")!=-1){
            outPath = `${process.env.HOME}/_TyranoGameData`;
            if(!fs.existsSync(outPath)){
                fs.mkdirSync(outPath);
            }
        }else{
            outPath = $.getProcessPath();
        }
        */
        // 開発テストデータ
        fs.writeFileSync(`./${key}.sav`, escape(data));
        fs.writeFileSync(`./${key}Visible.sav`, data);
        // 正規データ
        // fs.writeFileSync(`${outPath}/${key}.sav`, escape(data));
    };

    // ストレージにデータを保存する
    $.getStoreData = (key, type) => {
        switch(type){
            case "webcompress":
                return $.getStoreWebCompress(key);
            case "file":
                return $.getStoreFile(key);
            default:
                return $.getStoreWeb(key);
        }
    };
    // Webのローカルストレージに保存する（高速・容量少）
    $.getStoreWeb = (key) => {
        const data = JSON.parse(unescape(localStorage.getItem(key)));
        return data;
    };
    // Webのローカルストレージに、データを圧縮して保存する（低速・容量中）
    $.getStoreWebCompress = (key) => {

    };
    // デスクトップアプリのみ：プロジェクトフォルダのstoreファイルに保存する（高速・容量大）
    $.getStoreFile = (key) => {
        let jsonData = "null";
        try {
            const fs = require("fs");
            let outPath = "";
                outPath = $.getProcessPath();


            //Mac os Sierra 対応
            /*
            if(process.execPath.indexOf("var/folders")!=-1){
                outPath = process.env.HOME+"/_TyranoGameData";
                if(!fs.existsSync(outPath)){
                    fs.mkdirSync(outPath);
                }
            }else{
                outPath = $.getProcessPath();
            }
            */

            // 開発テストデータ
            if (fs.existsSync(`./${key}.sav`) ){
                const data = fs.readFileSync(`./${key}.sav`);
                jsonData = JSON.parse(unescape(data));
            } else {
                jsonData = JSON.parse(unescape(localStorage.getItem(key)));
            }

            if (jsonData == "null") return null;

            /*正規データ
            if (fs.existsSync(`${outPath}/${key}.sav`) ){
                const data = fs.readFileSync(`${outPath}/${key}.sav`);
                jsonData = JSON.parse(unescape(data));
            } else {
                jsonData = JSON.parse(unescape(localStorage.getItem(key)));
            }

            if (jsonData == "null") return null;
            */

        } catch(e) {
            alert("この環境はセーブ機能を利用できません。ローカルで実行している場合などに発生します");
        }

        return jsonData;
    };

    $.clearLocalStorage = () => localStorage.clear();






    /* ================================================ */
    // ● 演出系
    /* ================================================ */

    $.fn.extend({
        animateCss(animationProps, cb) {
            const animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
            this.css(animationProps).addClass("animated")
              .one(animationEnd, function() {
                $(this).removeClass("animated");
                for(let prop in animationProps) $(this).css(prop, "");
                if(cb) cb();
            });
            return this;
        },
    });

})(jQuery);


const requestAnimationFrame = ( function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame;
} )();

const cancelAnimationFrame = ( function(){
    return  window.cancelAnimationFrame       ||
            window.webkitCanvelAnimationFrame ||
            window.mozCancelAnimationFrame    ||
            window.oCancelAnimationFrame      ||
            window.msCancelAnimationFrame;
} )();
