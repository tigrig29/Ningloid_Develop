const {remote} = require("electron");
const {Menu, MenuItem, BrowserWindow} = remote;

// ================================================================
// ツールバー
// ================================================================
const template = [
	{
		label: "ファイル",
		submenu: [
			{
				label: "新規作成",
				accelerator: "CommandOrControl+N",
				click(){

				}
			},
			{
				label: "開く",
				accelerator: "CommandOrControl+O",
				click(){

				}
			},
			{
				label: "閉じる",
				accelerator: "CommandOrControl+W",
				click(){

				}
			},
			{type: "separator"},
			{
				label: "上書き保存",
				accelerator: "CommandOrControl+S",
				click(){

				}
			},
			{
				label: "名前をつけて保存",
				accelerator: "CommandOrControl+Shift+S",
				click(){

				}
			},
		]
	},
	{
		label: "編集",
		submenu: [
			{
				label: "元に戻す",
				role: "undo"
			},
			{
				label: "やり直す",
				role: "redo"
			},
			{type: "separator"},
			{
				label: "コピー",
				role: "copy"
			},
			{
				label: "切り取り",
				role: "cut"
			},
			{
				label: "貼り付け",
				role: "paste"
			},
			{
				label: "全選択",
				role: "selectall"
			}
		]
	},
	{
		label: "表示",
		submenu: [
			{
				label: "表示切り替え",
				submenu: [
					{
						label: "ゲーム＋エディタ",
						type: "radio",
						click(){

						}
					},
					{
						label: "エディタのみ",
						type: "radio",
						click(){

						}
					},
				]
			},
			{type: "separator"},
			{
				label: "ゲーム",
				submenu: [
					{
						label: "画面サイズ",
						submenu: [
							{
								label: "640×360",
								type: "radio",
								click(){

								}
							},
							{
								label: "960×540",
								type: "radio",
								click(){

								}
							},
							{
								label: "1280×720",
								type: "radio",
								click(){

								}
							},
						]
					},
				]
			},
			{
				label: "エディタ",
				submenu: [
					{
						label: "テーマ",
						submenu: [
							{
								label: "シンプル",
								type: "radio",
								click(){

								}
							},
							{
								label: "ダーク",
								type: "radio",
								click(){

								}
							}
						]
					}
				]
			},
		]
	},
	{
		label: "実行",
		submenu: [
			{
				label:"ゲーム単体実行",
				accelerator: "F5",
				click(){
					const windowOptions = require("../game/window_options.js");
					let win = new BrowserWindow(windowOptions);
					win.loadURL(`file://${__dirname}/../game/index.html`);
				},
			},
		]
	},
	{
		label: "ウィンドウ",
		submenu: [
			{
				label: "最小化",
				role: "minimize"
			},
			{
				label: "フルスクリーン",
				role: "togglefullscreen"
			},
			{type: "separator"},
			{
				label: "リロード",
				role: "reload"
			},
			{
				label: "強制リロード",
				role: "forcereload"
			},
			{type: "separator"},
			{
				label: "デベロッパーツール",
				role: "toggledevtools"
			},
		]
	},
	{
		label: "ヘルプ",
		submenu: [
			{
				label: "タグリファレンス",
				click () {
					let dir = __dirname.replace(/\\/g, "/").replace(/\/editor/g, "");
					// console.log(`file://${dir}/Reference/reference.html`);
					require("electron").shell.openExternal(`file://${dir}/Reference/reference.html`);
				}
			}
		]
	}
];
// ツールバーセット
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
