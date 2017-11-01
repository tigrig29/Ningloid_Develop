ningloid.keyMouse = {
	keydownArray: [],
	init(){
		const $clickLayer = ningloid.layer.getLayer("clickLayer");
		$clickLayer.on("click", () => {
			this.next();
		});
		const mousewheelevent = "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
		$(document).on({
			mousedown: (e) => {
				if(e.which == 3) ningloid.menu.hide();
			},
			contextmenu: () => false,
			keydown: (e) => {
				const keyNumber = e.which;
				const keydownArray = this.keydownArray;
				if(!keydownArray.includes(keyNumber)){
					// 押下中のキーナンバーを保管
					keydownArray.push(keyNumber);

					switch(keyNumber){
						case 17:
							this.skip();
							break;
					}
				}
			},
			keyup: (e) => {
				const keyNumber = e.which;
				const keydownArray = this.keydownArray;
				// 押下中だったキーナンバーを削除
				if(keydownArray.includes(keyNumber)) keydownArray.splice(keydownArray.indexOf(keyNumber), 1);

				switch(keyNumber){
					// Shift
					case 16:
						this.auto();
						break;
					// Ctrl
					case 17:
						this.skip();
						break;
				}
			},
		});
		$(document).on(mousewheelevent, (e) => {
			// e.preventDefault();
			const delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
			if (delta < 0){
				// マウスホイールを下にスクロールしたときの処理を記載
				// console.log("↓")
			} else {
				// マウスホイールを上にスクロールしたときの処理を記載
				ningloid.menu.show("backlog");
			}
		});
	},
	// 次へ進む
	next(){
		ningloid.messageSkip();
		ningloid.animSkip();
		ningloid.resolve();
		// console.log(ningloid.parser.label)
	},

	// オートモード操作
	auto(){
		const auto = ningloid.system.auto;
		if(ningloid.flag.autoMode) auto.stop();
		else auto.start();
	},
	// スキップモード操作
	skip(){
		const skip = ningloid.system.skip;
		if(ningloid.flag.skipMode) skip.stop();
		else skip.start();
	},
};

