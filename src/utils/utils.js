import api from '@/api'
import staticResource from './staticResource'	// 图片资源

// 工具函数，检测是否是函数
var isFunction = (object) => {
	return typeof object === "function"
}

// 兼容写法，获取动画调用接口
var animationFrame = (() => {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
		window.setTimeout(callback, 1000 / 60)
	}
})()

// 粒子对象
function Particle(x = 0, y = 0, ex = 0, ey = 0, vx = 0, vy = 0, width = 0, height = 0, color = '#FFF', tickTime = 10, v = 1500, mouseRadius = 50) {
	this.x = x	// 开始位置
	this.y = y
	this.ex = ex	// 结束位置
	this.ey = ey
	this.vx = vx	// 速度
	this.vy = vy
	this.width = width
	this.height = height
	this.color = color	// 颜色
	this.tickTime = tickTime

	this.stop = false	// 是否到达结束点
	this.a = v	// 控制速度
	this.mouseRadius = mouseRadius	// 鼠标移入显示的圆半径

	this.maxCheckTimes = 10	// 10次小于该距离判断为抵达
	this.checkLength = 2	// 检查达到终点的距离
	this.checkTimes = 0
}

Particle.prototype = {
	drawSelf: function (ctx) {
		if (ctx.fillStyle !== this.color) ctx.fillStyle = this.color
		ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)	// 绘制矩形
	},

	move: function() {
		if (this.stop) {
			this.x = this.ex
			this.y = this.ey
		} else {
			var tickTime = this.tickTime / 1000,

			cx = this.ex - this.x,	// 获取距离
			cy = this.ey - this.y

			var angle = Math.atan(cy / cx)	// 三角函数，获取移动方位
			var ax = Math.abs(this.a * Math.cos(angle))	// 位移值
			ax = this.x > this.ex ? -ax : ax

			var ay = Math.abs(this.a * Math.sin(angle))
			ay = this.y > this.ey ? -ay : ay

			this.vx += ax * tickTime
			this.vy += ay * tickTime
			this.vx *= 0.95
			this.vy *= 0.95
			this.x += this.vx * tickTime
			this.y += this.vy * tickTime

			// 判断距离终点位置是否达到最小值（检查终点的值）
			if (Math.abs(this.x - this.ex) <= this.checkLength && Math.abs(this.y - this.ey) <= this.checkLength) {
				this.checkTimes++
				if (this.checkTimes >= this.maxCheckTimes) {
					this.stop = true
				}
			} else {
				this.checkTimes = 0
			}
		}
	},

	// 检测鼠标事件
	_checkMouse: function(mouseX, mouseY) {

		// 三角函数，求出鼠标点到像素点的距离
		var distance = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2))
		// 算出运行角度
		var angle = Math.atan((mouseY - this.y) / (mouseX - this.x))
		if (distance < this.mouseRadius) {
			this.stop = false
			this.checkTimes = 0

			// 返回圆的位置
			if (!this.recordX) {
				this.recordX = this.ex
				this.recordY = this.ey
			}

			this.aBak = this.a 	// 存下原本值
			this.a = 2000 + 1000 * (1 - distance / this.mouseRadius)	// 加速

			var xc = Math.abs((this.mouseRadius - distance) * Math.cos(angle))
			var yc = Math.abs((this.mouseRadius - distance) * Math.sin(angle))
			xc = mouseX > this.x ? -xc : xc
			yc = mouseY > this.y ? -yc : yc
			this.ex = this.x + xc
			this.ey = this.y + yc
		} else {
			if (this.recordX) {
				this.stop = false
				this.checkTimes = 0

				this.a = this.aBak
				this.ex = this.recordX
				this.ey = this.recordY

				this.recordX = null
				this.recordY = null
			}
		}
	},

	// 重画
	update: function (ctx, x, y) {
		this.move(10)
		this.drawSelf(ctx)
		if (x && y) this._checkMouse(x, y)
	}
}



