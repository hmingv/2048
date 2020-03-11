/**
 * 游戏对象
 */
game = {
	// 画板数据
	data: [],
	positionData: [],
	// 分值
	score: 0,
	// 游戏状态 true=开始,false=中断/暂停
	status: false,
	// 是否结束 true=游戏结束,fasle=正常
	gameover: false,
	// 步长
	step: 1,
	
	/**
	 * 游戏初始化
	 */
	init: function() {
		// 初始化赋值
		game.status = true;
		game.score = 0;
		game.data = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		game.positionData = [
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null]
		];
		
		// 生成两个数值
		game.randomNum();
		game.randomNum();
		
		// 移动监听
		game.moveEvent();
	},
	
	/**
	 * 移动监听事件
	 */
	moveEvent: function() {
		// 注册按键监听
		document.addEventListener('keydown', function(e) {
			let keyCode = e.keyCode;
			if (game.status) {
				// 获取移动前的数据
				let beforeData = String(game.data);
				switch(keyCode) {
					case 37:
						for (let y = 0; y < 4; y++) {
							game.moveLeft(y);
						}
						break;
					case 38:
						for (let x = 0; x < 4; x++) {
							game.moveUp(x);
						}
						break;
					case 39:
						for (let y = 0; y < 4; y++) {
							game.moveRight(y);
						}
						break;
					case 40:
						for (let x = 0; x < 4; x++) {
							game.moveDown(x);
						}
						break;
				}
				// 获取移动后的数据
				let afterData = String(game.data);
				// 如果两次的数据不同，代表移动成功
				if (beforeData != afterData) {
					game.renderType(keyCode, splitTwo(beforeData, ',', 4), splitTwo(afterData, ',', 4));
					game.positionData = [
						[null, null, null, null],
						[null, null, null, null],
						[null, null, null, null],
						[null, null, null, null]
					];
					// 获取一个随机码
					setTimeout(function() {
						game.randomNum();
					}, 200);
				}
			} else {
				alert('游戏暂停或结束！');
			}
		});
	},
	
	/**
	 * 生成随机位置的随机数（2/4）
	 * @param {Int} line
	 * @param {Int} column
	 */
	randomNum: function() {
		// 无限循环，直到赋值完成
		// 获取随机位置 line 行
		line = Math.floor(Math.random() * 4);
		// 获取随机位置 column 列
		column = Math.floor(Math.random() * 4);

		// 当前位置为0，才可赋值
		let value = game.data[line][column];
		if (value != 0) {
			game.randomNum();
		} else {
			// 仅随机 2或4
			game.data[line][column] = Math.random() > 0.4 ? 4 : 2;
			// 创建元素div
			$('.params_box')[0].innerHTML 
			= $('.params_box')[0].innerHTML + 
			`<div id='position_${line}${column}' class='cell num${game.data[line][column]}'></div>`;
		}
	},
	
	/**
	 * 渲染方式
	 * @param {Int} keyCode
	 */
	renderType: function(keyCode, before, after) {
		switch(keyCode) {
			case 37:
				console.log('左移');
				for (let line = 0; line < 4; line++) {
					for (let column = 0; column < 4; column++) {
						game.render(line, column, before, after);
					}
				}
				break;
			case 38:
				console.log('上移');
				for (let column = 0; column < 4; column++) {
					for (let line = 0; line < 4; line++) {
						game.render(line, column, before, after);
					}
				}
				break;
			case 39:
				console.log('右移');
				for (let line = 0; line < 4; line++) {
					for (let column = 3; column >= 0; column--) {
						game.render(line, column, before, after);
					}
				}
				break;
			case 40:
				console.log('下移');
				for (let column = 0; column < 4; column++) {
					for (let line = 3; line >= 0; line--) {
						game.render(line, column, before, after);
					}
				}
				break;
			}
	},
	
	/**
	 * 页面渲染
	 * @param {Int} line
	 * @param {Int} column
	 * @param {Array} before
	 * @param {Array} after
	 */
	render: function(line, column, before, after) {
		// 移动之前的值
		let beforeValue = before[line][column];
		// 移动之后的值
		let afterValue = after[line][column];
		// 当前定位索引
		let posi = game.positionData[line][column];
		// 如果当前定位索引存在，表示该位置的值应当变动过
		if (posi != null) {
			if (posi == -1 && beforeValue == afterValue) {
				return;
			}
			// 若原来该位置值为0，便是后面的值移动到此，直接修改后面的值到该位置
			if (beforeValue == 0) {
				$(`#position_${posi}`).setAttribute('class', `cell num${afterValue}`);
				$(`#position_${posi}`).setAttribute('id', `position_${line}${column}`);
			// 否则表示两者结合
			} else {
				// 移除原有位置块
				let box = $(`#position_${line}${column}`);
				// 重新写入值，为变化后的值
				$(`#position_${posi}`).setAttribute('class', `cell num${afterValue}`);
				$(`#position_${posi}`).setAttribute('id', `position_${line}${column}`);
				if (box != null) {
					setTimeout(function() {
						if (box != null) {
							box.parentNode.removeChild(box);  
						}
					}, 100);
				}
			}
		// 定位索引不存在，表示此处无变更		
		} else {
			// 若该位置原有的值为0，移除该位置内容
			if (beforeValue == 0 || (beforeValue != 0 && afterValue == 0)) {
				let box = $(`#position_${line}${column}`);
				if (box != null) {
					box.parentNode.removeChild(box);  
				}
			}
		}
	},
	
	/**
	 * 左移-按行走
	 * @param {Int} line
	 */
	moveLeft: function(line) {
		let storageIndex = -1;
		for (let column = 0; column < 3; column++) {
			// 获取当前判断位置的索引，若上次此位置或前位置为空
			// 存储索引为前面有值位置的索引，否则为自身
			let index = storageIndex != -1 ? storageIndex : column;
			let afterIndex = column + 1;
			// 获取当前位置的值
			let currentValue = game.data[line][index];
			// 获取之后位置的值
			let afterValue = game.data[line][afterIndex];
			// 如果当前位置值为0，之后位置的值不为0
			if (currentValue == 0 && afterValue != 0) {
				// 设定当前位置值为之后位置的值
				game.data[line][index] = afterValue;
				// 设置之后位置的值为0
				game.data[line][afterIndex] = 0;
				game.positionData[line][index] = `${line}${afterIndex}`;
				// 修改存储索引为当前索引，用于下次比较
				storageIndex = index;
			// 如果当前位置的值或之后位置的值为0
			} else if (currentValue == 0 || afterValue == 0) {
				// 修改存储索引为当前索引，用于下次比较
				storageIndex = index;
			// 如果当前位置的值等于之后位置的值
			} else if (currentValue == afterValue) {
				// 设置当前位置的值为自身的2倍
				game.data[line][index] = currentValue * 2;
				// 设置之后位置的值为0
				game.data[line][afterIndex] = 0;
				game.positionData[line][index] = `${line}${afterIndex}`;
				// 修改存储索引为之后的索引，用于指定下次数值的存放位置
				storageIndex = index + 1;
			//	如果当前的值不等于之后的值且本次索引不等于当前位置索引
			} else if (currentValue != afterValue && index != column) {
				// 
				game.data[line][index + 1] = afterValue;
				game.data[line][afterIndex] = 0;
				storageIndex = index + 1;
				game.positionData[line][index + 1] = `${line}${afterIndex}`;
			}
		}
	},
	
	/**
	 * 右移-按行
	 * @param {Int} line
	 */
	moveRight: function(line) {
		let storageIndex = -1;
		// 循环列
		for (let column = 3; column > 0; column--) {
			// 获取当前判断位置的索引，若上次此位置或前位置为空
			// 存储索引为前面有值位置的索引，否则为自身
			let index = storageIndex != -1 ? storageIndex : column;
			let afterIndex = column - 1;
	
			// 获取当前位置的值
			let currentValue = game.data[line][index];
			// 获取之后位置的值
			let afterValue = game.data[line][afterIndex];
			// 如果当前位置值为0，之后位置的值不为0
			if (currentValue == 0 && afterValue != 0) {
				// 设定当前位置值为之后位置的值
				game.data[line][index] = afterValue;
				// 设置之后位置的值为0
				game.data[line][afterIndex] = 0;
				game.positionData[line][index] = `${line}${afterIndex}`;
				// 修改存储索引为当前索引，用于下次比较
				storageIndex = index;
			// 如果当前位置的值或之后位置的值为0
			} else if (currentValue == 0 || afterValue == 0) {
				// 修改存储索引为当前索引，用于下次比较
				storageIndex = index;
			// 如果当前位置的值等于之后位置的值
			} else if (currentValue == afterValue) {
				// 设置当前位置的值为自身的2倍
				game.data[line][index] = currentValue * 2;
				// 设置之后位置的值为0
				game.data[line][afterIndex] = 0;
				game.positionData[line][index] = `${line}${afterIndex}`;
				// 修改存储索引为之后的索引，用于指定下次数值的存放位置
				storageIndex = index - 1;
			//	如果当前的值不等于之后的值且本次索引不等于当前位置索引
			} else if (currentValue != afterValue && index != column) {
				// 
				game.data[line][index - 1] = afterValue;
				game.data[line][afterIndex] = 0;
				storageIndex = index - 1;
				game.positionData[line][index - 1] = `${line}${afterIndex}`;
			}
		}
	},
	
	/**
	 * 向下-按列
	 * @param {Int} column
	 */
	moveDown: function(column) {
		let storageIndex = -1;
		for (let line = 3; line > 0; line--) {
			let index = storageIndex != -1 ? storageIndex : line;
			let afterIndex = line - 1;
			// 获取当前位置的值
			let currentValue = game.data[index][column];
			// 获取之后位置的值
			let afterValue = game.data[afterIndex][column];
			
			// 如果当前位置值为0，之后位置的值不为0
			if (currentValue == 0 && afterValue != 0) {
				// 设定当前位置值为之后位置的值
				game.data[index][column] = afterValue;
				// 设置之后位置的值为0
				game.data[afterIndex][column] = 0;
				game.positionData[index][column] = `${afterIndex}${column}`;
				// 修改存储索引为当前索引，用于下次比较
				storageIndex = index;
			// 如果当前位置的值或之后位置的值为0
			} else if (currentValue == 0 || afterValue == 0) {
				// 修改存储索引为当前索引，用于下次比较
				storageIndex = index;
			// 如果当前位置的值等于之后位置的值
			} else if (currentValue == afterValue) {
				// 设置当前位置的值为自身的2倍
				game.data[index][column] = currentValue * 2;
				// 设置之后位置的值为0
				game.data[afterIndex][column] = 0;
				game.positionData[index][column] = `${afterIndex}${column}`;
				// 修改存储索引为之后的索引，用于指定下次数值的存放位置
				storageIndex = index - 1;
			//	如果当前的值不等于之后的值且本次索引不等于当前位置索引
			} else if (currentValue != afterValue && index != line) {
				game.data[index - 1][column] = afterValue;
				game.data[afterIndex][column] = 0;
				storageIndex = index - 1;
				game.positionData[index - 1][column] = `${afterIndex}${column}`;
			}
		}
	},
	
	/**
	 * 向上-按列
	 * @param {Int} column
	 */
	moveUp: function(column) {
		let storageIndex = -1;
		for (let line = 0; line < 3; line++) {
			let index = storageIndex != -1 ? storageIndex : line;
			let afterIndex = line + 1;
			// 获取当前位置的值
			let currentValue = game.data[index][column];
			// 获取之后位置的值
			let afterValue = game.data[afterIndex][column];
			
			// 如果当前位置值为0，之后位置的值不为0
			if (currentValue == 0 && afterValue != 0) {
				// 设定当前位置值为之后位置的值
				game.data[index][column] = afterValue;
				// 设置之后位置的值为0
				game.data[afterIndex][column] = 0;
				game.positionData[index][column] = `${afterIndex}${column}`;
				// 修改存储索引为当前索引，用于下次比较
				storageIndex = index;
			// 如果当前位置的值或之后位置的值为0
			} else if (currentValue == 0 || afterValue == 0) {
				// 修改存储索引为当前索引，用于下次比较
				storageIndex = index;
			// 如果当前位置的值等于之后位置的值
			} else if (currentValue == afterValue) {
				// 设置当前位置的值为自身的2倍
				game.data[index][column] = currentValue * 2;
				// 设置之后位置的值为0
				game.data[afterIndex][column] = 0;
				game.positionData[index][column] = `${afterIndex}${column}`;
				// 修改存储索引为之后的索引，用于指定下次数值的存放位置
				storageIndex = index + 1;
			//	如果当前的值不等于之后的值且本次索引不等于当前位置索引
			} else if (currentValue != afterValue && index != line) {
				game.data[index + 1][column] = afterValue;
				game.data[afterIndex][column] = 0;
				storageIndex = index + 1;
				game.positionData[index + 1][column] = `${afterIndex}${column}`;
			}
			
		}
	}
}

/**
 * 在页面完成初始化后加载Javascript
 */
window.onload = function() {
	try {
		game.init();
	} catch (error) {
		console.log(error);
	} 
}
