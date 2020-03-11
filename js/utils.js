/**
 * 模拟JQuery的$方法，获取DOM对象
 * @param {Object} value
 */
function $(value) {
	let prefix = value.substr(0, 1);
	value = value.substr(1, value.length);

	switch(prefix) {
		case '#':
			return document.getElementById(value);
			break;
		case '.':
			return document.getElementsByClassName(value);
			break;
		default: 
			return null;
	}	
}

/**
 * 根据字符串返回对应的二维数组
 * @param {String} str
 * @param {String} symbol
 * @param {Int} length
 */
function splitTwo(str, symbol, length) {
	let strData = str.split(symbol);
	let c = Math.ceil(strData.length / length);
	let data = new Array();
	let y = 0;
	for (let i = 0; i < c; i++) {
		data.push(new Array());
		let len = y + length;
		for (y; y < len; y++) {
			data[i].push(strData[y]);
		}
	}
	return data;
}
