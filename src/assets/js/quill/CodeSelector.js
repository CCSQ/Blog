// 代码编辑器类型选择

export class CodeSelector {
	constructor(quill, options) {	// 插件运行函数
		this.quill = quill
		this.options = options
		this.container = quill.options.container	// 全文信息
		this.codeBlockList = this.container.getElementsByClassName('ql-syntax')	// 代码编辑框列表
		this.codeSelectList = []	// 生成的代码选择框
		this.languages = this.quill.options.codetypelist || ['javascript','html','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript','javascript']	// 语言类型
		this.quill.on('text-change', function(delta, olddelta, source) {	// 监听文本变化
			for (let d in delta.ops) {
				if (delta['ops'][d].hasOwnProperty('attributes')) {	// 插入模块
					if (delta['ops'][d]['attributes'].hasOwnProperty('code-block')) {	// 插入的是代码块
						if (delta['ops'][d]['attributes']['code-block']) {	// 判断是否为去掉代码框（大代码框分成两个小代码框）
							this.onAddCodeBlock()
						} else {
							this.onAddCodeBlock(true)
						}
					}
				} else if (delta['ops'][d].hasOwnProperty('insert')) {	// 输入
					if (delta['ops'][d]['insert'] === '\n') {	// 回车事件,调整高度
						this.ArrangeY()
					}
				} else if (delta['ops'][d].hasOwnProperty('delete') && delta['ops'][d]['delete'] === 1) {	// 删除
					this.onAddCodeBlock()
				}
			}
		}.bind(this))

	}

	onAddCodeBlock(flag) {
		if (this.codeBlockList.length > this.codeSelectList.length) {
			for (let i = 0, len = this.codeBlockList.length; i < len; i++) {
				if (!this.codeSelectList[i] || this.codeBlockList[i].offsetTop !== parseInt(this.codeSelectList[i].style.top, 10)) {	// 选择框不在或者对应的选择框不在（按top属性判断）
					if (flag) {	// 去掉代码框
						let item = this.codeBlockList[i],
							cur = new CodeSelectBlock(item.offsetTop, this.languages, this.codeBlockList[i], this.codeSelectList[i - 1].getElementsByTagName('span')[0].innerHTML)
						this.codeSelectList.splice(i, 0, cur)
						this.container.insertBefore(cur, this.codeSelectList[i + 1])

					} else {
						let item = this.codeBlockList[i],
							cur = new CodeSelectBlock(item.offsetTop, this.languages, this.codeBlockList[i])
						this.codeSelectList.splice(i, 0, cur)
						this.container.appendChild(cur)
					}

					break
				}
			}
		} else if (this.codeBlockList.length < this.codeSelectList.length) {	// 移除代码框
			this.onRemoveCodeBlock()
		}

		this.ArrangeY()
	}

	onRemoveCodeBlock() {
		let i = 0
		while (i < this.codeSelectList.length) {
			if (!this.codeBlockList[i] || this.codeBlockList[i].offsetTop !== parseInt(this.codeSelectList[i].style.top, 10)) {
				this.container.removeChild(this.codeSelectList[i])
				this.codeSelectList.splice(i, 1)
				break
			}
			i++
		}
	}

	ArrangeY() {
		for (let i = 0, len = Math.min(this.codeBlockList.length, this.codeSelectList.length); i < len; i++) {
			this.codeSelectList[i].style.top = this.codeBlockList[i].offsetTop + 'px';
		}
	}
}

// 选择框对象
class CodeSelectBlock {
	constructor(top, languages, selectItem, inhriet) {
		this.selectItem = selectItem
		this.init(top, languages)
		this.events = new Event()	// 初始化事件
		this.initEvent()
		if (inhriet) {
			this.span.innerHTML = inhriet
			this.events._emit('change-language')
		}

		return this.container
	}

	getValue() {
		return this.span.innerHTML
	}

	// 初始化函数，下拉框的生成在该位置
	init(top, languages) {
		// 主体框
		this.container = this.itemConstructor('div', {
			'position': 'absolute',
			'background-color': '#393a3c8a',
			'height': '28px',
			'width': '130px',
			'border-radius': '5px',
		})

		// 下拉列表
		this.list = this.itemConstructor('ul', {
			'width': '120px',
			'max-height': '200px',
			'position': 'absolute',
			'padding': '0',
			'text-align': 'center',
			'margin': '0',
			'box-sizing': 'border-box',
			'top': '30px',
			'right': '0px',
			'overflow-y': 'auto',
			'visibility': 'hidden',
			'color': '#fff',
			'background-color': '#393a3c8a',
			'z-index': 0
		}, 'code-type-list')

		// 显示框
		this.span = this.itemConstructor('span', {
			'height': '23px',
			'outline': 'none',
			'position': 'absolute',
			'top': '5px',
			'left': '0',
			'width': '100px',
			'color': '#fff',
			'text-align': 'center',
		}, 'code-type-input')

		// 选择按钮
		this.button = this.itemConstructor('button', {
			'position': 'absolute',
			'outline': 'none',
			'box-sizing': 'border-box',
			'background': 'none',
			'height': '28px',
			'width': '30px',
			'right': '0px',
			'border': '0px',
			'border-left': '1px solid #fff',
			'color': '#fff',
			'cursor': 'pointer',
		})

		this.container.appendChild(this.list)
		this.container.appendChild(this.span)
		this.container.appendChild(this.button)

		this.extendStyle(this.container, {
			top: top + 'px',
			right: '15px',
		})

		// 初始化语言列表
		this.languages = languages
		for (let i = 0; i < this.languages.length; i++) {
			this.list.appendChild(this.itemConstructor('li', {
				'list-style': 'none',
				'height': '30px',
				'user-select': 'none',
				'cursor': 'pointer',
				'font-size': '13px'
			}, 'code-type-item', this.languages[i]))
		}
	}

	// 创建标签
	itemConstructor(tagName, style, className = '', innerHTML = '') {
		let item = document.createElement(tagName)
		item.className = className
		item.innerHTML = innerHTML
		this.extendStyle(item, style)
		return item
	}

	// 设置style
	extendStyle(element, style) {
		for (let s in style) {
			element.style[s] = style[s];
		}
	}

	// 增加事件处理
	initEvent() {
		this.button.onclick = () => {
			if (this.list.style.visibility === 'hidden') {
				this.list.style.zIndex = 10
				this.list.style.visibility = 'initial'
			} else if (this.list.style.visibility === 'initial') {
				this.list.style.visibility = 'hidden'
				this.list.style.zIndex = 0
			}
		}

		Array.prototype.forEach.call(this.list.children, (item) => {
			item.addEventListener('mousedown', () => {
				this.span.innerHTML = item.innerText
				this.events._emit('change-language')
				this.list.style.visibility = 'hidden'
				this.list.style.zIndex = 0
			})
		})

		this.events._on('change-language', () => {
			// 图标设置，语言设置
			let att = this.selectItem.setAttribute('data-code-type', this.getValue())
// 			this.button.style.background = `url(http://owa0yzg8x.bkt.clouddn.com/${this.getValue()}.svg) no-repeat center center`;
		})
	}
}

class Event {
	constructor() {
		this.eventBus = {};
	}
	_on(event, fn) {
		if (!this.eventBus.hasOwnProperty(event)) {
			this.eventBus[event] = [fn];
		} else {
			this.eventBus[event].push(fn);
		}
	}
	_emit(event) {
		if (this.eventBus.hasOwnProperty(event)) {
			for (let i = 0, len = this.eventBus[event].length; i < len; i++) {
				this.eventBus[event][i]();
			}
		}
	}
}
