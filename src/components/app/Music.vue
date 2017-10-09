<template>
	<div id="music" @mouseenter="topMenuShow = true" @mouseleave="topMenuShow = false">

		<!-- <audio src="../../assets/music/demo.mp3" controls=""></audio> -->
		<Card class="music-car" >
			<!-- <transition @before-enter="menuBeforeEnter" @enter="menuEnter" @leave="menuLeave">
				<div class="music-car-menu-list" v-show="topMenuShow">
					<a href="#" @click="min"><Icon :type="state === 1 ? 'minus' : 'arrow-resize'"></Icon></a>
					<a href="#" @click="max" v-show="state !== 3"><Icon type="arrow-expand"></Icon></a>
				</div>
			</transition> -->

			<div class="music-car-list" v-show="state === 3">
				<transition name="music-list">
					<div class="music-list" v-show="musicListIsShow">
						<ul>
							<li v-for="(item, index) in musicList"  @click="audio.play(musicList[index])">{{item.name}}</li>
						</ul>
					</div>
				</transition>
				<Button type="ghost" :icon="musicListIsShow ? 'ios-arrow-left' : 'ios-arrow-right'" @click="musicListIsShow = !musicListIsShow"></Button>
			</div>

			<div class="music-car-infor" v-show="state !== 0">
				<p class="title">{{audio.status === 1 ? '加载中' : audio.fileName || '无文件'}}</p>
				<p class="time" v-show="state === 3">{{audio.currTime | formatTime}}/{{audio.duration | formatTime}}</p>
			</div>

			<div class="music-car-control-list">
				<a href="javascript;" @click="pre"><Icon type="ios-arrow-back"></Icon></a>
				<a href="javascript;" @click="audio.pause()"><Icon :type="audio.status === 3 ? 'pause' : 'play'"></Icon></a>
				<a href="javascript;" @click="next"><Icon type="ios-arrow-forward"></Icon></a>
			</div>
		
			<canvas v-show="state === 3" class="music-car-canvas"></canvas>
			<!-- <Slider v-show="state === 3" :value="50" :min="0" :max="100" @input="changVol"></Slider> -->

			<Progress class="music-car-pro" :percent="Number.parseInt(audio.currTime / audio.duration * 100)" :hide-info="true" status="active" :stroke-width="1"></Progress>
		</Card>
	</div>
</template>

<script>
	import Velocity from 'velocity-animate'
	import audio_visualizer from '@/utils/utils'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		data(){
			return {
				topMenuShow: false,
				state: 1,	// 状态，0 最小化 1 正常 2 最大

				audio: new this.audio_visualizer(),
				playIndex: 0,
				musicListIsShow: false
			}
		},

		methods: {
			// 动画事件
			menuBeforeEnter: function (el) {
				el.style.top = "-10px"
				el.style.opacity = 0
			},
			menuEnter: function (el,done) {
				Velocity(el, {	// 动画属性
					opacity: 1,
					top: "-18px",
				}, {	// 动画配置项
					duration: 100,	// 动画执行时间
					display:'block',
					complete: done,
				})
			},
			menuLeave: function (el,done) {
				Velocity(el, {	// 动画属性
					opacity: 0,
					top: "-10px",
				}, {	// 动画配置项
					duration: 100,	// 动画执行时间
					display:'none',
					complete: done,
				})
			},

			// 最小化事件
			min: function () {
				if (this.state !== 1) {
					this.state = 1
					Velocity(this.$el.firstChild, {
						height: '100px',
						width: '100px',
					}, {
						duration: 100,
					})
					Velocity(this.$el, {
						height: '100px',
						width: '100px',
					}, {
						duration: 200,
					})
				} else {
					this.state = 0
					Velocity(this.$el.firstChild, {
						height: '25px',
						width: '100px',
					}, {
						duration: 100,
					})
					Velocity(this.$el, {
						height: '25px',
						width: '100px',
					}, {
						duration: 200,
					})
				}
			},
			max: function () {
				if (this.state !== 3) {
					this.state = 3
					Velocity(this.$el.firstChild, {
						height: '300px',
						width: '300px',
					}, {
						duration: 100,
					})
					Velocity(this.$el, {
						height: '300px',
						width: '300px',
					}, {
						duration: 200,
					})
				}
			},

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
			this.min()
			this.audio.init()
			if (this.musicList.length > 0) this.audio.play(this.musicList[0])
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
	a { color: @unhover-color; }

	// vue 动画
	.music-list-enter-active {
		transition: width .3s;
	}
	// .music-list-leave-active {
	// 	transition: width .3s;
	// }
	.music-list-enter{
		transform: translateX(10px);
	}
	// .music-list-leave-to {
	// 	transform: translateX(10px);
	// 	// opacity: 100;
	// }

	.music-car {
		width: @min-music-width-height;
		height: @min-music-width-height;
		text-align: center;
		&-menu-list {
			position: relative;
			text-align: right;
			top: -18px;
			height: 0px;
			&:hover {
				cursor: pointer;
			}
		}
		&:hover &-menu-list {
			animation: menu-in 1s;
			-webkit-animation: menu-in 1s;
		}

		&-infor {
			font-size: 10px;
			color: @font-color;
		}

		&-control-list {
			line-height: 22px;
			a {
				display: inline-block;
				width: 20%;
			}
		}

		&-list {
			height: @max-music-width-height - 4;
			float: left;
			position: absolute;
			background-color: transparent;

			// 菜单显示隐藏按钮
			.ivu-btn {
				width: 20px;
				height: 20px;
				padding: 0px 5px;
				margin-left: 1px;
				border-radius: 0px;
				background-color: #fff;

			}
			// 菜单
			.music-list {
				background-color: #fff;
				float: left;
				width: 120px;
				z-index: 20;
				height: @max-music-width-height - 4;
				border-right: 1px solid #dddee1;
				overflow: auto;
				ul li {
					&:hover {
						cursor: pointer;
						box-shadow: 1px 0px 1px 0px #aaa;
					}
				}
			}
		}

		&-pro {
			position: absolute;
			bottom: -9px;
			right: 0;
		}

		&-canvas {
			// border: 1px solid;
			position: absolute;
			right: 0;
			bottom: 1px;
			width: @max-music-width-height - 2;
			height: 100px;
		}

	}

</style>