export default{
	install(Vue,options)
	{
		Vue.prototype.utils = function () {
			
		}

		Vue.prototype.utils.isFunction = isFunction
		Vue.prototype.utils.animationFrame = animationFrame

		// 音频相关类
		Vue.prototype.audio_visualizer = function () {
			// this.file = null	// 播放的文件
			this.fileName = null	// 文件名
			this.duration = 0	// 歌曲时间
			this.currTime = 0	// 当前时间
			this.audioContext = null	// 播放上下文
			this.animationId = null	// 动画id
			this.status = 0	// 状态值，0 停止，1 加载，2 暂停，3 开始
			this.isEnd = false
			this.buffer = null	// 歌曲文件
			this.gainValue = 50	// 音量
			this.slowlyTime = 10	// 渐强时间
			this.startTimer = null	// 计时器
			this.audioBufferSouceNode = null
			this.musicBuffer = {}	// 缓存
			this.playId = 0	// 当前播放id
			this.gainNode = null	// 音量相关
		}

		Vue.prototype.audio_visualizer.prototype = {
			// 初始化函数
			init: function () {
				this._prepareAPI()
			},

			play: function ({id = 0, url = '', name = ''}) {
				this.playId = id

				if (this.startTimer) clearInterval(this.startTimer)
				this.currTime = this.duration = this.status = 0

				if (this.musicBuffer[id]) {
					this.setFileFromCache(this.musicBuffer[id], name)
					return
				}

				api.getByXMLHttpRequest(url, {
					responseType:'arraybuffer'
				}, (xhr) => {
					if (xhr != null && xhr.statusText == 'OK') this.setFileFromHttp(xhr.response, name)
				})
			},

			changVol: function (val) {
				this.gainValue = val
				if (this.gainNode) this.gainNode.gain.value = this.gainValue / 100
			},

			// 设置播放文件
			setFileFromHttp: function (file = '', name = '') {
				if (this.audioBufferSouceNode) this.audioBufferSouceNode.stop()
				this.fileName = name
				this.buffer = file

				this._start()
			},

			// 设置播放文件
			setFileFromCache: function(cache = null, name = '') {
				if (this.audioBufferSouceNode) this.audioBufferSouceNode.stop()

				this.fileName = name
				this.duration = this.musicBuffer[this.playId].duration
				this._visualize(this.musicBuffer[this.playId])
			},

			// 暂停或者开始
			pause: function () {
				if (!this.audioContext) return
				if (this.audioContext.state === 'running') {
					this.audioContext.suspend().then(() => {
						this.status = 2
					})
				} else if (this.audioContext.state === 'suspended') {
					this.audioContext.resume().then(() => {
						this.status = 3
					})
				}
			},

			// 确定使用哪个对象处理音频
			_prepareAPI: function() {
				window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
				window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame
				window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame
				try {
					this.audioContext = new AudioContext()
				} catch (e) {
					console.error(e)
				}
			},

			// 开始处理音频
			_start: function () {
				// 异步读取文件
				// let fr = new FileReader()
				this.status = 1

				if (!this.audioContext) return
				this.audioContext.decodeAudioData(this.buffer, (buffer) => {
					this.duration = buffer.duration
					this.musicBuffer[this.playId] = buffer
					this._visualize(buffer)
				}, (e) => {
					console.error(e)
				})

				// fr.onload = (e) => {
					// if (!this.audioContext) return
					// let fileResult = e.target.result
					// 从ArrayBuffer对象中异步解码音频文件. 该方法只能作用于完整的音频文件.
					// this.audioContext.decodeAudioData(this.buffer, (buffer) => {
					// 	this._visualize(buffer)
					// }, (e) => {
					// 	console.error(e)
					// })
				// }

				// fr.onerror = (e) => {
				// 	console.log(e)
				// }

				// fr.readAsArrayBuffer(this.file)
			},

			// 音频播放
			_visualize: function (buffer) {
				let audioBufferSouceNode = this.audioContext.createBufferSource(),	// 创建音频数据
					analyser =  this.audioContext.createAnalyser(),	// 可以用来显示音频时间和频率的数据
					gainNode = this.audioContext.createGain ? this.audioContext.createGain() : this.audioContext.createGainNode(),	// 处理音频或者声音
					currTime = this.audioContext.currentTime	// 起始播放时间

				audioBufferSouceNode.connect(gainNode)
				gainNode.connect(analyser)	// 连接频率解析器
				analyser.connect(this.audioContext.destination)	//当前audio context中所有节点的最终节点，一般表示音频渲染设备。

				audioBufferSouceNode.buffer = buffer 	// 连接资源

				// 初始化音量为一半
				gainNode.gain.value = this.gainValue / 100
				// 音频开始渐强结束渐弱
				gainNode.gain.linearRampToValueAtTime(0, currTime)
				gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, currTime + this.slowlyTime)
				gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, currTime + this.duration - this.slowlyTime)
				gainNode.gain.linearRampToValueAtTime(0, currTime + this.duration)

				// 兼容处理
				if (!audioBufferSouceNode.start) {
					audioBufferSouceNode.start = audioBufferSouceNode.noteOn
					audioBufferSouceNode.stop = audioBufferSouceNode.noteOff
				}

				// 播放
				this.status = 3
				audioBufferSouceNode.start(0)	// 开始播放(播放延迟，歌曲进度，播多久)

				// 进度控制
				this.startTimer = window.setInterval(() => {	// 不停调用
					if (this.duration - this.currTime < 0.1) {
						clearInterval(this.startTimer)
						this.currTime = this.duration = this.status = 0
					}
					if (this.status === 3) this.currTime = this.audioContext.currentTime - currTime
				}, 100)
				
				// 结束事件
				audioBufferSouceNode.onended = () => {
					// 判断为自然结束
					if (this.duration - this.currTime < 0.1) this.isEnd = true
					console.log("播放结束")
				}

				this.gainNode = gainNode
				this.audioBufferSouceNode = audioBufferSouceNode

				// 可视化操作
				this._drawSpectrum(analyser,audioBufferSouceNode)
			},

			// 可视化处理
			_drawSpectrum: function (analyser,audioBufferSouceNode) {
				// 1024位处理
				var draw = () => {
					let array = new Uint8Array(analyser.frequencyBinCount)
					analyser.getByteFrequencyData(array)	// 将当前频域数据拷贝进Uint8Array数组（无符号字节数组）。
					this.animationId = requestAnimationFrame(draw)
				}
				this.animationId = requestAnimationFrame(draw)
			}
		}

		// canvas 相关，粒子系统
		Vue.prototype.canvas_particle = function ({
			element = null,
			imageUrl = null,
			title = null,
			textAlign = 'center',
			textBaseline = 'middle',
			font = '50px 微软雅黑',
			mouseListrn = false,
			color = '#CCC',
			particleSize_x = 1,
			particleSize_y = 1,
			tickTime = 10,
			v = 1500,
			mouseRadius = 50,
		}) {
			this.element = element	// canvas 节点
			this.imageUrl = imageUrl	// 图片资源
			this.title = title	// 文字，以下字体相关
			this.textAlign = textAlign
			this.textBaseline = textBaseline
			this.font = font
			this.color = color
			this.mouseListrn = mouseListrn	// 鼠标监听
			this.tickTime = tickTime
			this.v = v	// 粒子飞行速度

			this.ctx = null
			this.mouseX = null
			this.mouseY = null
			this.img = null	// 要操作的图层
			this.particleSize_x = particleSize_x	// 颗粒度
			this.particleSize_y = particleSize_y
			this.particleArray = []	// 粒子队列
			// this.animateArray = []	// 动画队列

		}


		Vue.prototype.canvas_particle.prototype = {
			init: function () {
				if (!this.element) return console.error('节点不存在！')
				
				this.ctx = this.element.getContext('2d')

				if (this.mouseListrn) this._addMouseListening()
				if (this.imageUrl) this._addImageData()
				if (this.title) this._addTitleData()

				this._execAnimate()
			},

			setTitle: function (title) {
				this.title = title
				var ctx = this.img.getContext('2d')
				ctx.clearRect(0, 0, this.img.width, this.img.height)
				ctx.fillText(this.title, this.img.width / 2, this.img.height / 2)
				this._reset()
				this._drawImg()
			},

			_reset: function () {
				this.particleArray.length = 0
			},

			// 添加鼠标监听， 获取鼠标在节点上的位置
			_addMouseListening: function () {
				window.onmousemove = (e) => {
					if (e.target.id === this.element.id) {
						this.mouseX = e.clientX - e.target.getBoundingClientRect().left
						this.mouseY = e.clientY - e.target.getBoundingClientRect().top
					} else {
						this.mouseX = this.mouseY = null
					}
				}
			},

			// 添加图片
			_addImageData: function () {
				this.img = new Image()
				this.img.src = this.imageUrl
				// 图片加载完成后画出图片
				this.img.onload = () => {
					this._drawImg()
				}
			},

			// 添加文字
			_addTitleData: function () {
				this.img = document.createElement('canvas')
				this.img.width = this.element.width
				this.img.height = this.element.height

				var ctx = this.img.getContext('2d')
				ctx.fillStyle = this.color
				ctx.textAlign = this.textAlign
				ctx.textBaseline = this.textBaseline
				ctx.font = this.font
				ctx.fillText(this.title, this.img.width / 2, this.img.height / 2)

				this._drawImg()
			},

			// 画图形并生成颗粒
			_drawImg: function () {
				if (!this.img) return console.error('生成图片失败！')

				var imgx = (this.element.width - this.img.width) / 2,
				imgy = (this.element.height - this.img.height) / 2

				this.ctx.clearRect(0, 0, this.element.width, this.element.height)	// 清空画布
				this.ctx.drawImage(this.img, imgx, imgy, this.img.width, this.img.height)	// 画出图片

				// 获得存放rgba值，按顺序每4个元素为一个像素点
				var imgData = this.ctx.getImageData(imgx, imgy, this.img.width, this.img.height)
				
				// 控制颗粒度
				for (var x = 0; x < this.img.width; x += this.particleSize_x) {
					for (var y = 0; y < this.img.height; y += this.particleSize_y) {
						var i = (y * imgData.width + x) * 4

						// 舍弃比较透明的
						if (imgData.data[i + 3] >= 125) {
							var color = "rgba(" + imgData.data[i] + "," + imgData.data[i + 1] + "," + imgData.data[i + 2] + "," + imgData.data[i + 3] + ")"

							// 随机生成起始位置(20像素点内)
							var x_random = x + Math.random() * 20,
							vx = -Math.random() * 200 + 400,
							y_random = this.img.height / 2 - Math.random() * 40 + 20,
							vy

							if (y_random < this.imgy + this.img.height / 2) {
								vy = Math.random() * 300
							} else {
								vy = -Math.random() * 300
							}

							// 生成颗粒 + img宽高是因为上方将图片居中了
							this.particleArray.push(
								new Particle(
									x_random + imgx,
									y_random + imgy,
									x + imgx,
									y + imgy,
									vx,
									vy,
									this.particleSize_x,
									this.particleSize_y,
									color,
									this.tickTime,
									this.v,
									this.mouseRadius
								)
							)

							// 画出第一帧
							this.particleArray[this.particleArray.length - 1].drawSelf(this.ctx)
						}
					}
				}
			},

			// 执行动画
			_execAnimate: function () {
				// 排序，使动画更柔顺
				this.particleArray.sort(function(a, b) {
					return a.ex - b.ex
				})

				// 防止多次调用
				if (!this.isInit) {
					this.isInit = true
					this.animate(() => {
						// 创建动画队列
						// if (this.animateArray.length < this.particleArray.length) {
						// 	this.animateArray = this.animateArray.concat(this.particleArray.slice())
						// 	// console.log(this.animateArray)
						// }
						// 更新路径
						this.particleArray.forEach((item) => {
							item.update(this.ctx, this.mouseX, this.mouseY)
						})
					})
				}
			},

			// 动画
			animate: function (callback) {
				if (isFunction(callback)) {
					this.ctx.clearRect(0, 0, this.element.width, this.element.height)

					callback()
					// 不断调用
					animationFrame(() => {
						this.animate(callback)
					})
				}
			},

		}
	}
}