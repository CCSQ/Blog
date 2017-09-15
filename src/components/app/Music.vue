<template>
	<div id="music">
		<div id="max-card" v-if="isMax">
			<Card>
				<div @click="isMax = !isMax" slot="extra"><Icon class="menu-top" type="arrow-shrink"></Icon></div>
				<div class="list">
					<Button type="ghost" :icon="musicListIsShow ? 'ios-arrow-left' : 'ios-arrow-right'" @click="showMusicList"></Button>
					<div class="music-list">
						
					</div>
				</div>

				<!-- <div class="infor">
					<p class="title">{{audio.status === 1 ? '加载中' : audio.fileName || '无文件'}}</p>
					<p class="time">{{audio.currTime | formatTime}}/{{audio.duration | formatTime}}</p>
				</div>

				<div class="menu-control">
					<a href="#" @click="pre"><Icon type="ios-arrow-back"></Icon></a>
					<a href="#" @click="audio.pause()"><Icon :type="audio.status === 3 ? 'pause' : 'play'"></Icon></a>
					<a href="#" @click="next"><Icon type="ios-arrow-forward"></Icon></a>
				</div> -->
				
				<Progress class="music-pro" :percent="Number.parseInt(audio.currTime / audio.duration * 100)" :hide-info="true" status="active" :stroke-width="2"></Progress>

				<!-- <Spin size="large" fix v-if="audio.status === 1 || audio.status === 0"></Spin> -->
			</Card>
		</div>

		<div id="min-card" v-else>
			<Card>
				<div @click="isMax = !isMax" slot="extra"><Icon class="menu-top" type="arrow-expand"></Icon></div>

				<div class="infor">
					<p class="title">{{audio.status === 1 ? '加载中' : audio.fileName || '未知'}}</p>
					<p class="time">{{audio.currTime | formatTime}}/{{audio.duration | formatTime}}</p>
				</div>

				<div class="menu-control">
					<a href="#" @click="pre"><Icon type="ios-arrow-back"></Icon></a>
					<a href="#" @click="audio.pause()"><Icon :type="audio.status === 3 ? 'pause' : 'play'"></Icon></a>
					<a href="#" @click="next"><Icon type="ios-arrow-forward"></Icon></a>
				</div>

				<Progress class="music-pro" :percent="Number.parseInt(audio.currTime / audio.duration * 100)" :hide-info="true" status="active" :stroke-width="1"></Progress>

				<Spin size="large" fix v-if="audio.status === 1 || audio.status === 0"></Spin>
			</Card>
		</div>
	</div>
</template>

<script>
	import audio_visualizer from '@/utils/utils'
	import { mapGetters, mapActions } from 'vuex'
	export default {
		data(){
			return {
				pauseIco: 'pause',
				isMax: true,
				audio: new this.audio_visualizer(),
				musicBuffer: {},
				playIndex: 0,
				musicListIsShow: true
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

			showMusicList: function () {
				this.musicListIsShow = !this.musicListIsShow
			}
		},

		computed: mapGetters({
			musicList: 'getMusicList',
		}),

		mounted: function() {
			this.audio.init()
			if (this.musicList.length > 0) this.audio.play(this.musicList[0])
		},

		filters: {
			formatTime: function (value) {
				let min = Number.parseInt(value / 60)
				let s = Number.parseInt(value - min * 60).toString()
				return min.toString() + ':' + (s.length > 1 ? s : '0' + s)
			}
		},

		watch: {
			audio: {
				handler (curVal,oldVal) {
					if (curVal.isEnd) {
						this.next()
						this.audio.isEnd = false
					}
				},
				deep:true
			}
		}
	}
</script>

<style scoped lang="less">
	@min-music-width-height:100px;
	@max-music-width-height:300px;

	#music {
		#min-card {
			width: @min-music-width-height;
			.ivu-card {
				width: @min-music-width-height;
				height: @min-music-width-height;
				&:hover {
					.menu-top {
						display: inline-block;
					}
				}
				.menu-top {
					cursor: pointer;
					right: 5px;
					top: 1px;
					display: none;
				}
				.music-pro {
					height: 1px;
					position: absolute;
					// cursor: pointer;
					bottom: 9px;
				}
				.infor {
					height: 60px;
					padding-top: 15px;
					text-align: center;
					overflow:hidden;
					p {
						line-height: 20px;
					}
					.title{
						margin-left: 10px;
						width: 80px;
						
						font-size: 5px;

						overflow: hidden;
						white-space: nowrap;
						text-overflow: hidden;
					}
				}
				.menu-control {
					// margin-top: 40px;
					margin-left: 10px;
					.ivu-icon {
						margin-left: 11px;
						// &:hover{
						// 	font-size: 20px;
						// }
					}
					a {
						color: #5c6b77;
					}
				}
			}
		}

		#max-card {
			width: @max-music-width-height;
			.ivu-card {
				width: @max-music-width-height;
				height: @max-music-width-height;
				&:hover {
					.menu-top {
						display: inline-block;
					}
				}
				.menu-top {
					cursor: pointer;
					display: none;
				}
				.list {
					width: 100px;
					height: @max-music-width-height - 4;
					border: 1px solid;
					.ivu-btn {
						width: 20px;
						height: 20px;
						padding: 1px 5px;
						position: absolute;
						top: 0px;
						left: 100px;
						border-radius: 0;
					}
				}
				.music-pro {
					height: 2px;
					position: absolute;
					// cursor: pointer;
					bottom: 9px;
				}
			}
		}
	}
</style>