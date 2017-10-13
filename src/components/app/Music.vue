<template>
	<div id="music">
		<canvas id="canvas-music" class="music-car-canvas" width="600px" height="40px"></canvas>
		<div class="music-car" >
			
			<div class="music-car-lrc">
				<p>{{audio.nowLrc}}</p>
			</div>

			<div class="music-car-infor">
				<p class="title">{{audio.status === 1 ? $t('sys.loading') : audio.fileName || $t('sys.no_file')}}</p>
				<!-- <p class="time">{{audio.currTime | formatTime}}/{{audio.duration | formatTime}}</p> -->
			</div>

			<div class="music-car-control-list">
				<span @click="pre"><Icon type="ios-arrow-back"></Icon></span>
				<span @click="audio.pause()"><Icon :type="audio.status === 3 ? 'pause' : 'play'"></Icon></span>
				<span @click="next"><Icon type="ios-arrow-forward"></Icon></span>
			</div>

			<Progress class="music-car-pro" :percent="audio.currTime / audio.duration * 100" :hide-info="true" status="active" :stroke-width="1"></Progress>
		</div>
		
	</div>
</template>

<script>
	import Velocity from 'velocity-animate'
	import { audio_visualizer, canvas_draw } from '@/utils/utils'
	import staticResource from '@/utils/staticResource'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		data(){
			return {
				canvas: null,
				audio: new this.audio_visualizer(),
				playIndex: 0,
			}
		},

		methods: {
			pre: function () {
				if (this.playIndex == 0) {
					this.audio.play(this.musicList[this.musicList.length - 1])
					this.playIndex = this.musicList.length - 1
				} else {
					this.audio.play(this.musicList[-- this.playIndex])
				}
			},

			next: function () {
				if (this.playIndex == this.musicList.length - 1) {
					this.audio.play(this.musicList[0])
					this.playIndex = 0
				} else {
					this.audio.play(this.musicList[++ this.playIndex])
				}
			},

			changVol: function (value) {
				this.audio.changVol(value)
			},

		},

		computed: mapGetters({
			musicList: 'getMusicList',
		}),

		mounted: function() {
			this.audio.init()
			if (this.musicList.length <= 0) return console.log($t('nusuc.empty_list'))
			this.audio.play(this.musicList[0])
			this.audio.setLrc(staticResource.lrc)
			this.canvas = new this.canvas_draw({
				element: document.getElementById("canvas-music"),
			})
			this.canvas.init()
			this.audio.setCanvasObj(this.canvas)
			
		},

		filters: {
			formatTime: function (value) {
				let min = Number.parseInt(value / 60)
				let s = Number.parseInt(value - min * 60).toString()
				return min.toString() + ':' + (s.length > 1 ? s : '0' + s)
			},
		},

		watch: {
			audio: {
				handler (curVal,oldVal) {
					// 结束判断
					if (curVal.isEnd) {
						this.next()
						this.audio.isEnd = false
					}
				},
				deep:true,
			},
		},
	}
</script>

<style scoped lang="less">
	@import "../../assets/css/style.less";
	@min-music-width-height: 100px;
	@max-music-width-height: 300px;

	.music-car {
		text-align: center;
		margin-top: 10px;
		width: 140px;

		&-infor {
			display: inline-block;
			font-size: 10px;
			color: @font-color;
		}

		&-lrc {
			position: absolute;
			top: 10px;
			left: 10%;
			font-size: 10px;
			line-height: 22px;
		}

		&-control-list {
			display: inline-block;
			width: 100px;
			line-height: 22px;
			span {
				display: inline-block;
				width: 20%;
				color: @unhover-color;
				&:hover {
					cursor: pointer;
				}
			}
		}

		&-pro {
			position: absolute;
			top: -10px;
			right: 0;
		}
	}

	.music-car-canvas {
		position: absolute;
		left: 0;
		bottom: 0;
	}

</style>