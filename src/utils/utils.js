export default{
	install(Vue,options)
	{
		Vue.prototype.utils = function () {
			
		}

		// 音频相关类
		Vue.prototype.audio_visualizer = function () {
			// this.file = null	// 播放的文件
			this.fileName = null	// 文件名
			this.audioContext = null	// 播放上下文
			this.animationId = null	// 动画id
			this.pro = 0	// 进度 max：100
			this.status = 0	// 状态值，0 停止，1 加载，2 暂停，3 开始
			this.buffer = null
		}

		Vue.prototype.audio_visualizer.prototype = {
			// 初始化函数
			init: function () {
				this._prepareAPI()
			},

			// 设置播放文件
			setFile: function (file) {
				// this.file = file
				// let nameArr = file.name.split('.')
				// nameArr.pop()
				// this.fileName = nameArr.join('.')

				this.buffer = file

				this._start()
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
					analyser =  this.audioContext.createAnalyser()	// 可以用来显示音频时间和频率的数据

				audioBufferSouceNode.connect(analyser)	// 连接频率解析器
				analyser.connect(this.audioContext.destination)	//当前audio context中所有节点的最终节点，一般表示音频渲染设备。
				audioBufferSouceNode.buffer = buffer 	// 连接资源

				// 兼容处理
				if (!audioBufferSouceNode.start) {
					audioBufferSouceNode.start = audioBufferSouceNode.noteOn
					audioBufferSouceNode.stop = audioBufferSouceNode.noteOff
				}

				// 播放
				this.status = 3
				audioBufferSouceNode.start(0)	// 开始播放(播放延迟，歌曲进度，播多久)
				
				// 结束事件
				audioBufferSouceNode.onended = () => {
					this.status = 0
					console.log("播放结束")
				}

				// 可视化操作
				this._drawSpectrum(analyser,audioBufferSouceNode)
			},

			_drawSpectrum: function (analyser,audioBufferSouceNode) {
				// 1024位处理
				var draw = () => {
					let array = new Uint8Array(analyser.frequencyBinCount)
					analyser.getByteFrequencyData(array)	// 将当前频域数据拷贝进Uint8Array数组（无符号字节数组）。
					// analyser.context.currentTime	// audioContext一开始运行的计时器
					// console.log(audioBufferSouceNode.context.currentTime)
					// console.log(this.audioContext.getOutputTimestamp())
					this.animationId = requestAnimationFrame(draw)
				}
				this.animationId = requestAnimationFrame(draw)
			}
		}
	}
}