/* global NLE: true */

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
					if(NLE.flag.playing) return;
					$("#editButtonNewTab").click();
				}
			},
			{
				label: "開く",
				accelerator: "CommandOrControl+O",
				click(){
					if(NLE.flag.playing) return;
					$("#editButtonFileOpen").click();
				}
			},
			{
				label: "閉じる",
				accelerator: "CommandOrControl+W",
				click(){
					if(NLE.flag.playing) return;
					$("#editTabLabel").find(".active").find(".tabLabelCloseButton").click();
				}
			},
			{type: "separator"},
			{
				label: "上書き保存",
				accelerator: "CommandOrControl+S",
				click(){
					if(NLE.flag.playing) return;
					$("#editButtonOverwriteSave").click();
				}
			},
			{
				label: "別名で保存",
				accelerator: "CommandOrControl+Shift+S",
				click(){
					if(NLE.flag.playing) return;
					$("#editButtonAnotherSave").click();
				}
			},
		]
	},
	{
		label: "編集",
		submenu: [
			{
				label: "元に戻す",
				role: "undo",
				click(){
					if(NLE.flag.playing) return;
					$("#editButtonUndo").click();
				}
			},
			{
				label: "やり直す",
				role: "redo",
				click(){
					if(NLE.flag.playing) return;
					$("#editButtonRedo").click();
				}
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
			// {
			// 	label: "表示切り替え",
			// 	submenu: [
			// 		{
			// 			label: "ゲーム＋エディタ",
			// 			type: "radio",
			// 			click(){

			// 			}
			// 		},
			// 		{
			// 			label: "エディタのみ",
			// 			type: "radio",
			// 			click(){

			// 			}
			// 		},
			// 	]
			// },
			// {type: "separator"},
			{
				label: "ゲーム",
				submenu: [
					{
						label: "画面サイズ",
						submenu: [
							{
								label: "480×270",
								type: "radio",
								click(){
									setGameSize(480);
								}
							},
							{
								label: "640×360",
								type: "radio",
								checked: true,
								click(){
									setGameSize(640);
								}
							},
							{
								label: "800×450",
								type: "radio",
								click(){
									setGameSize(800);
								}
							},
							{
								label: "960×540",
								type: "radio",
								click(){
									setGameSize(960);
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
									NLE.design.setTheme("simple");
								}
							},
							{
								label: "ダーク",
								type: "radio",
								checked: true,
								click(){
									NLE.design.setTheme("dark");
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
				label:"ゲーム起動",
				accelerator: "F5",
				click(){
					$("#playGameOnAnother").click();
				},
			},
			{type: "separator"},
			{
				label:"選択行以降を実行",
				accelerator: "Shift+F5",
				click(){
					if(NLE.flag.playing) return;
					$("#playGameOnThis").click();
				}
			},
			{
				label:"実行を停止",
				click(){
					$("#stopGameOnThis").click();
				}
			},
			// {type: "separator"},
			// {
			// 	label:"リアルタイムプレビュー",
			// 	submenu: [
			// 		{
			// 			label: "オン",
			// 			type: "radio",
			// 			click(){
			// 			}
			// 		},
			// 		{
			// 			label: "オフ",
			// 			type: "radio",
			// 			click(){
			// 			}
			// 		}
			// 	]
			// },
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

function setGameSize(width){
	NLE.design.gameResize(width);
	NLE.design.setEditorStyle();
}
