// 音频相关类
import api from '@/api'
import { stringIsNotNull, string2NumberFloat, string2NumberInt } from './stringUtils'
import { jsonString2jsonObject } from './jsonUtils'

// 将网易云音乐的歌曲时间转换为毫秒时间
var changLrcTime = (string) => {
	let data = string.split(':')
	return string2NumberFloat((string2NumberInt(data[0]) * 60 + string2NumberFloat(data[1])).toFixed(2))
}

export const audio_visualizer = function () {
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
	this.uint8ArrayData = []
	this.canvasObj = null	// canvas对象
	this.gradient = null	// 渐变对象
	this.lrc = null	// 歌词
	this.nowLrc = ''	// 当前歌词
}

audio_visualizer.prototype = {
	// 初始化函数
	init: function () {
		this._prepareAPI()
	},

	getUint8ArrayData: function () {
		return this.uint8ArrayData
	},

	setCanvasObj: function (canvasObj) {
		this.canvasObj = canvasObj
		// 设置渐变
		this.gradient = this.canvasObj.getCtx().createLinearGradient(0, 0, 200, 0)
		this.gradient.addColorStop(1, '#f00')
		this.gradient.addColorStop(0.5, '#ff0')
		this.gradient.addColorStop(0, '#0f0')
	},

	setLrc: function (lrc) {
		this.lrc = lrc
		this.lrc.lrc.lyricData = []
		this.lrc.lrc.lyric.split('\n').forEach((item)=>{
			if (stringIsNotNull(item)) {
				let data = item.replace('[','').split(']')
				this.lrc.lrc.lyricData.push({
					time: changLrcTime(data[0]),
					string: data[1]
				})
			}
		})
	},

	play: function ({id = 0, url = '', name = '', lrcUrl= ''}) {
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
			if (lrcUrl) {
				api.getByXMLHttpRequest(lrcUrl, {
				}, (xhr) => {
					if (xhr != null && xhr.statusText == 'OK') this.setLrc(jsonString2jsonObject(xhr.response))
				})
			}
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
		var capYPositionArray = []	// 高度数据
		var meterNum = this.canvasObj.getHeight() / 2	// 取出数量
		// 1024位处理
		var draw = () => {
			// 播放结束，取消动画
			if (this.isEnd || this.status === 0) {
				this.uint8ArrayData = []
				cancelAnimationFrame(this.animationId)
				return
			}
			this.uint8ArrayData = new Uint8Array(analyser.frequencyBinCount)
			analyser.getByteFrequencyData(this.uint8ArrayData)	// 将当前频域数据拷贝进Uint8Array数组（无符号字节数组）。

			// 画出音频图
			if (this.canvasObj) {
				this.canvasObj.getCtx().clearRect(0, 0, this.canvasObj.getWidth(), this.canvasObj.getHeight())
				

				let step = Math.round(this.uint8ArrayData.length / meterNum)	// 获取间隔
				for (let i = 0; i < meterNum; i++) {
					let value = this.uint8ArrayData[i * step]
					if (capYPositionArray.length < Math.round(meterNum)) capYPositionArray.push(value)


					// 暂停
					if (this.status === 2) {
						value = -- capYPositionArray[i] - 10
					}

					// 画黑点
					this.canvasObj.getCtx().fillStyle = '#000'
					if (value < capYPositionArray[i]) {
						this.canvasObj.getCtx().fillRect(--capYPositionArray[i], this.canvasObj.getHeight() - i * 2, 1, 1)
					} else {
						capYPositionArray[i] = value
						this.canvasObj.getCtx().fillRect(capYPositionArray[i] + 1, this.canvasObj.getHeight() - i * 2, 1, 1)
					}
					// 画线
					this.canvasObj.getCtx().fillStyle = this.gradient
					this.canvasObj.getCtx().fillRect(0, this.canvasObj.getHeight() - i * 2, value, 1)
				}
			}

			// 歌词显示
			if (this.lrc) {
				this.currTime = string2NumberFloat(this.currTime.toFixed(2))
				for (var i = 0; i < this.lrc.lrc.lyricData.length; i++) {
					if (!this.lrc.lrc.lyricData[i + 1] || this.currTime >= this.lrc.lrc.lyricData[i].time && this.currTime < this.lrc.lrc.lyricData[i + 1].time) {
						this.nowLrc = this.lrc.lrc.lyricData[i].string
						break
					}
				}
			}
			this.animationId = requestAnimationFrame(draw)
		}
		this.animationId = requestAnimationFrame(draw)
	}
}
