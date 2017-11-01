// vue hljs 指令
import Vue from 'vue'
import hljs from 'highlight.js'

const hljsDirective = Vue.directive('hljs', el => {
	let blocks = el.querySelectorAll('pre')
	blocks.forEach((item) => {
		let lines = item.innerHTML.split(/\n/).slice(0, -1)
		let html = lines.map((item, index) => {
			return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
		}).join('')
		html = '<ul>' + html + '</ul>'
		item.innerHTML = html

		// 语法高亮
		hljs.highlightBlock(item)

		// 行选择
		item.addEventListener('click', (event) => {
			if (!event.target || event.target.className !== 'line-num') {
				return
			}

			if (event.shiftKey) {
				// 多选 选取最靠前一条
				let lightArr = item.querySelectorAll('.light>span:first-child')
				let begin, end
				if (lightArr.length > 1) {
					begin = Number.parseInt(lightArr[0].getAttribute('data-line'))
					end = Number.parseInt(lightArr[lightArr.length - 1].getAttribute('data-line'))
				} else if (lightArr.length === 1) {
					begin = end = Number.parseInt(lightArr[0].getAttribute('data-line'))
				} else {
					event.target.parentNode.className = 'light'
					return
				}

				let select = Number.parseInt(event.target.getAttribute('data-line'))

				if (select === begin || select === end) return

				let beginChang, endChang
				// 在区间内
				if (select > begin && select < end) {
					while(++select <= end) {
						item.querySelector('span[data-line|="' + select + '"]').parentNode.className = ''
					}
					return
				// 在上方
				} else if (select < begin) {
					beginChang = select - 1
					endChang = begin - 1
				// 在下方
				} else if (select > end) {
					beginChang = end
					endChang = select
				}
				while(++beginChang <= endChang) {
					item.querySelector('span[data-line|="' + beginChang + '"]').parentNode.className = 'light'
				}

			} else {
				// 单选 清除之前选中的
				let className = event.target.parentNode.className
				item.querySelectorAll('.light').forEach((light) => {
					light.className = ""
				})

				if (className !== 'light') {
					event.target.parentNode.className = 'light'
				}
			}
		})

		// TODO 类型判断
		let classes = item.className.split(' ')
		let type = classes[classes.length - 1]
		if (type !== 'hljs' && lines.length > 2) {
			item.innerHTML = '<div><b class="copy-text">copy</b><b class="code-type">' + type + '</b></div>' + item.innerHTML
			let copy = item.querySelector('.copy-text')
			// 增加复制事件
			copy.addEventListener('click', () => {
				let textArea				= document.createElement("textarea")
				textArea.style.position		= 'fixed'
				textArea.style.top			= 0
				textArea.style.left			= 0
				textArea.style.width		= '2em'
				textArea.style.height		= '2em'
				textArea.style.padding		= 0
				textArea.style.border		= 'none'
				textArea.style.outline		= 'none'
				textArea.style.boxShadow	= 'none'
				textArea.style.background	= 'transparent'
				textArea.value				= lines.join("\n")
				document.body.appendChild(textArea)
				textArea.select()
				// TODO 本地国际化
				try {
					document.execCommand('copy') ? window.$Message.success('复制成功') : window.$Message.error('复制失败')
				} catch(err) {
					window.$Message.error('浏览器不支持')
				}
				document.body.removeChild(textArea)
			})
		}
	})

	// Array.prototype.forEach.call(blocks, hljs.highlightBlock)
})

export default hljsDirective