<template>
	<div id="music">
		<div id="max-card" v-if="isMax">
			<Card>
				<div @click="isMax = !isMax" slot="extra"><Icon class="menu-top" type="arrow-shrink"></Icon></div>
				<div class="list">
					<div class="music-list" v-show="musicListIsShow">
						<ul>
							<li v-for="(item, index) in musicList"  @click="audio.play(musicList[index])">{{item.name}}</li>
						</ul>
					</div>
					<Button type="ghost" :icon="musicListIsShow ? 'ios-arrow-left' : 'ios-arrow-right'" @click="showMusicList"></Button>
				</div>
				
				<div class="main-music">
					<div class="infor">
						<p class="title">{{audio.status === 1 ? '加载中' : audio.fileName || '无文件'}}</p>
						<p class="time">{{audio.currTime | formatTime}}/{{audio.duration | formatTime}}</p>
					</div>

					<div class="menu-control">
						<a href="#" @click="pre"><Icon type="ios-arrow-back"></Icon></a>
						<a href="#" @click="audio.pause()"><Icon :type="audio.status === 3 ? 'pause' : 'play'"></Icon></a>
						<a href="#" @click="next"><Icon type="ios-arrow-forward"></Icon></a>
					</div>

					<div class="volume-control">
						<Slider :value="50" :min="0" :max="100" @input="changVol"></Slider>
					</div>
					
				</div>

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
				musicListIsShow: false
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
					// 结束判断
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

	.music(@sixe) {
		.ivu-card {
			width: @sixe;
			height: @sixe;
			&:hover {
				.menu-top {
					display: inline-block;
				}
			}
			.menu-top {
				cursor: pointer;
				display: none;
			}
			.music-pro {
				position: absolute;
				bottom: 9px;
				height: 1px;
			}
		}
	}

	.music-body() {
		.menu-control {
			a {
				color: #5c6b77;
			}
		}
	}

	#music {
		#min-card {
			width: @min-music-width-height;
			.music(@min-music-width-height);
			.ivu-card {
				.music-body;
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
				}
			}
		}

		#max-card {
			width: @max-music-width-height;
			.music(@max-music-width-height);
			.ivu-card {
				.menu-top {
					position: absolute;
					top: 8px;
					right: 8px;
					z-index: 20;
				}
				.list {
					height: @max-music-width-height - 4;
					float: left;
					position: absolute;
					z-index: 20;
					background-color: #fff;
					// 菜单显示隐藏按钮
					.ivu-btn {
						width: 20px;
						height: 20px;
						padding: 1px 5px;
						border-radius: 0;
					}
					// 菜单
					.music-list {
						// background-color: #000;
						float: left;
						width: 120px;
						height: @max-music-width-height - 4;
						border-right: 1px solid #dddee1;
						overflow: auto;
						ul li {
							text-align: center;
							&:hover {
								cursor: pointer;
								box-shadow: 1px 0px 1px 0px #aaa;
								color: #00d1b2;
							}
						}
					}
				}
				// 主体
				.main-music {
					width: @max-music-width-height;
					height: @max-music-width-height;
					position: absolute;
					z-index: 10;
					text-align: center;
					.music-body;
					.infor {
						margin-top: 40px;
					}
					.menu-control {
						margin-right: 18px;
						
						.ivu-icon {
							font-size: 20px;
							margin-left: 20px;
						}
					}
					.volume-control {
						padding: 0px 40px;
					}
				}
				.music-pro {
					height: 2px;
				}
			}
		}
	}
</style>