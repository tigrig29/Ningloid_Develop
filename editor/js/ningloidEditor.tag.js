/* global NLE: true, Editor: true */

ningloidEditor.tag = {
	init(){
		for(let tagName in this) ningloid.tag[tagName] = this[tagName];
	}
};

NLE.tag.s = {
	start: () => new Promise((resolve, reject) => {
		// 停止を実行した行数を保管
		NLE.flag.stop = ningloid.parser.line;
		// stopResolve
		resolve("stop");
	})
};

