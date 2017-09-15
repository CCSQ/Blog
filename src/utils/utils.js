import api from '@/api'

export default{
	install(Vue,options)
	{
		Vue.prototype.utils = function () {
			
		}

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
			this.gainValue = 0.5	// 音量
			this.slowlyTime = 10	// 渐强时间
			this.startTimer = null	// 计时器
			this.audioBufferSouceNode = null
			this.musicBuffer = {}	// 缓存
			this.playId = 0	// 当前播放id
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

			stopAsync: function () {
				return new Promise((resolve, reject) => {
					
					resolve()
				})
			},

			// 设置播放文件
			setFileFromHttp: function (file = '', name = '') {
				// this.file = file
				// let nameArr = file.name.split('.')
				// nameArr.pop()
				// this.fileName = nameArr.join('.')
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
				window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
				window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
				window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
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
					// let fileResult = e.target.result;
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
				gainNode.gain.value = this.gainValue
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
					// analyser.context.currentTime	// audioContext一开始运行的计时器
					// console.log(audioBufferSouceNode.context.currentTime)
					// console.log(this.audioContext.getOutputTimestamp())
					// console.log(this.audioContext.destination.context.currentTime)
					// console.log(this.audioContext.currentTime)
					this.animationId = requestAnimationFrame(draw)
				}
				this.animationId = requestAnimationFrame(draw)
			}
		}
	}
}