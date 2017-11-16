// canvas 画笔相关

import { animationFrame } from './compatible'

export const canvas_draw = function ({
	element = null,
	data = [],
}) {
	this.element = element	// 节点
	this.data = data

	this.ctx = null
	this.width = 0
	this.height = 0
}

canvas_draw.prototype = {
	init: function () {
		if (!this.element) return console.error('节点不存在！')
		this.ctx = this.element.getContext('2d')
		this.width = this.element.width
		this.height = this.element.height
	},

	getCtx: function () {
		return this.ctx
	},

	getWidth: function () {
		return this.width
	},

	getHeight: function () {
		return this.height
	},

	drawImg: function (img) {
		let imge = new Image()
		imge.src = img
		imge.onload = () => {
			this.ctx.drawImage(imge, 0, 0)
		}
	},

}
